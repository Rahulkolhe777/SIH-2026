"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowDown, Star } from "lucide-react";
import Navbar from "./Navbar";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[720px] max-h-[940px] md:min-h-[800px] overflow-hidden flex flex-col justify-between text-white"
    >
      {/* Full-Bleed Background Image with subtle smooth parallax */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
        style={{
          transform: `translateY(${scrollY * 0.12}px) scale(1.05)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <Image
          src="/images/hero-wheat.jpg"
          alt="Lush green wheat field with stalks in foreground"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Cinematic Lighting Overlays */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/40 via-black/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[450px] bg-gradient-to-t from-[#05160C]/95 via-[#05160C]/45 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(5,22,12,0.35)_100%)] pointer-events-none" />

      {/* Embedded Full-Width Navbar */}
      <Navbar />

      {/* Hero Main Content */}
      <div className="relative z-20 w-full px-6 sm:px-8 md:px-12 lg:px-16 mt-auto pb-12 md:pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-[780px]">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-normal leading-[1.0] tracking-tight text-white select-none">
              <span className="block font-medium">Smart Mandi for</span>
              <span className="block mt-1.5">
                Zero{" "}
                <span className="font-editorial italic font-normal text-white drop-shadow-sm tracking-normal">
                  Congestion
                </span>
              </span>
            </h1>

            {/* Subtitle / Copy */}
            <p className="mt-4 md:mt-5 text-white/85 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-[560px] font-light">
              Book procurement slots, track real-time mandi queues, and verify
              digital tokens in one transparent platform built for fair prices,
              instant verification, and zero waiting time.
            </p>

            {/* Action Buttons */}
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
              {/* Button 1: Book Mandi Slot */}
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/register`}
                className="group inline-flex items-center justify-center gap-2.5 bg-[#C8F52F] hover:bg-[#b8e826] active:scale-98 text-[#0B2D1B] font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm sm:text-[15px] transition-all duration-300 shadow-lg shadow-black/25 hover:shadow-[#C8F52F]/25 cursor-pointer"
              >
                <span>Book Mandi Slot</span>
                <ArrowUpRight
                  size={18}
                  strokeWidth={2.5}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              {/* Button 2: Mandi Portal */}
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/login`}
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-98 backdrop-blur-md border border-white/40 text-white font-medium px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm sm:text-[15px] transition-all duration-300 hover:-translate-y-0.5 hover:border-white shadow-sm cursor-pointer"
              >
                Mandi Portal
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Bottom Bar */}
      <div className="relative z-20 w-full px-6 sm:px-8 md:px-12 lg:px-16 pb-6 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="pt-4 border-t border-white/15 flex items-center justify-between">
            {/* Left: SCROLL Indicator */}
            <div className="flex items-center gap-2 text-white/80 text-xs tracking-widest uppercase font-medium">
              <span>SCROLL</span>
              <ArrowDown size={14} className="animate-bobbing text-white/90" />
            </div>

            {/* Right: Farmer Rating & Avatars */}
            <div className="flex items-center gap-3 bg-black/35 backdrop-blur-md border border-white/15 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
              {/* Star and Score */}
              <div className="flex items-center gap-1.5 pr-2 border-r border-white/20">
                <Star size={14} className="fill-[#FBBF24] text-[#FBBF24]" />
                <span className="text-white font-semibold text-xs sm:text-sm">4.9</span>
              </div>

              {/* Overlapping Avatars */}
              <div className="flex items-center -space-x-2">
                <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border-2 border-white/90 shadow-sm">
                  <Image
                    src="/images/avatar-1.jpg"
                    alt="Farmer Anita Patel"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border-2 border-white/90 shadow-sm">
                  <Image
                    src="/images/avatar-2.jpg"
                    alt="Agronomist Liang Chen"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border-2 border-white/90 shadow-sm">
                  <Image
                    src="/images/avatar-3.jpg"
                    alt="Crops Manager Sarah O'Connell"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border-2 border-white/90 shadow-sm">
                  <Image
                    src="/images/avatar-4.jpg"
                    alt="Soil Scientist David Adebayo"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Farmers Count */}
              <span className="text-white/90 text-xs sm:text-sm font-medium pl-1">
                10k+ Mandi Farmers
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
