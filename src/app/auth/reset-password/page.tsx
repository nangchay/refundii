"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updatePassword } from "@/lib/supabase/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsLoading(true);
    const result = await updatePassword(password);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/"), 2000);
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
        <section className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F37338]"></span>
            <span className="text-xs font-bold text-[#696969] uppercase tracking-[0.04em]">
              BẢO MẬT
            </span>
          </div>
          <h1 className="text-3xl font-medium text-[#141413] tracking-[-0.02em] mb-2">
            Đặt lại mật khẩu
          </h1>
          <p className="text-base text-[#696969]">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </section>

        {success ? (
          <div className="p-6 bg-[#FCFBFA] border border-[#141413]/10 rounded-[20px] text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-green-600">check</span>
            </div>
            <h2 className="text-lg font-medium text-[#141413] mb-2">Thành công!</h2>
            <p className="text-sm text-[#696969]">
              Mật khẩu đã được cập nhật. Đang chuyển hướng...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[20px] text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#696969] ml-1">Mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 pr-12 rounded-[20px] border border-[#141413]/20 bg-white focus:outline-none focus:border-[#141413] transition-colors text-base"
                  placeholder="Tối thiểu 6 ký tự"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#696969] hover:text-[#141413]"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#696969] ml-1">Xác nhận mật khẩu</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-[20px] border border-[#141413]/20 bg-white focus:outline-none focus:border-[#141413] transition-colors text-base"
                placeholder="Nhập lại mật khẩu"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 rounded-[20px] bg-[#141413] text-[#F3F0EE] font-medium text-base transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
