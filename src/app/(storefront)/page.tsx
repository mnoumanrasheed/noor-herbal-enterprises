import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CategoryShowcase } from "@/components/storefront/CategoryShowcase";
import HeroScene from "@/components/storefront/HeroScene";
import { getCategoryShowcases, getHeroSettings, getStorefrontContent } from "@/lib/queries";
import { DEFAULT_HERO_SETTINGS, type HeroSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Noor Herbal Enterprises — Traditional. Thoughtful. Handcrafted.",
  description:
    "Discover our range of chutneys, pickles, oils, and herbal shampoos made with care in Pakistan.",
};

// ISR: revalidate homepage every 60 s
export const revalidate = 60;

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof getCategoryShowcases>> = [];
  let catalogError = false;
  let hero: HeroSettings = DEFAULT_HERO_SETTINGS;
  let content = { homepageCopy: "Discover chutneys, pickles, oils, and shampoos composed with care for kitchens, shelves, and daily routines.", featuredContent: "A considered selection from the Noor Herbal collection.", footerContent: "" };
  try {
    categories = await getCategoryShowcases();
  } catch {
    catalogError = true;
  }
  try {
    hero = await getHeroSettings();
  } catch {
    // Render managed defaults until the database is available.
  }
  try { content = await getStorefrontContent(); } catch { /* managed defaults remain visible */ }

  return (
    <>
      {/* Skip-to-content link for keyboard/screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[#c9a84c] focus:px-4 focus:py-2 focus:text-[#0f0f0f] focus:font-semibold"
      >
        Skip to main content
      </a>

      <section aria-labelledby="hero-heading" className="hero-section">
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="site-shell hero-layout px-4 sm:px-6 lg:px-8">
          <div className="hero-copy">
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 id="hero-heading" className="hero-heading">{hero.title}</h1>
            <p className="hero-description">{hero.description}</p>
            <div className="hero-actions">
              <Link href="/categories" className="button-primary">{hero.ctaLabel}</Link>
              <Link href="/about" className="hero-secondary-action">Our story <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="hero-meta" aria-label="Collection details">
              <span>01 / 04</span>
              <span className="hero-meta-rule" aria-hidden="true" />
              <span>{hero.visualCategory}</span>
            </div>
          </div>
          <div className="hero-visual-wrap">
            <HeroScene />
            <div className="hero-visual-caption" aria-hidden="true">
              <span>Four expressions</span>
              <span>One considered collection</span>
            </div>
            <p className="sr-only">A composed 3D arrangement of unlabelled jars and bottles representing chutney, pickles, oils, and shampoo. Product packaging will be added when approved assets are available.</p>
          </div>
        </div>
        <div className="hero-bottom-line" aria-hidden="true" />
      </section>

      <CategoryShowcase categories={categories} error={catalogError} intro={content.homepageCopy} featuredContent={content.featuredContent} />

      {/* Values strip */}
      <section
        aria-label="Our values"
        className="border-y border-[#e8e3d9] bg-[#0f0f0f]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
            {[
              { number: "01", title: "Thoughtfully Made", desc: "Carefully prepared in small batches." },
              { number: "02", title: "Handcrafted", desc: "Small batches, authentic recipes." },
              { number: "03", title: "Pakistan Delivery", desc: "Delivery options confirmed at checkout." },
            ].map(({ number, title, desc }) => (
              <li key={title} className="flex flex-col items-center">
                <span className="font-display text-xl text-[#c9a84c]" aria-hidden="true">{number}</span>
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
