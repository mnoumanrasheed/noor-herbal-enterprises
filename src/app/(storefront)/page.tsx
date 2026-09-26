import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CategoryShowcase } from "@/components/storefront/CategoryShowcase";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Hero3DCanvas } from "@/components/storefront/Hero3DCanvas";

import {
  getCategoryShowcases,
  getFeaturedProducts,
  getStorefrontContent,
} from "@/lib/queries";
import {
  DEFAULT_STOREFRONT_CONTENT,
  type StorefrontContent,
} from "@/lib/site-settings";
import type { Category, Product } from "@/types";

export const metadata: Metadata = {
  title: "Noor Herbal Enterprises — Pure, Handcrafted Botanical & Pantry Essentials",
  description:
    "Discover authentic traditional chutneys, artisanal pickles, nourishing botanical hair oils, and herbal shampoos handcrafted in Pakistan.",
};

export const revalidate = 60;

export default async function HomePage() {
  let categories: Category[] = [];
  let featuredProducts: Product[] = [];
  let catalogError = false;
  let content: StorefrontContent = {
    homepageCopy: DEFAULT_STOREFRONT_CONTENT.homepageCopy,
    featuredContent: DEFAULT_STOREFRONT_CONTENT.featuredContent,
    footerContent: DEFAULT_STOREFRONT_CONTENT.footerContent,
  };

  try {
    [categories, featuredProducts, content] = await Promise.all([
      getCategoryShowcases(),
      getFeaturedProducts(),
      getStorefrontContent(),
    ]);
  } catch {
    catalogError = true;
  }

  return (
    <>
      {/* Skip-to-content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#c9a84c] focus:px-4 focus:py-2 focus:text-[#0f0f0f] focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Viewport-Correct Cinematic Hero — height = 100svh minus sticky header */}
      <section
        aria-labelledby="hero-heading"
        className="viewport-hero flex flex-col border-b border-[#2d2924]"
        style={{ background: "#080706" }}
      >
        {/* ── 1. Full-Bleed Background Video — vibrant and visible ── */}
        <video
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none scale-[1.05]"
          style={{ opacity: 0.92, filter: "brightness(0.88) contrast(1.05) saturate(1.15)" }}
        />

        {/* ── 2. Live Interactive 3D Canvas Overlay (Particles & Golden Orbits) ── */}
        <Hero3DCanvas />

        {/* ── 3. Light, balanced dark overlays for clear video + sharp text contrast ── */}
        {/* Full-screen soft dark tint layer */}
        <div
          className="absolute inset-0 pointer-events-none z-1"
          aria-hidden="true"
          style={{ background: "rgba(6,5,4,0.22)" }}
        />

        {/* Left-side soft gradient for text contrast */}
        <div
          className="absolute inset-0 pointer-events-none z-1"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to right, rgba(5,4,3,0.72) 0%, rgba(5,4,3,0.40) 45%, rgba(5,4,3,0.05) 100%)",
          }}
        />

        {/* Bottom vignette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 z-1 pointer-events-none"
          aria-hidden="true"
          style={{
            background: "linear-gradient(to top, rgba(5,4,3,0.85) 0%, transparent 100%)",
          }}
        />

        {/* Soft warm-gold ambient glow orb */}
        <div
          className="absolute -left-20 top-1/4 h-[460px] w-[460px] rounded-full pointer-events-none z-1"
          aria-hidden="true"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)",
            animation: "goldPulse 7s ease-in-out infinite",
          }}
        />

        {/* ── 4. Hero Content — flex-centered inside available viewport area ── */}
        <div className="viewport-hero-inner site-shell">
          <div className="max-w-[680px] space-y-5 sm:space-y-6">
            
            {/* Eyebrow */}
            <div className="hero-eyebrow-anim flex items-center gap-3">
              <span className="h-px w-7 bg-[#c9a84c]/60" />
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">
                ROOTED IN TRADITION • CRAFTED IN PAKISTAN
              </span>
            </div>

            {/* Headline — larger, bolder, white */}
            <h1
              id="hero-heading"
              className="font-display font-bold tracking-tight text-white mt-3"
              style={{ fontSize: "clamp(52px, 6.5vw, 90px)", lineHeight: 1.0 }}
            >
              <span className="hero-line-container">
                <span className="hero-line-inner hero-line-inner-1 block">
                  Pure tradition.
                </span>
              </span>
              <span className="hero-line-container mt-1 sm:mt-2">
                <span className="hero-line-inner hero-line-inner-2 block">
                  <span className="gold-shimmer-once">Crafted for today.</span>
                </span>
              </span>
            </h1>

            {/* Supporting Paragraph — larger, crisp white */}
            <p
              className="hero-para-anim text-[#f0ebe2] font-normal leading-relaxed mt-4 max-w-[520px]"
              style={{ fontSize: "clamp(16px, 1.3vw, 20px)" }}
            >
              Discover authentic chutneys, pickles, oils, and herbal essentials crafted with care for everyday kitchens, shelves, and routines.
            </p>

            {/* CTA Buttons — larger */}
            <div className="hero-cta-anim flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/categories"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-[#c9a84c] px-9 py-4 text-[13px] font-bold uppercase tracking-[0.22em] text-[#0a0907] shadow-xl shadow-[#c9a84c]/25 transition-all duration-300 hover:shadow-[#c9a84c]/50 hover:-translate-y-0.5"
              >
                <span>SHOP THE COLLECTION</span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/8 backdrop-blur-sm px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-[#c9a84c]/70 hover:text-[#c9a84c] hover:bg-white/12"
              >
                <span>OUR HERITAGE</span>
                <span aria-hidden="true" className="text-sm">↗</span>
              </Link>
            </div>

          </div>
        </div>

        {/* ── 4. Minimal Scroll Indicator ── */}
        <div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none z-10"
          aria-hidden="true"
        >
          <span className="text-[9px] uppercase tracking-[0.32em] text-[#c9a84c]/80 font-semibold">
            SCROLL TO EXPLORE
          </span>
          <div className="w-px h-7 bg-gradient-to-b from-[#c9a84c]/70 to-transparent animate-pulse" />
        </div>

        {/* ── Keyframe styles ── */}
        <style>{`
          @keyframes goldPulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50%       { opacity: 0.85; transform: scale(1.06); }
          }
        `}</style>
      </section>

      {/* Featured / Best Sellers Showcase */}
      {featuredProducts.length > 0 && (
        <section aria-labelledby="featured-heading" className="py-16 sm:py-24 border-b border-[#2a2620] bg-[#110f0e]">
          <div className="site-shell px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-2">
                  Considered Selection
                </p>
                <h2 id="featured-heading" className="font-display text-3xl sm:text-4xl font-bold text-[#f6f0e7]">
                  Featured & Best Sellers
                </h2>
              </div>
              <Link
                href="/categories"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9a84c] hover:underline self-start sm:self-auto"
              >
                View Complete Shop →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Showcase Rows */}
      <CategoryShowcase
        categories={categories}
        error={catalogError}
        intro={content.homepageCopy}
        featuredContent={content.featuredContent}
      />

      {/* Brand Heritage Story Teaser */}
      <section aria-label="Brand Philosophy" className="py-20 border-t border-[#2a2620] bg-[#13110f] relative overflow-hidden">
        <div className="site-shell max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a84c]">
            The Noor Herbal Philosophy
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f6f0e7] leading-tight">
            Rooted in Authentic Rituals. Prepared With Honest Care.
          </h2>
          <p className="text-base sm:text-lg text-[#bfb7aa] leading-relaxed max-w-2xl mx-auto">
            From authentic Aloo Bukhara chutney and traditional mango pickles shared around dinner tables, to pure herbal hair oils and shampoos created for daily rejuvenation—our creations honor time-tested heritage.
          </p>
          <div className="pt-4">
            <Link href="/about" className="button-primary px-8 py-3.5 text-xs uppercase tracking-[0.18em]">
              Read Our Full Story
            </Link>
          </div>
        </div>
      </section>

      {/* Quality / Values Trust Strip */}
      <section aria-label="Our values" className="border-t border-[#25221d] bg-[#0c0b0a] py-14">
        <div className="site-shell px-4 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#25221d]">
            {[
              {
                number: "01",
                title: "Artisanal & Thoughtful",
                desc: "Every jar and formulation is created in considered small batches with natural ingredients.",
              },
              {
                number: "02",
                title: "Authentic Recipes",
                desc: "Preserving traditional Pakistani tastes and herbal knowledge passed through generations.",
              },
              {
                number: "03",
                title: "Nationwide Direct Delivery",
                desc: "Fast, tracked shipping across all cities in Pakistan with direct WhatsApp confirmation.",
              },
            ].map(({ number, title, desc }) => (
              <li key={title} className="flex flex-col items-center px-4 pt-6 sm:pt-0">
                <span className="font-display text-2xl font-bold text-[#c9a84c]" aria-hidden="true">
                  {number}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-[#f6f0e7]">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-[#8e8578] max-w-xs leading-relaxed">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
