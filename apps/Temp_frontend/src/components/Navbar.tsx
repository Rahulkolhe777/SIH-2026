import React from "react";
import type { User } from "../types/mandi.types";
import { IconShield, IconRefresh, IconStar } from "./Icons";

interface NavbarProps {
  user: User | null;
  useMock: boolean;
  onToggleMock: () => void;
  onLogout: () => void;
  apiConnected: boolean;
  onTestConnection: () => void;
}

export function Navbar({
  user,
  useMock,
  onToggleMock,
  onLogout,
  apiConnected,
  onTestConnection,
}: NavbarProps) {
  return (
    <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-950/40">
          🌾
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">AgriMandi Portal</h1>
            <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">
              Mandi Operator
            </span>
          </div>
          <p className="text-xs text-zinc-400">SIH 2026 • Real-time Slot & Arrival Management</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Backend Status & Mock Toggle */}
        <div className="flex items-center gap-2 bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800 text-xs">
          <span className="text-zinc-400">Backend:</span>
          <button
            onClick={onTestConnection}
            title="Click to re-ping backend (http://localhost:4000/health)"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className={apiConnected ? "text-emerald-400 font-medium" : "text-amber-400"}>
              {apiConnected ? "Connected (Port 4000)" : "Offline / Standalone"}
            </span>
            <IconRefresh className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
          </button>
          <span className="text-zinc-700">|</span>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useMock}
              onChange={onToggleMock}
              className="accent-emerald-500 rounded cursor-pointer"
            />
            <span className="text-zinc-300">Mock Mode</span>
          </label>
        </div>

        {/* User profile & Rating / Logout */}
        {user ? (
          <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
            {/* Rating pill */}
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg text-amber-400 text-xs font-bold">
              <IconStar className="w-3.5 h-3.5 text-amber-400" />
              <span>{user.rating ?? 4.8}</span>
            </div>

            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-zinc-200">{user.name}</div>
              <div className="text-[11px] text-zinc-400">{user.mandiName || user.email}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-emerald-400 text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={onLogout}
              className="text-xs text-zinc-400 hover:text-rose-400 transition-colors px-2.5 py-1 rounded bg-zinc-800/60 hover:bg-rose-950/40 border border-zinc-700/50 hover:border-rose-800/50"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-400 flex items-center gap-1">
              <IconShield className="w-3.5 h-3.5" /> Demo Mode
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
