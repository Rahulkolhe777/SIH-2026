import React, { useState, useCallback, memo } from "react";
import { MoreVertical, Check } from "lucide-react";
import type { PaymentScheduleItem } from "../../interfaces";

const initialSchedule: PaymentScheduleItem[] = [
  { id: "sched-1", date: "Feb 16", merchant: "Bills", amount: 281.17, isChecked: true, dateBadgeColor: "gray" },
  { id: "sched-2", date: "Feb 16", merchant: "Spotify", amount: 181.36, isChecked: true, dateBadgeColor: "gray" },
  { id: "sched-3", date: "Feb 18", merchant: "Framer", amount: 21.58, isChecked: false, dateBadgeColor: "yellow" },
  { id: "sched-4", date: "Feb 21", merchant: "Adobe", amount: 59.25, isChecked: false, dateBadgeColor: "yellow" },
];

// Pure memoized single row component to isolate re-renders on checkbox click
interface ScheduleRowProps {
  item: PaymentScheduleItem;
  onToggle: (id: string) => void;
}

const ScheduleRow = memo(function ScheduleRow({ item, onToggle }: ScheduleRowProps) {
  return (
    <div
      onClick={() => onToggle(item.id)}
      className="flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-[#F7F8F8] transition-colors cursor-pointer select-none"
    >
      {/* Left: Date Badge + Merchant */}
      <div className="flex items-center gap-3">
        {/* Date badge: Feb 16 is light gray, Feb 18/21 is bright yellow */}
        <div
          className={`w-14 h-9 rounded-xl flex items-center justify-center text-xs font-semibold tracking-tight shadow-sm shrink-0 ${
            item.dateBadgeColor === "yellow"
              ? "bg-[#FFE600] text-[#111315]"
              : "bg-[#EAECEF] text-[#4B5563]"
          }`}
        >
          {item.date}
        </div>
        <span className="text-sm font-semibold text-[#111315]">{item.merchant}</span>
      </div>

      {/* Right: Amount + Custom Checkbox */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[#111315]">
          ${item.amount.toFixed(2)}
        </span>

        {/* Checkbox: Blue square with white check when checked, subtle border when unchecked */}
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-200 ${
            item.isChecked
              ? "bg-[#3B82F6] border-[#3B82F6] text-white shadow-sm"
              : "bg-white border-[#D1D5DB]"
          }`}
        >
          {item.isChecked && <Check size={13} strokeWidth={3} />}
        </div>
      </div>
    </div>
  );
});

export const PaymentScheduleCard = memo(function PaymentScheduleCard() {
  const [schedule, setSchedule] = useState<PaymentScheduleItem[]>(initialSchedule);

  const handleToggle = useCallback((id: string) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isChecked: !item.isChecked } : item))
    );
  }, []);

  return (
    <div className="flex-1 bg-white rounded-[26px] border border-[#E8EAEC] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-[#DDE1E6] transition-colors">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-xl font-semibold text-[#111315]">Payment schedule</h3>
          <button className="text-[#9CA3AF] hover:text-[#111315] p-1 cursor-pointer">
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Schedule List */}
        <div className="space-y-1 divide-y divide-[#F5F7F8]">
          {schedule.map((item) => (
            <ScheduleRow key={item.id} item={item} onToggle={handleToggle} />
          ))}
        </div>
      </div>
    </div>
  );
});
