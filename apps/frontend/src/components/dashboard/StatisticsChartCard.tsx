import React, { useState, useMemo, memo } from "react";
import { ChevronDown, ArrowUpRight, TrendingUp } from "lucide-react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

const defaultData = {
  marketPricePoints: [55, 62, 58, 75, 68, 78, 85, 90, 88],
  mspBaselinePoints: [45, 45, 45, 48, 48, 48, 52, 52, 52],
  marketTooltip: "₹2,580/Qtl (Market Rate)",
  mspTooltip: "₹2,275/Qtl (Govt MSP)",
};

export const StatisticsChartCard = memo(function StatisticsChartCard() {
  const [selectedMonth, setSelectedMonth] = useState("May");

  const width = 580;
  const height = 190;
  const paddingX = 25;
  const stepX = (width - paddingX * 2) / (months.length - 1);

  const getPath = (points: number[]) => {
    return points.reduce((acc, val, i) => {
      const x = paddingX + i * stepX;
      const y = height - (val / 100) * (height - 30) - 15;
      if (i === 0) return `M ${x} ${y}`;
      const prevVal = points[i - 1] ?? val;
      const prevX = paddingX + (i - 1) * stepX;
      const prevY = height - (prevVal / 100) * (height - 30) - 15;
      const cp1x = prevX + stepX / 2;
      const cp1y = prevY;
      const cp2x = prevX + stepX / 2;
      const cp2y = y;
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
    }, "");
  };

  const marketPath = useMemo(() => getPath(defaultData.marketPricePoints), []);
  const mspPath = useMemo(() => getPath(defaultData.mspBaselinePoints), []);

  const selectedIndex = Math.max(0, months.indexOf(selectedMonth));
  const activeX = paddingX + selectedIndex * stepX;
  const marketVal = defaultData.marketPricePoints[selectedIndex] ?? 80;
  const mspVal = defaultData.mspBaselinePoints[selectedIndex] ?? 50;
  const activeMarketY = height - (marketVal / 100) * (height - 30) - 15;
  const activeMspY = height - (mspVal / 100) * (height - 30) - 15;

  return (
    <div className="w-full bg-white rounded-[26px] border border-[#E8EAEC] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-[#DDE1E6] transition-colors text-left selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h3 className="text-xl font-bold text-[#111315]">APMC Mandi Price Trends</h3>
          <span className="text-xs text-[#6C727F]">Indore Yard Market Rate vs Minimum Support Price (MSP)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#10B981]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              Market Rate
            </span>
            <span className="flex items-center gap-1.5 text-[#6B7280]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B7280]" />
              MSP Floor
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full h-[200px] my-2 select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <line x1={paddingX} y1={height * 0.25} x2={width - paddingX} y2={height * 0.25} stroke="#F1F3F5" strokeDasharray="4 4" />
          <line x1={paddingX} y1={height * 0.55} x2={width - paddingX} y2={height * 0.55} stroke="#F1F3F5" strokeDasharray="4 4" />
          <line x1={paddingX} y1={height * 0.85} x2={width - paddingX} y2={height * 0.85} stroke="#F1F3F5" strokeDasharray="4 4" />

          {/* Active Vertical Line */}
          <line
            x1={activeX}
            y1={10}
            x2={activeX}
            y2={height}
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* MSP Baseline */}
          <path
            d={mspPath}
            fill="none"
            stroke="#6B7280"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />

          {/* Market Price Line */}
          <path
            d={marketPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          <circle cx={activeX} cy={activeMarketY} r="5" fill="#10B981" stroke="white" strokeWidth="2.5" />
          <circle cx={activeX} cy={activeMspY} r="5" fill="#6B7280" stroke="white" strokeWidth="2.5" />
        </svg>

        {/* Floating Tooltip */}
        <div
          className="absolute pointer-events-none flex items-center gap-1.5 transition-all duration-300 ease-out z-20"
          style={{
            left: `${(activeX / width) * 100}%`,
            top: `${(activeMarketY / height) * 100 - 24}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-[#111315] text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md whitespace-nowrap">
            {defaultData.marketTooltip}
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between gap-1 pt-1 pb-4">
        {months.map((m) => {
          const isSelected = selectedMonth === m;
          return (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#111315] text-white shadow-sm"
                  : "text-[#8C93A0] hover:text-[#111315] hover:bg-[#F3F5F7]"
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>

      <div className="w-full h-px bg-[#E8EAEC] mb-4" />

      {/* Bottom Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-0.5">
          <span className="text-xs text-[#7A8290] font-semibold block">Avg Mandi Price Realization</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#111315]">
              ₹ 2,425 / Qtl
            </span>
            <span className="text-xs font-bold text-[#10B981] flex items-center">
              <ArrowUpRight size={13} strokeWidth={2.5} />
              +14% vs MSP
            </span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-xs text-[#7A8290] font-semibold block">Monthly Total Yield Unloaded</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#111315]">
              320 Quintals
            </span>
            <span className="text-xs font-bold text-[#059669]">
              3 APMC Deliveries
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
