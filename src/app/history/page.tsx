"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";

type FilterType = "all" | "pending" | "received" | "cancelled";

const transactions = [
  {
    id: "1",
    name: "Highlands Coffee",
    category: "Đồ uống",
    time: "14:20",
    date: "today",
    amount: "+12,500đ",
    status: "pending",
    statusText: "Đang chờ",
    dotColor: "bg-yellow-500",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxarq9TOx3-6XxM3Zxf3GmRWnSQDM65tNfRlXQO-WptKfJfo_fFvi6fYeVkTKxZ1niXps_q9cmoZKGVM8-BieBSZz-tzKQXJDkv2jwI-KNhjlkybeLeUHjx_3xvemVhlEc-1Y7r2le3I92160wJv0RkECHqcnwxt_9YrglXiqbEhLo1PPcA6YTw6pP3m5VSGCAQ5vO6qmL6CQw_a_CjB4uRL28dIRStz6_3IkC2P1TAL0XOtQ1zHsJe8VmRN70SC5ontdILfwcvkJu",
  },
  {
    id: "2",
    name: "Uniqlo Vietnam",
    category: "Thời trang",
    time: "10:05",
    date: "today",
    amount: "+85,200đ",
    status: "received",
    statusText: "Đã nhận",
    dotColor: "bg-green-500",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChwDZYIKdDaZY4S5xse9bL0loJZTfkkoQlg4BWAVPBGMUAlBW4h8a9-DGu8OS19Os0RmSL103zhoFUlpmtI7alykoQmGJDjCIaCaPXEIIfU3sDZdaQTG2_0oOhFHnPYhdqUpogoLdFvkAsVHmZsTso43pqIuov9uyUDIEKqPVCsbBGenzhxxKOSRmeBqsgvNXONTT72yVlGiDpBWnSclU3qzofY5aUOTx1MU-gtmNKFqlaDctoXoukgT0COaZU1wLn15kEraLsTK14",
  },
  {
    id: "3",
    name: "Shopee Mall",
    category: "Mua sắm",
    time: "18:45",
    date: "yesterday",
    amount: "+42,000đ",
    status: "received",
    statusText: "Đã nhận",
    dotColor: "bg-green-500",
    icon: "shopping_bag",
  },
  {
    id: "4",
    name: "GrabFood",
    category: "Ăn uống",
    time: "12:30",
    date: "yesterday",
    amount: "+18,900đ",
    status: "cancelled",
    statusText: "Đã hủy",
    dotColor: "bg-red-500",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVdbFXEfAjCPzKv1Ixe4zEGs-CHVmYYnbo5ar0pDLDzEahm8TH0c1IDEzDuKaI0atlSHzFIU1b6jMoJT2qyCI3RFEXEkfWhdQODvcXmbZ3g1lqHslNHxPQRfm2v6F4r_Ps_qW9jJIKP0EEU06fcas7r1HUMYdqd5xW-G-uOZ6ifVZuUFA2eo_s_JItCtPAs7-Hxgp5uaSwQXty2nX-wDPRKdR4KfweLywjs7XNwg_52tBGHMeRQXWcNNrhayuR6k-5eHH5puDGnBH8",
  },
  {
    id: "5",
    name: "Nike Store",
    category: "Thể thao",
    time: "09:15",
    date: "yesterday",
    amount: "+120,000đ",
    status: "received",
    statusText: "Đã nhận",
    dotColor: "bg-green-500",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQxfQHWXKchNzLfpDZH8E_ligH9SivN3g-HcVtHANeztjymttsA9fapU1SJaxpIR4TEgSXqHdU1_493mQxUNZW3BqqLeJR7oBd3D3drFFVfpu2Igf8gC1ufgrlb2hAitMca9oQ7KMYhZo0fkXjjyVtfwlfjRC4_k7G40_SmKTddaBJxpotoFoWUn41QpNk6_v5K9CJKSnxwnqt9-EmFol0B4jEY4OWqqQaEUGCYfYjjh0vni48WtW1YklYUEWftifNtNqRMgOxJrkY",
  },
];

