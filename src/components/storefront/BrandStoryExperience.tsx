"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { BrandStoryContent } from "@/lib/site-settings";

export function BrandStoryExperience({ story }: { story: BrandStoryContent }) {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = Array.from(page.querySelectorAll<HTMLElement>("[data-story-reveal]"));

    if (reducedMotion) {
      reveals.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    page.classList.add("story-motion-ready");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    reveals.forEach((item) => observer.observe(item));

    const updateParallax = (event: PointerEvent) => {
      const bounds = page.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / Math.min(bounds.height, window.innerHeight) - 0.5) * 2));
      page.style.setProperty("--story-pointer-x", `${x * 18}px`);
      page.style.setProperty("--story-pointer-y", `${y * 14}px`);
    };
    const resetParallax = () => {
      page.style.setProperty("--story-pointer-x", "0px");
      page.style.setProperty("--story-pointer-y", "0px");
    };

    page.addEventListener("pointermove", updateParallax, { passive: true });
    page.addEventListener("pointerleave", resetParallax, { passive: true });
    return () => {
      observer.disconnect();
      page.removeEventListener("pointermove", updateParallax);
      page.removeEventListener("pointerleave", resetParallax);
    };
  }, []);

  return (
    <main ref={pageRef} className="brand-story-page">
      <section aria-labelledby="story-heading" className="brand-story-hero">
        <div className="brand-story-hero-glow" aria-hidden="true" />
        <div className="site-shell brand-story-hero-grid px-4 sm:px-6 lg:px-8">
          <div className="brand-story-hero-copy" data-story-reveal>
            <p className="eyebrow brand-story-hero-kicker">Noor Herbal Enterprises</p>
            <h1 id="story-heading" className="brand-story-hero-title">{story.heading}</h1>
            <p className="brand-story-hero-lede">{story.bodyOne}</p>
            <p className="brand-story-hero-detail">For the table and everyday care</p>
          </div>
          <div className="brand-story-hero-art" data-story-reveal="image">
            <div className="brand-story-opening-frame" aria-hidden="true" />
            <div className="brand-story-opening-orbit brand-story-opening-orbit-one" aria-hidden="true" />
            <div className="brand-story-opening-orbit brand-story-opening-orbit-two" aria-hidden="true" />
            <div className="brand-story-opening-main">
              <Image src={story.openingImage} alt={story.openingImageAlt} fill priority sizes="(max-width: 767px) 86vw, 40vw" />
            </div>
            <div className="brand-story-opening-accent" aria-hidden="true">
              <Image src="/images/products/crush-mango-pickle.jpeg" alt="" fill sizes="(max-width: 767px) 36vw, 18vw" />
            </div>
            <p className="brand-story-photo-caption">Authentic product photography</p>
          </div>
        </div>
      </section>

      <section className="brand-story-reading">
        <div className="site-shell brand-story-reading-grid px-4 sm:px-6 lg:px-8">
          <p className="brand-story-section-label" aria-hidden="true">01 / The story</p>
          <div data-story-reveal>
            <p>{story.bodyTwo}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="mission-heading" className="brand-story-purpose">
        <div className="site-shell px-4 sm:px-6 lg:px-8">
          <article className="brand-story-purpose-mission brand-story-purpose-grid" data-story-reveal>
            <div className="brand-story-purpose-copy">
              <p className="eyebrow">Mission</p>
              <h2 id="mission-heading">For everyday life, made easier.</h2>
              <p>{story.mission}</p>
            </div>
            <div className="brand-story-purpose-media brand-story-purpose-media-mission">
              <Image src={story.missionImage} alt={story.missionImageAlt} fill sizes="(max-width: 767px) 88vw, 46vw" />
            </div>
          </article>

          <article className="brand-story-purpose-vision brand-story-purpose-grid brand-story-vision-grid" data-story-reveal>
            <div className="brand-story-purpose-media brand-story-purpose-media-vision">
              <Image src={story.visionImage} alt={story.visionImageAlt} fill sizes="(max-width: 767px) 88vw, 40vw" />
            </div>
            <div className="brand-story-purpose-copy">
              <p className="eyebrow">Vision</p>
              <h2 id="vision-heading">A collection people return to.</h2>
              <p>{story.vision}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="brand-story-closing" data-story-reveal>
        <div className="site-shell px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Explore the collection</p>
          <h2>Discover what belongs in your everyday.</h2>
          <Link href="/categories" className="button-primary">Explore the collection</Link>
        </div>
      </section>
    </main>
  );
}
