import React, { memo } from "react";
import { ArrowLeft, ArrowRight, Lock, RotateCw, Shield } from "lucide-react";

interface BrowserChromeProps {
  url?: string;
  onRefresh?: () => void;
}

export const BrowserChrome = memo(function BrowserChrome({
  url = "cascade.com",
  onRefresh,
}: BrowserChromeProps) {
  return (
    <div className="w-full bg-[#EAECEF] border-b border-[#D8DCE0] px-4 py-2.5 flex items-center justify-between select-none rounded-t-[12px]">
      {/* Left: macOS Traffic Lights & Navigation Arrows */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-inner cursor-pointer hover:opacity-80" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-inner cursor-pointer hover:opacity-80" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-inner cursor-pointer hover:opacity-80" />
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[#8A92A0]">
          <button className="p-1 hover:text-[#2C333E] rounded hover:bg-black/5 transition-colors cursor-pointer" aria-label="Back">
            <ArrowLeft size={14} strokeWidth={2.5} />
          </button>
          <button className="p-1 hover:text-[#2C333E] rounded hover:bg-black/5 transition-colors cursor-pointer" aria-label="Forward">
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Center: Address Bar */}
      <div className="flex-1 max-w-sm sm:max-w-md mx-4">
        <div className="w-full bg-white/80 border border-[#D5D9DF] rounded-md px-3 py-1 flex items-center justify-between text-xs text-[#4A5260] shadow-sm">
          <div className="flex items-center gap-1.5 truncate">
            <Lock size={11} className="text-[#64748B] shrink-0" />
            <span className="font-medium text-[#2E3642] truncate">{url}</span>
          </div>
          <button
            onClick={onRefresh}
            className="text-[#8A92A0] hover:text-[#2C333E] cursor-pointer"
            aria-label="Refresh page"
          >
            <RotateCw size={11} />
          </button>
        </div>
      </div>

      {/* Right: Window Controls / Badge */}
      <div className="flex items-center gap-2 text-[#8A92A0] text-xs">
        <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded bg-black/5 text-[11px] font-medium text-[#556070]">
          <Shield size={11} className="text-[#10B981]" />
          <span>Verified SaaS</span>
        </div>
      </div>
    </div>
  );
});
