"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Layers,
  FileCheck,
  Activity,
  MapPin,
  CloudSun,
  ArrowRight,
} from "lucide-react";

interface TabItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  image: string;
  location: string;
}

const tabs: TabItem[] = [
  {
    id: "overview",
    title: "Slot Booking",
    subtitle: "Digital QR Token",
    icon: Calendar,
    image: "/images/how-it-works-dhaka.jpg",
    location: "Nashik APMC, Maharashtra",
  },
  {
    id: "planning",
    title: "Live Queue",
    subtitle: "Real-Time Traffic",
    icon: Layers,
    image: "/images/accordion-3.jpg",
    location: "Indore APMC, MP",
  },
  {
    id: "control",
    title: "Price Radar",
    subtitle: "Fair MSP Tracking",
    icon: FileCheck,
    image: "/images/accordion-1.jpg",
    location: "Karnal Mandi, Haryana",
  },
  {
    id: "monitor",
    title: "Mandi Control",
    subtitle: "Bay & Weighbridge",
    icon: Activity,
    image: "/images/accordion-2.jpg",
    location: "Guntur APMC, AP",
  },
];

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section className="w-full bg-[#FCFCFA] px-4 sm:px-8 md:px-12 lg:px-16 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Top Pill Label */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white border border-[#E5E7EB] shadow-xs text-xs font-medium text-[#0B2D1B] mb-5 sm:mb-6">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>How It Works</span>
        </div>

        {/* Two-Column Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start mb-8 sm:mb-10 md:mb-12">
          <div className="lg:col-span-7">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.1] tracking-tight text-[#0B2D1B]">
              <span className="block font-medium">Mandi Booking Made</span>
              <span className="block font-editorial italic font-normal text-[#0B2D1B] mt-1">
                Simple and Transparent
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pt-2">
            <p className="text-xs sm:text-base text-[#5A6C5F] leading-relaxed font-normal max-w-[480px]">
              A unified digital platform connecting farmers and mandi officials to
              eliminate waiting times, organize arrivals, and ensure fair MSP
              procurement.
            </p>
          </div>
        </div>

        {/* Four Horizontal Feature Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left p-2.5 sm:p-5 rounded-[14px] sm:rounded-[16px] transition-all duration-300 cursor-pointer border flex items-center sm:items-start gap-2.5 sm:gap-3.5 ${
                  isActive
                    ? "bg-[#F4F4F2] border-[#0B2D1B]/15 shadow-sm -translate-y-0.5"
                    : "bg-[#F4F4F2]/70 hover:bg-[#F4F4F2] border-transparent hover:-translate-y-0.5"
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isActive
                      ? "bg-[#C8F52F] text-[#0B2D1B]"
                      : "bg-[#EAEAE5] text-[#5A6C5F]"
                  }`}
                >
                  <Icon size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-xs sm:text-[15px] tracking-tight truncate ${
                      isActive
                        ? "font-semibold text-[#0B2D1B]"
                        : "font-medium text-[#23382B]"
                    }`}
                  >
                    {tab.title}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#6B7D72] truncate mt-0.5">
                    {tab.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Large Image Panel with Floating Cards */}
        <div className="relative w-full h-[360px] xs:h-[400px] sm:h-[500px] lg:h-[560px] rounded-[20px] sm:rounded-[28px] overflow-hidden shadow-lg bg-[#06180E]">
          {/* Dynamic Background Image */}
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${
                  isActive
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-105 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={tab.image}
                  alt={tab.title}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/25 pointer-events-none" />
              </div>
            );
          })}

          {/* Location Indicator (Top-Left on Mobile, Bottom-Left on Desktop) */}
          <div className="absolute top-3.5 left-3.5 sm:top-auto sm:bottom-8 sm:left-8 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/20 text-white text-[11px] sm:text-sm font-medium shadow-md">
            <MapPin size={13} className="sm:w-[15px] sm:h-[15px] text-[#C8F52F]" />
            <span>{currentTab.location}</span>
          </div>

          {/* Floating Cards (Bottom-Right, Small on Phone) */}
          <div className="absolute bottom-3 right-3 sm:bottom-8 sm:right-8 z-20 flex flex-col gap-2 sm:gap-3 max-w-[205px] xs:max-w-[240px] sm:max-w-[310px] w-full">
            {/* Card 1: Floating Mandi Status Card */}
            <div className="bg-white/95 backdrop-blur-md p-2.5 xs:p-3 sm:p-5 rounded-[14px] sm:rounded-[18px] shadow-xl border border-black/5 text-[#0B2D1B] animate-fadeIn">
              <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2.5">
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center">
                    <CloudSun size={13} className="sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <div>
                    <span className="text-sm xs:text-base sm:text-2xl font-bold tracking-tight">
                      28°C
                    </span>
                  </div>
                </div>
                <span className="text-[9px] sm:text-[11px] font-medium text-[#6B7D72] bg-[#F4F4F2] px-1.5 sm:px-2 py-0.5 rounded-md">
                  Live Hub
                </span>
              </div>

              <p className="hidden xs:block text-[10px] sm:text-xs text-[#5A6C5F] mb-1.5 sm:mb-3">
                Today&apos;s Gate Operations
              </p>

              <div className="grid grid-cols-3 gap-1 sm:gap-2 pt-1.5 sm:pt-2.5 border-t border-[#F0F0EB] text-center">
                <div>
                  <div className="text-[11px] xs:text-xs sm:text-sm font-bold text-[#0B2D1B]">94%</div>
                  <div className="text-[8px] xs:text-[9px] sm:text-[10px] text-[#7A8B7F]">Filled</div>
                </div>
                <div>
                  <div className="text-[11px] xs:text-xs sm:text-sm font-bold text-[#0B2D1B]">15m</div>
                  <div className="text-[8px] xs:text-[9px] sm:text-[10px] text-[#7A8B7F]">Avg Wait</div>
                </div>
                <div>
                  <div className="text-[11px] xs:text-xs sm:text-sm font-bold text-[#0B2D1B]">420 MT</div>
                  <div className="text-[8px] xs:text-[9px] sm:text-[10px] text-[#7A8B7F]">Volume</div>
                </div>
              </div>
            </div>

            {/* Card 2: Floating AI Prediction Card */}
            <div className="bg-white/95 backdrop-blur-md p-2 xs:p-2.5 sm:p-4 rounded-[14px] sm:rounded-[18px] shadow-xl border border-black/5 text-[#0B2D1B]">
              <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <span className="text-[10px] sm:text-xs font-semibold text-[#0B2D1B] truncate">
                  Arrival AI Model
                </span>
                <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[#059669] bg-[#ECFDF5] px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                  Optimal
                </span>
              </div>

              {/* Horizontal Color Bar Indicator */}
              <div className="flex items-center gap-0.5 sm:gap-1 my-1 sm:my-2">
                <div className="h-1 sm:h-1.5 flex-1 rounded-full bg-[#EF4444]" />
                <div className="h-1 sm:h-1.5 flex-1 rounded-full bg-[#F59E0B]" />
                <div className="h-1 sm:h-1.5 flex-1 rounded-full bg-[#FCD34D]" />
                <div className="h-1 sm:h-1.5 flex-1 rounded-full bg-[#86EFAC]" />
                <div className="h-1 sm:h-1.5 flex-1 rounded-full bg-[#10B981]" />
                <div className="h-1 sm:h-1.5 flex-1 rounded-full bg-[#059669]" />
              </div>

              <div className="flex items-center justify-between gap-1.5 sm:gap-2 mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-[#F0F0EB]">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-[#10B981] text-white flex items-center justify-center font-bold text-[8px] sm:text-[10px] shrink-0">
                    AI
                  </div>
                  <span className="text-[9px] sm:text-[11px] text-[#5A6C5F] font-medium truncate">
                    Predicted Zero-Wait Arrival
                  </span>
                </div>
                <ArrowRight size={12} className="sm:w-[14px] sm:h-[14px] text-[#0B2D1B] shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
