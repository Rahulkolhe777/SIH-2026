"use client";

import React, { useEffect, useRef, useState } from "react";

interface StatItem {
  numericValue: number;
  suffix: string;
  decimals?: number;
  label: string;
}

const stats: StatItem[] = [
  {
    numericValue: 1.5,
    suffix: "M+",
    decimals: 1,
    label: "Slot Bookings Managed",
  },
  {
    numericValue: 500,
    suffix: "+",
    decimals: 0,
    label: "APMC Mandis Connected",
  },
  {
    numericValue: 85,
    suffix: "%",
    decimals: 0,
    label: "Queue Congestion Reduced",
  },
  {
    numericValue: 750,
    suffix: "K+",
    decimals: 0,
    label: "Farmers Served Seamlessly",
  },
];

export default function Statistics() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCountUp();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCountUp = () => {
    const duration = 1400; // ms
    const frameRate = 30; // ms per frame
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = easeOutCubic(frame / totalFrames);

      setCounts(
        stats.map((s) => Number((s.numericValue * progress).toFixed(s.decimals || 0)))
      );

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCounts(stats.map((s) => s.numericValue));
      }
    }, frameRate);
  };

  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FCFCFA] px-6 sm:px-8 md:px-12 lg:px-16 pt-2 pb-16 md:pb-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((item, index) => {
            const currentCount = counts[index];
            const displayValue =
              item.decimals && item.decimals > 0
                ? currentCount.toFixed(item.decimals)
                : Math.round(currentCount).toString();

            return (
              <div
                key={item.label}
                className="bg-[#F4F4F2] hover:bg-[#ecece7] transition-all duration-300 rounded-[18px] p-6 sm:p-7 md:p-8 flex flex-col items-center justify-center text-center shadow-xs border border-black/5 hover:-translate-y-1 min-h-[145px] md:min-h-[160px]"
              >
                <div className="text-3xl sm:text-4xl md:text-[44px] font-bold text-[#0B2D1B] tracking-tight leading-none mb-2 select-none">
                  {displayValue}
                  {item.suffix}
                </div>
                <p className="text-xs sm:text-sm text-[#5A6C5F] font-medium leading-snug">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
