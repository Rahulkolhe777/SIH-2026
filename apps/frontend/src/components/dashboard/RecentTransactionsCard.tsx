import React, { memo } from "react";
import { Search, Sprout, Scale, ArrowDownLeft, ArrowUpRight, FileText } from "lucide-react";

interface MandiTransaction {
  id: string;
  title: string;
  date: string;
  type: "credit" | "debit";
  category: "Produce Sale" | "Subsidy" | "Cess Fee" | "Advance";
  amount: number;
  badgeBg: string;
  icon: "crop" | "weigh" | "subsidy";
}

const mandiTransactions: MandiTransaction[] = [
  {
    id: "tx-1",
    title: "120 Qtl Sharbati Wheat Sale",
    date: "Today, 11:30 AM • Indore Bay 03",
    type: "credit",
    category: "Produce Sale",
    amount: 291000.0,
    badgeBg: "bg-emerald-600 text-white",
    icon: "crop",
  },
  {
    id: "tx-2",
    title: "80 Qtl Yellow Soybean Deposit",
    date: "Yesterday, 04:15 PM • Ujjain Yard",
    type: "credit",
    category: "Produce Sale",
    amount: 391200.0,
    badgeBg: "bg-[#111315] text-[#C8F52F]",
    icon: "crop",
  },
  {
    id: "tx-3",
    title: "Weighbridge Electronic Slip #WB-8812",
    date: "Yesterday, 03:50 PM • Mandi Scale #02",
    type: "debit",
    category: "Cess Fee",
    amount: -450.0,
    badgeBg: "bg-slate-700 text-white",
    icon: "weigh",
  },
  {
    id: "tx-4",
    title: "PM-Kisan Direct Benefit Transfer (DBT)",
    date: "25 Aug, 10:00 AM • Ministry of Agriculture",
    type: "credit",
    category: "Subsidy",
    amount: 6000.0,
    badgeBg: "bg-blue-600 text-white",
    icon: "subsidy",
  },
];

export const RecentTransactionsCard = memo(function RecentTransactionsCard() {
  return (
    <div className="w-full bg-white rounded-[26px] border border-[#E8EAEC] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-[#DDE1E6] transition-colors text-left selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h3 className="text-xl font-bold text-[#111315]">Mandi Settlements & Sales</h3>
          <span className="text-xs text-[#6C727F]">Direct APMC Bank Credits & Weighbridge Slips</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="h-[36px] px-3.5 rounded-full border border-[#E2E5E9] hover:bg-[#F5F7F8] text-xs font-semibold text-[#111315] transition-colors cursor-pointer">
            Export Slips
          </button>
        </div>
      </div>

      {/* Transaction Rows */}
      <div className="space-y-1 divide-y divide-[#F5F7F8]">
        {mandiTransactions.map((tx) => {
          const isCredit = tx.type === "credit";
          return (
            <div
              key={tx.id}
              className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-[#F7F8F8] transition-all cursor-pointer"
            >
              {/* Left: Icon & Title */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-10 h-10 rounded-2xl ${tx.badgeBg} flex items-center justify-center shrink-0 shadow-sm`}>
                  {tx.icon === "crop" && <Sprout size={18} />}
                  {tx.icon === "weigh" && <Scale size={18} />}
                  {tx.icon === "subsidy" && <ArrowDownLeft size={18} />}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#111315] truncate">
                    {tx.title}
                  </div>
                  <div className="text-[11px] text-[#8C93A0]">{tx.date}</div>
                </div>
              </div>

              {/* Middle: Category Pill */}
              <div className="hidden sm:block">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    tx.category === "Produce Sale"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : tx.category === "Subsidy"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-[#F5F7F8] text-[#556070] border-[#E2E5E9]"
                  }`}
                >
                  {tx.category}
                </span>
              </div>

              {/* Right: Amount */}
              <div className="text-right">
                <span
                  className={`text-sm font-bold tracking-tight block ${
                    isCredit ? "text-[#059669]" : "text-[#111315]"
                  }`}
                >
                  {isCredit ? `+₹ ${tx.amount.toLocaleString("en-IN")}` : `-₹ ${Math.abs(tx.amount).toLocaleString("en-IN")}`}
                </span>
                <span className="text-[10px] text-[#8A92A0]">NEFT Direct Deposit</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
