"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const transactions = [
  {
    id: "SN2941",
    icon: "shopping_bag",
    title: "Đơn hàng #SN2941",
    date: "14:20, 22 Th05, 2024",
    amount: "+850.000đ",
    status: "Approved",
    statusColor: "bg-green-500",
    amountColor: "text-primary",
  },
  {
    id: "WD001",
    icon: "payments",
    title: "Rút tiền về MB Bank",
    date: "09:15, 21 Th05, 2024",
    amount: "-5.000.000đ",
    status: "Pending",
    statusColor: "bg-yellow-500",
    amountColor: "text-error",
  },
  {
    id: "SN2890",
    icon: "storefront",
    title: "Đơn hàng #SN2890",
    date: "18:45, 19 Th05, 2024",
    amount: "+1.250.000đ",
    status: "Approved",
    statusColor: "bg-green-500",
    amountColor: "text-primary",
  },
  {
    id: "SN2711",
    icon: "shopping_cart",
    title: "Đơn hàng #SN2711",
    date: "10:05, 18 Th05, 2024",
    amount: "+420.000đ",
    status: "Approved",
    statusColor: "bg-green-500",
    amountColor: "text-primary",
  },
];

export default function WalletPage() {
  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-lg rounded-full z-50 bg-white/80 backdrop-blur-lg shadow-nav flex justify-between items-center px-6 py-3">
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-signal-orange/20 to-primary/10" />
        </div>
        <span className="text-headline-sm tracking-tighter text-primary font-medium">SÀNH</span>
        <button className="w-10 h-10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-40 px-6 max-w-lg mx-auto">
        {/* Wallet Dashboard */}
        <section className="mb-10">
          <div className="rounded-[40px] bg-primary text-on-primary p-10 flex flex-col items-center relative overflow-hidden">
            {/* Decorative Orbital Arc */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border-[1.5px] border-signal-orange/30 rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-5 -left-5 w-24 h-24 border-[1.5px] border-signal-orange/20 rounded-full pointer-events-none"></div>

            <div className="flex flex-col items-center gap-1 z-10">
              <span className="text-eyebrow uppercase opacity-60 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-signal-orange rounded-full"></span>
                Số dư có thể rút
              </span>
              <h1 className="text-headline-lg-mobile tracking-tighter mt-2">12.450.000đ</h1>
            </div>

            <div className="w-full h-[1px] bg-white/10 my-8"></div>

            <div className="w-full flex justify-between items-center z-10 px-4">
              <div className="flex flex-col">
                <span className="text-label-md text-on-primary/60">Đang chờ duyệt</span>
                <span className="text-headline-sm">2.100.000đ</span>
              </div>
              <Link
                href="/withdraw"
                className="bg-white text-primary px-8 py-3 rounded-full text-label-md hover:scale-95 transition-transform active:scale-90 duration-200"
              >
                Rút tiền
              </Link>
            </div>
          </div>
        </section>

        {/* Transaction History */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-headline-sm">Lịch sử giao dịch</h2>
            <Link
              href="/history"
              className="text-on-surface-variant text-label-md flex items-center gap-1"
            >
              Tất cả <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Link>
          </div>

          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-lifted-cream p-5 rounded-[32px] border border-surface-container shadow-sm flex items-center justify-between hover:border-dust-taupe transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">{tx.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-label-md text-on-surface">{tx.title}</span>
                    <span className="text-[13px] text-on-surface-variant">{tx.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-label-md ${tx.amountColor}`}>{tx.amount}</span>
                  <span className="flex items-center gap-1.5 text-[12px] font-medium text-on-surface-variant">
                    <span className={`w-2 h-2 rounded-full ${tx.statusColor}`}></span>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
