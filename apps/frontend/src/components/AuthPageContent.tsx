import React, { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Star,
  User,
  MapPin,
  Sprout,
  Landmark,
  KeyRound,
  RotateCw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  clearAuthMessages,
  loginUserThunk,
  registerUserThunk,
  sendOtpThunk,
  verifyOtpThunk,
  setPendingVerification,
  clearPendingVerification,
} from "../store/slices/authSlice";
import type { Role } from "../interfaces";

type AuthMode = "LOGIN" | "REGISTER" | "OTP_VERIFY";
type LoginMethod = "PASSWORD" | "OTP";

interface AuthProps {
  initialMode?: "LOGIN" | "REGISTER";
  onSuccess?: () => void;
}

const roles = [
  {
    id: "FARMER" as Role,
    label: "Farmer",
    icon: Sprout,
    desc: "Book mandi unloading slots & digital tokens",
  },
  {
    id: "MANDI_OPERATOR" as Role,
    label: "Mandi Operator",
    icon: Landmark,
    desc: "Manage slots, gate entry & weighbridge",
  },
];

export function AuthPageContent({ initialMode = "LOGIN", onSuccess }: AuthProps) {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    error,
    successMessage,
    isAuthenticated,
    pendingIdentifier,
    pendingOtpType,
  } = useAppSelector((state) => state.auth);

  // If pendingIdentifier is already set in Redux, default to OTP_VERIFY
  const [authMode, setAuthMode] = useState<AuthMode>(() => {
    return pendingIdentifier ? "OTP_VERIFY" : initialMode;
  });

  const [selectedRole, setSelectedRole] = useState<Role>("FARMER");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("PASSWORD");

  // Login Form
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register Form
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [location, setLocation] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // 6-digit OTP Box Inputs
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCountdown, setResendCountdown] = useState(60);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // When authenticated, trigger onSuccess or redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        if (onSuccess) onSuccess();
        else window.location.href = "/farmer/dashboard";
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, onSuccess]);

  // When pendingIdentifier is set in Redux, ALWAYS switch to OTP_VERIFY view
  useEffect(() => {
    if (pendingIdentifier && authMode !== "OTP_VERIFY") {
      setAuthMode("OTP_VERIFY");
      setResendCountdown(60);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [pendingIdentifier, authMode]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (authMode !== "OTP_VERIFY" || resendCountdown <= 0) return;
    const interval = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [authMode, resendCountdown]);

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    dispatch(clearAuthMessages());
    if (mode === "LOGIN") {
      dispatch(clearPendingVerification());
      window.history.pushState({}, "", "/login");
    } else if (mode === "REGISTER") {
      dispatch(clearPendingVerification());
      window.history.pushState({}, "", "/register");
    }
  };

  // Handle individual OTP digit typing and auto-focus
  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-advance to next box
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits filled
    const fullCode = newDigits.join("");
    if (fullCode.length === 6 && !newDigits.includes("")) {
      const activeId = pendingIdentifier || identifier.trim() || regEmail.trim();
      dispatch(
        verifyOtpThunk({
          identifier: activeId,
          code: fullCode,
          type: pendingOtpType || "EMAIL_VERIFICATION",
        })
      );
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setOtpDigits(newDigits);

    if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
      const activeId = pendingIdentifier || identifier.trim() || regEmail.trim();
      dispatch(
        verifyOtpThunk({
          identifier: activeId,
          code: pasted,
          type: pendingOtpType || "EMAIL_VERIFICATION",
        })
      );
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    // Immediately show OTP view and dispatch
    dispatch(
      setPendingVerification({
        identifier: identifier.trim(),
        type: "LOGIN_OTP",
      })
    );
    setAuthMode("OTP_VERIFY");
    setResendCountdown(60);

    dispatch(
      sendOtpThunk({
        identifier: identifier.trim(),
        type: "LOGIN_OTP",
      })
    );
  };

  const handleResendOtp = () => {
    const activeId = pendingIdentifier || identifier.trim() || regEmail.trim();
    if (!activeId) return;
    dispatch(
      sendOtpThunk({
        identifier: activeId,
        type: pendingOtpType || "EMAIL_VERIFICATION",
      })
    );
    setResendCountdown(60);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthMessages());

    if (!identifier.trim()) return;

    if (loginMethod === "PASSWORD") {
      if (!password) return;
      dispatch(loginUserThunk({ identifier: identifier.trim(), password }));
    } else {
      handleSendOtp(e);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthMessages());

    const targetEmail = regEmail.trim();
    if (!fullName.trim() || !targetEmail || regPassword.length < 8) {
      return;
    }

    // 1. Immediately transition to OTP_VERIFY so user is never thrown back to login
    dispatch(
      setPendingVerification({
        identifier: targetEmail,
        type: "EMAIL_VERIFICATION",
      })
    );
    setAuthMode("OTP_VERIFY");
    setResendCountdown(60);
    setOtpDigits(["", "", "", "", "", ""]);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);

    // 2. Dispatch backend registration
    dispatch(
      registerUserThunk({
        name: fullName.trim(),
        email: targetEmail,
        phone: regPhone.trim() || undefined,
        password: regPassword,
        role: selectedRole,
        location: location.trim() || undefined,
      })
    );
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) return;

    const activeId = pendingIdentifier || identifier.trim() || regEmail.trim();
    dispatch(
      verifyOtpThunk({
        identifier: activeId,
        code,
        type: pendingOtpType || "EMAIL_VERIFICATION",
      })
    );
  };

  const activeDisplayId = pendingIdentifier || identifier.trim() || regEmail.trim();

  return (
    <div className="relative w-full min-h-screen bg-[#06180E] text-white flex flex-col justify-between overflow-x-hidden selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-0"
        style={{
          transform: `translateY(${scrollY * 0.1}px) scale(1.05)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <img
          src="/images/hero-wheat.jpg"
          alt="Agrovia Smart Mandi Background"
          className="w-full h-full object-cover object-center opacity-60"
        />
      </div>

      {/* Cinematic Lighting Overlays */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-[#05160C] via-[#05160C]/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(5,22,12,0.6)_100%)] pointer-events-none z-10" />

      {/* CENTER: Main Container */}
      <main className="relative z-20 w-full px-4 sm:px-6 md:px-12 lg:px-16 py-12 md:py-16 my-auto flex flex-col items-center">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Statement */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-xs font-medium text-white shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#C8F52F] animate-pulse" />
              <span>Smart Mandi Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-normal leading-[1.08] tracking-tight text-white select-none">
              <span className="block font-medium">
                {authMode === "OTP_VERIFY"
                  ? "Verify Your"
                  : authMode === "LOGIN"
                  ? "Welcome to"
                  : "Join the"}
              </span>
              <span className="block mt-1">
                Agrovia{" "}
                <span className="font-editorial italic font-normal text-white drop-shadow-sm tracking-normal">
                  {authMode === "OTP_VERIFY" ? "Account" : authMode === "LOGIN" ? "Portal" : "Network"}
                </span>
              </span>
            </h1>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-md font-light">
              {authMode === "OTP_VERIFY"
                ? `Enter the 6-digit security OTP sent to ${activeDisplayId || "your contact"}. Verification unlocks your instant APMC pass.`
                : authMode === "LOGIN"
                ? "Sign in to book real-time mandi unloading slots, track gate entry QR tokens, and access live rates."
                : "Create an account in under 2 minutes to eliminate waiting lines, verify digital tokens, and receive direct payments."}
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-white/90">
                <div className="w-5 h-5 rounded-full bg-[#C8F52F]/20 flex items-center justify-center text-[#C8F52F] shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Zero gate waiting with automated digital QR tokens</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/90">
                <div className="w-5 h-5 rounded-full bg-[#C8F52F]/20 flex items-center justify-center text-[#C8F52F] shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Automated weighbridge sync with instant slip generation</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/90">
                <div className="w-5 h-5 rounded-full bg-[#C8F52F]/20 flex items-center justify-center text-[#C8F52F] shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Direct real-time slot scheduling across all active APMC yards</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-7 w-full max-w-lg mx-auto">
            <div className="bg-black/45 backdrop-blur-2xl border border-white/20 rounded-[32px] md:rounded-[40px] p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/60 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C8F52F] to-transparent opacity-60" />

              {/* Mode Switcher (Visible on Register/Login, hidden on OTP) */}
              {authMode !== "OTP_VERIFY" ? (
                <div className="flex p-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-full mb-6 shadow-inner">
                  <button
                    type="button"
                    onClick={() => switchMode("LOGIN")}
                    className={`flex-1 py-2 text-xs sm:text-sm rounded-full transition-all duration-300 font-medium cursor-pointer ${
                      authMode === "LOGIN"
                        ? "bg-white text-[#0B2D1B] font-semibold shadow-md scale-100"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode("REGISTER")}
                    className={`flex-1 py-2 text-xs sm:text-sm rounded-full transition-all duration-300 font-medium cursor-pointer ${
                      authMode === "REGISTER"
                        ? "bg-[#C8F52F] text-[#0B2D1B] font-semibold shadow-md scale-100"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              ) : (
                /* Back to Registration / Login Link */
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => switchMode("REGISTER")}
                    className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Details</span>
                  </button>
                  <span className="text-xs text-[#C8F52F] font-semibold flex items-center gap-1">
                    <KeyRound size={13} />
                    Security Verification
                  </span>
                </div>
              )}

              {/* Role Selection Matrix (Only on Register / Login) */}
              {authMode !== "OTP_VERIFY" && (
                <div className="mb-6 space-y-2 text-left">
                  <label className="text-xs font-medium text-white/70 uppercase tracking-wider block">
                    Select Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map((role) => {
                      const isSelected = selectedRole === role.id;
                      const IconComponent = role.icon;
                      return (
                        <button
                          type="button"
                          key={role.id}
                          onClick={() => setSelectedRole(role.id)}
                          className={`p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-start gap-3 relative ${
                            isSelected
                              ? "bg-[#C8F52F]/15 border-[#C8F52F] shadow-sm scale-[1.01]"
                              : "bg-white/[0.04] border-white/15 hover:bg-white/[0.08]"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-[#C8F52F] text-[#0B2D1B]"
                                : "bg-white/10 text-white/80"
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs font-semibold block truncate ${
                                  isSelected ? "text-[#C8F52F]" : "text-white"
                                }`}
                              >
                                {role.label}
                              </span>
                              {isSelected && (
                                <div className="w-3.5 h-3.5 rounded-full bg-[#C8F52F] flex items-center justify-center shrink-0">
                                  <Check className="w-2.5 h-2.5 text-[#0B2D1B] stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] text-white/50 block leading-tight mt-0.5">
                              {role.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Status Alerts */}
              {error && (
                <div className="mb-5 p-3.5 rounded-2xl text-xs font-medium border flex items-center gap-2 bg-red-500/20 border-red-500/30 text-red-200">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {successMessage && (
                <div className="mb-5 p-3.5 rounded-2xl text-xs font-medium border flex items-center gap-2 bg-[#C8F52F]/15 border-[#C8F52F]/40 text-[#C8F52F]">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* ======================================================== */}
              {/* 1. DEDICATED OTP VERIFICATION SCREEN */}
              {/* ======================================================== */}
              {authMode === "OTP_VERIFY" && (
                <form onSubmit={handleVerifyOtpSubmit} className="space-y-6 text-center animate-fadeIn">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">Enter 6-Digit OTP Code</h3>
                    <p className="text-xs text-white/60">
                      Code dispatched to{" "}
                      <span className="font-semibold text-[#C8F52F]">
                        {activeDisplayId}
                      </span>
                    </p>
                  </div>

                  {/* 6-Box Segmented Inputs with Auto-Focus */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className="w-11 h-13 sm:w-12 sm:h-14 bg-white/[0.08] border border-white/25 focus:border-[#C8F52F] focus:bg-[#C8F52F]/10 rounded-2xl text-center font-mono text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#C8F52F]/40 transition-all"
                        required
                      />
                    ))}
                  </div>

                  {/* Resend Section */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-white/60">Didn't receive the code?</span>
                    {resendCountdown > 0 ? (
                      <span className="text-white/40 font-mono">Resend in {resendCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#C8F52F] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCw size={12} />
                        <span>Resend OTP</span>
                      </button>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || otpDigits.join("").length < 6}
                    className="w-full group inline-flex items-center justify-center gap-2.5 bg-[#C8F52F] hover:bg-[#b8e826] active:scale-98 text-[#0B2D1B] font-semibold px-6 py-4 rounded-full text-sm sm:text-[15px] transition-all duration-300 shadow-lg shadow-black/25 hover:shadow-[#C8F52F]/25 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#0B2D1B] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Verify & Enter Dashboard</span>
                        <ArrowUpRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ======================================================== */}
              {/* 2. LOGIN FORM */}
              {/* ======================================================== */}
              {authMode === "LOGIN" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                  <div className="flex gap-2 pb-1">
                    <button
                      type="button"
                      onClick={() => setLoginMethod("PASSWORD")}
                      className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                        loginMethod === "PASSWORD"
                          ? "bg-white/20 border-white/40 text-white font-medium"
                          : "border-transparent text-white/50 hover:text-white"
                      }`}
                    >
                      Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod("OTP")}
                      className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                        loginMethod === "OTP"
                          ? "bg-white/20 border-white/40 text-white font-medium"
                          : "border-transparent text-white/50 hover:text-white"
                      }`}
                    >
                      Phone OTP
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 mb-1.5 block">
                      {loginMethod === "OTP" ? "Mobile Number" : "Email or Phone Number"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                        {loginMethod === "OTP" ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      </div>
                      <input
                        type={loginMethod === "OTP" ? "tel" : "text"}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={loginMethod === "OTP" ? "+91 98765 43210" : "user@agrovia.in / 9876543210"}
                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.07] border border-white/20 focus:border-[#C8F52F] rounded-full text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#C8F52F] transition-all"
                        required
                      />
                    </div>
                  </div>

                  {loginMethod === "PASSWORD" && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-white/70">Password</label>
                        <a href="#forgot" className="text-xs text-[#C8F52F] hover:underline">Forgot password?</a>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-11 pr-11 py-3.5 bg-white/[0.07] border border-white/20 focus:border-[#C8F52F] rounded-full text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#C8F52F] transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-3 group inline-flex items-center justify-center gap-2.5 bg-[#C8F52F] hover:bg-[#b8e826] active:scale-98 text-[#0B2D1B] font-semibold px-6 py-4 rounded-full text-sm sm:text-[15px] transition-all duration-300 shadow-lg shadow-black/25 hover:shadow-[#C8F52F]/25 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#0B2D1B] border-t-transparent rounded-full animate-spin" />
                    ) : loginMethod === "OTP" ? (
                      <>
                        <span>Get 6-Digit OTP Code</span>
                        <ArrowUpRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    ) : (
                      <>
                        <span>Sign In as {roles.find((r) => r.id === selectedRole)?.label}</span>
                        <ArrowUpRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ======================================================== */}
              {/* 3. REGISTER FORM */}
              {/* ======================================================== */}
              {authMode === "REGISTER" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left">
                  <div>
                    <label className="text-xs font-medium text-white/70 mb-1 block">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Patel"
                        className="w-full pl-11 pr-4 py-3 bg-white/[0.07] border border-white/20 focus:border-[#C8F52F] rounded-full text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#C8F52F] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-white/70 mb-1 block">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="name@agrovia.in"
                          className="w-full pl-11 pr-3 py-3 bg-white/[0.07] border border-white/20 focus:border-[#C8F52F] rounded-full text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#C8F52F] transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-white/70 mb-1 block">Mobile Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full pl-11 pr-3 py-3 bg-white/[0.07] border border-white/20 focus:border-[#C8F52F] rounded-full text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#C8F52F] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 mb-1 block">
                      {selectedRole === "FARMER" ? "Village / District" : "Mandi Yard / City"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={selectedRole === "FARMER" ? "e.g. Sanwer, Indore" : "e.g. Grain Market Yard, Indore"}
                        className="w-full pl-11 pr-4 py-3 bg-white/[0.07] border border-white/20 focus:border-[#C8F52F] rounded-full text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#C8F52F] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 mb-1 block">Password (minimum 8 characters)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-11 pr-11 py-3 bg-white/[0.07] border border-white/20 focus:border-[#C8F52F] rounded-full text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#C8F52F] transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer text-xs text-white/70 pt-1">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded bg-white/10 border-white/20 accent-[#C8F52F]"
                      required
                    />
                    <span>I agree to the Terms of Service and APMC Guidelines.</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 group inline-flex items-center justify-center gap-2.5 bg-[#C8F52F] hover:bg-[#b8e826] active:scale-98 text-[#0B2D1B] font-semibold px-6 py-4 rounded-full text-sm sm:text-[15px] transition-all duration-300 shadow-lg shadow-black/25 hover:shadow-[#C8F52F]/25 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#0B2D1B] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create {roles.find((r) => r.id === selectedRole)?.label} Account & Verify OTP</span>
                        <ArrowUpRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 w-full px-6 sm:px-8 md:px-12 lg:px-16 pb-6 md:pb-8">
        <div className="max-w-7xl mx-auto pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white/60 text-xs">
            © {new Date().getFullYear()} Agrovia Mandi Platform • Encrypted & Secure
          </div>

          <div className="flex items-center gap-3 bg-black/35 backdrop-blur-md border border-white/15 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
            <div className="flex items-center gap-1.5 pr-2 border-r border-white/20">
              <Star size={14} className="fill-[#FBBF24] text-[#FBBF24]" />
              <span className="text-white font-semibold text-xs sm:text-sm">4.9</span>
            </div>
            <div className="flex items-center -space-x-2">
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border-2 border-white/90 shadow-sm">
                <img src="/images/avatar-1.jpg" alt="Farmer" className="w-full h-full object-cover" />
              </div>
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border-2 border-white/90 shadow-sm">
                <img src="/images/avatar-2.jpg" alt="Farmer" className="w-full h-full object-cover" />
              </div>
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border-2 border-white/90 shadow-sm">
                <img src="/images/avatar-3.jpg" alt="Farmer" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-white/80 text-[11px] sm:text-xs font-light pl-1">
              12,400+ Active Users
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
