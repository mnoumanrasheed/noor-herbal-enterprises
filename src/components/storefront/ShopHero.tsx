"use client";

import Link from "next/link";
import type { Category } from "@/types";

interface ShopHeroProps {
  categories?: Category[];
}

export function ShopHero({ categories = [] }: ShopHeroProps) {
  return (
    <section
      aria-labelledby="shop-hero-heading"
      className="viewport-hero flex flex-col border-b border-[#2d2924]"
      style={{ background: "#080706" }}
    >
      {/* Ambient background gold glow */}
      <div
        className="absolute -right-32 top-[-40px] h-[600px] w-[600px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(201,168,76,0.2) 0%, rgba(8,7,6,0.95) 70%)",
          animation: "goldPulse 7s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -left-32 bottom-[-60px] h-[500px] w-[500px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(160,110,30,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid dot overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(rgba(201, 168, 76, 0.22) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Left-side readability gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to right, rgba(8,7,6,0.96) 0%, rgba(8,7,6,0.78) 50%, rgba(8,7,6,0.3) 100%)",
        }}
      />
      {/* Bottom vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        aria-hidden="true"
        style={{ background: "linear-gradient(to top, rgba(8,7,6,0.9) 0%, transparent 100%)" }}
      />

      {/* ── Hero Content: flexbox-centered vertically ── */}
      <div className="viewport-hero-inner site-shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="hero-eyebrow-anim flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#8e8578]">
              <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
              <span aria-hidden="true" className="text-[#4a443b]">/</span>
              <span aria-current="page" className="text-[#c9a84c] font-semibold">Shop Collections</span>
            </nav>

            {/* Eyebrow pill */}
            <div className="hero-eyebrow-anim flex items-center gap-3">
              <span className="h-px w-8 bg-[#c9a84c]/60" />
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/35 bg-[#161412]/90 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a84c] shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
                EXPLORE THE COLLECTION
              </span>
            </div>

            {/* Headline */}
            <h1
              id="shop-hero-heading"
              className="hero-h1-sub font-display font-medium tracking-tight mt-1"
            >
              <span className="hero-line-container">
                <span className="hero-line-inner hero-line-inner-1 block">
                  Find what belongs
                </span>
              </span>
              <span className="hero-line-container mt-1">
                <span className="hero-line-inner hero-line-inner-2 block">
                  in your <span className="gold-shimmer-once italic font-serif">everyday.</span>
                </span>
              </span>
            </h1>

            {/* Body Copy */}
            <p className="hero-para-anim hero-p">
              Explore handcrafted chutneys, pickles, oils, and herbal care created with tradition, care, and everyday use in mind.
            </p>

            {/* CTAs */}
            <div className="hero-cta-anim flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <a
                href="#all-collections"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-[#c9a84c] px-8 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#0a0907] shadow-xl shadow-[#c9a84c]/20 transition-all duration-300 hover:shadow-[#c9a84c]/40 hover:-translate-y-0.5"
              >
                <span>EXPLORE COLLECTIONS</span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-1">↓</span>
              </a>

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e0d8cc] transition-all duration-300 hover:border-[#c9a84c]/60 hover:text-[#c9a84c] hover:bg-white/10"
              >
                <span>OUR HERITAGE STORY</span>
                <span aria-hidden="true" className="text-xs">↗</span>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="hero-cta-anim flex items-center gap-6 text-xs text-[#a09a8f]">
              <div className="flex items-center gap-2">
                <span className="text-[#c9a84c] font-bold">✦</span>
                <span>{categories.length > 0 ? categories.length : 4} Curated Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#c9a84c] font-bold">✦</span>
                <span>100% Handcrafted Recipes</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Brand Info Panel (no images, no tilt) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative rounded-3xl border border-[#c9a84c]/30 bg-[#12100e] p-8 shadow-2xl overflow-hidden">
              {/* Ambient glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 70% 30%, rgba(201,168,76,0.12) 0%, transparent 65%)",
                  animation: "goldPulse 8s ease-in-out infinite",
                }}
              />

              {/* Header */}
              <div className="relative z-10 mb-6 border-b border-[#2d2822] pb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#c9a84c] mb-1.5">NOOR HERBAL</p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#f6f0e7] leading-tight">
                  Curated Artisan<br />
                  <span className="text-[#c9a84c]">Collections</span>
                </h3>
              </div>

              {/* Collection Grid */}
              <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: "Chutneys", tagline: "Kitchen Artisanal", num: "01" },
                  { label: "Pickles", tagline: "Sun-Cured Traditional", num: "02" },
                  { label: "Botanical Oils", tagline: "Cold-Pressed Nectars", num: "03" },
                  { label: "Herbal Shampoo", tagline: "Gentle Scalp Care", num: "04" },
                ].map(({ label, tagline, num }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[#2d2822] bg-[#161411] p-3.5 space-y-1 hover:border-[#c9a84c]/40 transition-colors"
                  >
                    <p className="text-[9px] font-mono font-bold text-[#c9a84c]">{num}</p>
                    <p className="text-[12px] font-bold text-[#f6f0e7] leading-tight">{label}</p>
                    <p className="text-[10px] text-[#a09a8f] leading-snug">{tagline}</p>
                  </div>
                ))}
              </div>

              {/* Bottom tagline */}
              <div className="relative z-10 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a84c]/80">
                  Handcrafted · Small-Batch · Pakistan
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none z-10"
        aria-hidden="true"
      >
        <span className="text-[9px] uppercase tracking-[0.32em] text-[#c9a84c]/80 font-semibold">
          SCROLL TO DISCOVER
        </span>
        <div className="w-px h-6 bg-gradient-to-b from-[#c9a84c]/70 to-transparent animate-pulse" />
      </div>

      <style>{`
        @keyframes goldPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.85; transform: scale(1.06); }
        }
      `}</style>
    </section>
  );
}
