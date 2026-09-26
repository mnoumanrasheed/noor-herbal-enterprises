"use client";

import React, { useState } from "react";
import type { ContactSettings } from "@/lib/site-settings";
import { Contact3DCanvas } from "@/components/storefront/Contact3DCanvas";

interface ContactExperienceProps {
  settings: ContactSettings;
}

const FAQ_ITEMS = [
  {
    question: "How quickly will I receive a response to my message?",
    answer:
      "We respond to all email inquiries within 24 hours. For urgent order updates or instant product assistance, we recommend messaging us directly on WhatsApp where our team is online daily.",
  },
  {
    question: "Can I place orders directly through WhatsApp?",
    answer:
      "Yes! You can complete your checkout directly on our website, which generates a pre-formatted order summary directly sent to our WhatsApp line for instant confirmation.",
  },
  {
    question: "Do you ship across all cities in Pakistan?",
    answer:
      "Yes, we deliver nationwide to all cities, towns, and regions in Pakistan. Delivery charges are finalized transparently with you during order confirmation on WhatsApp.",
  },
  {
    question: "How can I ask for advice on which product to choose?",
    answer:
      "Whether you need guidance choosing the right traditional chutney, pickle jar size, or botanical hair oil for your routine, send us a message and our team will gladly assist you.",
  },
];

