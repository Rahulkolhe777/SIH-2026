"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function PlatformIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FCFCFA] px-6 sm:px-8 md:px-12 lg:px-16 pt-20 md:pt-28 pb-20 md:pb-28"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Pill Label */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] shadow-xs text-xs font-medium text-[#0B2D1B] mb-8 md:mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>DoCA Mandi Initiative</span>
        </div>

        {/* Large Editorial Statement with Embedded Inline Image */}
        <div
          className={`max-w-[1120px] transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] leading-[1.2] md:leading-[1.18] tracking-tight font-normal text-[#0B2D1B]">
            <span className="text-[#0B2D1B] font-medium">
              Our platform is built to support farmers, APMC mandis, and
              procurement centers
            </span>{" "}
            <span className="text-[#6B7D72]">by delivering</span>{" "}
            {/* Embedded Pill-Shaped Image */}
            <span className="inline-flex items-center align-middle mx-1 sm:mx-2 w-[80px] h-[34px] sm:w-[100px] sm:h-[40px] md:w-[115px] md:h-[46px] rounded-full overflow-hidden border border-black/10 shadow-sm relative -translate-y-0.5 hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/inline-drone.jpg"
                alt="Smart mandi digital queue sensor and scanner"
                fill
                className="object-cover object-center"
                sizes="120px"
              />
            </span>{" "}
            <span className="text-[#0B2D1B] font-medium">
              practical tools that
            </span>{" "}
            <span className="text-[#6B7D72]">
              eliminate long truck queues while ensuring fair crop pricing.
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
}
