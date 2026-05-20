"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "local_mall", label: "Săn Deal" },
  { href: "/wallet", icon: "account_balance_wallet", label: "Ví" },
  { href: "/history", icon: "receipt_long", label: "Lịch sử" },
  { href: "/profile", icon: "person", label: "Cá nhân" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md rounded-full z-50 bg-white shadow-bottom-nav flex justify-around items-center p-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center rounded-full px-5 py-2 active:scale-90 duration-300 ${
              isActive
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:text-primary transition-all"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
