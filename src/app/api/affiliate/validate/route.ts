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
    return {
      isValid: true,
      platform: "shopee",
      resolvedUrl: finalUrl,
      shopId,
      productId,
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
