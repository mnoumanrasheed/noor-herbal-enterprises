"use client";

import Image from "next/image";
import Link from "next/link";
import { CategorySortSelect } from "@/components/storefront/CategorySortSelect";
import type { Category } from "@/types";

export interface CategoryHeroProps {
  category: Category;
  productCount: number;
  currentSort?: string;
  index?: number;
}

// Category Dynamic Visual & Botanical Themes
const CATEGORY_THEMES: Record<
  string,
  {
    tagline: string;
    accentColor: string;
    glowGradient: string;
    stageImage?: string;
    stageImageAlt?: string;
    motto: string;
  }
> = {
  chutney: {
    tagline: "ARTISANAL KITCHEN RITUALS",
    accentColor: "#d97724",
    glowGradient:
      "radial-gradient(circle at 70% 50%, rgba(217, 119, 36, 0.32) 0%, rgba(160, 80, 20, 0.12) 45%, transparent 75%)",
    stageImage: "/images/products/aloo-bukharay-ki-chutney-cutout.png",
    stageImageAlt: "Authentic Aloo Bukhara Chutney Jar",
    motto:
      "Handcrafted chutneys cooked in small batches with sun-ripened plums, organic sugar, and authentic traditional spices.",
  },
  pickles: {
    tagline: "SUN-CURED TRADITIONAL PICKLES",
    accentColor: "#d4a029",
    glowGradient:
      "radial-gradient(circle at 70% 50%, rgba(212, 160, 41, 0.3) 0%, rgba(70, 110, 30, 0.15) 48%, transparent 75%)",
    stageImage: "/images/products/crush-mango-pickle.jpeg",
    stageImageAlt: "Crush Mango Pickle Jar",
    motto:
      "Hand-cut mangoes and traditional spice blends cured naturally under the sun for peak authentic Pakistani flavor.",
  },
  oils: {
    tagline: "NOURISHING BOTANICAL NECTARS",
    accentColor: "#e0b040",
    glowGradient:
      "radial-gradient(circle at 70% 50%, rgba(224, 176, 64, 0.32) 0%, rgba(150, 100, 25, 0.15) 50%, transparent 75%)",
    stageImage: "/images/products/noor-herbal-hair-oil-cutout.png",
    stageImageAlt: "Noor Herbal Hair Oil Bottle",
    motto:
      "Cold-pressed seed oils and 43+ raw herbs infused over slow traditional warmth for deep hair & scalp rejuvenation.",
  },
  "hair-oil": {
    tagline: "NOURISHING BOTANICAL NECTARS",
    accentColor: "#e0b040",
    glowGradient:
      "radial-gradient(circle at 70% 50%, rgba(224, 176, 64, 0.32) 0%, rgba(150, 100, 25, 0.15) 50%, transparent 75%)",
    stageImage: "/images/products/noor-herbal-hair-oil-cutout.png",
    stageImageAlt: "Noor Herbal Hair Oil Bottle",
    motto:
      "Cold-pressed seed oils and 43+ raw herbs infused over slow traditional warmth for deep hair & scalp rejuvenation.",
  },
  shampoo: {
    tagline: "HERBAL CARE & REJUVENATION",
    accentColor: "#387a4a",
    glowGradient:
      "radial-gradient(circle at 70% 50%, rgba(56, 122, 74, 0.32) 0%, rgba(201, 168, 76, 0.14) 48%, transparent 75%)",
    stageImage: "/images/products/noor-herbal-shampoo.jpeg",
    stageImageAlt: "Noor Herbal Botanical Shampoo Bottle",
    motto:
      "Botanical shampoo formulated with pure natural extracts for gentle cleansing and natural shine without harsh chemicals.",
  },
};

