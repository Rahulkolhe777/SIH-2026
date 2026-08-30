import React, { useState, useMemo, memo } from "react";
import { MoreVertical } from "lucide-react";

interface CategoryExpenseData {
  title: string;
  total: string;
  average: string;
  bars: { day: string; height: number; isPeak?: boolean; tooltip?: string }[];
}

const defaultExpenseData: CategoryExpenseData = {
  title: "Food & Drinks",
  total: "$722.03",
  average: "Average: $722.03",
  bars: [
    { day: "Mon", height: 45 },
    { day: "Tue", height: 85, isPeak: true, tooltip: "$114.79" },
    { day: "Wed", height: 55 },
    { day: "Thu", height: 65 },
  ],
};

const expenseData: Record<string, CategoryExpenseData> = {
  "Food & Drinks": defaultExpenseData,
  Shopping: {
    title: "Shopping",
    total: "$489.50",
    average: "Average: $489.50",
    bars: [
      { day: "Mon", height: 35 },
      { day: "Tue", height: 60 },
      { day: "Wed", height: 80, isPeak: true, tooltip: "$195.20" },
      { day: "Thu", height: 40 },
    ],
  },
  Health: {
    title: "Health",
    total: "$310.20",
    average: "Average: $310.20",
    bars: [
      { day: "Mon", height: 50 },
      { day: "Tue", height: 40 },
      { day: "Wed", height: 30 },
      { day: "Thu", height: 75, isPeak: true, tooltip: "$140.00" },
    ],
  },
};

const categories = ["Food & Drinks", "Shopping", "Health"];

export const TopExpensesCard = memo(function TopExpensesCard() {
  const [selectedCategory, setSelectedCategory] = useState("Food & Drinks");

  const current = useMemo(
    () => expenseData[selectedCategory] ?? defaultExpenseData,
    [selectedCategory]
  );

  return (
    <div className="flex-1 bg-white rounded-[26px] border border-[#E8EAEC] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-[#DDE1E6] transition-colors">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-xl font-semibold text-[#111315]">Top expenses</h3>
          <button className="text-[#9CA3AF] hover:text-[#111315] p-1 cursor-pointer">
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 pb-4 overflow-x-auto">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-[#F97316] text-white font-semibold shadow-sm"
                    : "bg-[#F5F7F8] text-[#556070] hover:text-[#111315] hover:bg-[#EAECEF]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Category Title & Amount */}
        <div className="space-y-0.5">
          <span className="text-xs text-[#7A8290] font-medium">{current.title}</span>
          <div className="text-3xl sm:text-[34px] font-normal text-[#111315] tracking-tight">
            {current.total}
          </div>
        </div>
      </div>

      {/* Animated Vertical Bar Chart */}
      <div className="pt-6 pb-2">
        <div className="flex items-end justify-between gap-3 h-[110px] px-2">
          {current.bars.map((bar) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative group">
              {/* Tooltip for peak / hovered bar */}
              {bar.isPeak && bar.tooltip && (
                <div className="absolute -top-7 bg-[#111315] text-white px-2 py-0.5 rounded-md text-[10px] font-semibold shadow-md whitespace-nowrap animate-fadeIn z-10">
                  {bar.tooltip}
                </div>
              )}

              {/* Bar Column */}
              <div
                className={`w-full max-w-[36px] rounded-t-xl transition-all duration-500 ease-out cursor-pointer ${
                  bar.isPeak
                    ? "bg-[#F97316] hover:bg-[#EA580C] shadow-sm"
                    : "bg-[#EAECEF] hover:bg-[#D5D9DF]"
                }`}
                style={{ height: `${bar.height}%` }}
              />

              {/* Day Label */}
              <span className="text-[11px] font-medium text-[#7A8290]">{bar.day}</span>
            </div>
          ))}
        </div>

        {/* Bottom Average Subtext */}
        <div className="text-center pt-3 text-xs text-[#7A8290] border-t border-[#F5F7F8] mt-3">
          {current.average}
        </div>
      </div>
    </div>
  );
});
