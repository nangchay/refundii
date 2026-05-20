"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const [link, setLink] = useState("");
  const pathname = usePathname();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (link.trim()) {
      // Navigate to result page
      window.location.href = `/result?link=${encodeURIComponent(link)}`;
    }
  };

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-lg rounded-full z-50 bg-white/80 backdrop-blur-lg shadow-nav flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-outline-variant">
            <div className="w-full h-full bg-gradient-to-br from-signal-orange/20 to-primary/10" />
          </div>
          <span className="text-headline-sm tracking-tighter text-primary font-medium">SÀNH</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </header>

      {/* Background Orbital Decorations */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="orbital-arc w-[800px] h-[800px] -top-40 -left-40"></div>
        <div className="orbital-arc w-[600px] h-[600px] top-1/2 -right-20"></div>
        <div className="soft-glow absolute top-1/4 right-0 w-[400px] h-[400px]"></div>
        <div className="soft-glow absolute bottom-1/4 left-0 w-[300px] h-[300px]"></div>
      </div>

      {/* Main Canvas */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-32 max-w-container-max mx-auto">
        {/* Hero Section */}
        <div className="w-full max-w-3xl text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/50 border border-white/50 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-signal-orange"></span>
            <span className="text-eyebrow uppercase tracking-widest text-on-surface-variant">Thỏa thích mua sắm</span>
          </div>

          <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary mb-12 tracking-tight max-w-2xl">
            Dán link Shopee/TikTok – Nhận lại đến <span className="text-signal-orange">10%</span> tiền mặt
          </h1>

          {/* Mega Input Field */}
          <form onSubmit={handleSubmit} className="w-full relative mb-8 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-signal-orange/20 to-transparent rounded-full blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
            <div className="relative flex items-center bg-white rounded-full shadow-card border border-outline-variant/30 p-2 pl-8 focus-within:border-primary transition-all">
              <span className="material-symbols-outlined text-on-surface-variant mr-4">link</span>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-body-md placeholder:text-on-surface-variant/50 py-4"
                placeholder="Dán link sản phẩm bạn muốn mua vào đây..."
              />
              <button
                type="submit"
                className="bg-primary text-on-primary text-label-md px-8 py-4 rounded-full hover:opacity-90 transition-all active:scale-95 duration-200 whitespace-nowrap"
              >
                Tạo link & Nhận hoàn tiền
              </button>
            </div>
          </form>

          {/* Features Grid (Subtle Bento) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-12">
            <div className="bg-lifted-cream/60 backdrop-blur-md p-6 rounded-[40px] border border-white/50 flex flex-col items-start text-left">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                <span className="material-symbols-outlined text-primary">bolt</span>
              </div>
              <p className="text-label-md text-primary mb-1">Xử lý tức thì</p>
              <p className="text-on-surface-variant text-sm">Nhận link hoàn tiền chỉ trong 0.5 giây sau khi dán.</p>
            </div>

            <div className="bg-lifted-cream/60 backdrop-blur-md p-6 rounded-[40px] border border-white/50 flex flex-col items-start text-left">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                <span className="material-symbols-outlined text-primary">payments</span>
              </div>
              <p className="text-label-md text-primary mb-1">Rút tiền mặt</p>
              <p className="text-on-surface-variant text-sm">Tiền về thẳng ví hoặc tài khoản ngân hàng của bạn.</p>
            </div>

            <div className="bg-lifted-cream/60 backdrop-blur-md p-6 rounded-[40px] border border-white/50 flex flex-col items-start text-left">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                <span className="material-symbols-outlined text-primary">verified_user</span>
              </div>
              <p className="text-label-md text-primary mb-1">An toàn 100%</p>
              <p className="text-on-surface-variant text-sm">Đối tác chính thức của các sàn thương mại điện tử lớn.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Ticker Section - above navbar */}
      <div className="fixed bottom-[96px] left-0 w-full z-[60] pointer-events-none">
        <div className="bg-surface/80 backdrop-blur-md border-t border-outline-variant/10 py-3 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            <span className="text-on-surface-variant/80 text-[13px] mx-8 flex items-center gap-2.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-signal-orange"></span> User A vừa rút 50.000đ từ Shopee
            </span>
            <span className="text-on-surface-variant/80 text-[13px] mx-8 flex items-center gap-2.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-signal-orange"></span> User B nhận 125.000đ từ TikTok
            </span>
            <span className="text-on-surface-variant/80 text-[13px] mx-8 flex items-center gap-2.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-signal-orange"></span> User C hoàn thành đơn 2.000.000đ
            </span>
            <span className="text-on-surface-variant/80 text-[13px] mx-8 flex items-center gap-2.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-signal-orange"></span> User D nhận hoàn tiền 85.000đ
            </span>
            <span className="text-on-surface-variant/80 text-[13px] mx-8 flex items-center gap-2.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-signal-orange"></span> User A vừa rút 50.000đ từ Shopee
            </span>
            <span className="text-on-surface-variant/80 text-[13px] mx-8 flex items-center gap-2.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-signal-orange"></span> User B nhận 125.000đ từ TikTok
            </span>
            <span className="text-on-surface-variant/80 text-[13px] mx-8 flex items-center gap-2.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-signal-orange"></span> User C hoàn thành đơn 2.000.000đ
            </span>
            <span className="text-on-surface-variant/80 text-[13px] mx-8 flex items-center gap-2.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-signal-orange"></span> User D nhận hoàn tiền 85.000đ
            </span>
          </div>
        </div>
      </div>

      {/* BottomNavBar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md rounded-full z-50 bg-white shadow-bottom-nav flex justify-around items-center p-2">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center rounded-full px-5 py-2 active:scale-90 duration-300 ${
            pathname === "/" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-primary transition-all"
          }`}
        >
          <span className="material-symbols-outlined">local_mall</span>
          <span className="text-[10px] mt-0.5 font-medium">Săn Deal</span>
        </Link>
        <Link
          href="/wallet"
          className={`flex flex-col items-center justify-center rounded-full px-5 py-2 active:scale-90 duration-300 ${
            pathname === "/wallet" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-primary transition-all"
          }`}
        >
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="text-[10px] mt-0.5 font-medium">Ví</span>
        </Link>
        <Link
          href="/history"
          className={`flex flex-col items-center justify-center rounded-full px-5 py-2 active:scale-90 duration-300 ${
            pathname === "/history" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-primary transition-all"
          }`}
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-[10px] mt-0.5 font-medium">Lịch sử</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center rounded-full px-5 py-2 active:scale-90 duration-300 ${
            pathname === "/profile" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-primary transition-all"
          }`}
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] mt-0.5 font-medium">Cá nhân</span>
        </Link>
      </nav>
    </>
  );
}
