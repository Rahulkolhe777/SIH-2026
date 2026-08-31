"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Minus, QrCode, TrendingUp, Truck, Bot } from "lucide-react";

interface AccordionItem {
  id: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: React.ElementType;
}

const accordionData: AccordionItem[] = [
  {
    id: 1,
    title: "Instant Slot Booking & QR Token",
    description:
      "Farmers select nearby APMC mandis, choose crop types and quantities, and receive an instant verified digital QR token with designated entry time slots.",
    image: "/images/accordion-1.jpg",
    imageAlt: "Farmer booking mandi slot on digital tablet with tractor in background",
    icon: QrCode,
  },
  {
    id: 2,
    title: "Real-Time Mandi Crowd & Price Radar",
    description:
      "Live crowd congestion monitoring and transparent crop price tracking across neighboring mandis to help farmers choose optimal delivery centers.",
    image: "/images/accordion-2.jpg",
    imageAlt: "Farmers checking real time crop prices and mandi congestion",
    icon: TrendingUp,
  },
  {
    id: 3,
    title: "Gatekeeper QR & Bay Management",
    description:
      "Mandi staff verify farmer tokens instantly at gates, automate weighbridge queue assignments, and monitor unloading bay turnaround times in real time.",
    image: "/images/accordion-3.jpg",
    imageAlt: "Automated mandi weighbridge and truck queue management",
    icon: Truck,
  },
  {
    id: 4,
    title: "AI Voice & Multilingual Chatbot",
    description:
      "Multilingual AI assistant allows farmers to check open booking slots, verify live mandi prices, and schedule bookings via simple voice or chat in Marathi, Hindi, and English.",
    image: "/images/accordion-4.jpg",
    imageAlt: "Multilingual AI chatbot for farmer mandi booking",
    icon: Bot,
  },
];

export default function SolutionsAccordion() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Intersection observer to only auto-rotate when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto rotation every 4.5 seconds if in view and not paused by user
  useEffect(() => {
    if (!isInView || isUserInteracting) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % accordionData.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isInView, isUserInteracting]);

  const handleSelectAccordion = (index: number) => {
    setActiveIndex(index);
    setIsUserInteracting(true);

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    // Resume auto-rotation after 8s of inactivity
    resumeTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 8000);
  };

  return (
    <section
      id="solutions"
      ref={sectionRef}
      className="w-full bg-[#FCFCFA] px-4 sm:px-8 md:px-12 lg:px-16 pt-4 pb-16 sm:pb-20 md:pb-28"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Pill Label */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white border border-[#E5E7EB] shadow-xs text-xs font-medium text-[#0B2D1B] mb-5 sm:mb-6">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>About Agrovia Mandi</span>
        </div>

        {/* Two-Column Heading Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start mb-8 sm:mb-12 md:mb-16">
          {/* Left Heading */}
          <div className="lg:col-span-7">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.1] sm:leading-[1.08] tracking-tight text-[#0B2D1B]">
              <span className="block font-medium">Smart Mandi Solutions</span>
              <span className="block font-editorial italic font-normal text-[#0B2D1B] mt-1">
                That Deliver Zero Waiting
              </span>
            </h2>
          </div>

          {/* Right Description */}
          <div className="lg:col-span-5 lg:pt-2">
            <p className="text-xs sm:text-base text-[#5A6C5F] leading-relaxed font-normal max-w-[480px]">
              Our intelligent queue and slot booking system helps mandis
              eliminate traffic congestion, manage daily procurement volumes, and
              empower farmers with guaranteed arrival times.
            </p>
          </div>
        </div>

        {/* Accordion + Image Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          {/* Left Accordion Column */}
          <div className="lg:col-span-6 flex flex-col gap-2.5 sm:gap-3.5 justify-start">
            {accordionData.map((item, index) => {
              const isActive = activeIndex === index;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectAccordion(index)}
                  className={`w-full rounded-[14px] sm:rounded-[16px] transition-all duration-300 cursor-pointer overflow-hidden border ${
                    isActive
                      ? "bg-[#F4F4F2] border-[#0B2D1B]/15 shadow-sm p-3.5 sm:p-4 md:p-5"
                      : "bg-[#F4F4F2] hover:bg-[#ecece8] border-transparent p-3 sm:p-4 md:p-4.5"
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-2.5 sm:gap-3">
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                      {/* Icon Box */}
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-colors duration-300 shrink-0 ${
                          isActive
                            ? "bg-[#C8F52F] text-[#0B2D1B]"
                            : "bg-[#EAEAE5] text-[#5A6C5F]"
                        }`}
                      >
                        <Icon size={17} className="sm:w-[19px] sm:h-[19px]" strokeWidth={2.2} />
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-base md:text-[17px] font-medium text-[#0B2D1B] tracking-tight truncate">
                        {item.title}
                      </h3>
                    </div>

                    {/* Plus / Minus Indicator */}
                    <div className="text-[#0B2D1B] shrink-0 p-0.5 sm:p-1">
                      {isActive ? (
                        <Minus size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
                      ) : (
                        <Plus size={16} strokeWidth={2.5} className="sm:w-[18px] sm:h-[18px] text-[#7A8B7F]" />
                      )}
                    </div>
                  </div>

                  {/* Expanding Description Panel */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out ${
                      isActive
                        ? "grid-rows-[1fr] opacity-100 mt-2.5 sm:mt-3.5"
                        : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="bg-white rounded-xl p-3 sm:p-4 md:p-4.5 text-xs sm:text-sm md:text-[14.5px] text-[#5A6C5F] leading-relaxed border border-black/5 shadow-xs">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Dynamic Image Display */}
          <div className="lg:col-span-6 relative min-h-[260px] xs:min-h-[300px] sm:min-h-[420px] lg:min-h-full h-[280px] xs:h-[340px] lg:h-auto rounded-2xl md:rounded-[24px] overflow-hidden shadow-md bg-[#E8EAE6]">
            {accordionData.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={item.id}
                  className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${
                    isActive
                      ? "opacity-100 scale-100 z-10 translate-x-0"
                      : "opacity-0 scale-[1.03] z-0 pointer-events-none translate-x-3"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 650px"
                    className="object-cover object-center"
                  />
                  {/* Subtle vignette overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
