"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  companyKey: string;
  quote: string;
  name: string;
  roleCompany: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    companyKey: "Nashik APMC",
    quote:
      "Earlier we waited 14 to 18 hours in tractor queues outside the mandi gate. With Agrovia slot booking, I arrived at my allotted 10 AM window and finished unloading in 45 minutes.",
    name: "Rameshwar Patil",
    roleCompany: "Farmer, Nashik APMC",
    image: "/images/avatar-2.jpg",
  },
  {
    id: "2",
    companyKey: "Pune APMC",
    quote:
      "Managing daily grain arrivals used to cause massive road bottlenecks. The digital token system organized our yard capacity and doubled our daily procurement throughput.",
    name: "Sunita Deshmukh",
    roleCompany: "Procurement Officer, Pune APMC",
    image: "/images/avatar-3.jpg",
  },
  {
    id: "3",
    companyKey: "Karnal Hub",
    quote:
      "The live price radar helped me compare rates across nearby mandis. I booked a slot where MSP purchase was active and saved ₹180 per quintal without any middleman hassle.",
    name: "Balwinder Singh",
    roleCompany: "Wheat Producer, Karnal Hub",
    image: "/images/avatar-4.jpg",
  },
  {
    id: "4",
    companyKey: "Indore Mandi",
    quote:
      "We now verify farmer Aadhaar records and weighbridge tokens with a single QR scan at the entrance, ensuring complete transparency and fast direct settlements.",
    name: "Vijay Anand",
    roleCompany: "Secretary, Indore Mandi",
    image: "/images/avatar-1.jpg",
  },
];

const companyFilters = [
  "Nashik APMC",
  "Pune APMC",
  "Karnal Hub",
  "Indore Mandi",
  "Guntur APMC",
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleSelectCompany = (company: string) => {
    const foundIndex = testimonials.findIndex((t) => t.companyKey === company);
    if (foundIndex !== -1) {
      setCurrentIndex(foundIndex);
    }
  };

  return (
    <section className="w-full bg-[#FCFCFA] px-6 sm:px-8 md:px-12 lg:px-16 pt-8 pb-20 md:pb-28">
      <div className="max-w-7xl mx-auto">
        {/* Top Pill Label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] shadow-xs text-xs font-medium text-[#0B2D1B] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>Testimonials</span>
        </div>

        {/* Two-Column Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10 md:mb-12">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.1] tracking-tight text-[#0B2D1B]">
              <span className="block font-medium">Real Stories Shared</span>
              <span className="block font-editorial italic font-normal text-[#0B2D1B] mt-1">
                by Farmers & Mandis
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pt-2 flex flex-col justify-between h-full gap-4">
            <p className="text-sm sm:text-base text-[#5A6C5F] leading-relaxed font-normal max-w-[480px]">
              Hear directly from farmers and mandi administrators who
              eliminated hours of waiting time with our digital queue management
              system.
            </p>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full bg-white border border-[#E0E0DB] hover:border-[#0B2D1B] flex items-center justify-center text-[#0B2D1B] shadow-xs hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <ArrowLeft size={17} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full bg-white border border-[#E0E0DB] hover:border-[#0B2D1B] flex items-center justify-center text-[#0B2D1B] shadow-xs hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonial Cards Carousel View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-8">
          {[0, 1].map((offset) => {
            const itemIndex = (currentIndex + offset) % testimonials.length;
            const item = testimonials[itemIndex];

            return (
              <div
                key={`${item.id}-${offset}`}
                className="bg-[#F4F4F2] rounded-[22px] p-6 sm:p-8 md:p-9 flex flex-col justify-between border border-black/5 shadow-xs transition-all duration-500 hover:shadow-md min-h-[310px]"
              >
                {/* Quote & Oversized Pale Quote Icon */}
                <div className="relative mb-6">
                  <Quote
                    size={46}
                    className="text-[#0B2D1B]/10 absolute -top-3 -left-2 rotate-180 pointer-events-none"
                  />
                  <p className="relative z-10 text-sm sm:text-base md:text-[16.5px] text-[#23382B] leading-relaxed font-normal pt-4">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Bottom Metadata & Farmer Portrait */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-black/5">
                  <div>
                    <h3 className="text-base font-semibold text-[#0B2D1B]">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#6B7D72] mt-0.5">
                      {item.roleCompany}
                    </p>
                    <button className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B2D1B] hover:text-[#059669] mt-2 transition-colors cursor-pointer">
                      <span>Read case study</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Farmer Photo */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Company Filter List */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 pt-2">
          {companyFilters.map((company) => {
            const isSelected = testimonials[currentIndex]?.companyKey === company;
            return (
              <button
                key={company}
                onClick={() => handleSelectCompany(company)}
                className={`text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer pb-1 border-b-2 ${
                  isSelected
                    ? "text-[#0B2D1B] border-[#0B2D1B] font-semibold"
                    : "text-[#8A9B8F] border-transparent hover:text-[#0B2D1B]"
                }`}
              >
                {company}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
