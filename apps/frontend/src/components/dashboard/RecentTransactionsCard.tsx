import React, { memo } from "react";
import { Search, MoreVertical, Music, ShoppingBag, ArrowDownLeft, Film, Coffee } from "lucide-react";
import type { TransactionItem } from "../../interfaces";

const sampleTransactions: TransactionItem[] = [
  {
    id: "tx-1",
    merchant: "Spotify",
    date: "07 Feb, 11:18 AM",
    category: "Subscription",
    amount: -50.24,
    type: "debit",
    logoBg: "bg-[#1DB954]",
    logoText: "Spotify",
    logoType: "spotify",
  },
  {
    id: "tx-2",
    merchant: "Billa",
    date: "07 Feb, 11:18 AM",
    category: "Food & Drinks",
    amount: -256.58,
    type: "debit",
    logoBg: "bg-[#FECC00] text-[#111315]",
    logoText: "Billa",
    logoType: "billa",
  },
  {
    id: "tx-3",
    merchant: "Transfer",
    date: "06 Feb, 11:18 AM",
    category: "Income",
    amount: 250.0,
    type: "credit",
    logoBg: "bg-[#3B82F6]",
    logoText: "Transfer",
    logoType: "transfer",
  },
  {
    id: "tx-4",
    merchant: "Cinema City",
    date: "06 Feb, 11:18 AM",
    category: "Entertainment",
    amount: -122.03,
    type: "debit",
    logoBg: "bg-[#1E293B]",
    logoText: "Cinema",
    logoType: "cinema",
  },
  {
    id: "tx-5",
    merchant: "Starbucks",
    date: "05 Feb, 11:18 AM",
    category: "Food & Drinks",
    amount: -10.89,
    type: "debit",
    logoBg: "bg-[#00704A]",
    logoText: "Starbucks",
    logoType: "starbucks",
  },
];

export const RecentTransactionsCard = memo(function RecentTransactionsCard() {
  const renderIcon = (tx: TransactionItem) => {
    switch (tx.logoType) {
      case "spotify":
        return <Music size={16} className="text-white" />;
      case "billa":
        return <ShoppingBag size={16} className="text-[#111315]" />;
      case "transfer":
        return <ArrowDownLeft size={16} className="text-white" />;
      case "cinema":
        return <Film size={16} className="text-white" />;
      case "starbucks":
        return <Coffee size={16} className="text-white" />;
      default:
        return <ShoppingBag size={16} className="text-white" />;
    }
  };

  return (
    <div className="w-full bg-white rounded-[26px] border border-[#E8EAEC] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-[#DDE1E6] transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-xl font-semibold text-[#111315]">Recent transactions</h3>

        <div className="flex items-center gap-2">
          <button className="w-[38px] h-[38px] rounded-full border border-[#E2E5E9] hover:bg-[#F5F7F8] flex items-center justify-center text-[#64748B] transition-colors cursor-pointer" aria-label="Search transactions">
            <Search size={15} />
          </button>
          <button className="h-[38px] px-4 rounded-full border border-[#E2E5E9] hover:bg-[#F5F7F8] text-xs font-medium text-[#111315] transition-colors cursor-pointer">
            View all
          </button>
        </div>
      </div>

      {/* Transaction Rows */}
      <div className="space-y-1 divide-y divide-[#F5F7F8]">
        {sampleTransactions.map((tx, index) => {
          const isIncome = tx.amount > 0;
          return (
            <div
              key={tx.id}
              className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-[#F7F8F8] hover:translate-x-0.5 transition-all duration-200 cursor-pointer"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              {/* Left: Brand Icon & Merchant info */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-10 h-10 rounded-full ${tx.logoBg} flex items-center justify-center shrink-0 shadow-sm`}>
                  {renderIcon(tx)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#111315] truncate">
                    {tx.merchant}
                  </div>
                  <div className="text-[11px] text-[#8C93A0]">{tx.date}</div>
                </div>
              </div>

              {/* Middle: Category Pill */}
              <div className="hidden sm:block">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    tx.category === "Income"
                      ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                      : "bg-[#F5F7F8] text-[#556070] border-[#E2E5E9]"
                  }`}
                >
                  {tx.category}
                </span>
              </div>

              {/* Right: Amount & Actions */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold tracking-tight ${
                    isIncome ? "text-[#10B981]" : "text-[#111315]"
                  }`}
                >
                  {isIncome ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                </span>

                <button className="text-[#9CA3AF] hover:text-[#111315] p-1 cursor-pointer">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
