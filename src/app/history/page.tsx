"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

type FilterType = "all" | "pending" | "success" | "failed";

const transactions = [
  {
    id: "SN9218",
    icon: "shopping_bag",
    platform: "Shopee",
    title: "Mua hàng Shopee - Đơn #SN9218",
    date: "Hôm nay, 14:20",
    amount: "+24.500đ",
    status: "pending",
    statusText: "Chờ đối soát (30-45 ngày)",
    statusBg: "bg-tertiary-fixed",
    statusTextColor: "text-on-tertiary-fixed-variant",
    dotColor: "bg-signal-orange",
  },
  {
    id: "TK8821",
    icon: "movie",
    platform: "TikTok",
    title: "TikTok Shop Order - #TK8821",
    date: "12 Th08, 2023",
    amount: "+12.000đ",
    status: "success",
    statusText: "Thành công",
    statusBg: "bg-green-50",
    statusTextColor: "text-green-700",
    dotColor: "bg-green-500",
  },
  {
    id: "TV7732",
    icon: "flight",
    platform: "Traveloka",
    title: "Traveloka - Đơn #TV7732",
    date: "10 Th08, 2023",
    amount: "+150.000đ",
    status: "failed",
    statusText: "Thất bại / Đã hủy",
    statusBg: "bg-error-container",
    statusTextColor: "text-on-error-container",
    dotColor: "bg-error",
    strikethrough: true,
  },
  {
    id: "LZ4410",
    icon: "local_mall",
    platform: "Lazada",
    title: "Lazada Global - Đơn #LZ4410",
    date: "08 Th08, 2023",
    amount: "+8.400đ",
    status: "success",
    statusText: "Thành công",
    statusBg: "bg-green-50",
    statusTextColor: "text-green-700",
    dotColor: "bg-green-500",
  },
];

const filters = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ đối soát" },
  { key: "success", label: "Có thể rút" },
  { key: "failed", label: "Đã hủy" },
];

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilter === "all") return true;
    return tx.status === activeFilter;
  });

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-lg rounded-full z-50 bg-white/80 backdrop-blur-lg shadow-nav flex justify-between items-center px-6 py-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-surface-container">
          <div className="w-full h-full bg-gradient-to-br from-signal-orange/20 to-primary/10" />
        </div>
        <h1 className="text-headline-sm tracking-tighter text-primary font-medium">SÀNH</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
        </button>
      </header>

      <main className="pt-28 px-6 max-w-lg mx-auto pb-40">
        {/* Page Title & Orbital Accent */}
        <div className="relative mb-8">
          <div
            className="orbital-arc w-24 h-24 -top-4 -left-6 opacity-20"
            style={{
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
              transform: "rotate(-45deg)",
            }}
          ></div>
          <p className="text-eyebrow text-on-tertiary-container mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-signal-orange"></span>
            GIAO DỊCH
          </p>
          <h2 className="text-headline-md text-primary">Lịch sử hoàn tiền</h2>
        </div>

        {/* Filter Section */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar mb-8 -mx-6 px-6">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as FilterType)}
              className={`flex-shrink-0 px-6 py-3 rounded-full text-label-md transition-all ${
                activeFilter === filter.key
                  ? "bg-primary text-on-primary"
                  : "bg-lifted-cream text-on-surface-variant border border-outline/10 hover:bg-surface-container-low"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className={`bg-lifted-cream p-5 rounded-[24px] shadow-card border border-white relative overflow-hidden group ${
                tx.status === "failed" ? "opacity-80" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center relative">
                    <span className="material-symbols-outlined text-primary text-[28px]">
                      {tx.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-label-md text-primary mb-1">{tx.title}</h3>
                    <p className="text-[12px] text-on-surface-variant opacity-60">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold text-headline-sm ${
                      tx.strikethrough ? "text-on-surface-variant line-through" : "text-primary"
                    }`}
                  >
                    {tx.amount}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`px-4 py-1.5 rounded-full ${tx.statusBg} ${tx.statusTextColor} text-[12px] font-bold flex items-center gap-1.5`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${tx.dotColor}`}></span>
                  {tx.statusText}
                </span>
                <button className="w-8 h-8 rounded-full bg-white border border-outline/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Floating Card */}
        <div className="mt-12 p-8 bg-primary rounded-[40px] text-on-primary relative overflow-hidden">
          <div className="orbital-arc w-48 h-48 -bottom-10 -right-10 opacity-30 absolute"></div>
          <p className="text-eyebrow text-dust-taupe mb-4">TỔNG TÍCH LŨY</p>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[42px] font-bold leading-none mb-2">1.450.000đ</h2>
              <p className="text-label-md opacity-60">Có thể rút ngay: 235.000đ</p>
            </div>
            <Link
              href="/withdraw"
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-primary text-[32px]">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
