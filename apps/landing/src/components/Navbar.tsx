"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

const navItems = [
  "Home",
  "About Platform",
  "Mandi Solutions",
  "Procurement",
  "Farmer Stories",
];

export default function Navbar({ activeTab = "Home", onSelectTab }: NavbarProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (item: string) => {
    setCurrentTab(item);
    if (onSelectTab) onSelectTab(item);
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative z-30 w-full pt-6 md:pt-8 px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          className="flex items-center gap-2.5 group cursor-pointer"
          aria-label="Agrovia Home"
        >
          <div className="w-8 h-8 md:w-9 md:h-9 bg-[#C8F52F] rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
            {/* Stylized Leaf / Agri Mark */}
            <svg
              className="w-5 h-5 text-[#0B2D1B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 16h10" />
              <path d="M9 12h10" />
              <path d="M5 8h10" />
            </svg>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">
            Agrovia Mandi
          </span>
        </a>

        {/* Desktop Center Navigation Pill */}
        <nav
          className="hidden md:flex items-center bg-black/25 backdrop-blur-md border border-white/15 rounded-full p-1 shadow-lg shadow-black/15"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item;
            return (
              <button
                key={item}
                onClick={() => handleTabClick(item)}
                className={`relative px-4 py-1.5 text-sm rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-white text-[#0B2D1B] font-semibold shadow-sm scale-100"
                    : "text-white/80 hover:text-white font-normal hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/login`}
            className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Sign In
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/register`}
            className="bg-[#C8F52F] text-[#0B2D1B] font-semibold px-5 py-2.5 rounded-full text-sm shadow-md hover:bg-[#b8e624] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            Book Slot
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="max-w-7xl mx-auto md:hidden mt-3 p-4 bg-[#06180E]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl flex flex-col gap-2 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleTabClick(item)}
              className={`text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                currentTab === item
                  ? "bg-[#C8F52F] text-[#0B2D1B] font-semibold"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/login`}
              className="w-full text-center py-2.5 rounded-xl text-sm text-white/90 bg-white/10 font-medium"
            >
              Sign In
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/register`}
              className="w-full bg-[#C8F52F] text-[#0B2D1B] font-semibold py-2.5 rounded-xl text-sm text-center shadow-md"
            >
              Book Slot / Register
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
