"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BottomNav from "@/components/BottomNav";

interface ProductInfo {
  title: string;
  price: number;
  image: string;
  shop: string;
  cashbackPercent: number;
  cashbackAmount: number;
  affiliateLink: string;
}

function ResultContent() {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProduct({
        title: "Tai nghe không dây Premium Noise-Cancelling",
        price: 300000,
        image: "/placeholder-product.jpg",
        shop: "Tech Store Official",
        cashbackPercent: 5,
        cashbackAmount: 15000,
        affiliateLink: "https://shope.ee/abc123xyz",
      });
      setIsLoading(false);
    }, 1500);
  }, [searchParams]);

  const handleOpenLink = () => {
    if (product) {
      window.open(product.affiliateLink, "_blank");
    }
  };

  if (isLoading) {
    return (
      <main className="w-full max-w-lg px-6 pt-32 pb-40 flex flex-col items-center">
        <section className="w-full bg-lifted-cream rounded-[40px] p-8 shadow-card relative overflow-hidden flex flex-col items-center text-center">
          <div className="w-48 h-48 rounded-full bg-surface-container animate-pulse mb-8" />
          <div className="h-6 w-48 bg-surface-container rounded-full animate-pulse mb-4" />
          <div className="h-4 w-32 bg-surface-container rounded-full animate-pulse" />
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="w-full max-w-lg px-6 pt-32 pb-40 flex flex-col items-center">
        <section className="w-full bg-lifted-cream rounded-[40px] p-8 shadow-card relative overflow-hidden flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-error text-[32px]">error</span>
          </div>
          <p className="text-label-md text-primary mb-2">Không tìm thấy sản phẩm</p>
          <p className="text-body-md text-on-surface-variant text-center mb-6">
            Link không hợp lệ hoặc sản phẩm không còn tồn tại
          </p>
          <Link
            href="/"
            className="bg-primary text-on-primary px-8 py-3 rounded-full text-label-md"
          >
            Thử lại
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full max-w-lg px-6 pt-32 pb-40 flex flex-col items-center">
      {/* Results Card */}
      <section className="w-full bg-lifted-cream rounded-[40px] p-8 shadow-card relative overflow-hidden flex flex-col items-center text-center">
        {/* Circular Portrait with Satellite CTA */}
        <div className="relative w-48 h-48 mb-8">
          {/* Orbital Arc Decoration */}
          <div
            className="absolute w-[210px] h-[210px] -top-[11px] -left-[11px] border-[1.5px] border-signal-orange rounded-full"
            style={{
              borderTopColor: "transparent",
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              transform: "rotate(-45deg)",
            }}
          />
          {/* Main Thumbnail */}
          <div className="w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden z-10 relative bg-white flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[80px]">headphones</span>
          </div>
          {/* Satellite CTA Button */}
          <button
            onClick={handleOpenLink}
            className="absolute bottom-1 right-1 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center z-20 border border-surface-container hover:scale-110 transition-transform duration-300"
          >
            <span className="material-symbols-outlined text-primary text-[24px]">north_east</span>
          </button>
        </div>

        {/* Product Details */}
        <div className="mb-6">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-signal-orange"></span>
            <p className="text-eyebrow text-on-surface-variant uppercase tracking-widest">
              Sẵn sàng nhận thưởng
            </p>
          </div>
          <h2 className="text-headline-sm text-primary mb-2 px-4">{product.title}</h2>
        </div>

        {/* Cashback Highlight */}
        <div className="bg-surface-container-low rounded-3xl py-6 px-4 mb-10 w-full">
          <p className="text-body-md text-on-surface-variant mb-1">Hoàn tiền dự kiến</p>
          <p className="text-headline-md text-primary font-bold">
            ~{product.cashbackAmount.toLocaleString("vi-VN")}đ{" "}
            <span className="text-signal-orange">({product.cashbackPercent}%)</span>
          </p>
        </div>

        {/* Primary Action */}
        <button
          onClick={handleOpenLink}
          className="w-full bg-primary text-on-primary py-5 rounded-full text-label-md tracking-tight hover:opacity-90 active:scale-[0.98] transition-all duration-200 mb-6 flex items-center justify-center gap-2"
        >
          Đến nơi mua & Nhận tiền
          <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
        </button>

        {/* Safety Notice */}
        <div className="flex gap-3 text-left">
          <span className="material-symbols-outlined text-signal-orange text-[18px] shrink-0">
            info
          </span>
          <p className="text-[13px] leading-relaxed text-on-surface-variant">
            Lưu ý: Không đổi thiết bị, không thêm vào giỏ hàng trước. Phải hoàn tất thanh toán trong
            vòng 24h để đảm bảo nhận được hoàn tiền.
          </p>
        </div>
      </section>

      {/* Secondary Info / Feature Bento */}
      <div className="w-full mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-surface-container-high">
          <span className="material-symbols-outlined text-primary mb-3">verified</span>
          <p className="text-label-md text-primary">Xác thực nhanh</p>
          <p className="text-[12px] text-on-surface-variant mt-1">Dưới 15 phút</p>
        </div>
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-surface-container-high">
          <span className="material-symbols-outlined text-primary mb-3">account_balance_wallet</span>
          <p className="text-label-md text-primary">Rút tiền mặt</p>
          <p className="text-[12px] text-on-surface-variant mt-1">Về ví tức thì</p>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-lg rounded-full z-50 bg-white/80 backdrop-blur-lg shadow-nav flex justify-between items-center px-6 py-3 border border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-signal-orange/20 to-primary/10" />
          </div>
        </div>
        <h1 className="text-headline-sm tracking-tighter text-primary font-medium">SÀNH</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-primary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <Suspense
        fallback={
          <main className="w-full max-w-lg px-6 pt-32 pb-40 flex flex-col items-center mx-auto">
            <div className="w-full bg-lifted-cream rounded-[40px] p-8 animate-pulse" />
          </main>
        }
      >
        <div className="flex justify-center">
          <ResultContent />
        </div>
      </Suspense>

      <BottomNav />
    </>
  );
}
