export type Platform = "shopee" | "tiktok" | "lazada";

export interface ProductInfo {
  title: string;
  image: string | null;
  price: number | null;
  shopName: string | null;
  platform: Platform;
  originalUrl: string;
  productId: string | null;
  shopId: string | null;
}

export interface AffiliateLink {
  shortLink: string;
  originalLink: string;
  subId: string;
  platform: Platform;
}

export interface CashbackEstimate {
  expectedCashback: number;
  commissionRate: number;
  userShareRate: number;
  displayText: string;
}

export interface ProcessedProduct {
  product: ProductInfo;
  affiliateLink: AffiliateLink;
  cashback: CashbackEstimate;
}

export interface ValidationResult {
  isValid: boolean;
  platform: Platform | null;
  error?: string;
  resolvedUrl?: string;
  productId?: string;
  shopId?: string;
}

export interface PlatformService {
  platform: Platform;
  validateUrl(url: string): Promise<ValidationResult>;
  fetchProduct(url: string, resolvedUrl?: string): Promise<ProductInfo>;
  generateAffiliateLink(url: string, walletId: string): Promise<AffiliateLink>;
  calculateCashback(price: number): CashbackEstimate;
}
