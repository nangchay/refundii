"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordReset } from "@/lib/supabase/auth";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!identifier.trim()) {
      setError("Vui lòng nhập Tên Ví hoặc Email");
      return;
    }

    setIsLoading(true);
    const result = await sendPasswordReset(identifier);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="bg-[#F3F0EE] text-[#141413] min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-center px-6 py-4 max-w-md mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Refundii" className="h-10 w-auto" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#F37338] to-[#CF4500] bg-clip-text text-transparent">
              Refundii
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-grow px-6 py-8 max-w-md mx-auto w-full">
        {/* Hero */}
        <section className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F37338]"></span>
            <span className="text-xs font-bold text-[#696969] uppercase tracking-[0.04em]">
              KHÔI PHỤC
            </span>
          </div>
          <h1 className="text-3xl font-medium text-[#141413] tracking-[-0.02em] mb-2">
            Quên mật khẩu?
          </h1>
          <p className="text-base text-[#696969]">
            Nhập Tên Ví hoặc Email để nhận link đặt lại mật khẩu
          </p>
        </section>

        {success ? (
          <div className="space-y-6">
            <div className="p-6 bg-[#FCFBFA] border border-[#141413]/10 rounded-[20px] text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-green-600">check</span>
              </div>
              <h2 className="text-lg font-medium text-[#141413] mb-2">Đã gửi email</h2>
              <p className="text-sm text-[#696969]">
                Chúng tôi đã gửi link đặt lại mật khẩu tới email của bạn. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác).
              </p>
            </div>

            <Link
              href="/auth"
              className="block w-full py-4 rounded-[20px] bg-[#141413] text-[#F3F0EE] font-medium text-base text-center transition-all active:scale-[0.98]"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[20px] text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#696969] ml-1">Tên Ví hoặc Email</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-5 py-4 rounded-[20px] border border-[#141413]/20 bg-white focus:outline-none focus:border-[#141413] transition-colors text-base"
                placeholder="VD: Sanh123 hoặc email@example.com"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 rounded-[20px] bg-[#141413] text-[#F3F0EE] font-medium text-base transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Đang gửi..." : "Gửi link khôi phục"}
            </button>

            <Link
              href="/auth"
              className="block text-center text-sm text-[#3860BE] hover:underline"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        )}
      </main>

      {/* Decorative */}
      <div className="fixed bottom-0 left-0 w-full h-24 pointer-events-none overflow-hidden opacity-30">
        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path d="M0 80 Q 100 20 200 80 T 400 80" fill="none" stroke="#F37338" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}
