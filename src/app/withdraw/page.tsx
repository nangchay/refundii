"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("Vietcombank - Ngân hàng Ngoại thương");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }, 1500);
  };

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-lg rounded-full z-50 bg-white/80 backdrop-blur-lg shadow-nav flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/wallet" className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[20px]">arrow_back</span>
          </Link>
        </div>
        <h1 className="text-headline-sm tracking-tighter text-primary font-medium">SÀNH</h1>
        <button className="material-symbols-outlined text-primary hover:bg-surface-container-low transition-colors p-2 rounded-full">
          notifications
        </button>
      </header>

      <main className="pt-32 px-6 max-w-lg mx-auto pb-40">
        {/* Withdrawal Header */}
        <div className="mb-10 text-center relative">
          <span className="inline-flex items-center gap-2 text-eyebrow text-on-primary-container mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange"></span>
            GIAO DỊCH TÀI CHÍNH
          </span>
          <h2 className="text-headline-md tracking-tight mb-2">Rút tiền về tài khoản</h2>
          <p className="text-body-md text-on-surface-variant max-w-[280px] mx-auto">
            Chuyển tiền nhanh chóng từ ví Sành về ngân hàng của bạn.
          </p>
          {/* Orbital Arc Decoration */}
          <svg
            className="absolute -top-4 -right-4 w-24 h-24 text-signal-orange opacity-20 pointer-events-none"
            viewBox="0 0 100 100"
          >
            <path
              d="M 80 20 A 50 50 0 0 1 100 60"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Available Balance Card */}
        <div className="bg-lifted-cream p-8 rounded-[40px] shadow-card mb-8 border border-surface-container-high relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-label-md text-on-surface-variant mb-1">Số dư khả dụng</p>
            <div className="flex items-baseline gap-2">
              <span className="text-headline-lg-mobile text-primary">24.550.000</span>
              <span className="text-label-md text-primary">VND</span>
            </div>
          </div>
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-12 -mt-12"></div>
        </div>

        {/* Withdrawal Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-label-md ml-4 text-on-surface-variant">Số tiền muốn rút</label>
            <div className="relative group">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white border border-on-surface/10 rounded-full py-4 px-6 text-headline-sm focus:ring-0 focus:border-primary focus:outline-none transition-all placeholder:text-surface-dim"
                placeholder="0"
                required
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-label-md text-primary">VND</span>
            </div>
          </div>

          {/* Bank Selection */}
          <div className="space-y-2">
            <label className="text-label-md ml-4 text-on-surface-variant">Ngân hàng thụ hưởng</label>
            <div className="relative group">
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full bg-white border border-on-surface/10 rounded-full py-4 px-6 appearance-none text-body-md focus:ring-0 focus:border-primary focus:outline-none transition-all"
              >
                <option>Vietcombank - Ngân hàng Ngoại thương</option>
                <option>Techcombank - Ngân hàng Kỹ thương</option>
                <option>MB Bank - Ngân hàng Quân đội</option>
                <option>TPBank - Ngân hàng Tiên Phong</option>
              </select>
              <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                expand_more
              </span>
            </div>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <label className="text-label-md ml-4 text-on-surface-variant">Số tài khoản</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full bg-white border border-on-surface/10 rounded-full py-4 px-6 text-body-md focus:ring-0 focus:border-primary focus:outline-none transition-all"
              placeholder="Nhập số tài khoản"
              required
            />
          </div>

          {/* Account Holder */}
          <div className="space-y-2">
            <label className="text-label-md ml-4 text-on-surface-variant">Tên chủ tài khoản</label>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
              className="w-full bg-white border border-on-surface/10 rounded-full py-4 px-6 text-body-md focus:ring-0 focus:border-primary focus:outline-none transition-all uppercase"
              placeholder="VD: NGUYEN VAN A"
              required
            />
          </div>

          {/* Cycle Info Box */}
          <div className="bg-tertiary-fixed/30 p-6 rounded-[32px] flex gap-4 items-start border border-tertiary-fixed">
            <span className="material-symbols-outlined text-signal-orange">info</span>
            <div className="space-y-1">
              <p className="text-label-md text-on-tertiary-fixed">Kỳ quyết toán định kỳ</p>
              <p className="text-[14px] leading-relaxed text-on-tertiary-fixed-variant">
                Lệnh rút tiền sẽ được xử lý vào các ngày 15 và 30 hàng tháng. Vui lòng kiểm tra kỹ
                thông tin trước khi xác nhận.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-full py-5 text-label-md tracking-tight hover:scale-[0.98] transition-transform duration-200 active:scale-95 flex justify-center items-center gap-2 mt-8 ${
              isSuccess ? "bg-green-600 text-white" : "bg-primary text-white"
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Đang xử lý...
              </>
            ) : isSuccess ? (
              <>
                <span className="material-symbols-outlined">check_circle</span>
                Đã gửi yêu cầu
              </>
            ) : (
              <>
                Xác nhận rút tiền
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-12 text-center">
          <Link
            href="/history"
            className="text-footer-link text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            Xem lịch sử giao dịch
          </Link>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
