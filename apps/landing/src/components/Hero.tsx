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
      className="relative w-full h-[100dvh] min-h-[580px] sm:min-h-[720px] md:min-h-[800px] max-h-[960px] overflow-hidden flex flex-col justify-between text-white"
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
      <div className="relative z-20 w-full px-5 sm:px-8 md:px-12 lg:px-16 mt-auto pb-10 sm:pb-12 md:pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-[780px]">
            {/* Main Heading */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-normal leading-[1.05] sm:leading-[1.0] tracking-tight text-white select-none">
              <span className="block font-medium">Smart Mandi for</span>
              <span className="block mt-1 sm:mt-1.5">
                Zero{" "}
                <span className="font-editorial italic font-normal text-white drop-shadow-sm tracking-normal">
                  Congestion
                </span>
              </span>
            </h1>

            {/* Subtitle / Copy */}
            <p className="mt-3.5 sm:mt-5 text-white/85 text-xs sm:text-base md:text-[17px] leading-relaxed max-w-[560px] font-light">
              Book procurement slots, track real-time mandi queues, and verify
              digital tokens in one transparent platform built for fair prices,
              instant verification, and zero waiting time.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Button 1: Book Mandi Slot */}
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/register`}
                className="group inline-flex items-center justify-center gap-2 bg-[#C8F52F] hover:bg-[#b8e826] active:scale-98 text-[#0B2D1B] font-semibold px-5 sm:px-7 py-3 sm:py-4 rounded-full text-xs sm:text-[15px] transition-all duration-300 shadow-lg shadow-black/25 hover:shadow-[#C8F52F]/25 cursor-pointer"
              >
                <span>Book Mandi Slot</span>
                <ArrowUpRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              {/* Button 2: Mandi Portal */}
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/login`}
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-98 backdrop-blur-md border border-white/40 text-white font-medium px-5 sm:px-7 py-3 sm:py-4 rounded-full text-xs sm:text-[15px] transition-all duration-300 hover:-translate-y-0.5 hover:border-white shadow-sm cursor-pointer"
              >
                Mandi Portal
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Bottom Bar */}
      <div className="relative z-20 w-full px-5 sm:px-8 md:px-12 lg:px-16 pb-6 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="pt-3.5 sm:pt-4 border-t border-white/15 flex items-center justify-between">
            {/* Left: SCROLL Indicator */}
            <div className="flex items-center gap-2 text-white/80 text-[11px] sm:text-xs tracking-widest uppercase font-medium">
              <span>SCROLL</span>
              <ArrowDown size={13} className="animate-bobbing text-white/90" />
            </div>

            {/* Right: Operational Mandis Indicator */}
            <div className="flex items-center gap-2 text-white/80 text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-light">Live Gateways Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
