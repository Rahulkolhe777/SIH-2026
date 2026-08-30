import React, { useState, useEffect, memo } from "react";
import { ArrowUp, ArrowDown, MoreVertical } from "lucide-react";

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
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setBalance(easeProgress * targetBalance);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [targetBalance]);

  const formattedBalance = balance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex-1 bg-white rounded-[26px] border border-[#E8EAEC] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-[#DDE1E6] transition-colors">
      {/* Top: Header & Amount */}
      <div className="space-y-1">
        <span className="text-xs font-medium text-[#7A8290] block tracking-wide">
          Total balance
        </span>

        <div className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#111315] tracking-tight">
          $ {formattedBalance}
        </div>

        <p className="text-xs text-[#7A8290] pt-1">
          Available to spend: <span className="font-semibold text-[#111315]">${formattedBalance}</span>
        </p>
      </div>

      {/* Bottom Controls: Transfer ↑, Request ↓, More Menu */}
      <div className="flex items-center gap-2 sm:gap-3 pt-6">
        {/* Transfer Button */}
        <button
          onClick={onTransfer}
          className="group flex-1 h-[48px] px-4 rounded-full bg-[#111315] hover:bg-[#25282C] text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 shadow-sm hover:-translate-y-[1px] hover:shadow transition-all cursor-pointer"
        >
          <span>Transfer</span>
          <ArrowUp size={15} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* Request Button */}
        <button
          onClick={onRequest}
          className="group flex-1 h-[48px] px-4 rounded-full bg-[#111315] hover:bg-[#25282C] text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 shadow-sm hover:-translate-y-[1px] hover:shadow transition-all cursor-pointer"
        >
          <span>Request</span>
          <ArrowDown size={15} className="group-hover:translate-y-0.5 transition-transform" />
        </button>

        {/* Three-Dot Menu Button */}
        <button
          className="w-[48px] h-[48px] rounded-full border border-[#E2E5E9] hover:bg-[#F4F6F8] flex items-center justify-center text-[#5A6372] transition-colors cursor-pointer shrink-0"
          aria-label="More options"
        >
          <MoreVertical size={17} />
        </button>
      </div>
    </div>
  );
});
