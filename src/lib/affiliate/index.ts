import { Platform, PlatformService, ProcessedProduct, ValidationResult } from "./types";
import { shopeeService } from "./shopee/service";

const PLATFORM_PATTERNS: { platform: Platform; patterns: RegExp[] }[] = [
  {
    platform: "shopee",
    patterns: [/shp\.ee/i, /shopee\.vn/i, /shopee\.com/i],
  },
  {
    platform: "tiktok",
    patterns: [/tiktok\.com/i, /vt\.tiktok/i],
  },
  {
    platform: "lazada",
    patterns: [/lazada\.vn/i, /lzd\.co/i],
  },
];

export function detectPlatform(url: string): Platform | null {
  for (const { platform, patterns } of PLATFORM_PATTERNS) {
    if (patterns.some((p) => p.test(url))) {
      return platform;
    }
  }
  return null;
}

export function getService(platform: Platform): PlatformService | null {
  switch (platform) {
    case "shopee":
      return shopeeService;
    case "tiktok":
    case "lazada":
      // TODO: implement these services
      return null;
    default:
      return null;
  }
}

export async function validateAndProcess(
  url: string,
  walletId: string
): Promise<{ success: true; data: ProcessedProduct } | { success: false; error: string }> {
  const platform = detectPlatform(url);
  if (!platform) {
    return { success: false, error: "Link không được hỗ trợ. Vui lòng dùng link từ Shopee, TikTok hoặc Lazada." };
  }

  const service = getService(platform);
  if (!service) {
    return { success: false, error: `${platform} chưa được hỗ trợ. Vui lòng thử lại sau.` };
  }

  const validation = await service.validateUrl(url);
  if (!validation.isValid) {
    return { success: false, error: validation.error || "Link không hợp lệ" };
  }

  const [product, affiliateLink] = await Promise.all([
    service.fetchProduct(url, validation.resolvedUrl),
    service.generateAffiliateLink(url, walletId),
  ]);

  const cashback = service.calculateCashback(product.price || 500000);

  return {
    success: true,
    data: { product, affiliateLink, cashback },
  };
}

export * from "./types";
