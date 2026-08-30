import React, { useState, useMemo, memo } from "react";
import { Search, ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

const defaultData = {
  incomePoints: [42, 58, 52, 78, 68, 74, 82, 85, 80],
  expensePoints: [26, 38, 34, 56, 48, 52, 62, 68, 64],
  incomeTooltip: "$8,554.79",
  expenseTooltip: "$6,814.52",
};

const dataset: Record<string, { incomePoints: number[]; expensePoints: number[]; incomeTooltip: string; expenseTooltip: string }> = {
  Jan: { incomePoints: [35, 45, 40, 60, 50, 55, 65, 70, 68], expensePoints: [20, 30, 28, 42, 35, 38, 45, 48, 46], incomeTooltip: "$7,120.40", expenseTooltip: "$5,430.10" },
  Feb: { incomePoints: [40, 50, 48, 65, 58, 62, 70, 75, 72], expensePoints: [25, 35, 30, 45, 40, 42, 50, 52, 49], incomeTooltip: "$7,840.50", expenseTooltip: "$5,910.20" },
  Mar: { incomePoints: [45, 55, 50, 70, 62, 68, 75, 80, 78], expensePoints: [28, 38, 35, 50, 44, 48, 54, 58, 55], incomeTooltip: "$8,190.00", expenseTooltip: "$6,250.80" },
  Apr: { incomePoints: [50, 60, 55, 72, 65, 70, 78, 82, 80], expensePoints: [30, 40, 38, 52, 46, 50, 56, 60, 58], incomeTooltip: "$8,320.10", expenseTooltip: "$6,540.30" },
  May: defaultData,
  Jun: { incomePoints: [48, 62, 56, 80, 72, 76, 84, 88, 82], expensePoints: [30, 42, 36, 58, 50, 54, 64, 70, 66], incomeTooltip: "$8,890.30", expenseTooltip: "$7,120.00" },
  Jul: { incomePoints: [52, 65, 60, 82, 75, 78, 86, 90, 85], expensePoints: [32, 45, 40, 60, 52, 56, 66, 72, 68], incomeTooltip: "$9,150.40", expenseTooltip: "$7,340.50" },
  Aug: { incomePoints: [50, 64, 58, 80, 73, 77, 85, 88, 84], expensePoints: [31, 44, 38, 59, 51, 55, 65, 71, 67], incomeTooltip: "$8,970.00", expenseTooltip: "$7,210.00" },
  Sep: { incomePoints: [46, 60, 54, 76, 70, 74, 82, 85, 81], expensePoints: [29, 41, 36, 57, 49, 53, 63, 69, 65], incomeTooltip: "$8,620.80", expenseTooltip: "$6,940.20" },
};

export const StatisticsChartCard = memo(function StatisticsChartCard() {
  const [selectedMonth, setSelectedMonth] = useState("May");

  const currentData = useMemo(() => dataset[selectedMonth] ?? defaultData, [selectedMonth]);

  // Generate SVG path strings
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

  const incomePath = useMemo(() => getPath(currentData.incomePoints), [currentData]);
  const expensePath = useMemo(() => getPath(currentData.expensePoints), [currentData]);

  // Selected point index (May is index 4)
  const selectedIndex = Math.max(0, months.indexOf(selectedMonth));
  const activeX = paddingX + selectedIndex * stepX;
  const incomeVal = currentData.incomePoints[selectedIndex] ?? 80;
  const expenseVal = currentData.expensePoints[selectedIndex] ?? 60;
  const activeIncomeY = height - (incomeVal / 100) * (height - 30) - 15;
  const activeExpenseY = height - (expenseVal / 100) * (height - 30) - 15;

  return (
    <div className="w-full bg-white rounded-[26px] border border-[#E8EAEC] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-[#DDE1E6] transition-colors">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-xl font-semibold text-[#111315]">Statistics</h3>

        <div className="flex items-center gap-2">
          {/* Monthly Dropdown Pill */}
          <button className="h-[38px] px-4 rounded-full bg-[#F5F7F8] hover:bg-[#EBEDF0] border border-[#E2E5E9] flex items-center gap-1.5 text-xs font-medium text-[#111315] transition-colors cursor-pointer">
            <span>Monthly</span>
            <ChevronDown size={14} className="text-[#64748B]" />
          </button>

          {/* Search Button */}
          <button className="w-[38px] h-[38px] rounded-full border border-[#E2E5E9] hover:bg-[#F5F7F8] flex items-center justify-center text-[#64748B] transition-colors cursor-pointer" aria-label="Search statistics">
            <Search size={15} />
          </button>
        </div>
      </div>

      {/* SVG Chart Area with Double Lines */}
      <div className="relative w-full h-[200px] my-2 select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Subtle horizontal grid lines */}
          <line x1={paddingX} y1={height * 0.25} x2={width - paddingX} y2={height * 0.25} stroke="#F1F3F5" strokeDasharray="4 4" />
          <line x1={paddingX} y1={height * 0.55} x2={width - paddingX} y2={height * 0.55} stroke="#F1F3F5" strokeDasharray="4 4" />
          <line x1={paddingX} y1={height * 0.85} x2={width - paddingX} y2={height * 0.85} stroke="#F1F3F5" strokeDasharray="4 4" />

          {/* Active Vertical Dashed Guide Line */}
          <line
            x1={activeX}
            y1={10}
            x2={activeX}
            y2={height}
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            className="transition-all duration-300 ease-out"
          />

          {/* Orange Expense Line */}
          <path
            d={expensePath}
            fill="none"
            stroke="#F97316"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />

          {/* Blue Income Line */}
          <path
            d={incomePath}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />

          {/* Selected Data Points */}
          <circle cx={activeX} cy={activeIncomeY} r="5" fill="#3B82F6" stroke="white" strokeWidth="2.5" className="transition-all duration-300 shadow-sm" />
          <circle cx={activeX} cy={activeExpenseY} r="5" fill="#F97316" stroke="white" strokeWidth="2.5" className="transition-all duration-300 shadow-sm" />
        </svg>

        {/* Floating Tooltips */}
        <div
          className="absolute pointer-events-none flex items-center gap-1.5 transition-all duration-300 ease-out z-20"
          style={{
            left: `${(activeX / width) * 100}%`,
            top: `${(activeIncomeY / height) * 100 - 24}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          {/* Black Tooltip (Income) */}
          <div className="bg-[#111315] text-white px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-md whitespace-nowrap">
            {currentData.incomeTooltip}
          </div>
          {/* White Tooltip (Expense) */}
          <div className="bg-white border border-[#E2E5E9] text-[#111315] px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-md whitespace-nowrap">
            {currentData.expenseTooltip}
          </div>
        </div>
      </div>

      {/* Horizontal Month Pill Selector */}
      <div className="flex items-center justify-between gap-1 pt-1 pb-4">
        {months.map((m) => {
          const isSelected = selectedMonth === m;
          return (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-[#E2E5E9] text-[#111315] font-semibold shadow-inner"
                  : "text-[#8C93A0] hover:text-[#111315] hover:bg-[#F3F5F7]"
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#E8EAEC] mb-4" />

      {/* Bottom Summary: Average Income & Average Expenses */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Average Income */}
        <div className="space-y-0.5">
          <span className="text-xs text-[#7A8290] font-medium block">Average Income</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-[28px] font-normal text-[#111315] tracking-tight">
              $12,325.96
            </span>
            <span className="text-xs font-semibold text-[#10B981] flex items-center">
              <ArrowUpRight size={13} strokeWidth={2.5} />
              14%
            </span>
          </div>
        </div>

        {/* Right: Average Expenses */}
        <div className="space-y-0.5">
          <span className="text-xs text-[#7A8290] font-medium block">Average Expenses</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-[28px] font-normal text-[#111315] tracking-tight">
              $8,146.96
            </span>
            <span className="text-xs font-semibold text-[#EF4444] flex items-center">
              <ArrowDownRight size={13} strokeWidth={2.5} />
              8%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
