import React, { useState, memo } from "react";
import { Plus, Wifi, QrCode, ShieldCheck } from "lucide-react";
import { useAppSelector } from "../../store";

interface MandiKisanCardProps {
  cardNumber1?: string;
  cardNumber2?: string;
  expiry?: string;
  onAddCard?: () => void;
}

export const MandiKisanCard = memo(function MandiKisanCard({
  cardNumber1 = "**** 3765",
  cardNumber2 = "**** 4329",
  expiry = "12/28",
  onAddCard,
}: MandiKisanCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const farmerProfile = useAppSelector((state) => state.farmer.profile);
  const authUser = useAppSelector((state) => state.auth.user);

  const farmerName = farmerProfile?.name || authUser?.name || "Ramesh Patel";

  return (
    <div className="relative inline-flex items-center shrink-0 select-none">
      {/* 3D Card Container */}
      <div
        className="w-[245px] h-[275px] rounded-[28px] overflow-hidden relative shadow-lg cursor-pointer transition-all duration-500 ease-out"
        style={{
          transform: isHovered
            ? "perspective(800px) rotateY(4deg) rotateX(2deg) scale(1.015)"
            : "perspective(800px) rotateY(0deg) scale(1)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Base Black */}
        <div className="absolute inset-0 bg-[#0E1012]" />

        {/* Diagonal Vibrant Blue Shape */}
        <div
          className="absolute -top-10 -left-12 w-48 h-64 bg-gradient-to-br from-[#064E3B] to-[#10B981] rounded-full blur-[2px] opacity-90 transform -rotate-12"
        />

        {/* Right Bright Yellow/Lime Split Area */}
        <div
          className="absolute inset-y-0 right-0 w-[64%] bg-[#FFE600] rounded-l-[36px] transform translate-x-2"
          style={{
            boxShadow: "-8px 0px 24px rgba(0,0,0,0.18)",
          }}
        />

        {/* Card Content Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
          {/* Top Row: Payment Chip Circles + APMC Mandi Pass Brand */}
          <div className="flex items-start justify-between">
            {/* Overlapping Payment Chip Circles */}
            <div className="flex items-center -space-x-2.5 pt-0.5">
              <div className="w-7 h-7 rounded-full bg-[#EA580C] opacity-90 border border-black/10" />
              <div className="w-7 h-7 rounded-full bg-[#FACC15] opacity-90 border border-black/10" />
            </div>

            {/* Right: Contactless Icon + Kisan Pass Label */}
            <div className="flex items-center gap-1.5 text-[#111315]">
              <Wifi size={15} className="rotate-90 text-[#111315] opacity-80" />
              <span className="font-extrabold italic text-sm tracking-wider text-[#111315]">
                KISAN PASS
              </span>
            </div>
          </div>

          {/* Middle: Farmer Name */}
          <div className="text-left pt-2">
            <div className="text-[10px] uppercase font-bold text-white/70 tracking-wider">APMC Member</div>
            <div className="text-sm font-bold text-white truncate max-w-[130px] drop-shadow-sm">{farmerName}</div>
          </div>

          {/* Bottom Row: Card Digits and Expiration Date */}
          <div className="space-y-1 text-left">
            <div className="flex items-center justify-between text-xs font-mono tracking-wider text-[#111315]">
              <span className="text-white/80 drop-shadow-sm font-semibold">{cardNumber1}</span>
              <span className="font-bold text-[#111315]">{cardNumber2}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#111315] pt-0.5">
              <span className="text-white/60 text-[9px] uppercase">Valid Thru</span>
              <span className="font-bold">{expiry}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping Floating "+" Circular Button */}
      <button
        type="button"
        onClick={onAddCard}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-[42px] h-[42px] rounded-full bg-white hover:bg-[#F4F6F8] border border-[#D5D9DF] shadow-md flex items-center justify-center text-[#111315] hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
        aria-label="Add Mandi Account"
        title="Add Mandi Account"
      >
        <Plus size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
});
