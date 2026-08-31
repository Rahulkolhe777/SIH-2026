import React, { memo } from "react";
import { Building2, MapPin, Sparkles, ArrowRight } from "lucide-react";
import type { SuggestedMandi } from "./FarmerDashboard";

interface SuggestedMandisSectionProps {
  mandis: SuggestedMandi[];
  onBookMandi: (mandi: SuggestedMandi) => void;
}

export const SuggestedMandisSection = memo(function SuggestedMandisSection({
  mandis,
  onBookMandi,
}: SuggestedMandisSectionProps) {
  return (
    <div className="w-full bg-white rounded-3xl border border-[#E8EAEC] p-6 sm:p-7 shadow-sm text-left space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F3F5] pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0B2D1B] flex items-center gap-2">
            <Building2 size={20} className="text-[#059669]" />
            <span>Suggested Mandis with Open Arrival Slots</span>
          </h2>
          <p className="text-xs text-[#5A6C5F] mt-0.5">
            AI recommended APMC yards sorted by proximity, best wholesale rates, and fast-track unloading hoppers.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 text-xs font-bold text-[#059669] bg-[#E8F5E9] px-3 py-1.5 rounded-full border border-emerald-200">
          <Sparkles size={13} />
          <span>Real-Time Mandi Board Feed</span>
        </div>
      </div>

      {/* Mandi Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mandis.map((mandi) => (
          <div
            key={mandi.id}
            className="p-5 rounded-2xl bg-[#FCFCFA] border border-[#E8EAEC] hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-sm text-[#0B2D1B] group-hover:text-[#059669] transition-colors leading-tight">
                  {mandi.name}
                </span>
                {mandi.badge && (
                  <span className="px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#059669] text-[10px] font-bold shrink-0 border border-emerald-200">
                    {mandi.badge}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#5A6C5F]">
                <MapPin size={13} className="text-[#8A92A0]" />
                <span>
                  {mandi.district} • {mandi.distanceKm} km away
                </span>
              </div>

              {/* Crop Rate Pill */}
              <div className="p-2.5 rounded-xl bg-white border border-[#E8EAEC] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5A6C5F]">Top Crop:</span>
                  <strong className="text-[#0B2D1B]">{mandi.bestCrop}</strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5A6C5F]">Market Rate:</span>
                  <strong className="text-[#059669]">₹{mandi.currentRateQtl}/Qtl</strong>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="space-y-2 pt-2 border-t border-[#E8EAEC]">
              <div className="flex items-center justify-between text-[11px] text-[#5A6C5F]">
                <span>Open Slots Today:</span>
                <strong className="text-[#0B2D1B]">{mandi.availableSlotsToday} slots</strong>
              </div>

              <button
                type="button"
                onClick={() => onBookMandi(mandi)}
                className="w-full py-2 px-3 rounded-xl bg-[#0B2D1B] hover:bg-[#06180E] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>Book Unloading Slot</span>
                <ArrowRight size={13} className="text-[#C8F52F]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
