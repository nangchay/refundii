"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/", icon: "local_mall", label: "Săn Deal" },
  { href: "/wallet", icon: "account_balance_wallet", label: "Ví" },
  { href: "/history", icon: "history", label: "Lịch sử" },
  { href: "/profile", icon: "person", label: "Cá nhân" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user, profile } = useAuth();

  return (
    <nav className="fixed bottom-6 left-0 right-0 mx-auto w-[92%] max-w-md z-50 flex justify-around items-center py-3 px-6 bg-white rounded-full shadow-[0_24px_48px_rgba(0,0,0,0.08)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const isProfileTab = item.href === "/profile";
        const isLoggedIn = !!user && !!profile;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-colors active:scale-90 duration-200 ${
              isActive
                ? "text-signal-orange font-bold scale-110"
                : "text-on-surface-variant/60 hover:text-signal-orange"
            }`}
          >
            {isProfileTab && isLoggedIn ? (
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1 ${
                isActive ? "bg-signal-orange" : "bg-gradient-to-br from-signal-orange to-tertiary-fixed-dim"
              }`}>
                {profile.wallet_name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <span
                className="material-symbols-outlined mb-1"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
            )}
            <span className="font-label-md text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
