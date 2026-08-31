"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone, MapPin, Send, Sprout, Landmark } from "lucide-react";

const footerNavColumns = [
  {
    title: "Platform",
    links: [
      { label: "Book Mandi Slot", href: "#book-slot" },
      { label: "Live Queue Status", href: "#queue-status" },
      { label: "Crop Price Tracker", href: "#prices" },
      { label: "Mandi Directory", href: "#mandis" },
      { label: "Digital Token", href: "#token" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "For Farmers", href: "#farmers", icon: Sprout },
      { label: "For Mandi Operators", href: "#operators", icon: Landmark },
      { label: "Queue Management", href: "#queue" },
      { label: "Smart Procurement", href: "#procurement" },
      { label: "Analytics Dashboard", href: "#analytics" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
      { label: "Farmer Stories", href: "#testimonials" },
      { label: "Blog", href: "#blog" },
      { label: "API Documentation", href: "#api-docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Agrovia", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Contact Us", href: "#contact" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
    ],
  },
];

const socialLinks = [
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full bg-gradient-to-b from-[#0A2818] via-[#071E12] to-[#04120A] text-white relative overflow-hidden">
      {/* Top accent line — lime glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8F52F]/30 to-transparent" />

      {/* Ambient gradient overlays — rich multi-hue depth */}
      <div className="absolute -top-32 -left-32 w-[700px] h-[700px] bg-[radial-gradient(circle,_rgba(200,245,47,0.07)_0%,_rgba(16,185,129,0.04)_40%,_transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(20,184,166,0.05)_0%,_rgba(200,245,47,0.03)_50%,_transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,_rgba(16,185,129,0.03)_0%,_transparent_60%)] pointer-events-none" />

      {/* CTA Banner */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-16 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#0C2E1C] via-[#06180E] to-[#081F10] border border-[#C8F52F]/10 rounded-[24px] md:rounded-[28px] px-6 sm:px-10 md:px-14 py-10 md:py-14 overflow-hidden shadow-[inset_0_1px_0_0_rgba(200,245,47,0.08)]">
            {/* Decorative glows — dual-tone emerald + lime */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[radial-gradient(circle,_rgba(200,245,47,0.12)_0%,_rgba(16,185,129,0.06)_50%,_transparent_70%)] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-[radial-gradient(circle,_rgba(20,184,166,0.08)_0%,_rgba(200,245,47,0.04)_60%,_transparent_70%)] rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10">
              <div className="max-w-[520px]">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium leading-[1.15] tracking-tight text-white/95">
                  Ready to skip the{" "}
                  <span className="font-editorial italic font-normal">
                    queue?
                  </span>
                </h2>
                <p className="mt-3 text-[#a8c4b0] text-sm sm:text-[15px] leading-relaxed font-light">
                  Join 10,000+ farmers already using Agrovia Mandi for hassle-free
                  slot booking and fair crop prices.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/register`}
                  className="group inline-flex items-center gap-2 bg-[#C8F52F] hover:bg-[#d4ff45] active:scale-[0.98] text-[#0B2D1B] font-semibold px-6 py-3.5 rounded-full text-sm transition-all duration-300 shadow-lg shadow-[#C8F52F]/20 hover:shadow-[#C8F52F]/35 cursor-pointer"
                >
                  <span>Book Mandi Slot</span>
                  <ArrowUpRight
                    size={16}
                    strokeWidth={2.5}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/login`}
                  className="inline-flex items-center bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-md border border-white/20 text-white/90 hover:text-white font-medium px-6 py-3.5 rounded-full text-sm transition-all duration-300 hover:border-[#C8F52F]/25 cursor-pointer"
                >
                  Mandi Portal
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-16 pt-14 md:pt-16 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
            {/* Brand Column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2 pr-4">
              {/* Logo */}
              <a
                href="#home"
                className="flex items-center gap-2.5 group cursor-pointer mb-5"
                aria-label="Agrovia Home"
              >
                <div className="w-8 h-8 bg-[#C8F52F] rounded-lg flex items-center justify-center shadow-[0_0_16px_rgba(200,245,47,0.25)] group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(200,245,47,0.35)] transition-all duration-200">
                  <svg
                    className="w-5 h-5 text-[#0B2D1B]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 16h10" />
                    <path d="M9 12h10" />
                    <path d="M5 8h10" />
                  </svg>
                </div>
                <span className="text-white font-semibold text-lg tracking-tight">
                  Agrovia Mandi
                </span>
              </a>

              <p className="text-[#8fa898] text-sm leading-relaxed mb-6 max-w-[300px]">
                Digitizing India&apos;s APMC mandis with smart slot booking,
                real-time queue management, and transparent crop pricing.
              </p>

              {/* Newsletter */}
              <form onSubmit={handleSubscribe} className="relative max-w-[300px]">
                <label className="text-xs text-[#C8F52F]/50 uppercase tracking-widest font-semibold mb-2.5 block">
                  Stay Updated
                </label>
                <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-full overflow-hidden focus-within:border-[#C8F52F]/40 focus-within:bg-white/[0.08] transition-all duration-300">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent text-white/90 text-sm px-4 py-3 placeholder:text-white/30 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="p-3 text-white/70 hover:text-[#C8F52F] transition-colors duration-200 cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <Send size={16} strokeWidth={2} />
                  </button>
                </div>
                {subscribed && (
                  <p className="mt-2 text-xs text-[#C8F52F] font-medium animate-pulse">
                    ✓ Subscribed successfully!
                  </p>
                )}
              </form>
            </div>

            {/* Nav Columns */}
            {footerNavColumns.map((column) => (
              <div key={column.title}>
                <h4 className="text-xs uppercase tracking-widest font-semibold mb-4 bg-gradient-to-r from-[#C8F52F]/60 to-[#10B981]/50 bg-clip-text text-transparent">
                  {column.title}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group flex items-center gap-1.5 text-[13px] sm:text-sm text-[#8fa898] hover:text-white hover:translate-x-0.5 transition-all duration-200"
                      >
                        {"icon" in link && link.icon && (
                          <link.icon size={13} className="text-[#10B981]/60 group-hover:text-[#C8F52F] transition-colors duration-200" />
                        )}
                        <span>{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Info Row */}
          <div className="mt-12 pt-8 border-t border-gradient-to-r border-white/[0.06] flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-8">
            <a
              href="mailto:support@agrovia.in"
              className="flex items-center gap-2 text-sm text-[#8fa898] hover:text-white transition-colors duration-200 group"
            >
              <Mail size={14} className="text-[#10B981]/50 group-hover:text-[#C8F52F] transition-colors duration-200" />
              <span>support@agrovia.in</span>
            </a>
            <a
              href="tel:+911800123456"
              className="flex items-center gap-2 text-sm text-[#8fa898] hover:text-white transition-colors duration-200 group"
            >
              <Phone size={14} className="text-[#10B981]/50 group-hover:text-[#C8F52F] transition-colors duration-200" />
              <span>1800-123-456</span>
            </a>
            <div className="flex items-center gap-2 text-sm text-[#8fa898]">
              <MapPin size={14} className="text-[#10B981]/50 shrink-0" />
              <span>Pune, Maharashtra, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-16 pb-6 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-[#5a7a63] font-light">
              © {new Date().getFullYear()} Agrovia Mandi. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#8fa898] hover:text-[#C8F52F] hover:bg-[#C8F52F]/[0.08] transition-all duration-200 cursor-pointer"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Bottom Legal Links */}
            <div className="flex items-center gap-4 text-xs text-[#5a7a63]">
              <a href="#privacy" className="hover:text-[#8fa898] transition-colors duration-200">
                Privacy
              </a>
              <span className="text-[#2a4a33]">|</span>
              <a href="#terms" className="hover:text-[#8fa898] transition-colors duration-200">
                Terms
              </a>
              <span className="text-[#2a4a33]">|</span>
              <a href="#cookies" className="hover:text-[#8fa898] transition-colors duration-200">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
