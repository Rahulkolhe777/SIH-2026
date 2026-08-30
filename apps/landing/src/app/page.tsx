import Hero from "@/components/Hero";
import TrustMarquee from "@/components/TrustMarquee";
import PlatformIntro from "@/components/PlatformIntro";
import SolutionsAccordion from "@/components/SolutionsAccordion";
import HowItWorks from "@/components/HowItWorks";
import Statistics from "@/components/Statistics";
import SmartSolutionsCarousel from "@/components/SmartSolutionsCarousel";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <main className="w-full bg-[#FCFCFA] flex flex-col items-center justify-start overflow-x-clip relative">
      {/* LAYER 1: Sticky Top Full-Bleed Hero */}
      <div className="w-full sticky top-0 z-10">
        <Hero />
      </div>

      {/* LAYER 2: Trust Marquee & Cultiva Legacy Statement (Overlaps Hero) */}
      <section className="w-full relative z-20 bg-[#FCFCFA] rounded-t-[32px] md:rounded-t-[44px] -mt-10 md:-mt-14 section-stack-shadow border-t border-black/5 overflow-hidden transition-all duration-300">
        <TrustMarquee />
        <PlatformIntro />
      </section>

      {/* LAYER 3: Smart Farming Solutions Accordion (Overlaps Layer 2) */}
      <section className="w-full relative z-30 bg-[#FCFCFA] rounded-t-[32px] md:rounded-t-[44px] -mt-8 md:-mt-10 section-stack-shadow border-t border-black/5 overflow-hidden transition-all duration-300">
        <SolutionsAccordion />
      </section>

      {/* LAYER 4: How It Works Feature Hub (Overlaps Layer 3) */}
      <section className="w-full relative z-40 bg-[#FCFCFA] rounded-t-[32px] md:rounded-t-[44px] -mt-8 md:-mt-10 section-stack-shadow border-t border-black/5 overflow-hidden transition-all duration-300">
        <HowItWorks />
      </section>

      {/* LAYER 5: Statistics & Smart Solutions Carousel (Overlaps Layer 4) */}
      <section className="w-full relative z-50 bg-[#FCFCFA] rounded-t-[32px] md:rounded-t-[44px] -mt-8 md:-mt-10 section-stack-shadow border-t border-black/5 overflow-hidden transition-all duration-300">
        <Statistics />
        <SmartSolutionsCarousel />
      </section>

      {/* LAYER 6: Testimonials & FAQ (Overlaps Layer 5) */}
      <section className="w-full relative z-60 bg-[#FCFCFA] rounded-t-[32px] md:rounded-t-[44px] -mt-8 md:-mt-10 section-stack-shadow border-t border-black/5 overflow-hidden pb-16 transition-all duration-300">
        <Testimonials />
        <FAQ />
      </section>
    </main>
  );
}
