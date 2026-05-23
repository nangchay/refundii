"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";
const COMMIT_SHA = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "dev";

function VersionInfo() {
  return (
    <p className="text-center text-xs text-on-surface-variant/50 mt-4">
      Phiên bản {APP_VERSION} ({COMMIT_SHA}) • Refundii Vietnam
    </p>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="bg-tertiary-fixed/10 min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-signal-orange text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="bg-tertiary-fixed/10 text-on-surface min-h-screen overflow-x-hidden">
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

      <main className="max-w-md mx-auto px-6 pt-24 pb-32 space-y-8 overflow-hidden">
        {user && profile ? (
          <LoggedInProfile profile={profile} onLogout={handleLogout} />
        ) : (
          <>
            <GuestProfile />

            {/* Zalo Action Button */}
            <section>
              <a
                className="w-full bg-[#0068FF] hover:opacity-90 active:scale-[0.98] transition-all py-4 px-6 rounded-full flex items-center justify-between shadow-lg shadow-blue-500/20 group"
                href="#"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'wght' 500" }}>support_agent</span>
                  </div>
                  <div>
                    <p className="text-white font-bold leading-tight">Hỗ trợ qua Zalo</p>
                    <p className="text-white/70 text-[12px]">Phản hồi ngay trong 5 phút</p>
                  </div>
                </div>
                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[#0068FF]">arrow_forward</span>
                </div>
              </a>
            </section>

            {/* Menu Section */}
            <section className="space-y-3">
              <h2 className="font-label-md text-secondary px-2 uppercase tracking-widest text-[11px] font-bold">
                Cài đặt chung
              </h2>
              <div className="space-y-2">
                <MenuItem icon="settings" label="Cài đặt ứng dụng" />
                <MenuItem icon="description" label="Điều khoản & Dữ liệu" />
                <MenuItem icon="support_agent" label="Hỗ trợ" />
              </div>
            </section>

            <VersionInfo />
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function MenuItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="bg-white border border-surface-container px-6 py-4 rounded-full flex items-center justify-between hover:border-signal-orange group cursor-pointer shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-signal-orange transition-colors">
          {icon}
        </span>
        <span className="font-label-md text-on-surface">{label}</span>
      </div>
      <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
    </div>
  );
}

function GuestProfile() {
  return (
    <section className="relative flex flex-col items-center overflow-hidden">
      <div className="absolute w-32 h-32 -top-2 -right-2 rotate-45 rounded-full border-[1.5px] border-signal-orange border-t-transparent border-l-transparent opacity-40 pointer-events-none"></div>
      <div className="absolute w-40 h-40 -top-6 -right-6 -rotate-12 rounded-full border-[1.5px] border-signal-orange border-t-transparent border-l-transparent opacity-10 pointer-events-none"></div>

      <div className="relative">
        <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-surface-container flex items-center justify-center">
          <span className="material-symbols-outlined text-outline text-5xl" style={{ fontVariationSettings: "'wght' 200" }}>person</span>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-surface-container-highest p-1.5 rounded-full border-2 border-white shadow-lg">
          <span className="material-symbols-outlined text-secondary text-[16px] font-bold">help</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h1 className="font-headline-sm text-headline-sm text-primary font-bold">Khách hàng ẩn danh</h1>
        <p className="text-secondary font-label-md mt-1 italic">Bạn đang sử dụng phiên bản khách</p>
      </div>

      <div className="w-full flex flex-col items-center mt-8">
        <Link
          href="/auth"
          className="w-full py-4 rounded-full shadow-lg shadow-signal-orange/20 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
          style={{ background: "linear-gradient(135deg, #FFD700 0%, #CF4500 100%)" }}
        >
          <span className="text-white font-bold text-label-md">Mở Ví / Đăng nhập</span>
          <span className="material-symbols-outlined text-white text-lg">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}

interface Profile {
  wallet_name: string;
  email: string;
}

function LoggedInProfile({ profile, onLogout }: { profile: Profile; onLogout: () => void }) {
  return (
    <>
      {/* Avatar Section */}
      <section className="relative flex flex-col items-center overflow-hidden">
        <div className="absolute w-32 h-32 -top-2 -right-2 rotate-45 rounded-full border-[1.5px] border-signal-orange border-t-transparent border-l-transparent opacity-40 pointer-events-none"></div>

        <div className="relative">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-signal-orange to-tertiary-fixed-dim flex items-center justify-center">
            <span className="text-white text-4xl font-bold">{profile.wallet_name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-amber-400 to-yellow-600 p-1.5 rounded-full border-2 border-white shadow-lg">
            <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <h1 className="font-headline-sm text-headline-sm text-primary font-bold">{profile.wallet_name}</h1>
          <p className="text-secondary font-label-md mt-1">Ví đã được kích hoạt</p>
        </div>
      </section>

      {/* Zalo Support CTA */}
      <section>
        <a
          className="w-full bg-[#0068FF] hover:opacity-90 active:scale-[0.98] transition-all py-4 px-6 rounded-full flex items-center justify-between shadow-lg shadow-blue-500/20 group"
          href="#"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'wght' 500" }}>support_agent</span>
            </div>
            <div>
              <p className="text-white font-bold leading-tight">Hỗ trợ qua Zalo</p>
              <p className="text-white/70 text-[12px]">Phản hồi ngay trong 5 phút</p>
            </div>
          </div>
          <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <span className="material-symbols-outlined text-[#0068FF]">arrow_forward</span>
          </div>
        </a>
      </section>

      {/* Menu Section */}
      <section className="space-y-3">
        <h2 className="font-label-md text-secondary px-2 uppercase tracking-widest text-[11px] font-bold">
          Tài khoản & Cài đặt
        </h2>
        <div className="space-y-2">
          <MenuItem icon="person" label="Thông tin cá nhân" />
          <MenuItem icon="account_balance" label="Liên kết ngân hàng" />
          <MenuItem icon="security" label="Bảo mật tài khoản" />
          <MenuItem icon="settings" label="Cài đặt ứng dụng" />
          <MenuItem icon="description" label="Điều khoản & Dữ liệu" />
          <MenuItem icon="support_agent" label="Hỗ trợ" />
        </div>
      </section>

      {/* Logout Button */}
      <section>
        <button onClick={onLogout} className="w-full py-4 text-error font-bold flex items-center justify-center gap-2 hover:bg-error/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">logout</span>
          Đăng xuất
        </button>
        <VersionInfo />
      </section>
    </>
  );
}