export function CategoryHero({
  category,
  productCount,
  currentSort = "featured",
  index = 1,
}: CategoryHeroProps) {
  const slug = category.slug.toLowerCase();
  const theme = CATEGORY_THEMES[slug] || {
    tagline: "THE NOOR HERBAL COLLECTION",
    accentColor: "#c9a84c",
    glowGradient:
      "radial-gradient(circle at 70% 50%, rgba(201, 168, 76, 0.28) 0%, rgba(140, 100, 30, 0.1) 45%, transparent 75%)",
    motto: category.description || "Thoughtful pantry and personal care essentials crafted for daily rituals.",
  };

  const collectionIndex = String(category.sort_order || index).padStart(2, "0");

  return (
    <section
      aria-labelledby="category-hero-title"
      className="viewport-hero flex flex-col border-b border-[#2d2924]"
      style={{ background: "#080706" }}
    >
      {/* ── 1. Dynamic Category Background Halo ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        aria-hidden="true"
        style={{ background: theme.glowGradient }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(rgba(201, 168, 76, 0.22) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── 2. Readability vignettes ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to right, rgba(8,7,6,0.96) 0%, rgba(8,7,6,0.76) 48%, rgba(8,7,6,0.2) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        aria-hidden="true"
        style={{ background: "linear-gradient(to top, rgba(8,7,6,0.95) 0%, transparent 100%)" }}
      />

      {/* ── 3. Hero Content: flex-centered ── */}
      <div className="viewport-hero-inner site-shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Category Info & Controls */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">

            {/* Breadcrumb Bar */}
            <nav aria-label="Breadcrumb" className="hero-eyebrow-anim flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#8e8578]">
              <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
              <span aria-hidden="true" className="text-[#4a443b]">/</span>
              <Link href="/categories" className="hover:text-[#c9a84c] transition-colors">Shop</Link>
              <span aria-hidden="true" className="text-[#4a443b]">/</span>
              <span aria-current="page" className="text-[#c9a84c] font-semibold">{category.name}</span>
            </nav>

            {/* Collection Eyebrow */}
            <div className="hero-eyebrow-anim flex items-center gap-3">
              <span className="h-px w-8 bg-[#c9a84c]/60" />
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/35 bg-[#161412]/90 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a84c] shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
                COLLECTION {collectionIndex} • {theme.tagline}
              </span>
            </div>

            {/* Headline */}
            <h1
              id="category-hero-title"
              className="hero-h1-sub font-display font-medium tracking-tight mt-1"
            >
              <span className="hero-line-container">
                <span className="hero-line-inner hero-line-inner-1 block">
                  {category.name}
                </span>
              </span>
              <span className="hero-line-container mt-1">
                <span className="hero-line-inner hero-line-inner-2 block">
                  <span className="gold-shimmer-once italic font-serif">Collection</span>
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="hero-para-anim hero-p">
              {category.description || theme.motto}
            </p>

            {/* Metadata & Controls Bar */}
            <div className="hero-cta-anim flex flex-wrap items-center gap-3 pt-0.5">
              {/* Product Count Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#38332a] bg-[#161411] px-4 py-2 text-xs text-[#d8d2c7] font-semibold shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#c9a84c]" />
                <span>
                  {productCount} {productCount === 1 ? "Product" : "Products"} Available
                </span>
              </div>

              {/* Sorting Select */}
              <form method="GET" className="flex items-center gap-2">
                <label htmlFor="sort-select" className="sr-only">Sort products</label>
                <CategorySortSelect defaultValue={currentSort} />
              </form>
            </div>

            {/* CTAs */}
            <div className="hero-cta-anim flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <a
                href="#collection-products"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-[#c9a84c] px-8 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#0a0907] shadow-xl shadow-[#c9a84c]/20 transition-all duration-300 hover:shadow-[#c9a84c]/40 hover:-translate-y-0.5"
              >
                <span>EXPLORE COLLECTION</span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-1">↓</span>
              </a>

              <Link
                href="/categories"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e0d8cc] transition-all duration-300 hover:border-[#c9a84c]/60 hover:text-[#c9a84c] hover:bg-white/10"
              >
                <span>ALL COLLECTIONS</span>
                <span aria-hidden="true" className="text-xs">↗</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Product Showcase Panel (no tilt) */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm rounded-3xl border border-[#c9a84c]/30 bg-[#12100e] p-6 shadow-2xl overflow-hidden">
              {/* Category glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${theme.accentColor}22 0%, transparent 70%)`,
                  animation: "goldPulse 8s ease-in-out infinite",
                }}
              />

              {/* Stage Header */}
              <div className="relative z-10 w-full flex items-center justify-between border-b border-[#28241e] pb-3 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a84c]">
                  COLLECTION {collectionIndex} ATELIER
                </span>
                <span className="text-[9px] font-mono text-[#8e8578] uppercase tracking-wider">
                  100% PURE
                </span>
              </div>

              {/* Product Image */}
              {theme.stageImage ? (
                <div className="relative h-56 w-full flex items-center justify-center my-2">
                  <Image
                    src={theme.stageImage}
                    alt={theme.stageImageAlt || category.name}
                    fill
                    sizes="300px"
                    priority
                    className="object-contain object-center hover:scale-105 transition-transform duration-700 drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 space-y-3 h-40">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c9a84c]/40 bg-[#1c1813] text-xl font-display font-bold text-[#c9a84c] shadow-lg">
                    {category.name.substring(0, 2).toUpperCase()}
                  </span>
                  <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-[#e0d8cc]">
                    {category.name} Atelier
                  </span>
                </div>
              )}

              {/* Stage Footer */}
              <div className="relative z-10 w-full pt-3 border-t border-[#28241e] flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#c9a84c]">
                  Authentic Handcrafted Batch
                </span>
                <span className="text-[9px] text-[#a09a8f] uppercase tracking-wider">
                  Direct Delivery
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none z-10"
        aria-hidden="true"
      >
        <span className="text-[9px] uppercase tracking-[0.32em] text-[#c9a84c]/80 font-semibold">
          SCROLL TO EXPLORE
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
