"use client";

import React from "react";
import Image from "next/image";
import {
  Sprout,
  ArrowUpRight,
  ArrowUp,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5173";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full relative z-70 bg-[#05160C] text-white rounded-t-[36px] md:rounded-t-[50px] -mt-10 md:-mt-14 section-stack-shadow border-t border-white/10 overflow-hidden font-sans selection:bg-[#C8F52F] selection:text-[#0B2D1B]">
      {/* Background Hero Wheat Layer with Cinematic Dark Forest Lighting */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <Image
          src="/images/hero-wheat.jpg"
          alt="Agrovia Wheat Fields"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05160C] via-[#05160C]/90 to-[#030d07]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,245,47,0.15)_0%,_transparent_60%)]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pt-16 md:pt-20 pb-12">
        
        {/* Top Feature CTA Card */}
        <div className="bg-white/[0.04] border border-white/15 backdrop-blur-2xl rounded-[32px] md:rounded-[40px] p-8 sm:p-12 md:p-14 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-2xl mb-16">
          <div className="space-y-3.5 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8F52F]/15 border border-[#C8F52F]/30 text-[#C8F52F] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#C8F52F] animate-pulse" />
              <span>Smart APMC Mandi Network</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white leading-[1.08]">
              <span>Zero Waiting Time. </span>
              <span className="block font-editorial italic font-normal text-[#C8F52F]">
                Guaranteed Fair Mandi Prices.
              </span>
            </h2>

            <p className="text-white/80 text-sm sm:text-base font-light leading-relaxed">
              Book digital unloading slots, track weighbridge queues in real-time, and receive instant DBT payments without gate congestion.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
            <a
              href={`${appUrl}/register`}
              className="group inline-flex items-center justify-center gap-2.5 bg-[#C8F52F] hover:bg-[#b8e826] active:scale-98 text-[#0B2D1B] font-semibold px-7 py-4 rounded-full text-sm sm:text-[15px] transition-all duration-300 shadow-lg shadow-black/30 hover:shadow-[#C8F52F]/25 cursor-pointer"
            >
              <span>Book Mandi Slot</span>
              <ArrowUpRight
                size={18}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <a
              href={`${appUrl}/login`}
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-98 backdrop-blur-md border border-white/30 text-white font-medium px-7 py-4 rounded-full text-sm sm:text-[15px] transition-all duration-300 cursor-pointer hover:border-white"
            >
              <span>Mandi Portal</span>
            </a>
          </div>
        </div>

        {/* 4-Column Navigation Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10 text-left">
          
          {/* Column 1: Brand Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C8F52F] text-[#0B2D1B] flex items-center justify-center shadow-lg shadow-[#C8F52F]/20 font-bold">
                <Sprout size={22} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white tracking-tight leading-tight">Agrovia</span>
                <span className="text-[10px] text-[#C8F52F] font-semibold tracking-wider uppercase">Smart Mandi Ecosystem</span>
              </div>
            </div>

            <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">
              Transforming traditional agricultural yards with automated gate QR verification, digital token scheduling, and transparent MSP price discovery.
            </p>

            <div className="inline-flex items-center gap-2 p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white/80">
              <ShieldCheck size={16} className="text-[#C8F52F]" />
              <span>e-NAM & Ministry of Agriculture Aligned</span>
            </div>
          </div>

          {/* Column 2: Platform Links (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Platform Services</h3>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <a href={`${appUrl}/login`} className="hover:text-[#C8F52F] transition-colors flex items-center gap-1.5">
                  <span>Farmer Unloading Portal</span>
                  <ExternalLink size={11} className="text-white/40" />
                </a>
              </li>
              <li>
                <a href={`${appUrl}/login`} className="hover:text-[#C8F52F] transition-colors flex items-center gap-1.5">
                  <span>APMC Gate Operator Console</span>
                  <ExternalLink size={11} className="text-white/40" />
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#C8F52F] transition-colors">
                  Digital QR Token Pass Flow
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-[#C8F52F] transition-colors">
                  Live Weighbridge Integration
                </a>
              </li>
              <li>
                <a href="#statistics" className="hover:text-[#C8F52F] transition-colors">
                  APMC Mandi Price Index
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Commodities (2.5 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Key Commodities</h3>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li className="hover:text-[#C8F52F] transition-colors cursor-pointer">Sharbati Wheat (Grade A)</li>
              <li className="hover:text-[#C8F52F] transition-colors cursor-pointer">Yellow Soybean</li>
              <li className="hover:text-[#C8F52F] transition-colors cursor-pointer">Basmati Rice 1121</li>
              <li className="hover:text-[#C8F52F] transition-colors cursor-pointer">Mustard & Oilseeds</li>
              <li className="hover:text-[#C8F52F] transition-colors cursor-pointer">Gram / Chana & Pulses</li>
            </ul>
          </div>

          {/* Column 4: Helpdesk & Support (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Yard Helpdesk</h3>
            <div className="space-y-3 text-xs text-white/70">
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#C8F52F] shrink-0" />
                <span>Toll-Free: 1800-425-1555</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#C8F52F] shrink-0" />
                <span>support@agrovia.in</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-[#C8F52F] shrink-0 mt-0.5" />
                <span>Central APMC Tech Hub, Indore Mandi Yard #01, M.P.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Status & Back-to-Top Button */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            © {new Date().getFullYear()} Agrovia Cloud Technologies. All rights reserved.
          </div>

          {/* Live System Uptime Indicator */}
          <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-white/80 font-medium">All 142 Mandi Gateways Operational (99.98% Uptime)</span>
          </div>

          {/* Back to Top */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
