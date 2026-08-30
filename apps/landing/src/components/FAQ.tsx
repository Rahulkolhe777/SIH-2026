"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How do farmers book a mandi procurement slot?",
    answer:
      "Farmers choose their preferred APMC mandi, select the crop and quantity, pick an available date and time slot, and instantly receive a digital QR token with their queue number.",
  },
  {
    id: 2,
    question: "How does the real-time queue management system work?",
    answer:
      "Mandis define hourly slot capacities. As farmers arrive, gatekeepers scan QR tokens to push them into an automated digital queue, sending live SMS updates on bay allocation and weighbridge readiness.",
  },
  {
    id: 3,
    question: "Can farmers check crop prices before selecting a mandi?",
    answer:
      "Yes. The platform displays real-time commodity prices, travel distance, and current crowd congestion for all nearby mandis to help farmers choose the most profitable destination.",
  },
  {
    id: 4,
    question: "Is the platform available in regional languages like Marathi and Hindi?",
    answer:
      "Yes. Agrovia Mandi supports multilingual interfaces in English, Hindi, and Marathi with simplified voice and AI chatbot options for non-technical users.",
  },
  {
    id: 5,
    question: "How are mandis and procurement centers verified?",
    answer:
      "All APMC mandis and procurement centers undergo admin verification with official documentation and legal authentication before publishing procurement schedules.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1); // First item open by default

  const toggleFAQ = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-[#FCFCFA] px-6 sm:px-8 md:px-12 lg:px-16 pt-8 pb-24 md:pb-32 flex flex-col items-center">
      {/* Top Pill Label */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] shadow-xs text-xs font-medium text-[#0B2D1B] mb-6">
        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
        <span>FAQ</span>
      </div>

      {/* Centered Heading */}
      <div className="text-center max-w-[620px] mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] leading-[1.15] tracking-tight text-[#0B2D1B] mb-3">
          <span>Common Mandi & Farmer </span>
          <span className="font-editorial italic font-normal text-[#0B2D1B]">
            Questions
          </span>
        </h2>
        <p className="text-sm sm:text-base text-[#5A6C5F] leading-relaxed font-normal">
          Got questions about slot booking, token queues, and mandi registration?
          Find all the answers here.
        </p>
      </div>

      {/* Centered FAQ Accordion List */}
      <div className="w-full max-w-[840px] flex flex-col gap-3.5">
        {faqData.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => toggleFAQ(item.id)}
              className={`w-full rounded-[16px] transition-all duration-300 cursor-pointer overflow-hidden border ${
                isOpen
                  ? "bg-[#F4F4F2] border-[#0B2D1B]/15 shadow-xs p-5 md:p-6"
                  : "bg-[#F4F4F2] hover:bg-[#ecece7] border-transparent p-5 md:p-5.5"
              }`}
            >
              {/* Question Row */}
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base sm:text-[17px] font-medium text-[#0B2D1B] tracking-tight">
                  {item.question}
                </h3>

                {/* Square Plus / Minus Button */}
                <div
                  className={`w-6 h-6 rounded-[5px] flex items-center justify-center shrink-0 border transition-colors duration-200 ${
                    isOpen
                      ? "bg-[#0B2D1B] text-white border-[#0B2D1B]"
                      : "bg-white text-[#0B2D1B] border-[#DCDCD5] shadow-2xs"
                  }`}
                >
                  {isOpen ? (
                    <Minus size={13} strokeWidth={2.5} />
                  ) : (
                    <Plus size={13} strokeWidth={2.5} />
                  )}
                </div>
              </div>

              {/* Collapsible Answer */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-350 ease-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100 mt-3"
                    : "grid-rows-[0fr] opacity-0 mt-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-sm sm:text-[14.5px] text-[#5A6C5F] leading-relaxed pt-1">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
