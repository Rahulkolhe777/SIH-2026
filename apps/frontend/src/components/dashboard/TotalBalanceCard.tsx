import React, { useState, useEffect, memo } from "react";
import { ArrowUp, ArrowDown, Landmark } from "lucide-react";

interface TotalBalanceCardProps {
  targetBalance?: number;
  onTransfer?: () => void;
  onRequest?: () => void;
}

export const TotalBalanceCard = memo(function TotalBalanceCard({
  targetBalance = 87325.96,
  onTransfer,
  onRequest,
}: TotalBalanceCardProps) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setBalance(easeProgress * targetBalance);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [targetBalance]);

  const formattedBalance = balance.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex-1 bg-white rounded-[26px] border border-[#E8EAEC] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-[#DDE1E6] transition-colors text-left selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      {/* Top: Header & Amount */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#8A92A0] uppercase tracking-wider block">
            APMC Mandi Balance
          </span>
          <span className="text-[11px] font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full">
            Direct DBT Verified
          </span>
        </div>

        <div className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#111315] tracking-tight">
          ₹ {formattedBalance}
        </div>

        <p className="text-xs text-[#6C727F] pt-1">
          Settlement Ready: <span className="font-semibold text-[#111315]">₹ {formattedBalance}</span>
        </p>
      </div>

      {/* Bottom Controls: Transfer ↑, Request ↓ */}
      <div className="flex items-center gap-2 sm:gap-3 pt-6">
        <button
          type="button"
          onClick={onTransfer}
          className="group flex-1 h-[46px] px-4 rounded-full bg-[#111315] hover:bg-black text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <span>Bank Transfer</span>
          <ArrowUp size={14} className="text-[#C8F52F] group-hover:-translate-y-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={onRequest}
          className="group flex-1 h-[46px] px-4 rounded-full bg-[#F5F7F8] hover:bg-[#E8EAEC] border border-[#E2E5E9] text-[#111315] text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span>Mandi Pass</span>
          <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
});
