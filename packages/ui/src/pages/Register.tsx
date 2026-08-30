import React, { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  Globe2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sprout,
  User,
} from "lucide-react";
import farmlandSunrise from "../assets/login-background.jpg";

export type RegisterMode = "register" | "verify";
export type Role = "FARMER" | "MANDI_OPERATOR";

export interface RegisterPageProps {
  /** Current mode of the registration form */
  mode?: RegisterMode;
  /** Called when the user submits registration */
  onRegister?: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
  }) => void | Promise<void>;
  /** Called when the user submits OTP verification */
  onVerifyOtp?: (identifier: string, code: string) => void | Promise<void>;
  /** Called when the user clicks "Already have an account" / navigates to login */
  onNavigateLogin?: () => void;
  /** Called when mode changes internally */
  onModeChange?: (mode: RegisterMode) => void;
  /** Loading state from parent (Redux) */
  loading?: boolean;
  /** Error message from parent (Redux) */
  error?: string | null;
  /** Success message from parent (Redux) */
  message?: string | null;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
  mode: controlledMode,
  onRegister,
  onVerifyOtp,
  onNavigateLogin,
  onModeChange,
  loading: externalLoading,
  error: externalError,
  message: externalMessage,
}) => {
  const [internalMode, setInternalMode] = useState<RegisterMode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("FARMER");
  const [otp, setOtp] = useState("");
  const [language, setLanguage] = useState("English");

  // Use external props when provided (Redux mode), fall back to internal state
  const isControlled = externalLoading !== undefined;
  const mode = controlledMode ?? internalMode;
  const loading = isControlled ? (externalLoading ?? false) : false;
  const error = isControlled ? (externalError ?? "") : "";
  const message = isControlled ? (externalMessage ?? "") : "";

  const changeMode = (newMode: RegisterMode) => {
    if (onModeChange) {
      onModeChange(newMode);
    } else {
      setInternalMode(newMode);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    if (onRegister) {
      await onRegister({
        name,
        email,
        phone: phone ? `+91${phone}` : "",
        password,
        role,
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    if (onVerifyOtp) {
      await onVerifyOtp(email, otp);
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
          <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Select language" className="appearance-none rounded-full border border-white/20 bg-black/45 py-2 pl-10 pr-10 text-sm text-white shadow-sm backdrop-blur-xl transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-lime-300">
            <option className="bg-[#07140d]" value="English">English</option>
            <option className="bg-[#07140d]" value="Hindi">Hindi</option>
            <option className="bg-[#07140d]" value="Punjabi">Punjabi</option>
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
              Join the mandi network
            </div>
            <h2 className="text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl xl:text-6xl">
              Grow smarter.
              <br />
              <span className="bg-gradient-to-r from-green-200 via-green-400 to-yellow-200 bg-clip-text text-transparent">
                Trade better.
              </span>
              <br />
              Together.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
              Create your account to book slots, follow procurement updates, and
              connect directly with your mandi.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[25rem]">
          <div className="relative">
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-green-500/20 to-yellow-500/20 blur-xl" />
            <div className="relative rounded-[1.75rem] border border-white/20 bg-black/70 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-6">
              <div className="mb-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/15">
                  {mode === "register" ? (
                    <Sprout className="h-6 w-6 text-green-400" />
                  ) : (
                    <ShieldCheck className="h-6 w-6 text-green-400" />
                  )}
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {mode === "register"
                    ? "Create your account"
                    : "Verify your email"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  {mode === "register"
                    ? "Start using MandiConnect in just a few steps."
                    : `Enter the 6-digit code sent to ${email}.`}
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

              {mode === "register" ? (
                <div className="register-form space-y-3">
                  <Field label="Full name">
                    <div className="relative"><User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" /><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your full name" className="input input-with-leading" /></div>
                  </Field>
                  <Field label="Email address">
                    <div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="name@example.com" className="input input-with-leading" /></div>
                  </Field>
                  <Field label="Mobile number (optional)">
                    <div className="flex overflow-hidden rounded-xl border border-white/20 bg-white/10 transition focus-within:border-lime-300/70 focus-within:ring-4 focus-within:ring-lime-300/10">
                      <span className="flex items-center gap-2 border-r border-white/20 px-4 text-sm text-white/80"><Phone className="h-4 w-4 text-white/70" />
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={phone}
                        onChange={(e) =>
                          setPhone(
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                        placeholder="98765 43210"
                        className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/65"
                      />
                    </div>
                  </Field>
                  <Field label="Password">
                    <div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 8 characters, letters and numbers" className="input input-with-leading input-with-trailing" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/75 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-lime-300" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>
                  </Field>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/85">
                      Register as
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <RoleButton
                        active={role === "FARMER"}
                        label="Farmer"
                        onClick={() => setRole("FARMER")}
                      />
                      <RoleButton
                        active={role === "MANDI_OPERATOR"}
                        label="Mandi Operator"
                        onClick={() => setRole("MANDI_OPERATOR")}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleRegister}
                    disabled={!name || !email || !password || loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 font-semibold text-black transition hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? "Creating account..." : "Create account"}
                    {!loading && (
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                  <p className="pt-1 text-center text-sm text-white/50">
                    Already have an account?{" "}
                    <button
                      onClick={onNavigateLogin}
                      className="rounded font-semibold text-lime-300 hover:text-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-300"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <Field label="Enter OTP">
                    <input
                      autoFocus
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
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-4 font-semibold text-black transition hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? "Verifying..." : "Verify account"}
                    {!loading && (
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                </div>
              )}
              <div className="mx-auto mt-5 flex w-fit items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/80">
                <LockKeyhole className="h-3.5 w-3.5" />
                Your information is securely protected
              </div>
            </div>
          </div>
        </div>
      </section>
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
const RoleButton = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-lime-300 ${active ? "border-green-400/60 bg-green-400/15 text-green-100" : "border-white/20 bg-black/40 text-white/85 hover:bg-white/10"}`}
  >
    {label}
  </button>
);

export default RegisterPage;
export { RegisterPage };
