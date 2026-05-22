"use client";

import { Dispatch, SetStateAction } from "react";
import Link from "next/link";

type AuthMode = "login" | "register";
type RegisterStep = "form" | "otp";

interface AuthBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  registerStep: RegisterStep;
  identifier: string;
  setIdentifier: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  walletName: string;
  setWalletName: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  regPassword: string;
  setRegPassword: Dispatch<SetStateAction<string>>;
  otp: string;
  onOtpChange: (value: string) => void;
  countdown: number;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  error: string;
  onLogin: () => void;
  onRegister: () => void;
  onVerifyOtp: () => void;
  onResendOtp: () => void;
}

export default function AuthBottomSheet({
  isVisible,
  onClose,
  authMode,
  setAuthMode,
  registerStep,
  identifier,
  setIdentifier,
  password,
  setPassword,
  walletName,
  setWalletName,
  email,
  setEmail,
  regPassword,
  setRegPassword,
  otp,
  onOtpChange,
  countdown,
  showPassword,
  setShowPassword,
  isLoading,
  error,
  onLogin,
  onRegister,
  onVerifyOtp,
  onResendOtp,
}: AuthBottomSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[32px] transition-transform duration-300 ease-out max-h-[90vh] overflow-y-auto ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-6 max-w-md mx-auto">
          {/* Handle */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#141413]">
              {authMode === "login"
                ? "Đăng nhập"
                : registerStep === "otp"
                  ? "Xác thực Email"
                  : "Mở Ví Refundii"}
            </h2>
            <p className="text-sm text-[#696969] mt-1">
              {authMode === "login"
                ? "Đăng nhập vào Ví của bạn"
                : registerStep === "otp"
                  ? `Nhập mã OTP đã gửi đến ${email}`
                  : "Tạo ví mới chỉ trong 30 giây"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          {authMode === "login" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#696969] ml-1">Tên Ví hoặc Email</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#141413]"
                  placeholder="VD: Sanh123 hoặc email@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#696969] ml-1">Mật khẩu</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#141413]"
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#696969]"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              <div className="text-right">
                <Link href="/auth/forgot-password" className="text-sm text-[#3860BE]">
                  Quên mật khẩu?
                </Link>
              </div>
              <button
                onClick={onLogin}
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-[#141413] text-white font-medium disabled:opacity-50"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
              <p className="text-center text-sm text-[#696969]">
                Chưa có tài khoản?{" "}
                <button onClick={() => setAuthMode("register")} className="text-[#CF4500] font-bold">
                  Đăng ký ngay
                </button>
              </p>
            </div>
          )}

          {/* Register Form */}
          {authMode === "register" && registerStep === "form" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#696969] ml-1">Tên Ví (Username)</label>
                <input
                  type="text"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value.replace(/\s/g, ""))}
                  className="w-full mt-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#141413]"
                  placeholder="VD: Sanh123"
                />
                <p className="text-xs text-[#696969] ml-1 mt-1">Không khoảng trắng, chỉ chữ và số</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#696969] ml-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#141413]"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#696969] ml-1">Mật khẩu</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#141413]"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#696969]"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              <button
                onClick={onRegister}
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-[#141413] text-white font-medium disabled:opacity-50"
              >
                {isLoading ? "Đang xử lý..." : "Mở Ví"}
              </button>
              <p className="text-center text-sm text-[#696969]">
                Đã có tài khoản?{" "}
                <button onClick={() => setAuthMode("login")} className="text-[#CF4500] font-bold">
                  Đăng nhập
                </button>
              </p>
            </div>
          )}

          {/* OTP Form */}
          {authMode === "register" && registerStep === "otp" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#696969] ml-1">Mã xác thực (6 chữ số)</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => onOtpChange(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#141413] text-center tracking-[0.5em] font-mono"
                  placeholder="000000"
                  maxLength={8}
                />
              </div>
              <button
                onClick={onVerifyOtp}
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-[#141413] text-white font-medium disabled:opacity-50"
              >
                {isLoading ? "Đang xác thực..." : "Xác nhận"}
              </button>
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-[#696969]">
                    Gửi lại mã sau <span className="font-bold text-[#CF4500]">{countdown}s</span>
                  </p>
                ) : (
                  <button onClick={onResendOtp} disabled={isLoading} className="text-sm text-[#3860BE]">
                    Gửi lại mã
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
