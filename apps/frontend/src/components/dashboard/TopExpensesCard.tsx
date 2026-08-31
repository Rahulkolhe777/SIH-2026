import React, { useState, memo } from "react";
import { QrCode, Clock, CheckCircle2, Truck, ArrowUpRight } from "lucide-react";

interface SlotPass {
  id: string;
  tokenId: string;
  crop: string;
  quantity: string;
  yard: string;
  bay: string;
  time: string;
  status: "ACTIVE" | "IN_YARD" | "COMPLETED";
  progress: number;
}

const mockPasses: SlotPass[] = [
  {
    id: "pass-1",
    tokenId: "APMC-7821",
    crop: "Sharbati Wheat",
    quantity: "120 Qtl",
    yard: "Indore Yard #01",
    bay: "Bay 03 (Fast Intake)",
    time: "Today, 10:00 AM - 11:30 AM",
    status: "ACTIVE",
    progress: 75,
  },
  {
    id: "pass-2",
    tokenId: "APMC-6410",
    crop: "Basmati Rice 1121",
    quantity: "65 Qtl",
    yard: "Ujjain Yard #02",
    bay: "Bay 01 (Bulk Intake)",
    time: "Tomorrow, 08:30 AM",
    status: "IN_YARD",
    progress: 30,
  },
];

export const TopExpensesCard = memo(function TopExpensesCard() {
  const [selectedPass, setSelectedPass] = useState<SlotPass>(mockPasses[0]!);

  return (
    <div className="flex-1 bg-white rounded-[26px] border border-[#E8EAEC] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-[#DDE1E6] transition-colors text-left selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#111315] text-[#C8F52F] flex items-center justify-center">
              <QrCode size={16} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111315]">Gate Passes & Slots</h3>
              <span className="text-[11px] text-[#6C727F]">Digital Mandi Entry Tokens</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            1 Active Pass
          </span>
        </div>

        {/* Active Token Card */}
        <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-[#E8EAED] space-y-3 mt-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#111315] bg-white px-2.5 py-1 rounded-lg border border-[#E2E5E9]">
              {selectedPass.tokenId}
            </span>
            <span className="text-xs text-[#059669] font-bold flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>Gate Verified</span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-bold text-[#111315]">
              {selectedPass.crop} ({selectedPass.quantity})
            </div>
            <div className="text-xs text-[#6C727F] flex items-center gap-2">
              <Truck size={13} className="text-[#8A92A0]" />
              <span>{selectedPass.yard} • {selectedPass.bay}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[11px] text-[#6C727F]">
              <span>Weighbridge & Unloading</span>
              <span className="font-bold text-[#111315]">{selectedPass.progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E5E8EB] overflow-hidden">
              <div
                className="h-full bg-[#111315] rounded-full transition-all duration-500"
                style={{ width: `${selectedPass.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Arrival Slot Footer */}
      <div className="pt-4 border-t border-[#F5F7F8] flex items-center justify-between text-xs text-[#6C727F]">
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-[#8A92A0]" />
          <span>{selectedPass.time}</span>
        </div>
        <button
          type="button"
          className="text-[#111315] hover:underline font-semibold text-[11px] flex items-center gap-0.5 cursor-pointer"
        >
          <span>View QR</span>
          <ArrowUpRight size={12} />
        </button>
      </div>
    </div>
  );
});