const filters = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ duyệt" },
  { key: "received", label: "Thành công" },
];

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const { user, profile, loading } = useAuth();

  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilter === "all") return true;
    return tx.status === activeFilter;
  });

  const todayTransactions = filteredTransactions.filter((tx) => tx.date === "today");
  const yesterdayTransactions = filteredTransactions.filter((tx) => tx.date === "yesterday");

  if (loading) {
    return (
      <div className="bg-tertiary-fixed/10 min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-signal-orange text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="bg-tertiary-fixed/10 min-h-screen">
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
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          todayTransactions={todayTransactions}
          yesterdayTransactions={yesterdayTransactions}
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
              alt="Empty shopping bag"
              className="w-64 h-64 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTgx3K7XwBxAkegQbZ-8TrvI6-niuv0s0x_cOl5_DbVctJZijDR-aC_Fw7lK9U2rWG3XsUgDKM8bH-Fpn0CsnW7t_ocM3Ir7tV1_jieNmQjxsT8pIdfYafN8bJruIH9hZ8g3XAJip5G8t81riFAhBl9QjmzTN1xA8KJIzQgUbm3AF5yaSlrAF2ha8CdNWtMHXbnxcRK956u0tHcjwm6AFIwfNQ21NBkSZFItLDKp1KeF1t9dIGaIq5H_LshxEa9LfVp5fC4H1JNcZd"
            />
          </div>
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold mb-4 px-4">
            Đăng nhập để xem lịch sử
          </h2>
          <p className="font-body-md text-body-md text-secondary max-w-[280px] leading-relaxed">
            Vui lòng đăng nhập hoặc đăng ký tài khoản để bắt đầu lưu lại các giao dịch hoàn tiền của bạn.
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
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  todayTransactions: Transaction[];
  yesterdayTransactions: Transaction[];
}

function LoggedInContent({ activeFilter, setActiveFilter, todayTransactions, yesterdayTransactions }: LoggedInContentProps) {
  return (
    <main className="pt-24 pb-32 px-6">
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-signal-orange"></span>
          <span className="font-eyebrow text-eyebrow text-on-surface-variant uppercase tracking-wider">Tổng quan hoàn tiền</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">2,450,000đ</h2>
            <p className="text-on-surface-variant text-sm">Tiết kiệm được trong tháng này</p>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[1.5px] border-signal-orange border-b-transparent border-l-transparent rotate-45"></div>
            <span className="material-symbols-outlined text-signal-orange">trending_up</span>
          </div>
        </div>
      </section>

      <div className="sticky top-20 z-40 py-4 -mx-6 px-6 bg-surface/80 backdrop-blur-sm">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as FilterType)}
              className={`px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap active:scale-95 transition-transform ${
                activeFilter === filter.key ? "bg-primary text-white" : "bg-lifted-cream border border-outline/20"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mt-4">
        {todayTransactions.length > 0 && (
          <>
            <div className="pt-4 pb-2">
              <p className="font-eyebrow text-eyebrow text-on-surface-variant/60">HÔM NAY</p>
            </div>
            {todayTransactions.map((tx) => (
              <TransactionCard key={tx.id} transaction={tx} />
            ))}
          </>
        )}
        {yesterdayTransactions.length > 0 && (
          <>
            <div className="pt-8 pb-2">
              <p className="font-eyebrow text-eyebrow text-on-surface-variant/60">HÔM QUA</p>
            </div>
            {yesterdayTransactions.map((tx) => (
              <TransactionCard key={tx.id} transaction={tx} />
            ))}
          </>
        )}
      </div>
    </main>
  );
}

interface Transaction {
  id: string;
  name: string;
  category: string;
  time: string;
  date: string;
  amount: string;
  status: string;
  statusText: string;
  dotColor: string;
  image?: string;
  icon?: string;
}

function TransactionCard({ transaction: tx }: { transaction: Transaction }) {
  return (
    <div className="bg-lifted-cream p-5 rounded-[40px] shadow-[0_24px_48px_rgba(0,0,0,0.04)] flex items-center justify-between group transition-all hover:translate-y-[-2px]">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center relative overflow-hidden">
          {tx.image ? (
            <img alt={tx.name} className="w-full h-full object-cover" src={tx.image} />
          ) : (
            <>
              <div className="absolute inset-0 bg-primary/5"></div>
              <span className="material-symbols-outlined text-primary">{tx.icon}</span>
            </>
          )}
        </div>
        <div>
          <h3 className="font-label-md text-label-md text-primary">{tx.name}</h3>
          <p className="text-xs text-on-surface-variant">{tx.time} • {tx.category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-signal-orange">{tx.amount}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`w-1.5 h-1.5 rounded-full ${tx.dotColor}`}></span>
          <span className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-tighter">{tx.statusText}</span>
        </div>
      </div>
    </div>
  );
}
