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
  ArrowUpRight,
  ShieldCheck,
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
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

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
      truckNumber: "MP-09-KA-5521",
    });
    setFeedbackMsg(null);
  };

  const handleGrantEntry = () => {
    setFeedbackMsg(`Gate Pass issued for ${tokenResult.tokenId}. Gate 02 opened.`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFA] text-[#111315] flex flex-col font-sans selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      {/* Top App Header */}
      <header className="w-full border-b border-[#E8EAEC] bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-[#111315] text-[#C8F52F] rounded-2xl flex items-center justify-center shadow-sm">
            <Landmark size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-[#111315] leading-tight flex items-center gap-2">
              <span>APMC Mandi Gate Console</span>
              <span className="text-[11px] font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Gate #02 Online
              </span>
            </h1>
            <span className="text-xs text-[#6C727F]">{mandiName} • Live Yard Management</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F7F8] border border-[#E2E5E9] text-xs font-semibold text-[#111315]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Operator: {operatorName}</span>
          </div>

          <button
            onClick={() => {
              dispatch(logout());
              window.history.pushState({}, "", "/login");
              window.location.href = "/login";
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F5F7F8] border border-[#E2E5E9] text-[#111315] text-xs font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <LogOut size={14} className="text-[#6C727F]" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-6">
        {/* KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-[#E8EAEC] p-5 space-y-2 shadow-sm hover:border-[#DDE1E6] transition-colors">
            <div className="flex items-center justify-between text-[#6C727F] text-xs font-medium">
              <span>Trucks in Yard</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center">
                <Truck size={16} />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#111315]">18 <span className="text-xs font-normal text-[#8A92A0]">/ 25 Cap</span></div>
            <p className="text-xs font-semibold text-[#059669]">Yard Load: 72% Optimal</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-[#E8EAEC] p-5 space-y-2 shadow-sm hover:border-[#DDE1E6] transition-colors">
            <div className="flex items-center justify-between text-[#6C727F] text-xs font-medium">
              <span>Average Clearance</span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#111315]">14.5 <span className="text-xs font-normal text-[#8A92A0]">min</span></div>
            <p className="text-xs font-semibold text-[#0284C7]">↓ 4.2 min faster than avg</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-[#E8EAEC] p-5 space-y-2 shadow-sm hover:border-[#DDE1E6] transition-colors">
            <div className="flex items-center justify-between text-[#6C727F] text-xs font-medium">
              <span>Slots Handled Today</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#111315]">42 <span className="text-xs font-normal text-[#8A92A0]">slots</span></div>
            <p className="text-xs font-semibold text-[#4F46E5]">98.5% on-time check-in</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl border border-[#E8EAEC] p-5 space-y-2 shadow-sm hover:border-[#DDE1E6] transition-colors">
            <div className="flex items-center justify-between text-[#6C727F] text-xs font-medium">
              <span>Weighbridge Status</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
                <Scale size={16} />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#059669]">Active</div>
            <p className="text-xs font-semibold text-[#8A92A0]">Calibrated & Online</p>
          </div>
        </div>

        {/* 2-Column Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Quick QR Token Verification */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8EAEC] p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#111315] text-[#C8F52F] flex items-center justify-center">
                  <QrCode size={16} />
                </div>
                <h3 className="font-bold text-base text-[#111315]">Gate Token Scanner</h3>
              </div>
              <span className="text-xs text-[#8A92A0] font-medium">Instant Validation</span>
            </div>

            <form onSubmit={handleVerifyToken} className="space-y-3">
              <label className="text-xs text-[#6C727F] block font-semibold uppercase tracking-wider">
                Enter Token ID or Scan Barcode
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3.5 text-[#8A92A0]" />
                <input
                  type="text"
                  value={tokenSearch}
                  onChange={(e) => setTokenSearch(e.target.value)}
                  placeholder="e.g. TKN-7821 or APMC-6410"
                  className="w-full pl-10 pr-24 py-3 bg-[#F8F9FA] border border-[#E2E5E9] focus:border-[#111315] rounded-xl text-sm text-[#111315] placeholder:text-[#8A92A0] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-[#111315] hover:bg-black text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                >
                  Verify
                </button>
              </div>
            </form>

            {/* Token Result Card */}
            {tokenResult && (
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E2E5E9] space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#111315] bg-white px-2.5 py-1 rounded-lg border border-[#E2E5E9]">
                    {tokenResult.tokenId}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                    <ShieldCheck size={12} />
                    {tokenResult.status}
                  </span>
                </div>

                <div className="text-xs text-[#556070] space-y-1.5 bg-white p-3 rounded-xl border border-[#E8EAED]">
                  <div className="flex justify-between">
                    <span>Farmer:</span>
                    <strong className="text-[#111315]">{tokenResult.farmerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Crop:</span>
                    <strong className="text-[#111315]">{tokenResult.crop}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle:</span>
                    <strong className="text-[#111315] font-mono">{tokenResult.truckNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Slot Time:</span>
                    <strong className="text-[#111315]">{tokenResult.slotTime}</strong>
                  </div>
                  <div className="flex justify-between border-t border-[#F5F7F8] pt-1 mt-1">
                    <span>Assigned Dock:</span>
                    <strong className="text-[#059669] font-bold">{tokenResult.bayAssigned}</strong>
                  </div>
                </div>

                {feedbackMsg ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#059669] text-center">
                    {feedbackMsg}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGrantEntry}
                    className="w-full py-2.5 bg-[#111315] hover:bg-black text-[#C8F52F] font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Grant Gate Entry & Print Slip</span>
                    <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: Live Unloading Bays */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8EAEC] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F5F7F8] text-[#111315] flex items-center justify-center border border-[#E2E5E9]">
                  <SlidersHorizontal size={16} />
                </div>
                <h3 className="font-bold text-base text-[#111315]">Unloading Dock Status</h3>
              </div>
              <span className="text-xs text-[#8A92A0] font-semibold">4 Active Intake Hoppers</span>
            </div>

            <div className="space-y-3">
              {mockDocks.map((bay) => (
                <div
                  key={bay.id}
                  className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E8EAED] hover:border-[#DDE1E6] transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#111315]">{bay.name}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        bay.status === "AVAILABLE"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {bay.status}
                    </span>
                  </div>

                  {bay.status !== "AVAILABLE" && (
                    <div className="flex items-center justify-between text-xs text-[#6C727F]">
                      <span>Crop: <strong className="text-[#111315]">{bay.crop}</strong></span>
                      <span>Truck: <strong className="text-[#111315] font-mono">{bay.truck}</strong></span>
                    </div>
                  )}

                  {bay.progress > 0 && (
                    <div className="w-full bg-[#E5E8EB] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#111315] h-full rounded-full transition-all duration-500"
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
      <footer className="w-full border-t border-[#E8EAEC] py-4 px-6 text-center text-xs text-[#8A92A0] bg-white">
        © {new Date().getFullYear()} Agrovia Smart APMC Mandi Console • Gate Terminal Online
      </footer>
    </div>
  );
});
