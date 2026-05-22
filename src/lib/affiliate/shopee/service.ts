import {
  Platform,
  ProductInfo,
  AffiliateLink,
  CashbackEstimate,
  ValidationResult,
  PlatformService,
} from "../types";

const COMMISSION_RATE = 0.03;
const USER_SHARE_RATE = 0.70;
const MAX_DISPLAY_CASHBACK = 15000;

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
  return { shopId: null, productId: null };
}

export class ShopeeService implements PlatformService {
  platform: Platform = "shopee";

  async validateUrl(url: string): Promise<ValidationResult> {
    const isShopeeUrl = SHOPEE_URL_PATTERNS.some((p) => p.test(url));
    if (!isShopeeUrl) {
      return { isValid: false, platform: null, error: "Không phải link Shopee" };
    }

    try {
      const response = await fetch("/api/affiliate/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, platform: "shopee" }),
      });
      const data = await response.json();
      return data;
    } catch {
      return { isValid: false, platform: "shopee", error: "Không thể kiểm tra link" };
    }
  }

  async fetchProduct(url: string, resolvedUrl?: string): Promise<ProductInfo> {
    const finalUrl = resolvedUrl || url;
    const { shopId, productId } = extractIdsFromUrl(finalUrl);

    return {
      title: productId ? `Sản phẩm Shopee #${productId}` : "Sản phẩm Shopee",
      image: null,
      price: Math.floor(Math.random() * 1950000) + 50000,
      shopName: null,
      platform: "shopee",
      originalUrl: url,
      productId,
      shopId,
    };
  }

  async generateAffiliateLink(url: string, walletId: string): Promise<AffiliateLink> {
    // Mock - sẽ thay bằng Shopee API khi có credentials
    await new Promise((r) => setTimeout(r, 300));
    const mockId = Math.random().toString(36).substring(2, 10);
    return {
      shortLink: `https://shope.ee/${mockId}`,
      originalLink: url,
      subId: walletId,
      platform: "shopee",
    };
  }

  calculateCashback(price: number): CashbackEstimate {
    const raw = price * COMMISSION_RATE * USER_SHARE_RATE;
    const expected = Math.min(raw, MAX_DISPLAY_CASHBACK);
    const display =
      expected >= MAX_DISPLAY_CASHBACK
        ? `~ ${MAX_DISPLAY_CASHBACK.toLocaleString("vi-VN")}đ`
        : `~ ${Math.round(expected).toLocaleString("vi-VN")}đ`;

    return {
      expectedCashback: Math.round(expected),
      commissionRate: COMMISSION_RATE,
      userShareRate: USER_SHARE_RATE,
      displayText: display,
    };
  }
}

export const shopeeService = new ShopeeService();
