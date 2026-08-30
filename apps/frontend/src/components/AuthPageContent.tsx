import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
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
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  clearAuthMessages,
  loginUserThunk,
  registerUserThunk,
  sendOtpThunk,
  verifyOtpThunk,
} from "../store/slices/authSlice";
import type { Role } from "../interfaces";

type AuthMode = "LOGIN" | "REGISTER";
type LoginMethod = "PASSWORD" | "OTP";

interface AuthProps {
  initialMode?: AuthMode;
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
  const { isLoading, otpSent, error, successMessage, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [selectedRole, setSelectedRole] = useState<Role>("FARMER");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("PASSWORD");

  // Login Form
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register Form (Simple and uniform for both Farmer & Mandi Operator)
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [location, setLocation] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

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
        else window.location.href = "/dashboard";
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, onSuccess]);

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    dispatch(clearAuthMessages());
    window.history.pushState({}, "", mode === "LOGIN" ? "/login" : "/register");
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    dispatch(sendOtpThunk({ identifier, type: "LOGIN" }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthMessages());

    if (!identifier.trim()) return;

    if (loginMethod === "PASSWORD") {
      if (!password) return;
      dispatch(loginUserThunk({ identifier, password }));
    } else {
      if (!otpCode) return;
      dispatch(verifyOtpThunk({ identifier, code: otpCode, type: "LOGIN" }));
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthMessages());

    if (!fullName.trim() || (!regEmail.trim() && !regPhone.trim()) || regPassword.length < 8) {
      return;
    }

    dispatch(
      registerUserThunk({
        name: fullName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        role: selectedRole,
        location,
      })
    ).then((action: any) => {
      if (!action.error) {
        setTimeout(() => switchMode("LOGIN"), 1200);
      }
    });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#06180E] text-white flex flex-col justify-between overflow-x-hidden selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      {/* Background Image with Landing Hero Parallax */}
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

      {/* CENTER: Main Container with Landing Typography & Stacked Glass Card */}
      <main className="relative z-20 w-full px-4 sm:px-6 md:px-12 lg:px-16 py-12 md:py-16 my-auto flex flex-col items-center">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero-Styled Statement */}
          <div className="lg:col-span-5 text-left space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-xs font-medium text-white shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#C8F52F] animate-pulse" />
              <span>Smart Mandi Portal</span>
            </div>

            {/* Editorial Heading matching Hero */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-normal leading-[1.08] tracking-tight text-white select-none">
              <span className="block font-medium">
                {authMode === "LOGIN" ? "Welcome to" : "Join the"}
              </span>
              <span className="block mt-1">
                Agrovia{" "}
                <span className="font-editorial italic font-normal text-white drop-shadow-sm tracking-normal">
                  {authMode === "LOGIN" ? "Portal" : "Network"}
                </span>
              </span>
            </h1>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-md font-light">
              {authMode === "LOGIN"
                ? "Sign in to book real-time mandi unloading slots, track gate entry QR tokens, and access live rates."
                : "Create an account in under 2 minutes to eliminate waiting lines, verify digital tokens, and receive payments."}
            </p>

            {/* Features Highlight */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-white/90">
                <div className="w-5 h-5 rounded-full bg-[#C8F52F]/20 flex items-center justify-center text-[#C8F52F] shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Zero gate waiting with automated digital tokens</span>
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
                <span>Direct real-time slot scheduling across all active yards</span>
              </div>
            </div>
          </div>

          {/* Right Column: Frosted Glass Form Card */}
          <div className="lg:col-span-7 w-full max-w-lg mx-auto">
            <div className="bg-black/45 backdrop-blur-2xl border border-white/20 rounded-[32px] md:rounded-[40px] p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/60 relative overflow-hidden">
              {/* Subtle top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C8F52F] to-transparent opacity-60" />

              {/* Mode Switcher Pill (Sign In vs Register) */}
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

              {/* Role Selection Matrix (Farmer & Mandi Operator Only, No Emojis) */}
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

              {/* Status Alert from Redux */}
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

              {/* LOGIN FORM */}
              {authMode === "LOGIN" && (
                <form onSubmit={loginMethod === "OTP" && !otpSent ? handleSendOtp : handleLoginSubmit} className="space-y-4 text-left">
                  {/* Password / OTP Toggle */}
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

                  {/* Identifier Field */}
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

                  {/* Password Field */}
                  {loginMethod === "PASSWORD" && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-white/70">
                          Password
                        </label>
                        <a href="#forgot" className="text-xs text-[#C8F52F] hover:underline">
                          Forgot password?
                        </a>
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

                  {/* OTP Field */}
                  {loginMethod === "OTP" && otpSent && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-white/70">
                          Enter 6-Digit OTP Code
                        </label>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-xs text-[#C8F52F] hover:underline cursor-pointer"
                        >
                          Resend Code
                        </button>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        className="w-full px-4 py-3.5 bg-white/[0.07] border border-white/20 focus:border-[#C8F52F] rounded-full text-center tracking-[0.4em] font-mono text-base text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#C8F52F] transition-all"
                        required
                      />
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-3 group inline-flex items-center justify-center gap-2.5 bg-[#C8F52F] hover:bg-[#b8e826] active:scale-98 text-[#0B2D1B] font-semibold px-6 py-4 rounded-full text-sm sm:text-[15px] transition-all duration-300 shadow-lg shadow-black/25 hover:shadow-[#C8F52F]/25 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#0B2D1B] border-t-transparent rounded-full animate-spin" />
                    ) : loginMethod === "OTP" && !otpSent ? (
                      <>
                        <span>Get OTP Code</span>
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

              {/* REGISTER FORM (Clean, uniform fields for both Farmer & Mandi Operator) */}
              {authMode === "REGISTER" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-medium text-white/70 mb-1 block">
                      Full Name
                    </label>
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

                  {/* Email & Phone in 2 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-white/70 mb-1 block">
                        Email Address
                      </label>
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
                      <label className="text-xs font-medium text-white/70 mb-1 block">
                        Mobile Number
                      </label>
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
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location / Mandi Area */}
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

                  {/* Password */}
                  <div>
                    <label className="text-xs font-medium text-white/70 mb-1 block">
                      Password (minimum 8 characters)
                    </label>
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

                  {/* Terms */}
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-white/70 pt-1">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded bg-white/10 border-white/20 accent-[#C8F52F]"
                      required
                    />
                    <span>
                      I agree to the Terms of Service and Privacy Policy.
                    </span>
                  </label>

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 group inline-flex items-center justify-center gap-2.5 bg-[#C8F52F] hover:bg-[#b8e826] active:scale-98 text-[#0B2D1B] font-semibold px-6 py-4 rounded-full text-sm sm:text-[15px] transition-all duration-300 shadow-lg shadow-black/25 hover:shadow-[#C8F52F]/25 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#0B2D1B] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create {roles.find((r) => r.id === selectedRole)?.label} Account</span>
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

      {/* BOTTOM: Hero-style rating & avatar bar */}
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
