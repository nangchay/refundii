import { NextRequest, NextResponse } from "next/server";

const SHOPEE_URL_PATTERNS = [
  /^https?:\/\/(vn\.)?shp\.ee\/.+/i,
  /^https?:\/\/(www\.)?shopee\.vn\/.+/i,
];

function extractIdsFromUrl(url: string): { shopId: string | null; productId: string | null } {
  const productMatch = url.match(/\/product\/(\d+)\/(\d+)/);
  if (productMatch) {
    return { shopId: productMatch[1], productId: productMatch[2] };
  }
  const iMatch = url.match(/i\.(\d+)\.(\d+)/);
  if (iMatch) {
    return { shopId: iMatch[1], productId: iMatch[2] };
  }
  return { shopId: null, productId: null };
}

async function fetchProductMetadata(shopId: string, productId: string) {
  try {
    const productUrl = `https://shopee.vn/product/${shopId}/${productId}`;
    const res = await fetch(productUrl, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      },
    });
    const html = await res.text();

    // Extract og:title
    const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/) ||
                       html.match(/content="([^"]*)"[^>]*property="og:title"/) ||
                       html.match(/<title[^>]*>([^<]*)<\/title>/);
    const title = titleMatch ? titleMatch[1].replace(" | Shopee Việt Nam", "").trim() : null;

    // Extract product image (prefer clean product image over og:image with promo watermark)
    const productImageMatch = html.match(/https:\/\/down-vn\.img\.susercontent\.com\/file\/vn-[a-z0-9-]+(?=["'\s])/);
    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/) ||
                         html.match(/content="([^"]*)"[^>]*property="og:image"/);
    const image = productImageMatch ? productImageMatch[0] : (ogImageMatch ? ogImageMatch[1] : null);

    return { title, image };
  } catch {
    return { title: null, image: null };
  }
}

async function validateShopeeUrl(url: string) {
  const isShopeeFormat = SHOPEE_URL_PATTERNS.some((p) => p.test(url));
  if (!isShopeeFormat) {
    return { isValid: false, platform: null, error: "Không phải link Shopee" };
  }

  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
    });

    const finalUrl = res.url;
    const isValidShopee = finalUrl.includes("shopee.vn/product/") || /i\.\d+\.\d+/.test(finalUrl);

    if (!isValidShopee) {
      return { isValid: false, platform: "shopee", error: "Link sản phẩm không hợp lệ" };
    }

    const { shopId, productId } = extractIdsFromUrl(finalUrl);

    // Fetch product metadata
    let title = null;
    let image = null;
    if (shopId && productId) {
      const metadata = await fetchProductMetadata(shopId, productId);
      title = metadata.title;
      image = metadata.image;
    }

    return {
      isValid: true,
      platform: "shopee",
      resolvedUrl: finalUrl,
      shopId,
      productId,
      title,
      image,
    };
  } catch {
    return { isValid: false, platform: "shopee", error: "Không thể kiểm tra link" };
  }
}

export async function POST(request: NextRequest) {
  const { url, platform } = await request.json();

  if (!url) {
    return NextResponse.json({ isValid: false, error: "Thiếu URL" }, { status: 400 });
  }

  if (platform === "shopee") {
    const result = await validateShopeeUrl(url);
    return NextResponse.json(result);
  }

  return NextResponse.json({ isValid: false, error: "Platform chưa được hỗ trợ" });
}
