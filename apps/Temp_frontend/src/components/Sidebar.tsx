import React from "react";
import { IconDashboard, IconSlots, IconSettings, IconTerminal } from "./Icons";

export type TabType = "dashboard" | "slots" | "settings" | "api-tester";

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingCount?: number;
}

export function Sidebar({ activeTab, onSelectTab, pendingCount = 0 }: SidebarProps) {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: "dashboard",
      label: "Mandi Dashboard",
      icon: <IconDashboard className="w-4 h-4" />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: "slots",
      label: "Manage Slots",
      icon: <IconSlots className="w-4 h-4" />,
    },
    {
      id: "settings",
      label: "Mandi & KYC Settings",
      icon: <IconSettings className="w-4 h-4" />,
    },
    {
      id: "api-tester",
      label: "Backend API Console",
      icon: <IconTerminal className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-61px)] p-4">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
          Operations
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-emerald-900 text-emerald-100" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick stats footer */}
      <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>APMC Terminal</span>
          <span className="text-emerald-400 font-semibold">Active</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full w-3/4" />
        </div>
        <div className="text-[10px] text-zinc-500">System Ready • Automated Weighbridge Sync</div>
      </div>
    </aside>
  );
}
