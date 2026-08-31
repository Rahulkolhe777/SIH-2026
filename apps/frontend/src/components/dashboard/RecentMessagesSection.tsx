import React, { memo } from "react";
import { MessageSquare, Truck, CheckCircle2, TrendingUp, Bell } from "lucide-react";
import type { YardMessage } from "./FarmerDashboard";

interface RecentMessagesSectionProps {
  messages: YardMessage[];
}

export const RecentMessagesSection = memo(function RecentMessagesSection({
  messages,
}: RecentMessagesSectionProps) {
  return (
    <div className="w-full bg-white rounded-3xl border border-[#E8EAEC] p-6 sm:p-7 shadow-sm text-left space-y-4">
      <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#059669] flex items-center justify-center">
            <MessageSquare size={16} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#0B2D1B]">
              Recent Messages & Mandi Gate Updates
            </h3>
            <span className="text-xs text-[#5A6C5F]">
              Official dispatch communications & payment confirmations
            </span>
          </div>
        </div>

        <span className="text-xs font-bold text-[#059669] bg-[#E8F5E9] px-2.5 py-1 rounded-full border border-emerald-200">
          {messages.length} New Alerts
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-4 rounded-2xl bg-[#FCFCFA] border border-[#E8EAEC] space-y-1.5 hover:border-[#DDE1E6] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#0B2D1B] flex items-center gap-1.5">
                {msg.type === "GATE" && <Truck size={13} className="text-purple-600" />}
                {msg.type === "PAYMENT" && <CheckCircle2 size={13} className="text-[#059669]" />}
                {msg.type === "PRICE_ALERT" && <TrendingUp size={13} className="text-blue-600" />}
                {msg.type === "INFO" && <Bell size={13} className="text-amber-600" />}
                <span>{msg.title}</span>
              </span>
              <span className="text-[10px] text-[#8A92A0]">{msg.time}</span>
            </div>
            <p className="text-xs text-[#5A6C5F] leading-relaxed">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
});
