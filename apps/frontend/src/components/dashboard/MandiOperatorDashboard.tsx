import React, { useState, memo } from "react";
import {
  Landmark,
  Truck,
  QrCode,
  Scale,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";
import { useAppDispatch } from "../../store";
import { logout } from "../../store/slices/authSlice";

interface MandiOperatorDashboardProps {
  operatorName?: string;
  mandiName?: string;
}

const mockDocks = [
  { id: "bay-1", name: "Bay 01 — Grain Unloader", status: "OCCUPIED", crop: "Sharbati Wheat", truck: "MP-09-AB-4821", progress: 75 },
  { id: "bay-2", name: "Bay 02 — Bulk Silo Intake", status: "UNLOADING", crop: "Basmati Rice", truck: "MP-09-CX-1934", progress: 40 },
  { id: "bay-3", name: "Bay 03 — Fast Hopper", status: "AVAILABLE", crop: "—", truck: "—", progress: 0 },
  { id: "bay-4", name: "Bay 04 — Mustard / Oilseed", status: "AVAILABLE", crop: "—", truck: "—", progress: 0 },
];

export const MandiOperatorDashboard = memo(function MandiOperatorDashboard({
  operatorName = "Operator",
  mandiName = "Indore APMC Yard #1",
}: MandiOperatorDashboardProps) {
  const dispatch = useAppDispatch();
  const [tokenSearch, setTokenSearch] = useState("");
  const [tokenResult, setTokenResult] = useState<any>(null);

  const handleVerifyToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenSearch.trim()) return;
    setTokenResult({
      tokenId: tokenSearch.toUpperCase(),
      farmerName: "Rajeshwar Patel",
      crop: "Sharbati Wheat (120 Qtl)",
      slotTime: "Today, 10:00 AM - 11:30 AM",
      status: "VALID_ENTRY",
      bayAssigned: "Bay 03",
    });
  };

  return (
    <div className="min-h-screen bg-[#07130B] text-white flex flex-col font-sans selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      {/* Top App Header */}
      <header className="w-full border-b border-white/10 bg-black/40 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C8F52F] rounded-xl flex items-center justify-center shadow-lg text-[#0B2D1B]">
            <Landmark size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">APMC Mandi Gate Console</h1>
            <span className="text-xs text-white/50">{mandiName} • Gate #02</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/80">
            <span className="w-2 h-2 rounded-full bg-[#C8F52F] animate-pulse" />
            <span>Operator: {operatorName}</span>
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-6">
        {/* KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-white/60 text-xs">
              <span>Trucks in Yard</span>
              <Truck size={16} className="text-[#C8F52F]" />
            </div>
            <div className="text-3xl font-bold text-white">18 <span className="text-xs font-normal text-white/50">/ 25 Cap</span></div>
            <p className="text-[11px] text-[#C8F52F]">Yard Load: 72% Optimal</p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-white/60 text-xs">
              <span>Average Clearance</span>
              <Clock size={16} className="text-[#38BDF8]" />
            </div>
            <div className="text-3xl font-bold text-white">14.5 <span className="text-xs font-normal text-white/50">min</span></div>
            <p className="text-[11px] text-[#38BDF8]">↓ 4.2 min faster than avg</p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-white/60 text-xs">
              <span>Slots Handled Today</span>
              <CheckCircle2 size={16} className="text-[#A78BFA]" />
            </div>
            <div className="text-3xl font-bold text-white">42 <span className="text-xs font-normal text-white/50">slots</span></div>
            <p className="text-[11px] text-[#A78BFA]">98.5% on-time check-in</p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-white/60 text-xs">
              <span>Weighbridge Status</span>
              <Scale size={16} className="text-[#FBBF24]" />
            </div>
            <div className="text-3xl font-bold text-[#C8F52F]">Active</div>
            <p className="text-[11px] text-white/50">Calibrated & Online</p>
          </div>
        </div>

        {/* 2-Column Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Quick QR Token Verification */}
          <div className="lg:col-span-5 bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <QrCode size={18} className="text-[#C8F52F]" />
                <h3 className="font-semibold text-base text-white">Gate Token Scanner</h3>
              </div>
              <span className="text-xs text-white/40">Real-Time Validation</span>
            </div>

            <form onSubmit={handleVerifyToken} className="space-y-3">
              <label className="text-xs text-white/70 block font-medium">
                Enter Token ID / Scan QR
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3.5 text-white/40" />
                <input
                  type="text"
                  value={tokenSearch}
                  onChange={(e) => setTokenSearch(e.target.value)}
                  placeholder="e.g. AGRO-TK-8942"
                  className="w-full pl-10 pr-24 py-3 bg-white/10 border border-white/15 focus:border-[#C8F52F] rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-[#C8F52F] hover:bg-[#B5E025] text-[#0B2D1B] rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Verify
                </button>
              </div>
            </form>

            {/* Token Result Card */}
            {tokenResult && (
              <div className="p-4 rounded-2xl bg-[#C8F52F]/10 border border-[#C8F52F]/30 space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#C8F52F]">{tokenResult.tokenId}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#C8F52F] text-[#0B2D1B] text-[10px] font-bold">
                    {tokenResult.status}
                  </span>
                </div>
                <div className="text-xs text-white/80 space-y-1">
                  <div>Farmer: <strong className="text-white">{tokenResult.farmerName}</strong></div>
                  <div>Crop: <strong className="text-white">{tokenResult.crop}</strong></div>
                  <div>Slot Time: <strong className="text-white">{tokenResult.slotTime}</strong></div>
                  <div>Allocated Dock: <strong className="text-[#C8F52F]">{tokenResult.bayAssigned}</strong></div>
                </div>
                <button
                  onClick={() => alert(`Gate Pass generated for ${tokenResult.tokenId}`)}
                  className="w-full mt-2 py-2 bg-[#C8F52F] text-[#0B2D1B] font-semibold text-xs rounded-xl hover:bg-[#B5E025] cursor-pointer"
                >
                  Grant Gate Entry & Print Slip
                </button>
              </div>
            )}
          </div>

          {/* Right: Live Unloading Bays */}
          <div className="lg:col-span-7 bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal size={18} className="text-[#C8F52F]" />
                <h3 className="font-semibold text-base text-white">Unloading Dock Status</h3>
              </div>
              <span className="text-xs text-white/40">4 Active Hoppers</span>
            </div>

            <div className="space-y-3">
              {mockDocks.map((bay) => (
                <div
                  key={bay.id}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{bay.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        bay.status === "AVAILABLE"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {bay.status}
                    </span>
                  </div>

                  {bay.status !== "AVAILABLE" && (
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span>Crop: <strong className="text-white">{bay.crop}</strong></span>
                      <span>Truck: <strong className="text-white font-mono">{bay.truck}</strong></span>
                    </div>
                  )}

                  {bay.progress > 0 && (
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C8F52F] h-full rounded-full transition-all duration-500"
                        style={{ width: `${bay.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-4 px-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Agrovia Smart APMC Mandi Console • Gate Terminal Online
      </footer>
    </div>
  );
});
