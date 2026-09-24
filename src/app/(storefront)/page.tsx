import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { getActiveCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Noor Herbal Enterprises — Pure. Natural. Handcrafted.",
  description:
    "Discover our range of natural chutneys, pickles, oils, and herbal shampoos crafted from the finest ingredients.",
};

// ISR: revalidate homepage every 60 s
export const revalidate = 60;

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof getActiveCategories>> = [];
  try {
    categories = await getActiveCategories();
  } catch {
    // DB not configured yet — render static shell
    categories = [];
  }

  return (
    <>
      {/* Skip-to-content link for keyboard/screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[#c9a84c] focus:px-4 focus:py-2 focus:text-[#0f0f0f] focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Hero section */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden bg-[#0f0f0f] text-white"
      >
        {/* Background texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1c1c1c] to-[#0f0f0f] opacity-90"
        />
        {/* Gold accent line */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 text-center">
          {/* Eyebrow */}
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a84c]">
            Pure · Natural · Handcrafted
          </p>

          <h1
            id="hero-heading"
            className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
          >
            Rooted in Nature,
            <br />
            <span className="text-[#c9a84c]">Crafted with Care</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-[#a09a8f] leading-relaxed">
            Noor Herbal Enterprises brings you authentic, chemical-free products
            made from handpicked natural ingredients — from your kitchen to your
            daily care routine.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/categories"
              className="rounded-[8px] bg-[#c9a84c] px-7 py-3.5 text-base font-semibold text-[#0f0f0f] hover:bg-[#a67c2e] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9a84c] focus-visible:outline-offset-2"
            >
              Shop All Products
            </Link>
            <Link
              href="/about"
              className="rounded-[8px] border border-[#c9a84c]/50 px-7 py-3.5 text-base font-medium text-[#d4cfc5] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section
        aria-labelledby="categories-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      >
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-2">
            Our Collections
          </p>
          <h2
            id="categories-heading"
            className="font-display text-3xl font-bold text-[#0f0f0f] sm:text-4xl"
          >
            Shop by Category
          </h2>
          <hr className="divider-gold mt-4 max-w-xs mx-auto" />
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {["Chutney", "Pickles", "Oils", "Shampoo"].map((name) => (
              <div
                key={name}
                className="aspect-[4/3] animate-pulse rounded-[12px] bg-[#e8e3d9]"
                aria-label={`Loading ${name} category`}
              />
            ))}
          </div>
        )}

        {categories.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/categories"
              className="inline-block rounded-[8px] border border-[#c9a84c] px-6 py-2.5 text-sm font-medium text-[#c9a84c] hover:bg-[#f5eecf] transition-colors"
            >
              View all categories
            </Link>
          </div>
        )}
      </section>

      {/* Values strip */}
      <section
        aria-label="Our values"
        className="border-y border-[#e8e3d9] bg-[#0f0f0f]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
            {[
              { icon: "🌿", title: "100% Natural", desc: "No preservatives, no artificial colours." },
              { icon: "🤲", title: "Handcrafted", desc: "Small batches, authentic recipes." },
              { icon: "🚚", title: "Fast Delivery", desc: "Doorstep delivery across India." },
            ].map(({ icon, title, desc }) => (
              <li key={title} className="flex flex-col items-center">
                <span className="text-3xl" aria-hidden="true">{icon}</span>
                <h3 className="mt-3 font-display text-base font-semibold text-[#c9a84c]">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-[#a09a8f]">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
