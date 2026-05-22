"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import AuthBottomSheet from "@/components/AuthBottomSheet";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithCredentials, signUpWithEmail, verifySignUpOtp, resendOtp } from "@/lib/supabase/auth";
import { validateAndProcess, detectPlatform, ProcessedProduct } from "@/lib/affiliate";

type ProcessingState = "idle" | "processing" | "success" | "error";
type AuthMode = "login" | "register";
type RegisterStep = "form" | "otp";

const PENDING_LINK_KEY = "refundii_pending_link";
const PROCESSING_STATE_KEY = "refundii_processing_state";
const AUTH_FLOW_KEY = "refundii_auth_flow";
const PROCESSED_PRODUCT_KEY = "refundii_processed_product";

export default function HomePage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [link, setLink] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [processingState, setProcessingState] = useState<ProcessingState>("idle");
  const [processedProduct, setProcessedProduct] = useState<ProcessedProduct | null>(null);

  // Bottom Sheet states
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
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

  // Restore link khi mount
  useEffect(() => {
    const savedLink = sessionStorage.getItem(PENDING_LINK_KEY);
    const savedState = sessionStorage.getItem(PROCESSING_STATE_KEY) as ProcessingState;
    const savedProduct = sessionStorage.getItem(PROCESSED_PRODUCT_KEY);
    const inAuthFlow = sessionStorage.getItem(AUTH_FLOW_KEY);

    if (savedLink && savedState) {
      setLink(savedLink);
      setProcessingState(savedState);
    }
    if (savedProduct) {
      try {
        setProcessedProduct(JSON.parse(savedProduct));
      } catch {
        // ignore
      }
    }

    // Clear auth flow flag sau khi restore
    if (inAuthFlow) {
      sessionStorage.removeItem(AUTH_FLOW_KEY);
    }
  }, []);

  // Lưu vào sessionStorage khi có link thành công
  useEffect(() => {
    if (link && processingState === "success" && processedProduct) {
      sessionStorage.setItem(PENDING_LINK_KEY, link);
      sessionStorage.setItem(PROCESSING_STATE_KEY, processingState);
      sessionStorage.setItem(PROCESSED_PRODUCT_KEY, JSON.stringify(processedProduct));
    }
  }, [link, processingState, processedProduct]);

  // Clear session khi user chủ động clear input
  const handleClearLink = () => {
    setLink("");
    setProcessingState("idle");
    setProcessedProduct(null);
    sessionStorage.removeItem(PENDING_LINK_KEY);
    sessionStorage.removeItem(PROCESSING_STATE_KEY);
    sessionStorage.removeItem(PROCESSED_PRODUCT_KEY);
  };

  // Handle sheet animation
  useEffect(() => {
    if (showAuthSheet) {
      setTimeout(() => setIsSheetVisible(true), 10);
    } else {
      setIsSheetVisible(false);
    }
  }, [showAuthSheet]);

  const closeSheet = () => {
    setIsSheetVisible(false);
    setTimeout(() => {
      setShowAuthSheet(false);
      setAuthMode("login");
      setRegisterStep("form");
      setError("");
    }, 300);
  };

  // Auto-detect when link is pasted and start processing
  useEffect(() => {
    if (link.trim() && processingState === "idle") {
      const platform = detectPlatform(link);
      if (platform) {
        setProcessingState("processing");
        const walletId = profile?.id || "guest_" + Date.now();

        validateAndProcess(link, walletId)
          .then((result) => {
            if (result.success) {
              setProcessedProduct(result.data);
              setProcessingState("success");
            } else {
              setError(result.error);
              setProcessingState("error");
            }
          })
          .catch(() => {
            setProcessingState("error");
          });
      }
    }
  }, [link, profile?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
    if (!e.target.value.trim()) {
      setProcessingState("idle");
      setProcessedProduct(null);
      sessionStorage.removeItem(PENDING_LINK_KEY);
      sessionStorage.removeItem(PROCESSING_STATE_KEY);
      sessionStorage.removeItem(PROCESSED_PRODUCT_KEY);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (link.trim() && processingState === "success") {
      handleGoToShopClick();
    }
  };

  const handleGoToShopClick = () => {
    if (user && profile) {
      // Open affiliate link if available, otherwise original link
      const targetUrl = processedProduct?.affiliateLink.shortLink || link;
      window.open(targetUrl, "_blank");
    } else {
      // Đánh dấu đang trong auth flow để giữ link sau login
      sessionStorage.setItem(AUTH_FLOW_KEY, "true");
      setShowAuthSheet(true);
    }
  };

  const switchAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setError("");
    setRegisterStep("form");
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

    if (link.trim()) {
      sessionStorage.setItem(PENDING_LINK_KEY, link);
    }
    window.location.reload();
  };

  const handleRegister = async () => {
    setError("");

    if (walletName.length < 3) {
      setError("Tên Ví phải có ít nhất 3 ký tự");
      return;
    }
    if (/\s/.test(walletName)) {
      setError("Tên Ví không được chứa khoảng trắng");
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(walletName)) {
      setError("Tên Ví chỉ được chứa chữ và số");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không đúng định dạng");
      return;
    }

    if (regPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
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
    const cleanValue = value.replace(/\D/g, "").slice(0, 6);
    setOtp(cleanValue);
    if (cleanValue.length === 6) {
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

    if (link.trim()) {
      sessionStorage.setItem(PENDING_LINK_KEY, link);
    }
    window.location.reload();
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (otp.length !== 6) {
      setError("Mã xác thực phải có 6 chữ số");
      return;
    }

    setIsLoading(true);
    const result = await verifySignUpOtp(email, otp);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (link.trim()) {
      sessionStorage.setItem(PENDING_LINK_KEY, link);
    }
    window.location.reload();
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

  return (
    <div className="bg-tertiary-fixed/10 text-on-surface min-h-screen overflow-x-hidden">
      <header className="bg-surface/80 backdrop-blur-md shadow-sm w-full z-50 fixed top-0 left-0">
        <div className="flex justify-between items-center px-6 py-4 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Refundii" className="h-12 w-auto" />
            <span className="text-headline-sm font-bold bg-gradient-to-r from-signal-orange to-tertiary-fixed-dim bg-clip-text text-transparent">Refundii</span>
          </div>
          <button className="material-symbols-outlined text-secondary active:scale-95 transition-transform">notifications</button>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-32 pt-20 max-w-md mx-auto">
        <section className="pt-12 pb-8">
          <h1 className="text-headline-lg-mobile text-on-background max-w-[90%] leading-tight">
            Dán link Shopee/TikTok – Nhận lại đến <span className="text-signal-orange">10% tiền mặt</span>
          </h1>
        </section>

        <section className="mb-8">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-signal-orange/20 to-tertiary-fixed-dim/20 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className={`glass-pill relative flex items-center w-full px-6 py-5 rounded-full border border-white/40 shadow-xl ${isFocused ? 'ring-2 ring-signal-orange/30' : ''}`}>
              <span className="material-symbols-outlined text-signal-orange mr-3">link</span>
              <input
                type="text"
                value={link}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-on-surface placeholder:text-on-surface-variant/50 text-label-md"
                placeholder="Dán link sản phẩm vào đây..."
              />
            </div>
          </form>
        </section>

        {processingState !== "idle" && (
          <ProcessingCard
            processingState={processingState}
            onGoToShop={handleGoToShopClick}
            processedProduct={processedProduct}
            errorMessage={error}
            onRetry={handleClearLink}
          />
        )}

        <MerchantsGrid />
      </main>

      {showAuthSheet && (
        <AuthBottomSheet
          isVisible={isSheetVisible}
          onClose={closeSheet}
          authMode={authMode}
          setAuthMode={switchAuthMode}
          registerStep={registerStep}
          identifier={identifier}
          setIdentifier={setIdentifier}
          password={password}
          setPassword={setPassword}
          walletName={walletName}
          setWalletName={setWalletName}
          email={email}
          setEmail={setEmail}
          regPassword={regPassword}
          setRegPassword={setRegPassword}
          otp={otp}
          onOtpChange={handleOtpChange}
          countdown={countdown}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isLoading={isLoading}
          error={error}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onVerifyOtp={handleVerifyOtp}
          onResendOtp={handleResendOtp}
        />
      )}

      {!showAuthSheet && <BottomNav />}
    </div>
  );
}

function ProcessingCard({
  processingState,
  onGoToShop,
  processedProduct,
  errorMessage,
  onRetry,
}: {
  processingState: "processing" | "success" | "error";
  onGoToShop: () => void;
  processedProduct: ProcessedProduct | null;
  errorMessage?: string;
  onRetry: () => void;
}) {
  const productTitle = processedProduct?.product.title || "Sản phẩm Shopee";
  const productImage = processedProduct?.product.image;
  const cashbackDisplay = processedProduct?.cashback.displayText || "~ 15.000đ";

  if (processingState === "error") {
    return (
      <section className="mb-10 px-2 animate-fade-in">
        <div className="glass-pill bg-white/90 rounded-[32px] p-5 border border-red-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-red-600">Link không hợp lệ</h4>
              <p className="text-sm text-on-surface-variant mt-1">{errorMessage || "Vui lòng kiểm tra lại link sản phẩm"}</p>
            </div>
          </div>
          <button onClick={onRetry} className="w-full py-3 rounded-2xl border border-red-200 text-red-600 font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10 px-2 animate-fade-in">
      <div className="glass-pill bg-white/90 rounded-[32px] p-5 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-5">
        {processingState === "processing" ? (
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-surface-container relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer"></div>
              <span className="material-symbols-outlined text-on-surface-variant/20 text-3xl flex items-center justify-center h-full">image</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-surface-container rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer"></div>
              </div>
              <div className="flex items-center gap-1.5 opacity-50">
                <span className="material-symbols-outlined text-signal-orange text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                <span className="text-signal-orange font-medium text-[16px] tracking-tight">Đang tính toán...</span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-100">
                <span className="material-symbols-outlined text-amber-600 text-[14px] animate-spin">progress_activity</span>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">Đang xử lý</span>
              </div>
              <span className="text-[10px] font-medium text-on-surface-variant/40 mt-1.5 mr-1">Vui lòng đợi giây lát</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface-container flex items-center justify-center shrink-0">
                {productImage ? (
                  <img src={productImage} alt={productTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-signal-orange text-4xl">shopping_bag</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-on-surface line-clamp-2">{productTitle}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-signal-orange text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                  <span className="text-signal-orange font-bold text-[20px]">+ {cashbackDisplay}</span>
                </div>
                <p className="text-[10px] text-on-surface-variant/70 leading-tight mt-1">*Số tiền dự kiến có thể thay đổi tùy theo chính sách của hãng</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 bg-emerald-50 py-2 px-4 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">CHÚC MỪNG! BẠN ĐÃ ĐỦ ĐIỀU KIỆN NHẬN HOÀN TIỀN</span>
              </div>
              <button onClick={onGoToShop} className="w-full bg-gradient-to-r from-[#FFB800] to-signal-orange text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-signal-orange/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
                Đến sàn mua ngay <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function MerchantsGrid() {
  return (
    <section>
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-eyebrow text-signal-orange flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange"></span>
            THƯƠNG HIỆU NỔI BẬT
          </span>
          <h2 className="text-headline-sm text-on-background">Hoàn tiền cực hời</h2>
        </div>
        <button className="text-signal-orange text-label-md flex items-center gap-1">
          Tất cả <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-lifted-cream rounded-[32px] p-6 border border-white shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4 shadow-inner">
            <span className="material-symbols-outlined text-orange-500 text-3xl">shopping_bag</span>
          </div>
          <span className="text-[18px] font-semibold text-on-background mb-1">Shopee</span>
          <span className="text-label-md text-signal-orange font-bold">Hoàn 12%</span>
        </div>
        <div className="bg-lifted-cream rounded-[32px] p-6 border border-white shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 shadow-inner">
            <span className="material-symbols-outlined text-white text-3xl">music_note</span>
          </div>
          <span className="text-[18px] font-semibold text-on-background mb-1">TikTok Shop</span>
          <span className="text-label-md text-signal-orange font-bold">Hoàn 10%</span>
        </div>
        <div className="bg-lifted-cream rounded-[32px] p-6 border border-white shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 shadow-inner">
            <span className="material-symbols-outlined text-blue-600 text-3xl">storefront</span>
          </div>
          <span className="text-[18px] font-semibold text-on-background mb-1">Lazada</span>
          <span className="text-label-md text-signal-orange font-bold">Hoàn 8.5%</span>
        </div>
        <div className="bg-primary-container rounded-[32px] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-primary-container">add</span>
          </div>
          <span className="text-label-md text-white">Xem thêm<br/>50+ đối tác</span>
        </div>
      </div>
    </section>
  );
}
