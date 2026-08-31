"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface SolutionCard {
  id: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const solutions: SolutionCard[] = [
  {
    id: 1,
    title: "Guaranteed Slot Scheduling",
    description:
      "Reserve arrival windows in advance, avoiding multi-day tractor queues and preserving fresh crop quality.",
    image: "/images/solution-crop-mgmt.jpg",
    imageAlt: "Farmer managing harvest produce for mandi delivery",
  },
  {
    id: 2,
    title: "QR Verification & Fast Pass",
    description:
      "Gatekeepers scan farmer QR tokens instantly for swift gate entry, weighbridge tracking, and unloading.",
    image: "/images/solution-automation.jpg",
    imageAlt: "Young farmer using QR token for mandi check-in",
  },
  {
    id: 3,
    title: "Live Price & Distance Radar",
    description:
      "Compare live crop rates, travel distance, and crowd levels across multiple mandis to maximize profits.",
    image: "/images/solution-sustainable.jpg",
    imageAlt: "Experienced farmer checking crop market prices",
  },
  {
    id: 4,
    title: "Instant SMS & Status Alerts",
    description:
      "Receive automated notifications for slot approval, live queue status, and direct procurement settlement.",
    image: "/images/solution-analytics.jpg",
    imageAlt: "Procurement officer tracking live digital queue status",
  },
];

export default function SmartSolutionsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-[#FCFCFA] px-6 sm:px-8 md:px-12 lg:px-16 pt-8 pb-20 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Top Pill Label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] shadow-xs text-xs font-medium text-[#0B2D1B] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>Smart Procurement</span>
        </div>

        {/* Two-Column Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10 md:mb-12">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.1] tracking-tight text-[#0B2D1B]">
              <span className="block font-medium">Smart Solutions for</span>
              <span className="block font-editorial italic font-normal text-[#0B2D1B] mt-1">
                Modern Mandis
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pt-2 flex flex-col justify-between h-full gap-4">
            <p className="text-sm sm:text-base text-[#5A6C5F] leading-relaxed font-normal max-w-[480px]">
              We empower farmers and procurement centers with intelligent slot
              scheduling and real-time data to eliminate truck lines, cut
              spoilage, and streamline payments.
            </p>

            {/* Carousel Arrow Controls */}
            <div className="hidden sm:flex items-center gap-2.5 pt-2">
              <button
                onClick={() => handleScroll("left")}
                aria-label="Previous solution card"
                className="w-10 h-10 rounded-full bg-white border border-[#E0E0DB] hover:border-[#0B2D1B] flex items-center justify-center text-[#0B2D1B] shadow-xs hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <ArrowLeft size={17} />
              </button>
              <button
                onClick={() => handleScroll("right")}
                aria-label="Next solution card"
                className="w-10 h-10 rounded-full bg-white border border-[#E0E0DB] hover:border-[#0B2D1B] flex items-center justify-center text-[#0B2D1B] shadow-xs hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory -mx-2 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {solutions.map((card) => (
            <div
              key={card.id}
              className="group shrink-0 w-[240px] xs:w-[270px] sm:w-[350px] lg:w-[380px] snap-start flex flex-col justify-between transition-all duration-300"
            >
              {/* Image Container with Hover Zoom */}
              <div className="relative w-full h-[220px] xs:h-[260px] sm:h-[380px] lg:h-[410px] rounded-[18px] sm:rounded-[24px] overflow-hidden shadow-sm bg-[#E8EAE6] mb-3.5 sm:mb-5">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  sizes="(max-width: 768px) 270px, 380px"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base sm:text-xl font-medium text-[#0B2D1B] tracking-tight mb-1.5 sm:mb-2">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6C5F] leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
