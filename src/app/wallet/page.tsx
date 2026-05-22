"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";

const transactions = [
  {
    id: "1",
    icon: "payments",
    iconBg: "bg-tertiary-fixed",
    iconColor: "text-signal-orange",
    title: "Hoàn tiền Shopee",
    date: "24 Th05, 2024 • 14:30",
    amount: "+12.500đ",
    amountColor: "text-signal-orange",
  },
  {
    id: "2",
    icon: "account_balance_wallet",
    iconBg: "bg-secondary-container",
    iconColor: "text-on-secondary-container",
    title: "Rút về Techcombank",
    date: "22 Th05, 2024 • 09:15",
    amount: "-50.000đ",
    amountColor: "text-primary",
  },
  {
    id: "3",
    icon: "payments",
    iconBg: "bg-tertiary-fixed",
    iconColor: "text-signal-orange",
    title: "Hoàn tiền Grab",
    date: "20 Th05, 2024 • 18:45",
    amount: "+5.200đ",
    amountColor: "text-signal-orange",
  },
];

const quickAmounts = ["50.000đ", "100.000đ", "Tất cả"];

export default function WalletPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { user, profile, loading } = useAuth();

  const handleQuickAmount = (amount: string) => {
    if (amount === "Tất cả") {
      setWithdrawAmount("125000");
    } else {
      setWithdrawAmount(amount.replace(/\D/g, ""));
    }
  };

  if (loading) {
    return (
      <div className="bg-tertiary-fixed/10 min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-signal-orange text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="bg-tertiary-fixed/10 text-on-surface min-h-screen pb-32">
      {/* Top AppBar */}
      <header className="bg-surface/80 backdrop-blur-md shadow-sm w-full z-50 fixed top-0 left-0">
        <div className="flex justify-between items-center px-6 py-4 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Refundii" className="h-12 w-auto" />
            <span className="text-headline-sm font-bold bg-gradient-to-r from-signal-orange to-tertiary-fixed-dim bg-clip-text text-transparent">Refundii</span>
          </div>
          <button className="material-symbols-outlined text-secondary active:scale-95 transition-transform">notifications</button>
        </div>
      </header>

      {user && profile ? (
        <LoggedInContent
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          handleQuickAmount={handleQuickAmount}
        />
      ) : (
        <EmptyStateContent />
      )}

      <BottomNav />
    </div>
  );
}

