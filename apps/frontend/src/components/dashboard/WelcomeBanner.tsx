import React, { useState, memo } from "react";
import { Search, Plus, Check, X, Sliders, TrendingUp, Calendar, CreditCard } from "lucide-react";

interface WelcomeBannerProps {
  userName?: string;
  onSearchClick?: () => void;
}

const availableWidgets = [
  { id: "kisan-card", title: "Mandi Visa / Kisan Card", icon: CreditCard, enabled: true },
  { id: "analytics", title: "Live Revenue Analytics", icon: TrendingUp, enabled: true },
  { id: "schedule", title: "APMC Unloading Schedule", icon: Calendar, enabled: true },
  { id: "weighbridge", title: "Live Weighbridge Stream", icon: Sliders, enabled: false },
];

export const WelcomeBanner = memo(function WelcomeBanner({
  userName = "Jane",
  onSearchClick,
}: WelcomeBannerProps) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [widgets, setWidgets] = useState(availableWidgets);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8 pb-6 select-none relative">
      {/* Welcome Heading (48-52px desktop, thin/regular sans-serif) */}
      <div className="animate-fadeIn">
        <h1 className="text-3xl sm:text-4xl md:text-[46px] lg:text-[50px] font-light tracking-tight text-[#111315] leading-tight">
          Welcome back, <span className="font-normal text-[#111315]">{userName}!</span>
        </h1>
      </div>

      {/* Right Controls: Search + Add Widget */}
      <div className="flex items-center gap-3 self-start sm:self-auto relative">
        {/* Search Circular Button (48px) */}
        <button
          onClick={() => {
            setIsSearchOpen(!isSearchOpen);
            if (onSearchClick) onSearchClick();
          }}
          className="w-[46px] h-[46px] sm:w-[48px] sm:h-[48px] rounded-full bg-white hover:bg-[#F3F5F7] border border-[#E2E5E9] flex items-center justify-center text-[#2C333E] shadow-sm hover:-translate-y-[1px] hover:shadow transition-all cursor-pointer"
          aria-label="Search dashboard"
        >
          <Search size={18} strokeWidth={2} />
        </button>

        {/* Add Widget Pill Button (115px × 48px) */}
        <div className="relative">
          <button
            onClick={() => setIsWidgetOpen(!isWidgetOpen)}
            className="h-[46px] sm:h-[48px] px-5 rounded-full bg-white hover:bg-[#F3F5F7] border border-[#E2E5E9] flex items-center gap-2 text-sm font-medium text-[#111315] shadow-sm hover:-translate-y-[1px] hover:shadow transition-all cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} className={isWidgetOpen ? "rotate-45 transition-transform" : "transition-transform"} />
            <span>Add widget</span>
          </button>

          {/* Interactive Widget Dropdown Panel */}
          {isWidgetOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-[#E2E5E9] shadow-2xl p-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#F0F2F5] mb-2">
                <span className="text-xs font-semibold text-[#111315]">Customize Widgets</span>
                <button
                  onClick={() => setIsWidgetOpen(false)}
                  className="text-[#8C93A0] hover:text-[#111315] p-1 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-1">
                {widgets.map((widget) => {
                  const Icon = widget.icon;
                  return (
                    <button
                      key={widget.id}
                      onClick={() => toggleWidget(widget.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        widget.enabled ? "bg-[#F5F7F9] text-[#111315]" : "text-[#717886] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-black/5 flex items-center justify-center text-[#111315]">
                          <Icon size={13} />
                        </div>
                        <span className="font-medium">{widget.title}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                          widget.enabled ? "bg-[#111315] border-[#111315] text-white" : "border-[#D5D9DF]"
                        }`}
                      >
                        {widget.enabled && <Check size={11} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Search Popover */}
        {isSearchOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-[#E2E5E9] shadow-2xl p-3 z-50 animate-fadeIn">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-3 text-[#8C93A0]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions, receipts, slots..."
                className="w-full pl-9 pr-8 py-2 bg-[#F5F7F8] rounded-xl text-xs text-[#111315] focus:outline-none focus:ring-1 focus:ring-[#111315]"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-2.5 top-2.5 text-[#8C93A0] hover:text-[#111315] cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
