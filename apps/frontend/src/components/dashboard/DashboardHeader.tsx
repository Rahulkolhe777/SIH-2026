import React, { useState, useRef, useEffect, memo } from "react";
import { Bell, Moon, Sun, LogOut, User, Shield, ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store";
import { logout } from "../../store/slices/authSlice";

interface DashboardHeaderProps {
  userName?: string;
  avatarUrl?: string;
  onNavigateTab?: (tab: string) => void;
  onOpenProfile?: () => void;
}

const navItems = ["Dashboard", "Transactions", "Analytics", "History"];

export const DashboardHeader = memo(function DashboardHeader({
  userName = "Jane",
  avatarUrl = "/images/avatar-1.jpg",
  onNavigateTab,
  onOpenProfile,
}: DashboardHeaderProps) {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onNavigateTab) onNavigateTab(tab);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    dispatch(logout());
    window.history.pushState({}, "", "/login");
    window.location.href = "/login";
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const displayName = authUser?.name || userName;
  const displayEmail = authUser?.email || "farmer@agrovia.in";

  return (
    <header className="w-full flex items-center justify-between py-4 border-b border-[#E8EAEC] select-none relative z-30">
      {/* Left: Minimal Black Abstract Logo + Nav Tabs */}
      <div className="flex items-center gap-8 sm:gap-10">
        {/* Minimal Black Abstract Logo */}
        <div className="flex items-center gap-1 cursor-pointer group" aria-label="Logo">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute w-4 h-7 bg-[#111315] rounded-l-full -rotate-12 translate-x-[-3px] transition-transform group-hover:scale-105" />
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

      {/* Right: Controls (Theme Pill, Bell Notification, Avatar + Profile Menu) */}
      <div className="flex items-center gap-3 sm:gap-3.5">
        {/* Combined Theme Switcher Pill */}
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

        {/* Notification Bell Button */}
        <button
          className="relative w-[44px] h-[44px] rounded-full bg-white hover:bg-[#F0F2F5] border border-[#E2E5E9] flex items-center justify-center text-[#2C333E] shadow-sm hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#FF4D4D] border-2 border-white ring-1 ring-[#FF4D4D]/30" />
        </button>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#111315]/10 transition-all cursor-pointer"
            aria-expanded={isMenuOpen}
            aria-label="User Menu"
          >
            <div className="relative w-[44px] h-[44px] rounded-full overflow-hidden border border-[#D5D9DF] shadow-sm">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/avatar-1.jpg";
                }}
              />
            </div>
            <ChevronDown size={14} className={`text-[#6C727F] transition-transform duration-200 hidden sm:block ${isMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Interactive Profile & Logout Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E2E5E9] py-2 z-50 animate-fadeIn">
              {/* User Header */}
              <div className="px-4 py-3 border-b border-[#F0F2F5]">
                <div className="font-semibold text-sm text-[#111315] truncate">
                  {displayName}
                </div>
                <div className="text-xs text-[#6C727F] truncate mt-0.5">
                  {displayEmail}
                </div>
                <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#059669] text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>Farmer • Verified</span>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onOpenProfile) onOpenProfile();
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs text-[#2C333E] hover:bg-[#F5F7F8] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <User size={15} className="text-[#6C727F]" />
                  <span>Profile & Land Records</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full px-4 py-2.5 text-left text-xs text-[#2C333E] hover:bg-[#F5F7F8] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Shield size={15} className="text-[#6C727F]" />
                  <span>Security & Sessions</span>
                </button>
              </div>

              {/* Logout Option */}
              <div className="pt-1 border-t border-[#F0F2F5]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#EF4444] hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});
