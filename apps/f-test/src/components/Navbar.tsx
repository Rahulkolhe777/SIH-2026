import React from "react";
import { Sprout, LogOut, User, LogIn, UserPlus } from "lucide-react";
import { Button } from "./ui/button.js";
import { Badge } from "./ui/badge.js";
import { TokenState } from "../interfaces/index.js";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  tokenState: TokenState;
  onLogout: () => void;
}

export function Navbar({
  currentPage,
  onNavigate,
  tokenState,
  onLogout,
}: NavbarProps): React.JSX.Element {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => onNavigate(tokenState.accessToken ? "dashboard" : "home")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              KrishiSetu
            </span>
            <span className="ml-1 text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-semibold">SIH</span>
          </div>
        </div>

        {/* Navigation links & user controls */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {tokenState.accessToken ? (
            <>
              <Button
                variant={currentPage === "dashboard" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onNavigate("dashboard")}
              >
                Dashboard
              </Button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Badge variant="emerald" className="hidden sm:inline-flex gap-1 font-medium">
                  <User className="h-3 w-3" />
                  {tokenState.role || "User"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                variant={currentPage === "home" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onNavigate("home")}
              >
                Home
              </Button>
              <Button
                variant={currentPage === "login" ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate("login")}
              >
                <LogIn className="h-4 w-4 mr-1" />
                Sign In
              </Button>
              <Button
                variant={currentPage === "register" ? "emerald" : "outline"}
                size="sm"
                onClick={() => onNavigate("register")}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Get Started
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
