import React, { memo } from "react";
import { TrendingUp, Sparkles, ShieldCheck } from "lucide-react";

interface MandiPriceItem {
  id: string;
  crop: string;
  mspRate: string;
  marketRate: string;
  change: string;
  isPositive: boolean;
}

const mandiPrices: MandiPriceItem[] = [
  { id: "m-1", crop: "Sharbati Wheat", mspRate: "₹2,275", marketRate: "₹2,425/Qtl", change: "+₹45", isPositive: true },
  { id: "m-2", crop: "Yellow Soybean", mspRate: "₹4,600", marketRate: "₹4,890/Qtl", change: "+₹80", isPositive: true },
  { id: "m-3", crop: "Basmati Rice 1121", mspRate: "₹3,200", marketRate: "₹3,850/Qtl", change: "+₹120", isPositive: true },
  { id: "m-4", crop: "Mustard Seed", mspRate: "₹5,450", marketRate: "₹5,650/Qtl", change: "+₹65", isPositive: true },
];

export const PaymentScheduleCard = memo(function PaymentScheduleCard() {
  return (
    <div className="flex-1 bg-white rounded-[26px] border border-[#E8EAEC] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-[#DDE1E6] transition-colors text-left selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <div>
            <h3 className="text-lg font-bold text-[#111315]">Live APMC Rates</h3>
            <span className="text-[11px] text-[#6C727F]">Indore Yard Real-Time Price Index</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <TrendingUp size={12} />
            <span>Bullish Market</span>
          </span>
        </div>

        {/* Commodity Prices List */}
        <div className="space-y-2.5 pt-1">
          {mandiPrices.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F9FA] hover:bg-[#F0F2F5] transition-colors border border-[#E8EAED]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E5E9] flex items-center justify-center font-bold text-xs text-[#111315]">
                  {item.crop[0]}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111315]">{item.crop}</div>
                  <div className="text-[10px] text-[#8A92A0]">Govt MSP: {item.mspRate}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-[#111315]">{item.marketRate}</div>
                <div className="text-[10px] font-bold text-[#059669]">{item.change} Today</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 text-[11px] text-[#8A92A0] border-t border-[#F5F7F8] mt-2 flex items-center justify-between">
        <span>Updated 5 mins ago from Mandi Board</span>
        <span className="font-semibold text-[#111315]">Direct Bidding Enabled</span>
      </div>
    </div>
  );
});
