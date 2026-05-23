import { NextRequest, NextResponse } from "next/server";

const SHOPEE_URL_PATTERNS = [
  /^https?:\/\/(vn\.)?shp\.ee\/.+/i,
  /^https?:\/\/(www\.)?shopee\.vn\/.+/i,
];

function extractIdsFromUrl(url: string): { shopId: string | null; productId: string | null } {
  // Format: shopee.vn/product/shopId/productId
  const productMatch = url.match(/\/product\/(\d+)\/(\d+)/);
  if (productMatch) {
    return { shopId: productMatch[1], productId: productMatch[2] };
  }
  // Format: shopee.vn/name-i.shopId.productId
  const iMatch = url.match(/i\.(\d+)\.(\d+)/);
  if (iMatch) {
    return { shopId: iMatch[1], productId: iMatch[2] };
  }
  // Format: shopee.vn/opaanlp/shopId/productId
  const opaanlpMatch = url.match(/\/opaanlp\/(\d+)\/(\d+)/);
  if (opaanlpMatch) {
    return { shopId: opaanlpMatch[1], productId: opaanlpMatch[2] };
  }
  return { shopId: null, productId: null };
}

async function resolveShopeeUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
    });
    return res.url;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const { url, affiliateId, subId } = await request.json();

  if (!url || !affiliateId) {
    return NextResponse.json({ success: false, error: "Missing url or affiliateId" }, { status: 400 });
  }

  // Check if valid Shopee URL
  const isShopeeFormat = SHOPEE_URL_PATTERNS.some((p) => p.test(url));
  if (!isShopeeFormat) {
    return NextResponse.json({ success: false, error: "Not a Shopee URL" });
  }

  // Resolve short URL to full URL
  const resolvedUrl = await resolveShopeeUrl(url);
  if (!resolvedUrl) {
    return NextResponse.json({ success: false, error: "Cannot resolve URL" });
  }

  // Extract shopId and productId
  const { shopId, productId } = extractIdsFromUrl(resolvedUrl);
  if (!shopId || !productId) {
    return NextResponse.json({ success: false, error: "Cannot extract product IDs" });
  }

  // Build affiliate link theo hướng dẫn Shopee:
  // https://s.shopee.vn/an_redir?origin_link={encoded_url}&affiliate_id={id}&sub_id={tracking}
  const productUrl = `https://shopee.vn/product/${shopId}/${productId}`;
  const encodedUrl = encodeURIComponent(productUrl);
  const affiliateLink = `https://s.shopee.vn/an_redir?origin_link=${encodedUrl}&affiliate_id=${affiliateId}&sub_id=${subId || ""}`;

  // Trả về link an_redir gốc, không cần follow redirect
  return NextResponse.json({
    success: true,
    shortLink: affiliateLink,
    shopId,
    productId,
  });
}
