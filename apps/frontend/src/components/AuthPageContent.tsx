import React, { useState, useEffect, useRef, memo } from "react";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  Sprout,
  Landmark,
  KeyRound,
  RotateCw,
  LogIn,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  clearAuthMessages,
  loginUserThunk,
  registerUserThunk,
  sendOtpThunk,
  verifyOtpThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  clearPendingVerification,
} from "../store/slices/authSlice";
import type { Role } from "../interfaces";

type AuthMode = "LOGIN" | "REGISTER" | "OTP_VERIFY" | "FORGOT_PASSWORD" | "RESET_PASSWORD";
type LoginMethod = "PASSWORD" | "OTP";

interface AuthProps {
  initialMode?: "LOGIN" | "REGISTER";
  onSuccess?: () => void;
}

const roles = [
  {
    id: "FARMER" as Role,
    label: "Farmer (Kisan)",
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

export const AuthPageContent = memo(function AuthPageContent({
  initialMode = "LOGIN",
  onSuccess,
}: AuthProps) {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    error,
    errorCode,
    successMessage,
    isAuthenticated,
    pendingIdentifier,
    pendingOtpType,
  } = useAppSelector((state) => state.auth);

  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("PASSWORD");
  const [selectedRole, setSelectedRole] = useState<Role>("FARMER");

  // Login Form
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register Form
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot / Reset Password Form
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetValidationMsg, setResetValidationMsg] = useState<string | null>(null);

  // 6-digit OTP Box Inputs
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCountdown, setResendCountdown] = useState(60);
  const isSubmittingRef = useRef(false);

  // When authenticated, trigger onSuccess or redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.href =
            selectedRole === "MANDI_OPERATOR" ? "/mandi/dashboard" : "/farmer/dashboard";
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, onSuccess, selectedRole]);

  // When an unverified login triggers pendingIdentifier, switch to OTP_VERIFY view
  useEffect(() => {
    if (pendingIdentifier && authMode !== "OTP_VERIFY" && authMode !== "RESET_PASSWORD") {
      setAuthMode(pendingOtpType === "PASSWORD_RESET" ? "RESET_PASSWORD" : "OTP_VERIFY");
      setResendCountdown(60);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 200);
    }
  }, [pendingIdentifier, authMode, pendingOtpType]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if ((authMode !== "OTP_VERIFY" && authMode !== "RESET_PASSWORD") || resendCountdown <= 0) return;
    const interval = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [authMode, resendCountdown]);

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    dispatch(clearAuthMessages());
    setResetValidationMsg(null);
    if (mode === "LOGIN") {
      dispatch(clearPendingVerification());
      window.history.pushState({}, "", "/login");
    } else if (mode === "REGISTER") {
      dispatch(clearPendingVerification());
      window.history.pushState({}, "", "/register");
    }
  };

  // Safe single-flight OTP submit for normal verification / OTP login
  const triggerOtpVerification = async (code: string) => {
    if (isSubmittingRef.current || code.length < 6) return;
    isSubmittingRef.current = true;

    const activeId = pendingIdentifier || identifier.trim() || regEmail.trim();
    try {
      await dispatch(
        verifyOtpThunk({
          identifier: activeId,
          code,
          type: pendingOtpType || "EMAIL_VERIFICATION",
        })
      ).unwrap();
    } catch (err) {
      console.error("OTP verification error:", err);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // Handle individual OTP digit typing and auto-focus
  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    if (error) {
      dispatch(clearAuthMessages());
    }

    // Auto-advance to next box
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when in normal OTP_VERIFY mode and all 6 digits filled
    const fullCode = newDigits.join("");
    if (authMode === "OTP_VERIFY" && fullCode.length === 6 && !newDigits.includes("")) {
      triggerOtpVerification(fullCode);
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
      if (authMode === "OTP_VERIFY") {
        triggerOtpVerification(pasted);
      }
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const handleResendOtp = () => {
    const activeId = pendingIdentifier || identifier.trim() || regEmail.trim() || forgotEmail.trim();
    if (!activeId) return;
    dispatch(
      sendOtpThunk({
        identifier: activeId,
        type: pendingOtpType || (authMode === "RESET_PASSWORD" ? "PASSWORD_RESET" : "EMAIL_VERIFICATION"),
      })
    );
    setResendCountdown(60);
  };

  // Submit Password or OTP-based Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthMessages());

    if (!identifier.trim()) return;

    if (loginMethod === "PASSWORD") {
      if (!password) return;
      await dispatch(loginUserThunk({ identifier: identifier.trim(), password }));
    } else {
      // OTP Login Flow
      const result = await dispatch(
        sendOtpThunk({
          identifier: identifier.trim(),
          type: "LOGIN_OTP",
        })
      );
      if (sendOtpThunk.fulfilled.match(result)) {
        setAuthMode("OTP_VERIFY");
        setResendCountdown(60);
        setOtpDigits(["", "", "", "", "", ""]);
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 200);
      }
    }
  };

  // Submit Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthMessages());

    const targetEmail = regEmail.trim();
    if (!fullName.trim() || !targetEmail || regPassword.length < 8) {
      return;
    }

    const result = await dispatch(
      registerUserThunk({
        name: fullName.trim(),
        email: targetEmail,
        phone: regPhone.trim() || undefined,
        password: regPassword,
        role: selectedRole,
      })
    );

    // If registration succeeded, switch to OTP view
    if (registerUserThunk.fulfilled.match(result)) {
      setAuthMode("OTP_VERIFY");
      setResendCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 200);
    }
  };

  // Submit Forgot Password request (Email -> Send OTP)
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthMessages());

    const email = forgotEmail.trim();
    if (!email) return;

    const result = await dispatch(forgotPasswordThunk({ email }));
    if (forgotPasswordThunk.fulfilled.match(result)) {
      setAuthMode("RESET_PASSWORD");
      setResendCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 200);
    }
  };

  // Submit Reset Password (OTP + New Password)
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthMessages());
    setResetValidationMsg(null);

    const otpCode = otpDigits.join("");
    if (otpCode.length < 6) {
      setResetValidationMsg("Please enter the complete 6-digit OTP code.");
      return;
    }

    if (newPassword.length < 8) {
      setResetValidationMsg("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetValidationMsg("Passwords do not match. Please re-enter.");
      return;
    }

    const targetEmail = pendingIdentifier || forgotEmail.trim();
    const result = await dispatch(
      resetPasswordThunk({
        email: targetEmail,
        token: otpCode,
        newPassword,
      })
    );

    if (resetPasswordThunk.fulfilled.match(result)) {
      setIdentifier(targetEmail);
      setPassword("");
      setAuthMode("LOGIN");
      setLoginMethod("PASSWORD");
    }
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) return;
    triggerOtpVerification(code);
  };

  const activeDisplayId = pendingIdentifier || identifier.trim() || regEmail.trim() || forgotEmail.trim();

  const isEmailError = errorCode === "USER_NOT_FOUND";
  const isPasswordError = errorCode === "INCORRECT_PASSWORD";

  return (
    <div className="relative w-full min-h-screen bg-[#FCFCFA] text-[#0B2D1B] flex flex-col justify-between overflow-x-hidden selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#E8EAEC_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none z-0" />

      {/* Top Brand Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-[#0B2D1B] text-[#C8F52F] rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            🌾
          </div>
          <div className="text-left">
            <span className="text-xl font-bold tracking-tight text-[#0B2D1B] block leading-none">
              Agrovia
            </span>
            <span className="text-[10px] text-[#5A6C5F] font-semibold tracking-wider uppercase">
              Smart APMC Mandi
            </span>
          </div>
        </a>

        <div className="flex items-center gap-2">
          <a
            href="/"
            className="text-xs font-semibold text-[#5A6C5F] hover:text-[#0B2D1B] px-3 py-1.5 rounded-full hover:bg-[#F4F4F2] transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {/* CENTER: Main Auth Card Canvas */}
      <main className="relative z-10 w-full px-4 sm:px-6 md:px-8 py-8 my-auto flex flex-col items-center">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Editorial Information */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8EAEC] text-xs font-semibold text-[#0B2D1B] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Unified APMC Gateway</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.12] tracking-tight text-[#0B2D1B]">
              {authMode === "OTP_VERIFY" ? (
                <>
                  Verify Security <br />
                  <span className="font-editorial italic font-normal text-[#10B981]">
                    Passcode.
                  </span>
                </>
              ) : authMode === "FORGOT_PASSWORD" || authMode === "RESET_PASSWORD" ? (
                <>
                  Recover Account <br />
                  <span className="font-editorial italic font-normal text-[#10B981]">
                    Credentials.
                  </span>
                </>
              ) : authMode === "LOGIN" ? (
                <>
                  Access Your <br />
                  <span className="font-editorial italic font-normal text-[#10B981]">
                    Smart Mandi.
                  </span>
                </>
              ) : (
                <>
                  Join the Future of <br />
                  <span className="font-editorial italic font-normal text-[#10B981]">
                    Digital Mandis.
                  </span>
                </>
              )}
            </h1>

            <p className="text-[#5A6C5F] text-sm sm:text-base leading-relaxed max-w-md">
              {authMode === "OTP_VERIFY"
                ? `Enter the 6-digit verification code dispatched to ${activeDisplayId || "your contact"}. Immediate access upon verification.`
                : authMode === "FORGOT_PASSWORD"
                ? "Enter your registered email address and we'll dispatch a 6-digit security reset code instantly."
                : authMode === "RESET_PASSWORD"
                ? `Enter the 6-digit reset code sent to ${activeDisplayId || "your email"} along with your new password.`
                : authMode === "LOGIN"
                ? "Sign in to book real-time unloading slots, track gate entry QR tokens, and access guaranteed MSP rates."
                : "Create an account in 2 minutes to eliminate yard wait times and receive direct bank settlements."}
            </p>

            {/* Value Props List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#23382B] font-medium">
                <div className="w-5 h-5 rounded-full bg-[#C8F52F] text-[#0B2D1B] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Zero queue gate entry with digital QR slot tokens</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#23382B] font-medium">
                <div className="w-5 h-5 rounded-full bg-[#C8F52F] text-[#0B2D1B] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Automated weighbridge sync with instant e-slips</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#23382B] font-medium">
                <div className="w-5 h-5 rounded-full bg-[#C8F52F] text-[#0B2D1B] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Instant Direct Benefit Transfer (DBT) settlements</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form Container Card */}
          <div className="lg:col-span-7 w-full max-w-lg mx-auto">
            <div className="bg-white border border-[#E8EAEC] rounded-[32px] p-6 sm:p-8 md:p-9 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0B2D1B] via-[#C8F52F] to-[#10B981]" />

              {/* Mode Switcher Tabs (Only on Login & Register) */}
              {authMode === "LOGIN" || authMode === "REGISTER" ? (
                <div className="flex p-1 bg-[#F4F4F2] border border-[#E8EAEC] rounded-full mb-6">
                  <button
                    type="button"
                    onClick={() => switchMode("LOGIN")}
                    className={`flex-1 py-2 text-xs sm:text-sm rounded-full transition-all duration-200 font-semibold cursor-pointer ${
                      authMode === "LOGIN"
                        ? "bg-white text-[#0B2D1B] shadow-sm"
                        : "text-[#5A6C5F] hover:text-[#0B2D1B]"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode("REGISTER")}
                    className={`flex-1 py-2 text-xs sm:text-sm rounded-full transition-all duration-200 font-semibold cursor-pointer ${
                      authMode === "REGISTER"
                        ? "bg-[#0B2D1B] text-white shadow-sm"
                        : "text-[#5A6C5F] hover:text-[#0B2D1B]"
                    }`}
                  >
                    Register
                  </button>
                </div>
              ) : (
                /* Back Navigation for Sub-Flows */
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#F1F3F5]">
                  <button
                    type="button"
                    onClick={() => switchMode("LOGIN")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6C5F] hover:text-[#0B2D1B] transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Sign In</span>
                  </button>
                  <span className="text-xs text-[#059669] font-bold flex items-center gap-1">
                    <KeyRound size={13} />
                    {authMode === "FORGOT_PASSWORD"
                      ? "Password Recovery"
                      : authMode === "RESET_PASSWORD"
                      ? "Reset Credentials"
                      : "OTP Verification"}
                  </span>
                </div>
              )}

              {/* Role Selection Matrix (Only on Register / Login) */}
              {(authMode === "LOGIN" || authMode === "REGISTER") && (
                <div className="mb-6 space-y-2 text-left">
                  <label className="text-[11px] font-bold text-[#5A6C5F] uppercase tracking-wider block">
                    Select User Type
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
                              ? "bg-emerald-50/70 border-[#10B981] shadow-xs"
                              : "bg-[#F8F9FA] border-[#E8EAEC] hover:bg-[#F0F2F5]"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-[#0B2D1B] text-[#C8F52F]"
                                : "bg-white text-[#5A6C5F] border border-[#E2E5E9]"
                            }`}
                          >
                            <IconComponent size={18} strokeWidth={2} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#0B2D1B] leading-tight">
                              {role.label}
                            </div>
                            <div className="text-[10px] text-[#5A6C5F] leading-tight mt-0.5">
                              {role.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Error Alert Box */}
              {(error || resetValidationMsg) && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 text-left animate-fadeIn">
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold">{resetValidationMsg || error}</span>
                  </div>
                </div>
              )}

              {/* Success Notification Alert */}
              {successMessage && (
                <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 text-left animate-fadeIn">
                  <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold">{successMessage}</span>
                  </div>
                </div>
              )}

              {/* ======================= MODE 1: LOGIN ======================= */}
              {authMode === "LOGIN" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                  {/* Login Method Toggle: Password vs OTP */}
                  <div className="flex items-center justify-between pb-1 border-b border-[#F1F3F5]">
                    <span className="text-xs text-[#5A6C5F] font-semibold">Sign In Method</span>
                    <div className="flex gap-1 p-0.5 bg-[#F4F4F2] rounded-lg border border-[#E2E5E9]">
                      <button
                        type="button"
                        onClick={() => setLoginMethod("PASSWORD")}
                        className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                          loginMethod === "PASSWORD"
                            ? "bg-white text-[#0B2D1B] shadow-xs"
                            : "text-[#5A6C5F] hover:text-[#0B2D1B]"
                        }`}
                      >
                        Password
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginMethod("OTP")}
                        className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                          loginMethod === "OTP"
                            ? "bg-[#0B2D1B] text-white shadow-xs"
                            : "text-[#5A6C5F] hover:text-[#0B2D1B]"
                        }`}
                      >
                        Login with OTP
                      </button>
                    </div>
                  </div>

                  {/* Email / Identifier */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#0B2D1B] flex items-center justify-between">
                      <span>Email Address or Phone</span>
                      {isEmailError && (
                        <span className="text-[11px] font-bold text-rose-600">Email not found</span>
                      )}
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-3.5 text-[#8A92A0]" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          if (error) dispatch(clearAuthMessages());
                        }}
                        placeholder="kisan@agrovia.in or 9876543210"
                        className={`w-full pl-10 pr-4 py-3 bg-[#F8F9FA] rounded-xl text-sm text-[#0B2D1B] placeholder:text-[#8A92A0] focus:outline-none transition-all ${
                          isEmailError
                            ? "border-2 border-rose-500 bg-rose-50/30"
                            : "border border-[#E2E5E9] focus:border-[#0B2D1B] focus:bg-white"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Password (Only if loginMethod === 'PASSWORD') */}
                  {loginMethod === "PASSWORD" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#0B2D1B]">
                          <span>Password</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotEmail(identifier.includes("@") ? identifier : "");
                            switchMode("FORGOT_PASSWORD");
                          }}
                          className="text-[11px] font-semibold text-[#059669] hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-3.5 text-[#8A92A0]" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) dispatch(clearAuthMessages());
                          }}
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-11 py-3 bg-[#F8F9FA] rounded-xl text-sm text-[#0B2D1B] placeholder:text-[#8A92A0] focus:outline-none transition-all ${
                            isPasswordError
                              ? "border-2 border-rose-500 bg-rose-50/30"
                              : "border border-[#E2E5E9] focus:border-[#0B2D1B] focus:bg-white"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-[#8A92A0] hover:text-[#0B2D1B] cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 rounded-2xl bg-[#0B2D1B] hover:bg-[#06180E] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RotateCw size={16} className="animate-spin text-[#C8F52F]" />
                    ) : loginMethod === "PASSWORD" ? (
                      <>
                        <LogIn size={16} className="text-[#C8F52F]" />
                        <span>Sign In to Dashboard</span>
                      </>
                    ) : (
                      <>
                        <KeyRound size={16} className="text-[#C8F52F]" />
                        <span>Get Instant Login OTP</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-[#5A6C5F]">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("REGISTER")}
                      className="font-bold text-[#0B2D1B] hover:underline cursor-pointer"
                    >
                      Register Now
                    </button>
                  </div>
                </form>
              )}

              {/* ======================= MODE 2: REGISTER ======================= */}
              {authMode === "REGISTER" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0B2D1B]">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-3.5 text-[#8A92A0]" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Patel"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#0B2D1B] focus:bg-white rounded-xl text-sm text-[#0B2D1B] placeholder:text-[#8A92A0] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0B2D1B]">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-3.5 text-[#8A92A0]" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="ramesh@agrovia.in"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#0B2D1B] focus:bg-white rounded-xl text-sm text-[#0B2D1B] placeholder:text-[#8A92A0] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0B2D1B]">Mobile Phone</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-3.5 text-[#8A92A0]" />
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#0B2D1B] focus:bg-white rounded-xl text-sm text-[#0B2D1B] placeholder:text-[#8A92A0] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0B2D1B]">Create Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-3.5 text-[#8A92A0]" />
                      <input
                        type={showRegPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full pl-10 pr-11 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#0B2D1B] focus:bg-white rounded-xl text-sm text-[#0B2D1B] placeholder:text-[#8A92A0] focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3.5 top-3.5 text-[#8A92A0] hover:text-[#0B2D1B] cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 rounded-2xl bg-[#0B2D1B] hover:bg-[#06180E] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RotateCw size={16} className="animate-spin text-[#C8F52F]" />
                    ) : (
                      <>
                        <span>Get Verification OTP</span>
                        <span className="text-[#C8F52F]">→</span>
                      </>
                    )}
                  </button>

                  <div className="pt-1 text-center text-xs text-[#5A6C5F]">
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("LOGIN")}
                      className="font-bold text-[#0B2D1B] hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* ======================= MODE 3: FORGOT PASSWORD ======================= */}
              {authMode === "FORGOT_PASSWORD" && (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-left">
                  <div className="space-y-1 text-center mb-2">
                    <h2 className="text-lg font-bold text-[#0B2D1B]">Forgot Your Password?</h2>
                    <p className="text-xs text-[#5A6C5F]">
                      Enter your account email and we'll send a 6-digit recovery OTP code.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#0B2D1B]">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-3.5 text-[#8A92A0]" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="your.email@agrovia.in"
                        className="w-full pl-10 pr-4 py-3 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#0B2D1B] focus:bg-white rounded-xl text-sm text-[#0B2D1B] placeholder:text-[#8A92A0] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 rounded-2xl bg-[#0B2D1B] hover:bg-[#06180E] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RotateCw size={16} className="animate-spin text-[#C8F52F]" />
                    ) : (
                      <>
                        <KeyRound size={16} className="text-[#C8F52F]" />
                        <span>Send Password Reset Code</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-[#5A6C5F]">
                    Remembered your password?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("LOGIN")}
                      className="font-bold text-[#0B2D1B] hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* ======================= MODE 4: RESET PASSWORD ======================= */}
              {authMode === "RESET_PASSWORD" && (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-left">
                  <div className="space-y-1 text-center mb-1">
                    <h2 className="text-lg font-bold text-[#0B2D1B]">Set New Password</h2>
                    <p className="text-xs text-[#5A6C5F]">
                      Enter the 6-digit code sent to <strong className="text-[#0B2D1B]">{activeDisplayId}</strong> and create a new password.
                    </p>
                  </div>

                  {/* 6 Digit Inputs */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#0B2D1B] block text-center">
                      6-Digit Security Reset Code
                    </label>
                    <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-2">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={handleOtpPaste}
                          className="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg font-bold bg-[#F8F9FA] border border-[#D5D9DF] focus:border-[#0B2D1B] focus:bg-white rounded-xl text-[#0B2D1B] focus:outline-none transition-all shadow-xs"
                        />
                      ))}
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#0B2D1B]">New Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-3.5 text-[#8A92A0]" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full pl-10 pr-11 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#0B2D1B] focus:bg-white rounded-xl text-sm text-[#0B2D1B] placeholder:text-[#8A92A0] focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-3.5 text-[#8A92A0] hover:text-[#0B2D1B] cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#0B2D1B]">Confirm New Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-3.5 text-[#8A92A0]" />
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#0B2D1B] focus:bg-white rounded-xl text-sm text-[#0B2D1B] placeholder:text-[#8A92A0] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || otpDigits.join("").length < 6 || !newPassword}
                    className="w-full mt-2 py-3.5 rounded-2xl bg-[#0B2D1B] hover:bg-[#06180E] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RotateCw size={16} className="animate-spin text-[#C8F52F]" />
                    ) : (
                      <>
                        <Check size={16} className="text-[#C8F52F] stroke-[3]" />
                        <span>Update Password & Sign In</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-xs text-[#5A6C5F] flex items-center justify-center gap-1.5">
                    <span>Didn't receive code?</span>
                    {resendCountdown > 0 ? (
                      <span className="font-semibold text-[#8A92A0]">
                        Resend in {resendCountdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="font-bold text-[#0B2D1B] hover:underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* ======================= MODE 5: OTP VERIFY ======================= */}
              {authMode === "OTP_VERIFY" && (
                <form onSubmit={handleVerifyOtpSubmit} className="space-y-5 text-center">
                  <div className="space-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mx-auto border border-emerald-200">
                      <KeyRound size={22} strokeWidth={2.2} />
                    </div>
                    <h2 className="text-lg font-bold text-[#0B2D1B]">Enter 6-Digit OTP</h2>
                    <p className="text-xs text-[#5A6C5F]">
                      We sent a verification code to{" "}
                      <strong className="text-[#0B2D1B]">{activeDisplayId}</strong>
                    </p>
                  </div>

                  {/* 6 Digit Inputs */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 my-4">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-[#F8F9FA] border border-[#D5D9DF] focus:border-[#0B2D1B] focus:bg-white rounded-2xl text-[#0B2D1B] focus:outline-none transition-all shadow-xs"
                      />
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <button
                    type="submit"
                    disabled={isLoading || otpDigits.join("").length < 6}
                    className="w-full py-3.5 rounded-2xl bg-[#0B2D1B] hover:bg-[#06180E] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RotateCw size={16} className="animate-spin text-[#C8F52F]" />
                    ) : (
                      <>
                        <Check size={16} className="text-[#C8F52F] stroke-[3]" />
                        <span>Verify & Enter Dashboard</span>
                      </>
                    )}
                  </button>

                  {/* Resend OTP */}
                  <div className="pt-2 text-xs text-[#5A6C5F] flex items-center justify-center gap-1.5">
                    <span>Didn't receive code?</span>
                    {resendCountdown > 0 ? (
                      <span className="font-semibold text-[#8A92A0]">
                        Resend in {resendCountdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="font-bold text-[#0B2D1B] hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto py-6 px-6 text-center text-xs text-[#5A6C5F]">
        © {new Date().getFullYear()} Agrovia Cloud Ecosystem • Built for Indian Agriculture & APMC Mandis
      </footer>
    </div>
  );
});
