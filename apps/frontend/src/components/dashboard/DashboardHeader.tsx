import React, { useState, memo } from "react";
import { Bell, Moon, Sun } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  avatarUrl?: string;
  onNavigateTab?: (tab: string) => void;
}

const navItems = ["Dashboard", "Transactions", "Analytics", "History"];

export const DashboardHeader = memo(function DashboardHeader({
  userName = "Jane",
  avatarUrl = "/images/avatar-1.jpg",
  onNavigateTab,
}: DashboardHeaderProps) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onNavigateTab) onNavigateTab(tab);
  };

  return (
    <header className="w-full flex items-center justify-between py-4 border-b border-[#E8EAEC] select-none">
      {/* Left: Minimal Black Abstract Logo + Nav Tabs */}
      <div className="flex items-center gap-8 sm:gap-10">
        {/* Minimal Black Abstract Logo (two curved/angled shapes) */}
        <div className="flex items-center gap-1 cursor-pointer group" aria-label="Logo">
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Shape 1 */}
            <div className="absolute w-4 h-7 bg-[#111315] rounded-l-full -rotate-12 translate-x-[-3px] transition-transform group-hover:scale-105" />
            {/* Shape 2 */}
            <div className="absolute w-4 h-7 bg-[#111315] rounded-r-full rotate-12 translate-x-[3px] transition-transform group-hover:scale-105" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-7 sm:gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item;
            return (
              <button
                key={item}
                onClick={() => handleTabClick(item)}
                className={`relative py-1 text-[14px] font-medium transition-colors cursor-pointer ${
                  isActive ? "text-[#111315]" : "text-[#6C727F] hover:text-[#111315]"
                }`}
              >
                <span>{item}</span>
                {isActive && (
                  <span className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-[#111315] rounded-full animate-fadeIn" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: Controls (Theme Pill, Bell Notification, Avatar) */}
      <div className="flex items-center gap-3 sm:gap-3.5">
        {/* Combined Theme Switcher Pill (85-90px wide, 45px high) */}
        <div
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="relative w-[88px] h-[44px] bg-[#EBEDF0] hover:bg-[#E2E5E9] rounded-full p-1 flex items-center justify-between cursor-pointer transition-colors shadow-inner"
          role="switch"
          aria-checked={isDarkMode}
          aria-label="Toggle Theme"
        >
          {/* Sliding Indicator Circle */}
          <div
            className={`absolute top-1 w-[36px] h-[36px] bg-white rounded-full shadow-md transition-transform duration-300 ease-out flex items-center justify-center ${
              isDarkMode ? "translate-x-[44px]" : "translate-x-0"
            }`}
          >
            {isDarkMode ? (
              <Moon size={16} className="text-[#111315]" />
            ) : (
              <Sun size={17} className="text-[#111315]" />
            )}
          </div>

          <div className="w-[36px] h-[36px] flex items-center justify-center text-[#8C93A0]">
            <Moon size={15} />
          </div>
          <div className="w-[36px] h-[36px] flex items-center justify-center text-[#8C93A0]">
            <Sun size={16} />
          </div>
        </div>

        {/* Notification Bell Button (45px white/light gray with red dot) */}
        <button
          className="relative w-[44px] h-[44px] rounded-full bg-white hover:bg-[#F0F2F5] border border-[#E2E5E9] flex items-center justify-center text-[#2C333E] shadow-sm hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {/* Tiny orange/red notification dot */}
          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#FF4D4D] border-2 border-white ring-1 ring-[#FF4D4D]/30" />
        </button>

        {/* User Avatar (48px circular, tight portrait) */}
        <div className="relative w-[46px] h-[46px] rounded-full overflow-hidden border border-[#D5D9DF] shadow-sm hover:scale-[1.02] transition-transform cursor-pointer">
          <img
            src={avatarUrl}
            alt={userName}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/avatar-1.jpg";
            }}
          />
        </div>
      </div>
    </header>
  );
});
