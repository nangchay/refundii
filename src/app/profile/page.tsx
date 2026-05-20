"use client";

import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-lg rounded-full z-50 bg-white/80 backdrop-blur-lg shadow-nav flex justify-between items-center px-6 py-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-surface-container">
          <div className="w-full h-full bg-gradient-to-br from-signal-orange/20 to-primary/10" />
        </div>
        <div className="text-headline-sm tracking-tighter text-primary font-medium">SÀNH</div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </header>

      <main className="pt-32 pb-40 px-6 max-w-md mx-auto">
        {/* Profile Header Section */}
        <section className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
            {/* Orbital Arc Decoration */}
            <div
              className="absolute -inset-2 rounded-full border-[1.5px] border-signal-orange rotate-45 opacity-60"
              style={{ borderBottomColor: "transparent", borderLeftColor: "transparent" }}
            ></div>
            {/* Main Avatar Container */}
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10 bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[64px]">person</span>
            </div>
            {/* Satellite CTA */}
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center z-20 hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-primary">edit</span>
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-headline-sm text-primary mb-1">Tên người dùng</h1>
            <p className="text-label-md text-secondary tracking-tight">user.premium@email.com</p>
            <div className="mt-4 flex gap-2 justify-center">
              <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full tracking-widest uppercase">
                Thành viên vàng
              </span>
            </div>
          </div>
        </section>

        {/* Account Sections */}
        <div className="space-y-6">
          {/* Payment Settings */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="w-2 h-2 rounded-full bg-signal-orange"></div>
              <span className="text-eyebrow text-secondary uppercase tracking-widest">Thanh toán</span>
            </div>
            <div className="bg-lifted-cream rounded-[40px] p-6 shadow-sm border border-white/50 space-y-4">
              <button className="w-full flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary transition-colors">
                    <span className="material-symbols-outlined text-primary group-hover:text-white">
                      account_balance
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-label-md text-primary">Tài khoản nhận tiền</p>
                    <p className="text-xs text-secondary">Ngân hàng MB Bank • ••88</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          {/* Support & Policy */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="w-2 h-2 rounded-full bg-dust-taupe"></div>
              <span className="text-eyebrow text-secondary uppercase tracking-widest">
                Hỗ trợ & Pháp lý
              </span>
            </div>
            <div className="bg-lifted-cream rounded-[40px] p-2 shadow-sm border border-white/50">
              <div className="flex flex-col">
                <button className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-[32px] transition-colors group">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary">policy</span>
                    <span className="text-label-md text-primary">Quy định hoàn tiền</span>
                  </div>
                  <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <div className="h-[1px] bg-surface-container mx-6"></div>
                <button className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-[32px] transition-colors group">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary">quiz</span>
                    <span className="text-label-md text-primary">Câu hỏi thường gặp (FAQ)</span>
                  </div>
                  <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <div className="h-[1px] bg-surface-container mx-6"></div>
                <button className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-[32px] transition-colors group">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary">support_agent</span>
                    <span className="text-label-md text-primary">Liên hệ hỗ trợ</span>
                  </div>
                  <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="mt-12 mb-8">
            <button className="w-full py-4 rounded-full border-[1.5px] border-primary text-primary text-label-md hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">logout</span>
              Đăng xuất
            </button>
            <p className="text-center mt-6 text-[10px] text-dust-taupe uppercase tracking-[0.2em]">
              Phiên bản 2.4.0 (Build 88)
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