function EmptyStateContent() {
  const router = useRouter();

  return (
    <main className="pt-24 pb-32 px-6 flex flex-col items-center min-h-screen max-w-lg mx-auto">
      {/* Empty State Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full py-12">
        <div className="absolute w-64 h-64 -top-8 -right-4 rounded-full border-[1.5px] border-signal-orange opacity-20 pointer-events-none"></div>
        <div className="absolute w-48 h-48 bottom-0 -left-8 rounded-full border-[1.5px] border-signal-orange opacity-10 pointer-events-none"></div>

        <div className="relative z-10 w-full flex flex-col items-center text-center">
          <div className="mb-8 transform hover:scale-105 transition-transform duration-700">
            <img
              alt="Metallic Gold Chest"
              className="w-64 h-64 object-contain drop-shadow-2xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi5A3z8YU-gZU0eWJtdFWwRxQmMaJ-pHLw50LDJP1UdPQVVqu3bQLiRNJVr4fSEstKcdP0pUg4QuFaSCz6gAVFOiuFWFWCyDe7hRkTbT-KeHgcTL2I1ZMGaqKz09W4pzdLPea-BFI1KVRcZJxjR4iD7ljBqevfGuIKTiHiQ34Btoqfs9eqNc35Bu74nwZgIRZhYJr2_n1Wi6BPYbKCaYGdBpwLGvEIqbKhQY7t4nvtBwvKSWlTz1wQndTWL2pfW2ADaOfB1kqKvVax"
            />
          </div>
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold mb-4 px-4">
            Đăng nhập để xem Ví
          </h2>
          <p className="font-body-md text-body-md text-secondary max-w-[280px] leading-relaxed">
            Vui lòng đăng nhập hoặc đăng ký tài khoản để kiểm tra số dư và nhận tiền hoàn từ các đơn hàng.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="w-full mt-auto pt-8">
        <button
          onClick={() => router.push("/auth")}
          className="w-full py-5 rounded-full text-white font-bold text-label-md tracking-tight shadow-[0_20px_40px_rgba(207,69,0,0.2)] active:scale-95 transition-all duration-200 bg-gradient-to-r from-signal-orange to-[#FF8A00]"
        >
          Mở Ví để bắt đầu
        </button>
      </div>
    </main>
  );
}

interface LoggedInContentProps {
  withdrawAmount: string;
  setWithdrawAmount: (value: string) => void;
  handleQuickAmount: (amount: string) => void;
}

function LoggedInContent({ withdrawAmount, setWithdrawAmount, handleQuickAmount }: LoggedInContentProps) {
  return (
    <main className="pt-24 px-6 max-w-md mx-auto">
      <section className="relative overflow-hidden bg-gradient-to-br from-signal-orange to-tertiary-fixed-dim rounded-[40px] p-8 text-white mb-10 shadow-[0_24px_48px_rgba(0,0,0,0.04)]">
        <div className="absolute top-[-20px] right-[-20px] w-48 h-48 border-[30px] border-signal-orange rounded-full opacity-10"></div>
        <div className="relative z-10">
          <p className="text-eyebrow opacity-80 uppercase mb-2">Số dư khả dụng</p>
          <h2 className="text-headline-lg-mobile font-extrabold tracking-tight mb-8">125.000đ</h2>
          <div className="glass-overlay rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[20px]">account_balance</span>
              </div>
              <div>
                <p className="text-[12px] opacity-70">Ngân hàng liên kết</p>
                <p className="text-label-md">Techcombank •••• 8892</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/60">chevron_right</span>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 bg-signal-orange rounded-full"></span>
          <h3 className="text-headline-sm">Rút tiền</h3>
        </div>
        <div className="bg-lifted-cream rounded-[32px] p-6 border border-outline-variant/30 shadow-[0_24px_48px_rgba(0,0,0,0.04)]">
          <label className="block text-eyebrow text-on-surface-variant mb-4">NHẬP SỐ TIỀN MUỐN RÚT</label>
          <div className="relative mb-6">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full bg-transparent border-b-2 border-outline-variant focus:border-signal-orange outline-none py-3 text-[32px] font-bold text-primary transition-all placeholder:text-outline-variant"
              placeholder="0"
            />
            <span className="absolute right-0 bottom-3 text-headline-sm text-on-surface-variant">đ</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickAmount(amount)}
                className="px-4 py-2 rounded-full border border-outline-variant text-[14px] font-medium hover:border-signal-orange hover:text-signal-orange transition-colors active:scale-95"
              >
                {amount}
              </button>
            ))}
          </div>
          <button className="w-full bg-primary text-white py-5 rounded-full text-label-md active:scale-95 transition-transform flex items-center justify-center gap-3">
            Rút tiền ngay
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-signal-orange rounded-full"></span>
            <h3 className="text-headline-sm">Giao dịch gần đây</h3>
          </div>
          <Link href="/history" className="text-link-blue text-label-md">Tất cả</Link>
        </div>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="group flex items-center justify-between p-5 bg-lifted-cream rounded-[24px] border border-outline-variant/20 hover:border-signal-orange/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${tx.iconBg} flex items-center justify-center`}>
                  <span
                    className={`material-symbols-outlined ${tx.iconColor}`}
                    style={tx.icon === "payments" ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {tx.icon}
                  </span>
                </div>
                <div>
                  <p className="text-label-md text-primary">{tx.title}</p>
                  <p className="text-[12px] text-on-surface-variant">{tx.date}</p>
                </div>
              </div>
              <p className={`text-label-md ${tx.amountColor} font-bold`}>{tx.amount}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
