import React, { memo } from "react";
import { Plus, SlidersHorizontal, Sun, MapPin, Sparkles } from "lucide-react";
import { useAppSelector } from "../../store";

interface WelcomeBannerProps {
  userName?: string;
  onBookSlot?: () => void;
  onOpenProfile?: () => void;
}

export const WelcomeBanner = memo(function WelcomeBanner({
  userName = "Jane",
  onBookSlot,
  onOpenProfile,
}: WelcomeBannerProps) {
  const farmerProfile = useAppSelector((state) => state.farmer.profile);
  const location = farmerProfile?.farmerProfile?.village
    ? `${farmerProfile.farmerProfile.village}, ${farmerProfile.farmerProfile.district || "Indore"}`
    : "Indore Mandi Region, MP";

  const firstName = userName.split(" ")[0];

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 pb-2 text-left select-none">
      {/* Left: Heading & Status Indicator */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111315]">
            Welcome back, {firstName}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/10 text-[#059669] text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>Mandi Yard Open</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#6C727F]">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[#8A92A0]" />
            <span>{location}</span>
          </div>
          <span className="text-[#D5D9DF]">•</span>
          <div className="flex items-center gap-1.5">
            <Sun size={13} className="text-[#F59E0B]" />
            <span>28°C Clear • Optimal Grain Moisture</span>
          </div>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Book Slot Button */}
        <button
          type="button"
          onClick={onBookSlot}
          className="group inline-flex items-center gap-2 bg-[#111315] hover:bg-black active:scale-98 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:rotate-90 transition-transform duration-300">
            <Plus size={13} strokeWidth={3} />
          </div>
          <span>Book Unloading Slot</span>
        </button>

        {/* Farm Profile & Records Settings Button */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="inline-flex items-center gap-2 bg-white hover:bg-[#F0F2F5] active:scale-98 border border-[#DCE0E5] text-[#2C333E] font-semibold text-xs sm:text-sm px-4 sm:px-4.5 py-2.5 sm:py-3 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
        >
          <SlidersHorizontal size={14} className="text-[#6C727F]" />
          <span>Farm Records</span>
        </button>
      </div>
    </div>
  );
});
