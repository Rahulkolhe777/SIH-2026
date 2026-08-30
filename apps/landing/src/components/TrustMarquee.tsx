"use client";

import React from "react";

// Brand Logo Components representing official agricultural & APMC procurement networks
const brands = [
  {
    name: "e-NAM",
    render: () => (
      <div className="flex items-center gap-2 font-bold tracking-wider text-base text-[#475b4f]">
        <span>e-NAM</span>
        <svg className="w-4 h-4 text-[#475b4f]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 12l10 10 10-10L12 2zm0 3.5l6.5 6.5-6.5 6.5-6.5-6.5L12 5.5z" />
        </svg>
      </div>
    ),
  },
  {
    name: "APMC MANDI",
    render: () => (
      <div className="flex items-center gap-2 font-black tracking-tight text-base text-[#475b4f]">
        <svg className="w-5 h-5 text-[#475b4f]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 14l3-6 4 2 2-4 3 2 4-2v6l-4 3-4-1-4 3-4-3z" />
        </svg>
        <span className="uppercase">APMC MANDI</span>
      </div>
    ),
  },
  {
    name: "DoCA INDIA",
    render: () => (
      <div className="flex items-center gap-1.5 font-bold text-base tracking-widest text-[#475b4f]">
        <div className="w-3.5 h-3.5 rounded-sm bg-[#475b4f]" />
        <span>DoCA INDIA</span>
      </div>
    ),
  },
  {
    name: "AGMARKNET",
    render: () => (
      <div className="flex items-center gap-1.5 font-semibold text-base text-[#475b4f]">
        <svg className="w-4 h-4 text-[#475b4f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v4m0 8v4" />
        </svg>
        <span>AGMARKNET</span>
      </div>
    ),
  },
  {
    name: "NAFED",
    render: () => (
      <div className="flex items-center gap-1.5 font-extrabold text-base tracking-tight text-[#475b4f]">
        <svg className="w-4 h-4 text-[#475b4f]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4h4l8 16h-4L4 4z" />
          <circle cx="18" cy="6" r="2" />
        </svg>
        <span>NAFED</span>
      </div>
    ),
  },
  {
    name: "FCI",
    render: () => (
      <div className="flex items-center gap-1 font-bold italic text-base text-[#475b4f]">
        <span className="text-lg">🌾</span>
        <span className="not-italic font-semibold">FCI HUB</span>
      </div>
    ),
  },
  {
    name: "KISAN SEVA",
    render: () => (
      <div className="flex items-center font-bold text-base tracking-wider text-[#475b4f]">
        <span className="uppercase">KISAN SEVA</span>
      </div>
    ),
  },
  {
    name: "MAHADBT",
    render: () => (
      <div className="flex items-center font-black text-base tracking-widest text-[#475b4f]">
        <span className="uppercase">MAHADBT</span>
      </div>
    ),
  },
];

export default function TrustMarquee() {
  return (
    <section className="w-full bg-white border-b border-[#EBEBE6] py-7 md:py-9 px-6 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12">
        {/* Left Trust Statement */}
        <div className="shrink-0 max-w-[260px]">
          <p className="text-sm md:text-[15px] leading-snug text-[#5A6C5F]">
            Connected with <strong className="font-bold text-[#0B2D1B]">thousand</strong>
            <br />
            APMC mandis across India
          </p>
        </div>

        {/* Right Infinite Scrolling Brand Marquee */}
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex items-center gap-12 md:gap-16">
            {/* First Set of Logos */}
            {brands.map((brand, i) => (
              <div
                key={`brand-1-${i}`}
                className="opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-default shrink-0"
              >
                {brand.render()}
              </div>
            ))}

            {/* Duplicated Set for Seamless Infinite Loop */}
            {brands.map((brand, i) => (
              <div
                key={`brand-2-${i}`}
                className="opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-default shrink-0"
              >
                {brand.render()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
