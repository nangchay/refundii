"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpWithEmail, signInWithCredentials, verifySignUpOtp, resendOtp } from "@/lib/supabase/auth";

type AuthMode = "login" | "register";
type RegisterStep = "form" | "otp";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [registerStep, setRegisterStep] = useState<RegisterStep>("form");

  // Login fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [walletName, setWalletName] = useState("");
  const [email, setEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // OTP
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateWalletName = (name: string): string | null => {
    if (name.length < 3) return "Tên Ví phải có ít nhất 3 ký tự";
    if (/\s/.test(name)) return "Tên Ví không được chứa khoảng trắng";
    if (!/^[a-zA-Z0-9]+$/.test(name)) return "Tên Ví chỉ được chứa chữ và số";
    return null;
  };

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email không đúng định dạng";
    return null;
  };

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return null;
  };

  const handleLogin = async () => {
    setError("");

    if (!identifier.trim()) {
      setError("Vui lòng nhập Tên Ví hoặc Email");
      return;
    }
    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    setIsLoading(true);
    const result = await signInWithCredentials(identifier, password);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/");
  };

  const handleRegister = async () => {
    setError("");

    const walletError = validateWalletName(walletName);
    if (walletError) {
      setError(walletError);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const pwdError = validatePassword(regPassword);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    setIsLoading(true);
    const result = await signUpWithEmail(walletName, email, regPassword);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setRegisterStep("otp");
    startCountdown();
  };

  const handleOtpChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 8);
    setOtp(cleanValue);
    if (cleanValue.length === 8) {
      handleVerifyOtpAuto(cleanValue);
    }
  };

  const handleVerifyOtpAuto = async (otpValue: string) => {
    setError("");
    setIsLoading(true);
    const result = await verifySignUpOtp(email, otpValue);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/");
  };

  const handleVerifyOtp = async () => {
    setError("");

    if (otp.length !== 8) {
      setError("Mã xác thực phải có 8 chữ số");
      return;
    }

    setIsLoading(true);
    const result = await verifySignUpOtp(email, otp);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/");
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setError("");
    setIsLoading(true);
    const result = await resendOtp(email);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    startCountdown();
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError("");
    setRegisterStep("form");
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
              {mode === "login" ? "ĐĂNG NHẬP" : registerStep === "otp" ? "XÁC THỰC" : "MỞ VÍ"}
            </span>
          </div>
          <h1 className="text-3xl font-medium text-[#141413] tracking-[-0.02em] mb-2">
            {mode === "login"
              ? "Chào mừng trở lại"
              : registerStep === "otp"
                ? "Xác thực Email"
                : "Mở Ví Refundii"}
          </h1>
          <p className="text-base text-[#696969]">
            {mode === "login"
              ? "Đăng nhập vào Ví của bạn"
              : registerStep === "otp"
                ? `Nhập mã OTP đã gửi đến ${email}`
                : "Tạo ví mới chỉ trong 30 giây"}
          </p>
        </section>

        {/* Tab Switcher - only show when not in OTP step */}
        {registerStep !== "otp" && (
          <div className="flex bg-[#FCFBFA] rounded-[999px] p-1 mb-6 border border-[#141413]/10">
            <button
              onClick={() => switchMode("login")}
              className={`flex-1 py-3 rounded-[999px] text-base font-medium transition-all duration-300 ${
                mode === "login"
                  ? "bg-[#141413] text-[#F3F0EE] shadow-sm"
                  : "text-[#696969]"
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => switchMode("register")}
              className={`flex-1 py-3 rounded-[999px] text-base font-medium transition-all duration-300 ${
                mode === "register"
                  ? "bg-[#141413] text-[#F3F0EE] shadow-sm"
                  : "text-[#696969]"
              }`}
            >
              Đăng ký
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[20px] text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        {mode === "login" && (
          <div className="space-y-4">
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#696969] ml-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 pr-12 rounded-[20px] border border-[#141413]/20 bg-white focus:outline-none focus:border-[#141413] transition-colors text-base"
                  placeholder="Nhập mật khẩu"
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

            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#3860BE] hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-4 rounded-[20px] bg-[#141413] text-[#F3F0EE] font-medium text-base transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <p className="text-center text-sm text-[#696969]">
              Chưa có tài khoản?{" "}
              <button
                onClick={() => switchMode("register")}
                className="text-[#CF4500] font-bold hover:underline"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        )}

        {/* Register Form */}
        {mode === "register" && registerStep === "form" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#696969] ml-1">Tên Ví (Username)</label>
              <input
                type="text"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value.replace(/\s/g, ""))}
                className="w-full px-5 py-4 rounded-[20px] border border-[#141413]/20 bg-white focus:outline-none focus:border-[#141413] transition-colors text-base"
                placeholder="VD: Sanh123"
              />
              <p className="text-xs text-[#696969] ml-1">Không khoảng trắng, chỉ chữ và số, tối thiểu 3 ký tự</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#696969] ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-[20px] border border-[#141413]/20 bg-white focus:outline-none focus:border-[#141413] transition-colors text-base"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#696969] ml-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
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

            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full py-4 rounded-[20px] bg-[#141413] text-[#F3F0EE] font-medium text-base transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Mở Ví"}
            </button>

            <p className="text-center text-sm text-[#696969]">
              Đã có tài khoản?{" "}
              <button
                onClick={() => switchMode("login")}
                className="text-[#CF4500] font-bold hover:underline"
              >
                Đăng nhập
              </button>
            </p>
          </div>
        )}

        {/* OTP Verification */}
        {mode === "register" && registerStep === "otp" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#696969] ml-1">Mã xác thực (6 chữ số)</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                className="w-full px-5 py-4 rounded-[20px] border border-[#141413]/20 bg-white focus:outline-none focus:border-[#141413] transition-colors text-base text-center tracking-[0.5em] font-mono"
                placeholder="000000"
                maxLength={8}
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={isLoading}
              className="w-full py-4 rounded-[20px] bg-[#141413] text-[#F3F0EE] font-medium text-base transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Đang xác thực..." : "Xác nhận"}
            </button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-[#696969]">
                  Gửi lại mã sau <span className="font-bold text-[#CF4500]">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-sm text-[#3860BE] hover:underline"
                >
                  Gửi lại mã
                </button>
              )}
            </div>

            <button
              onClick={() => setRegisterStep("form")}
              className="w-full text-center text-sm text-[#696969] hover:text-[#141413]"
            >
              Quay lại chỉnh sửa thông tin
            </button>
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
