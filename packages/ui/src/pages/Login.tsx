import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Globe2,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sprout,
  Tractor,
} from "lucide-react";
import farmlandSunrise from "../assets/login-background.jpg";

export type LoginMode = "login" | "otp" | "forgot";

export interface LoginPageProps {
  /** Current mode of the login form */
  mode?: LoginMode;
  /** Called when the user submits login credentials */
  onLogin?: (identifier: string, password: string) => void | Promise<void>;
  /** Called when the user submits OTP verification */
  onVerifyOtp?: (identifier: string, code: string) => void | Promise<void>;
  /** Called when the user requests a new OTP */
  onSendOtp?: (identifier: string) => void | Promise<void>;
  /** Called when the user submits forgot-password */
  onForgotPassword?: (email: string) => void | Promise<void>;
  /** Called when the user clicks "Create an account" */
  onNavigateRegister?: () => void;
  /** Called when mode changes internally */
  onModeChange?: (mode: LoginMode) => void;
  /** Loading state from parent (Redux) */
  loading?: boolean;
  /** Error message from parent (Redux) */
  error?: string | null;
  /** Success message from parent (Redux) */
  message?: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({
  mode: controlledMode,
  onLogin,
  onVerifyOtp,
  onSendOtp,
  onForgotPassword,
  onNavigateRegister,
  onModeChange,
  loading: externalLoading,
  error: externalError,
  message: externalMessage,
}) => {
  const [internalMode, setInternalMode] = useState<LoginMode>("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalMessage, setInternalMessage] = useState("");
  const [internalError, setInternalError] = useState("");
  const [language, setLanguage] = useState("English");

  // Use external props when provided (Redux mode), fall back to internal state
  const isControlled = externalLoading !== undefined;
  const mode = controlledMode ?? internalMode;
  const loading = isControlled ? (externalLoading ?? false) : internalLoading;
  const error = isControlled ? (externalError ?? "") : internalError;
  const message = isControlled ? (externalMessage ?? "") : internalMessage;

  const changeMode = (newMode: LoginMode) => {
    if (onModeChange) {
      onModeChange(newMode);
    } else {
      setInternalMode(newMode);
    }
  };

  const handleLogin = async () => {
    if (!identifier || !password) return;
    if (onLogin) {
      await onLogin(identifier, password);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    if (onVerifyOtp) {
      await onVerifyOtp(identifier, otp);
    }
  };

  const handleSendOtp = async () => {
    if (!identifier) return;
    if (onSendOtp) {
      await onSendOtp(identifier);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) return;
    if (onForgotPassword) {
      await onForgotPassword(resetEmail);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#07140d] text-white">
      <div className="fixed inset-0" aria-hidden="true">
        <img
          src={farmlandSunrise}
          alt=""
          className="h-full w-full scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_23%_35%,rgba(34,197,94,0.26),transparent_38%),radial-gradient(circle_at_78%_25%,rgba(252,194,72,0.22),transparent_34%)]" />
      </div>

      <header className="relative z-20 flex items-center justify-between px-5 py-4 lg:px-10 lg:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/15 ring-1 ring-green-400/20">
            <Sprout className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Mandi<span className="text-green-400">Connect</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/65">
              Digital Mandi Network
            </p>
          </div>
        </div>
        <div className="relative">
          <Globe2 className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-white/80" />
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label="Select language"
            className="appearance-none rounded-full border border-white/20 bg-black/45 py-2 pl-10 pr-10 text-sm text-white shadow-sm backdrop-blur-xl transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-lime-300"
          >
            <option className="bg-[#07140d]" value="English">
              English
            </option>
            <option className="bg-[#07140d]" value="Hindi">
              Hindi
            </option>
            <option className="bg-[#07140d]" value="Punjabi">
              Punjabi
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-[80rem] items-center gap-10 px-5 pb-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        <div className="block pt-4 lg:pt-0">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-xs text-green-200 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              Mandi network is live
            </div>
            <h2 className="text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl xl:text-6xl">
              Your harvest.
              <br />
              <span className="bg-gradient-to-r from-green-200 via-green-400 to-yellow-200 bg-clip-text text-transparent">
                Your mandi.
              </span>
              <br />
              Your time.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
              Book procurement slots, track your mandi status and stay ahead of
              the queue — all from one simple platform.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2 sm:mt-8 sm:gap-3">
              <JourneyItem icon={<Leaf />} text="Harvest" />
              <div className="hidden h-px w-6 bg-white/35 sm:block sm:w-10" />
              <JourneyItem icon={<Tractor />} text="Transport" />
              <div className="hidden h-px w-6 bg-white/35 sm:block sm:w-10" />
              <JourneyItem icon={<Sprout />} text="Mandi" />
              <div className="hidden h-px w-6 bg-white/35 sm:block sm:w-10" />
              <JourneyItem icon={<CheckCircle2 />} text="Procure" />
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[26rem]">
          <div className="relative">
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-green-500/20 to-yellow-500/20 blur-xl" />
            <div className="relative rounded-[1.75rem] border border-white/20 bg-black/70 p-5.5 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-6.5">
              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/15">
                  {mode === "otp" ? (
                    <ShieldCheck className="h-6 w-6 text-green-400" />
                  ) : (
                    <LockKeyhole className="h-6 w-6 text-green-400" />
                  )}
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  {mode === "login"
                    ? "Welcome back"
                    : mode === "otp"
                      ? "Verify your account"
                      : "Reset your password"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {mode === "login"
                    ? "Sign in with your email or phone number to access your mandi bookings."
                    : mode === "otp"
                      ? `Enter the 6-digit code sent to ${identifier}.`
                      : "Enter your registered email and we'll send password reset instructions."}
                </p>
              </div>
              {(message || error) && (
                <div
                  className={`mb-5 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-300/20 bg-red-500/10 text-red-100" : "border-green-300/20 bg-green-500/10 text-green-100"}`}
                  role="status"
                >
                  {error || message}
                </div>
              )}

              {mode === "login" ? (
                <div className="space-y-5">
                  <Field label="Email or Mobile Number">
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
                      <input
                        type="text"
                        autoComplete="username"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleLogin();
                        }}
                        placeholder="name@example.com or +91 98765 43210"
                        className="input input-with-leading"
                      />
                    </div>
                  </Field>
                  <Field label="Password">
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleLogin();
                        }}
                        placeholder="Enter your password"
                        className="input input-with-leading input-with-trailing"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/75 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-lime-300"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </Field>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        changeMode("forgot");
                        setResetEmail(
                          identifier.includes("@") ? identifier : "",
                        );
                      }}
                      className="rounded text-sm font-medium text-lime-300 transition hover:text-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <button
                    onClick={handleLogin}
                    disabled={!identifier || !password || loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-4 font-semibold text-black transition hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                    {!loading && (
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                  <p className="pt-2 text-center text-sm text-white/50">
                    New farmer?{" "}
                    <button
                      onClick={onNavigateRegister}
                      className="rounded font-semibold text-lime-300 hover:text-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-300"
                    >
                      Create an account
                    </button>
                  </p>
                </div>
              ) : mode === "otp" ? (
                <div className="space-y-5">
                  <Field label="Enter OTP">
                    <input
                      autoFocus
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleVerifyOtp();
                      }}
                      placeholder="• • • • • •"
                      className="input text-center text-2xl font-bold tracking-[0.6em]"
                    />
                  </Field>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6 || loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-4 font-semibold text-[#07140d] transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? "Verifying..." : "Verify account"}
                    {!loading && (
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                  <div className="flex items-center justify-between text-sm">
                    <button
                      onClick={() => {
                        changeMode("login");
                      }}
                      className="text-white/50 transition hover:text-white"
                    >
                      ← Change account
                    </button>
                    <button
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="text-green-300 hover:text-green-200 disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <Field label="Registered email">
                    <input
                      autoFocus
                      type="email"
                      autoComplete="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleForgotPassword();
                      }}
                      placeholder="name@example.com"
                      className="input"
                    />
                  </Field>
                  <button
                    onClick={handleForgotPassword}
                    disabled={!resetEmail || loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-4 font-semibold text-[#07140d] transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading
                      ? "Sending instructions..."
                      : "Send reset instructions"}
                    {!loading && (
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      changeMode("login");
                    }}
                    className="mx-auto block text-sm text-white/50 transition hover:text-white"
                  >
                    ← Back to sign in
                  </button>
                </div>
              )}
              <div className="mx-auto mt-8 flex w-fit items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/80">
                <LockKeyhole className="h-3.5 w-3.5" />
                Your information is securely protected
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-950/20 to-transparent" />
    </main>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-white/85">
      {label}
    </label>
    {children}
  </div>
);
const JourneyItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-black/45 px-3 py-2 text-xs font-medium text-white/85 backdrop-blur-sm">
    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-lime-300">
      {React.cloneElement(icon as React.ReactElement<{ className: string }>, {
        className: "h-4 w-4",
      })}
    </div>
    {text}
  </div>
);
export default LoginPage;
export { LoginPage };
