"use client";

import Link from "next/link";
import { useState } from "react";
import type { BrandStoryContent } from "@/lib/site-settings";

const HERITAGE_TIMELINE = [
  {
    step: "01",
    title: "Traditional Roots",
    subtitle: "Generational Pakistani Heritage",
    description:
      "Rooted in authentic family recipes passed through generations, from rich Aloo Bukhara chutneys to traditional sun-cured mango pickles.",
    badge: "Authentic Tastes",
  },
  {
    step: "02",
    title: "Artisanal Method",
    subtitle: "Small-Batch Handcrafted Preparation",
    description:
      "We prepare every jar and botanical formula in small, considered batches using raw natural herbs, cold-pressed oils, and zero artificial shortcuts.",
    badge: "100% Pure Care",
  },
  {
    step: "03",
    title: "Daily Rejuvenation",
    subtitle: "For Everyday Tables & Care Routines",
    description:
      "Crafted to enrich your daily meals and hair care rituals with honest, pure, and comforting traditional Pakistani goodness.",
    badge: "Direct Delivery",
  },
];

const BRAND_VALUES = [
  {
    num: "01",
    tag: "PURITY",
    title: "Pure Botanical",
    desc: "Unrefined herbs, natural oils, and traditional ingredients sourced with unyielding integrity.",
  },
  {
    num: "02",
    tag: "ARTISANAL",
    title: "Small-Batch Handcrafted",
    desc: "Every jar cooked and poured in controlled small quantities for peak freshness and authentic taste.",
  },
  {
    num: "03",
    tag: "HERITAGE",
    title: "Authentic Recipes",
    desc: "Preserving traditional Pakistani culinary and herbal knowledge passed through generations.",
  },
  {
    num: "04",
    tag: "HONESTY",
    title: "Honest & Transparent",
    desc: "No artificial dyes or hidden fillers — just honest, pure quality in every single batch.",
  },
];

