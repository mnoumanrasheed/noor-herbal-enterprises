"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Category } from "@/types";
import { ProductCard } from "@/components/storefront/ProductCard";

interface CategoryShowcaseProps {
  categories: Category[];
  error?: boolean;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  featuredContent?: string;
}

export function CatalogUnavailable() {
  return (
    <div className="rounded-3xl border border-[#c9a84c]/30 bg-[#12100e] p-10 sm:p-14 text-center my-10 shadow-2xl relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle at center, rgba(201,168,76,0.2) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 space-y-4">
        <div className="mx-auto w-14 h-14 rounded-2xl border border-[#c9a84c]/50 bg-[#1a1612] flex items-center justify-center text-[#c9a84c] text-xl font-serif shadow-lg">
          ✦
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#c9a84c] block">
          ATELIER SERVICE UPDATE
        </span>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#f6f0e7]">
          Catalogue Temporarily Unavailable
        </h3>
        <p className="text-sm text-[#b8b0a2] max-w-md mx-auto leading-relaxed">
          We are updating our seasonal product catalogue. Please refresh your page or reach out directly to customer care.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#c9a84c] px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#0a0907] shadow-lg hover:bg-[#d8b467] transition-colors"
          >
            <span>Contact Customer Care</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CatalogEmpty({ message = "No products listed in this collection yet." }: { message?: string }) {
  return (
    <div className="rounded-3xl border border-[#383229] bg-[#12100e] p-10 sm:p-12 text-center my-8 shadow-xl relative overflow-hidden">
      <div className="relative z-10 space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#c9a84c] block">
          CURATED ARTISANAL BATCH
        </span>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#f6f0e7] max-w-lg mx-auto">
          {message}
        </h3>
        <p className="text-xs sm:text-sm text-[#a09a8f] max-w-md mx-auto leading-relaxed">
          Our small-batch kitchen and herbal formulations are freshly prepared in limited quantities across seasons.
        </p>
        <div className="pt-2">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/50 bg-[#1a1612] px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0907] transition-all duration-300 shadow-md"
          >
            <span>Explore All Collections</span>
            <span aria-hidden="true">➔</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CategoryShowcase({
  categories,
  error = false,
  eyebrow = "COLLECTION DISCOVERY",
  heading = "Curated For Daily Rituals & The Table",
  intro = "Explore handcrafted chutneys, traditional pickles, nourishing botanical oils, and herbal shampoos.",
}: CategoryShowcaseProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  if (error) {
    return (
      <section className="site-shell px-4 sm:px-6 lg:px-8 py-16">
        <CatalogUnavailable />
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="site-shell px-4 sm:px-6 lg:px-8 py-16">
        <CatalogEmpty message="The Noor Herbal collection catalogue is currently being prepared for the next batch." />
      </section>
    );
  }

  const filteredCategories = selectedFilter === "all"
    ? categories
    : categories.filter((c) => c.slug.toLowerCase().includes(selectedFilter) || selectedFilter.includes(c.slug.toLowerCase()));

  return (
    <section id="all-collections" aria-labelledby="categories-heading" className="category-showcase-section py-20 bg-[#080706]">
      <div className="site-shell px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Ultra-Luxury Section Header Panel */}
        <div className="relative rounded-3xl border border-[#332e27] bg-gradient-to-b from-[#161411] to-[#0d0c0a] p-8 sm:p-12 shadow-2xl overflow-hidden">
          {/* Ambient Gold Background Glow */}
          <div
            className="absolute top-0 right-0 h-[400px] w-[500px] rounded-full pointer-events-none opacity-30"
            aria-hidden="true"
            style={{
              background: "radial-gradient(circle at 70% 20%, rgba(201,168,76,0.18) 0%, transparent 65%)",
            }}
          />

          <div className="relative z-10 space-y-8">
            {/* Top Eyebrow & Live Counter */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2a2620] pb-6">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#c9a84c]/40 bg-[#1e1a14] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.26em] text-[#c9a84c] shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
                <span>{eyebrow}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#c9a84c]">
                <span className="text-[#a09a8f]">Total Collections:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#c9a84c] font-bold">
                  {categories.length}
                </span>
              </div>
            </div>

            {/* Title & Filter Row */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              {/* Heading & Paragraph */}
              <div className="space-y-3 max-w-2xl">
                <h2 id="categories-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f6f0e7] leading-tight tracking-tight">
                  {heading}
                </h2>
                <p className="text-sm sm:text-base text-[#d0c9bd] leading-relaxed font-normal max-w-xl">
                  {intro}
                </p>
              </div>

              {/* Luxury Filter Buttons Bar */}
              <div className="flex-shrink-0 pt-2 lg:pt-0">
                <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl border border-[#332e27] bg-[#0f0e0c]/90 backdrop-blur-md p-2 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("all")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
                      selectedFilter === "all"
                        ? "bg-[#c9a84c] text-[#0a0907] shadow-lg shadow-[#c9a84c]/20 font-extrabold scale-[1.02]"
                        : "text-[#c9a84c]/80 border border-transparent hover:border-[#c9a84c]/40 hover:bg-[#1a1713] hover:text-[#f6f0e7]"
                    }`}
                  >
                    All ({categories.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedFilter(cat.slug.toLowerCase())}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
                        selectedFilter === cat.slug.toLowerCase()
                          ? "bg-[#c9a84c] text-[#0a0907] shadow-lg shadow-[#c9a84c]/20 font-extrabold scale-[1.02]"
                          : "text-[#c9a84c]/80 border border-transparent hover:border-[#c9a84c]/40 hover:bg-[#1a1713] hover:text-[#f6f0e7]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Categories Showcase */}
        <div className="space-y-16">
          {filteredCategories.map((category, index) => {
            const products = category.products ?? [];
            const collectionIndex = String(category.sort_order || index + 1).padStart(2, "0");

            return (
              <article
                key={category.id}
                className="group relative rounded-3xl border border-[#2d2822] bg-[#12100e] p-6 sm:p-10 shadow-2xl transition-all duration-300 hover:border-[#c9a84c]/60"
              >
                {/* Category Header Bar (Entire Row is Clickable & Navigation Friendly) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#25221d] pb-8 mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#c9a84c] bg-[#1a1612] px-3.5 py-1 rounded-full border border-[#c9a84c]/30 shadow-sm">
                        COLLECTION {collectionIndex}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#a09a8f]">
                        {products.length} {products.length === 1 ? "Product" : "Products"} Available
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-4xl font-bold text-[#f6f0e7] group-hover:text-[#c9a84c] transition-colors">
                      <Link href={`/categories/${category.slug}`}>
                        {category.name}
                      </Link>
                    </h3>

                    {category.description && (
                      <p className="text-xs sm:text-sm text-[#a09a8f] max-w-2xl leading-relaxed">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {/* Direct Collection CTA Link */}
                  <Link
                    href={`/categories/${category.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/40 bg-[#181512] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0907] transition-all duration-300 shadow-md self-start md:self-center"
                  >
                    <span>EXPLORE COLLECTION</span>
                    <span aria-hidden="true">➔</span>
                  </Link>
                </div>

                {/* Product Cards Grid */}
                {products.length > 0 ? (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    role="list"
                    aria-label={`${category.name} products`}
                  >
                    {products.map((product) => (
                      <div key={product.id} role="listitem">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#2d2822] bg-[#161411]/80 p-8 text-center space-y-3">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c9a84c]">
                      Fresh Batch In Preparation
                    </p>
                    <p className="text-xs text-[#a09a8f]">
                      New handcrafted {category.name.toLowerCase()} formulations are being prepared in our kitchens.
                    </p>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="inline-block text-xs font-semibold uppercase tracking-wider text-[#c9a84c] hover:underline pt-1"
                    >
                      View Collection Atelier Page ↗
                    </Link>
                  </div>
                )}
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
