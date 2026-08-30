import React, { useState, useEffect } from "react";
import { AuthPageContent } from "./components/AuthPageContent";
import { LogOut, User, ShieldCheck, Sprout, Landmark, ArrowRight, LayoutDashboard, QrCode } from "lucide-react";
import "./index.css";

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== "undefined" ? window.location.pathname : "/login";
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("mandi_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("mandi_current_user");
    localStorage.removeItem("mandi_access_token");
    setCurrentUser(null);
    window.history.pushState({}, "", "/login");
    setCurrentPath("/login");
  };

  const handleAuthSuccess = (userData: any) => {
    setCurrentUser(userData);
    window.history.pushState({}, "", "/dashboard");
    setCurrentPath("/dashboard");
  };

  // If user is not authenticated or explicitly on /login or /register
  if (!currentUser || currentPath === "/login" || currentPath === "/register") {
    const initialMode = currentPath === "/register" ? "REGISTER" : "LOGIN";
    return <AuthPageContent initialMode={initialMode} onSuccess={handleAuthSuccess} />;
  }

  // Authenticated Portal View
  return (
    <div className="min-h-screen bg-[#06180E] text-white flex flex-col justify-between selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      {/* Top Header */}
      <header className="w-full border-b border-white/10 bg-black/30 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#C8F52F] rounded-xl flex items-center justify-center shadow-md">
            <svg
              className="w-5 h-5 text-[#0B2D1B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M7 16h10" />
              <path d="M9 12h10" />
              <path d="M5 8h10" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-lg text-white">Agrovia Mandi Portal</span>
            <span className="text-xs text-white/50 block">Connected to Live APMC Network</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/80">
            {currentUser?.role === "MANDI_OPERATOR" ? (
              <Landmark className="w-3.5 h-3.5 text-[#C8F52F]" />
            ) : (
              <Sprout className="w-3.5 h-3.5 text-[#C8F52F]" />
            )}
            <span>{currentUser?.name || "Verified User"}</span>
            <span className="text-white/40">•</span>
            <span className="text-[#C8F52F] font-semibold">{currentUser?.role || "FARMER"}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8F52F]/15 border border-[#C8F52F]/30 text-xs font-semibold text-[#C8F52F]">
          <ShieldCheck className="w-4 h-4" />
          <span>Active APMC Session Authenticated</span>
        </div>

        <div className="space-y-3 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-normal tracking-tight text-white">
            Welcome back,{" "}
            <span className="font-editorial italic text-[#C8F52F]">
              {currentUser?.name || "Farmer"}
            </span>
          </h1>
          <p className="text-white/70 text-base">
            Your {currentUser?.role === "MANDI_OPERATOR" ? "APMC Mandi Gate Operator" : "Farmer Unloading"} portal is ready. You can manage tokens, real-time queues, and auction receipts.
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl pt-4">
          <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl text-left space-y-3 hover:border-[#C8F52F]/40 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#C8F52F]/20 text-[#C8F52F] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-white">Digital Slot Booking</h3>
            <p className="text-xs text-white/60">Reserve unloading dock time slots with zero gate waiting.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl text-left space-y-3 hover:border-[#C8F52F]/40 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#C8F52F]/20 text-[#C8F52F] flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-white">Live Queue Monitor</h3>
            <p className="text-xs text-white/60">Track yard congestion and live weighbridge queue positions.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl text-left space-y-3 hover:border-[#C8F52F]/40 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#C8F52F]/20 text-[#C8F52F] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-white">Profile & KYC</h3>
            <p className="text-xs text-white/60">Manage Aadhaar, bank details, and statutory APMC licenses.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-6 px-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Agrovia Smart APMC Mandi Ecosystem
      </footer>
    </div>
  );
}