export function ContactExperience({ settings }: ContactExperienceProps) {
  const whatsappNumber = settings.phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Noor Herbal Enterprises, I have a question regarding your products/orders.")}`;

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="contact-page-wrapper text-[#f6f0e7] bg-[#080706] pb-24">
      
      {/* ── 1. Viewport-Correct 3D Luxury Contact Hero ── */}
      <section
        aria-labelledby="contact-hero-title"
        className="viewport-hero flex flex-col border-b border-[#2d2924]"
        style={{ background: "#080706" }}
      >
        {/* 3D Background Canvas Layer */}
        <div className="absolute inset-0 z-0">
          <Contact3DCanvas />
        </div>

        {/* Layered Overlays for Text Legibility & Brand Lighting */}
        <div
          className="absolute inset-0 z-1 pointer-events-none bg-[#080706]/35"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 z-1 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to right, rgba(8,7,6,0.96) 0%, rgba(8,7,6,0.78) 48%, rgba(8,7,6,0.2) 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-36 z-1 pointer-events-none"
          aria-hidden="true"
          style={{
            background: "linear-gradient(to top, rgba(8,7,6,0.95) 0%, transparent 100%)",
          }}
        />

        {/* Hero Content Stage: flex-centered */}
        <div className="viewport-hero-inner site-shell z-10">
          <div className="max-w-2xl space-y-4 sm:space-y-5">
            
            {/* Eyebrow */}
            <div className="hero-eyebrow-anim flex items-center gap-3">
              <span className="h-px w-8 bg-[#c9a84c]/60" />
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/35 bg-[#161412]/90 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a84c] shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
                WE ARE HERE TO HELP
              </span>
            </div>

            {/* Headline */}
            <h1
              id="contact-hero-title"
              className="hero-h1-sub font-display font-bold tracking-tight mt-1"
            >
              <span className="hero-line-container">
                <span className="hero-line-inner hero-line-inner-1 block">
                  We’d love to hear
                </span>
              </span>
              <span className="hero-line-container mt-1 sm:mt-2">
                <span className="hero-line-inner hero-line-inner-2 block">
                  <span className="gold-shimmer-once italic font-serif">from you.</span>
                </span>
              </span>
            </h1>

            {/* Paragraph */}
            <p className="hero-para-anim hero-p">
              For product questions, order support, collaborations, or a simple hello, our customer care team is online and ready to assist you.
            </p>

            {/* Small Support Note */}
            <div className="hero-para-anim text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a84c] flex items-center gap-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
              <span>Reach us by Email, WhatsApp, or Instagram</span>
            </div>

            {/* CTAs */}
            <div className="hero-cta-anim flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#c9a84c] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0a0907] shadow-xl shadow-[#c9a84c]/20 hover:bg-[#d8b467] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Chat on WhatsApp</span>
                <svg className="w-4 h-4 text-[#0a0907]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e0d8cc] hover:border-[#c9a84c]/60 hover:text-[#c9a84c] hover:bg-white/10 transition-all duration-300"
              >
                <span>Direct Email</span>
                <svg className="w-4 h-4 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </a>
            </div>

          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none z-10"
          aria-hidden="true"
        >
          <span className="text-[9px] uppercase tracking-[0.32em] text-[#c9a84c]/80 font-semibold">
            SCROLL TO CONNECT
          </span>
          <div className="w-px h-7 bg-gradient-to-b from-[#c9a84c]/70 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── 2. Content Sections (Direct Channels & Commitments) ── */}
      <div className="site-shell px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20 space-y-16 lg:space-y-24">
        
        {/* Direct Channels Grid */}
        <section aria-label="Direct Contact Channels" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-1">
                Direct Channels
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#f6f0e7]">
                Connect With Our Team
              </h2>
            </div>
            <p className="text-xs text-[#8e8578]">Select your preferred method of communication.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Card */}
            <a
              href={`mailto:${settings.email}`}
              className="group relative flex flex-col justify-between rounded-3xl border border-[#2d2924] bg-[#12100e] p-7 transition-all duration-300 hover:border-[#c9a84c]/60 hover:bg-[#181512] hover:-translate-y-1 shadow-xl hover:shadow-[#c9a84c]/10"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#38332a] bg-[#1c1916] text-[#c9a84c] group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[#8e8578]">Email</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#f6f0e7] mb-1">
                  Email Support
                </h3>
                <p className="text-xs font-mono text-[#c9a84c] break-all mb-3 font-semibold">
                  {settings.email}
                </p>
                <p className="text-xs text-[#bfb7aa] leading-relaxed">
                  For detailed product inquiries, customer support, and general questions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#25221d] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#c9a84c] group-hover:text-[#f4db8d]">
                <span>Send an Email</span>
                <span className="transition-transform group-hover:translate-x-1">➔</span>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col justify-between rounded-3xl border border-[#c9a84c]/40 bg-[#14120f] p-7 transition-all duration-300 hover:border-[#c9a84c] hover:bg-[#1b1713] hover:-translate-y-1 shadow-xl shadow-[#c9a84c]/5 hover:shadow-[#c9a84c]/15"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c9a84c]/30 bg-[#1e1913] text-[#c9a84c] group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                    </svg>
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/25 px-2 py-0.5 rounded-full font-bold">
                    Fastest
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#f6f0e7] mb-1">
                  WhatsApp Helpline
                </h3>
                <p className="text-xs font-mono text-[#c9a84c] mb-3 font-semibold">
                  {settings.phone}
                </p>
                <p className="text-xs text-[#bfb7aa] leading-relaxed">
                  For instant order confirmation, stock availability, and quick support.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#332e27] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#c9a84c] group-hover:text-[#f4db8d]">
                <span>Chat on WhatsApp</span>
                <span className="transition-transform group-hover:translate-x-1">➔</span>
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href={settings.instagram}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col justify-between rounded-3xl border border-[#2d2924] bg-[#12100e] p-7 transition-all duration-300 hover:border-[#c9a84c]/60 hover:bg-[#181512] hover:-translate-y-1 shadow-xl hover:shadow-[#c9a84c]/10"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#38332a] bg-[#1c1916] text-[#c9a84c] group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[#8e8578]">Social</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#f6f0e7] mb-1">
                  Instagram
                </h3>
                <p className="text-xs font-mono text-[#c9a84c] mb-3 font-semibold">
                  @noorherbalenterprices
                </p>
                <p className="text-xs text-[#bfb7aa] leading-relaxed">
                  Follow our latest releases, behind-the-scenes, and traditional stories.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#25221d] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#c9a84c] group-hover:text-[#f4db8d]">
                <span>Visit Instagram</span>
                <span className="transition-transform group-hover:translate-x-1">↗</span>
              </div>
            </a>
          </div>
        </section>

        {/* Customer Care Commitments Grid */}
        <section aria-label="Support & Service Commitments" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-1">
                Customer Care & Commitments
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#f6f0e7]">
                How We Serve You
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/30 bg-[#1c1813] px-3.5 py-1 text-[11px] font-semibold text-[#c9a84c]">
              <svg className="w-3.5 h-3.5 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
              <span>Fast WhatsApp Customer Assistance</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Response Commitment */}
            <div className="group relative flex flex-col justify-between rounded-3xl border border-[#383229] bg-[#12100e] p-7 transition-all duration-300 hover:border-[#c9a84c] hover:bg-[#181512] hover:-translate-y-1 shadow-xl hover:shadow-[#c9a84c]/10">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c9a84c]/30 bg-[#1c1813] text-[#c9a84c] group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-2.5 py-0.5 rounded-full">
                    24h Response
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#f6f0e7] mb-2">
                  Response Commitment
                </h3>
                <p className="text-xs text-[#bfb7aa] leading-relaxed">
                  We usually respond within 24 hours for email inquiries and faster on WhatsApp during business hours (10:00 AM – 8:00 PM PKT).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#25221d] flex items-center justify-between text-[11px] font-semibold text-[#8e8578]">
                <span>Daily Online Support</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
              </div>
            </div>

            {/* Box 2: Personal Product Advice */}
            <div className="group relative flex flex-col justify-between rounded-3xl border border-[#383229] bg-[#12100e] p-7 transition-all duration-300 hover:border-[#c9a84c] hover:bg-[#181512] hover:-translate-y-1 shadow-xl hover:shadow-[#c9a84c]/10">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c9a84c]/30 bg-[#1c1813] text-[#c9a84c] group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-2.5 py-0.5 rounded-full">
                    Tailored Advice
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#f6f0e7] mb-2">
                  Personal Product Assistance
                </h3>
                <p className="text-xs text-[#bfb7aa] leading-relaxed">
                  Unsure which chutney, pickle, or botanical hair oil suits your routine best? Chat directly with our product team for tailored recommendations.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#25221d] flex items-center justify-between text-[11px] font-semibold text-[#8e8578]">
                <span>Expert Guidance</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
              </div>
            </div>

            {/* Box 3: Nationwide Delivery */}
            <div className="group relative flex flex-col justify-between rounded-3xl border border-[#383229] bg-[#12100e] p-7 transition-all duration-300 hover:border-[#c9a84c] hover:bg-[#181512] hover:-translate-y-1 shadow-xl hover:shadow-[#c9a84c]/10">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c9a84c]/30 bg-[#1c1813] text-[#c9a84c] group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-2.5 py-0.5 rounded-full">
                    All Pakistan
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#f6f0e7] mb-2">
                  Nationwide Direct Delivery
                </h3>
                <p className="text-xs text-[#bfb7aa] leading-relaxed">
                  Based in Pakistan. Delivering pure botanical and pantry essentials across all cities with direct WhatsApp confirmation and tracking.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#25221d] flex items-center justify-between text-[11px] font-semibold text-[#8e8578]">
                <span>Tracked Shipping</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
              </div>
            </div>
          </div>

          {/* Featured Full-Width WhatsApp CTA Card */}
          <div className="rounded-3xl border border-[#c9a84c]/40 bg-gradient-to-r from-[#181511] via-[#14110e] to-[#181511] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-display text-xl font-bold text-[#f6f0e7]">
                Need Instant Help or Order Updates?
              </h3>
              <p className="text-xs text-[#bfb7aa]">
                Our WhatsApp team is online daily for rapid order confirmation and personal customer assistance.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="button-primary whitespace-nowrap px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] shadow-xl flex items-center gap-2"
            >
              <span>Chat Directly on WhatsApp</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
            </a>
          </div>
        </section>

        {/* Quick Support FAQ Accordion Section */}
        <section aria-labelledby="faq-heading" className="space-y-6 pt-4 border-t border-[#25221d]">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c]">
              Quick Answers
            </p>
            <h2 id="faq-heading" className="font-display text-3xl font-bold text-[#f6f0e7]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#a09a8f]">
              Find instant answers to common questions about contacting us and placing orders.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.question}
                  className="rounded-2xl border border-[#28241e] bg-[#12100e] overflow-hidden transition-colors hover:border-[#c9a84c]/40"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-[#f6f0e7] hover:text-[#c9a84c] transition-colors"
                  >
                    <span>{item.question}</span>
                    <span className="ml-4 font-mono text-xs text-[#c9a84c]">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-[#bfb7aa] leading-relaxed border-t border-[#221f19] pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