export function BrandStoryExperience({ story }: { story: BrandStoryContent }) {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <main className="brand-story-page pb-24 text-[#f6f0e7] overflow-hidden bg-[#080706]">
      
      {/* ── 1. Viewport-Correct Hero Section ── */}
      <section
        aria-labelledby="story-heading"
        className="viewport-hero flex flex-col border-b border-[#2d2924]"
        style={{ background: "#080706" }}
      >
        {/* Ambient background gold glows */}
        <div
          className="absolute -left-32 top-[-60px] h-[550px] w-[550px] rounded-full pointer-events-none"
          aria-hidden="true"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)",
            animation: "goldPulse 7s ease-in-out infinite",
          }}
        />
        <div
          className="absolute right-0 top-1/3 h-[450px] w-[450px] rounded-full pointer-events-none"
          aria-hidden="true"
          style={{
            background: "radial-gradient(circle, rgba(160,110,30,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Content Container: flex-centered */}
        <div className="viewport-hero-inner site-shell">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Hero Story Text */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#c9a84c]/35 bg-[#161412]/90 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a84c] shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
                THE NOOR HERBAL STORY
              </div>

              <h1 id="story-heading" className="hero-h1-sub font-display font-bold tracking-tight mt-1">
                {story.heading}
              </h1>

              <p className="hero-p mt-1">
                {story.bodyOne}
              </p>

              <div className="pt-1 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#c9a84c] font-semibold">
                <span className="h-px w-8 bg-[#c9a84c]" />
                <span>Handcrafted for everyday kitchens & personal care</span>
              </div>
            </div>

            {/* Right Column: Premium Brand Stats Panel */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl border border-[#c9a84c]/30 bg-[#12100e] p-8 sm:p-10 shadow-2xl overflow-hidden">
                {/* Ambient gold glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 70% 30%, rgba(201,168,76,0.12) 0%, transparent 65%)",
                    animation: "goldPulse 8s ease-in-out infinite",
                  }}
                />

                {/* Header */}
                <div className="relative z-10 mb-8 border-b border-[#2d2822] pb-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#c9a84c] mb-2">NOOR HERBAL</p>
                  <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#f6f0e7] leading-tight">
                    Pure Artisanal<br />
                    <span className="text-[#c9a84c]">Heritage Craft</span>
                  </h3>
                </div>

                {/* Stats Grid */}
                <div className="relative z-10 grid grid-cols-2 gap-4 mb-8">
                  {[
                    { value: "100%", label: "Natural Ingredients" },
                    { value: "0", label: "Artificial Additives" },
                    { value: "Small", label: "Batch Prepared" },
                    { value: "3+", label: "Generations of Craft" },
                  ].map(({ value, label }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-[#2d2822] bg-[#161411] p-4 space-y-1"
                    >
                      <p className="font-display text-2xl font-bold text-[#c9a84c]">{value}</p>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#a09a8f] font-semibold">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Bottom tag line */}
                <div className="relative z-10 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c]/80">
                    Handcrafted in Pakistan · Est. for Daily Tables
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none z-10"
          aria-hidden="true"
        >
          <span className="text-[9px] uppercase tracking-[0.32em] text-[#c9a84c]/80 font-semibold">
            SCROLL TO EXPLORE
          </span>
          <div className="w-px h-7 bg-gradient-to-b from-[#c9a84c]/70 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── 2. Reading Story Section ── */}
      <section className="py-20 bg-[#0c0b09] border-b border-[#25221d]">
        <div className="site-shell max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a84c]">
            01 / Our Philosophy
          </p>
          <p className="font-display text-2xl sm:text-4xl text-[#f6f0e7] leading-relaxed font-normal">
            &ldquo;{story.bodyTwo}&rdquo;
          </p>
        </div>
      </section>

      {/* ── 3. High-Visibility Interactive Timeline Journey ── */}
      <section aria-labelledby="timeline-heading" className="py-20 border-b border-[#25221d] relative">
        <div className="site-shell px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a84c]">
              Generational Journey
            </p>
            <h2 id="timeline-heading" className="font-display text-3xl sm:text-4xl font-bold text-[#f6f0e7]">
              How We Craft Quality
            </h2>
            <p className="text-xs text-[#a09a8f]">
              From sourcing pure raw ingredients to traditional small-batch preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HERITAGE_TIMELINE.map((item, index) => {
              const isHovered = activeCard === index;
              return (
                <div
                  key={item.step}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                  className={`group relative rounded-3xl border border-t-2 p-8 transition-all duration-300 shadow-xl ${
                    isHovered
                      ? "border-[#c9a84c] border-t-[#c9a84c] bg-[#1d1a15] -translate-y-2 shadow-2xl shadow-[#c9a84c]/15"
                      : "border-[#383229] border-t-[#c9a84c]/60 bg-[#161411]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display text-4xl font-bold text-[#c9a84c] group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#c9a84c] bg-[#c9a84c]/15 border border-[#c9a84c]/30 px-3 py-1 rounded-full font-semibold shadow-sm">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#f6f0e7] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#c9a84c] mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-[#d0c9bd] leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Mission & Vision — Balanced 2-Column Luxury Grid ── */}
      <section aria-labelledby="purpose-heading" className="py-20 border-b border-[#25221d] bg-[#0c0b09]">
        <div className="site-shell px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a84c]">
              Guiding Principles
            </p>
            <h2 id="purpose-heading" className="font-display text-3xl sm:text-4xl font-bold text-[#f6f0e7]">
              Our Mission & Vision
            </h2>
            <p className="text-xs text-[#a09a8f]">
              Driven by pure Pakistani heritage and an unyielding commitment to quality.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Mission Card */}
            <article className="rounded-3xl border border-[#383229] border-t-2 border-t-[#c9a84c] bg-[#161411] p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-[#c9a84c] transition-all duration-300 group">
              <div
                className="absolute inset-0 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ background: "radial-gradient(ellipse at 15% 15%, rgba(201,168,76,0.08) 0%, transparent 65%)" }}
              />
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#c9a84c]">
                    01 · OUR MISSION
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#c9a84c]/60 uppercase">
                    PURITY FIRST
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#f6f0e7] leading-tight">
                  For Everyday Life, Made Pure.
                </h3>

                <div className="h-px w-12 bg-[#c9a84c]/40" />

                <p className="text-sm sm:text-base text-[#d0c9bd] leading-relaxed font-normal">
                  {story.mission}
                </p>
              </div>

              <div className="relative z-10 pt-6 mt-6 border-t border-[#2a2620] flex items-center justify-between text-xs text-[#a09a8f]">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                  Pure Botanical & Culinary Care
                </span>
                <span className="font-semibold text-[#c9a84c]">100% Authentic</span>
              </div>
            </article>

            {/* Vision Card */}
            <article className="rounded-3xl border border-[#383229] border-t-2 border-t-[#c9a84c] bg-[#161411] p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-[#c9a84c] transition-all duration-300 group">
              <div
                className="absolute inset-0 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ background: "radial-gradient(ellipse at 85% 15%, rgba(201,168,76,0.08) 0%, transparent 65%)" }}
              />
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#c9a84c]">
                    02 · OUR VISION
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#c9a84c]/60 uppercase">
                    GENERATIONAL CRAFT
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#f6f0e7] leading-tight">
                  A Collection Returned To Across Generations.
                </h3>

                <div className="h-px w-12 bg-[#c9a84c]/40" />

                <p className="text-sm sm:text-base text-[#d0c9bd] leading-relaxed font-normal">
                  {story.vision}
                </p>
              </div>

              <div className="relative z-10 pt-6 mt-6 border-t border-[#2a2620] flex items-center justify-between text-xs text-[#a09a8f]">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                  Long-lasting Quality & Trust
                </span>
                <span className="font-semibold text-[#c9a84c]">Heritage Legacy</span>
              </div>
            </article>
          </div>

        </div>
      </section>

      {/* ── 5. Brand Core Values (Executive Gold Badges - High Visibility) ── */}
      <section aria-label="Our core values" className="py-20 border-b border-[#25221d]">
        <div className="site-shell px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a84c]">
              Pillars of Excellence
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#f6f0e7]">
              Our Uncompromising Standards
            </h2>
            <p className="text-xs text-[#a09a8f]">
              Every formulation and recipe reflects four core commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRAND_VALUES.map(({ num, tag, title, desc }) => (
              <div
                key={title}
                className="group relative rounded-3xl border border-[#383229] bg-[#161411] p-7 space-y-4 border-t-2 border-t-[#c9a84c] hover:border-[#c9a84c] hover:bg-[#1d1a15] transition-all duration-300 shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c9a84c]/40 bg-[#c9a84c]/15 text-xs font-mono font-bold text-[#c9a84c] group-hover:bg-[#c9a84c] group-hover:text-[#0a0907] transition-colors">
                    {num}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#c9a84c]">
                    {tag}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-[#f6f0e7]">
                  {title}
                </h3>
                <p className="text-xs text-[#b8b0a2] leading-relaxed group-hover:text-[#f6f0e7] transition-colors">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Cinematic Closing Banner ── */}
      <section className="pt-20 text-center">
        <div className="site-shell max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a84c]">
            Explore The Collection
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#f6f0e7]">
            Discover What Belongs In Your Daily Routine.
          </h2>
          <div className="pt-4">
            <Link
              href="/categories"
              className="button-primary inline-flex items-center gap-2 px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl"
            >
              <span>Explore The Shop</span>
              <span>➔</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes goldPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.08); }
        }
      `}</style>
    </main>
  );
}
