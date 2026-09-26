"use client";

import React, { useEffect, useState } from "react";

export function BrandLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setVisible(false);
      return;
    }

    const startTime = performance.now();
    const duration = 1200; // 1.2s luxury load time

    let frameId: number;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 100) {
        frameId = requestAnimationFrame(step);
      } else {
        // Trigger smooth fade out
        setFading(true);
        setTimeout(() => {
          setVisible(false);
        }, 500);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-label="Loading Noor Herbal Enterprises"
      role="status"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between p-8 sm:p-12 bg-[#080706] text-[#f6f0e7] select-none transition-opacity duration-500 ease-in-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Ambient Radial Gold Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(201, 168, 76, 0.22) 0%, rgba(212, 155, 61, 0.05) 55%, rgba(8, 7, 6, 0.98) 80%)",
        }}
      />

      {/* Subtle Micro Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(rgba(201, 168, 76, 0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top Header Tag */}
      <div className="relative z-10 pt-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.32em] text-[#c9a84c]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
        <span>ARTISANAL PANTRY & BOTANICAL CARE</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
      </div>

      {/* Center Monogram & Brand Showcase */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 my-auto">
        
        {/* Double-Ring Glowing Emblem */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#c9a84c]/40 flex items-center justify-center shadow-2xl transition-transform duration-700"
            style={{
              boxShadow: "0 0 50px rgba(201, 168, 76, 0.25)",
            }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#c9a84c] bg-[#161310] flex items-center justify-center shadow-inner">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#c9a84c] tracking-tighter">
                N
              </span>
            </div>
          </div>
          <span className="absolute -top-1.5 text-[10px] text-[#c9a84c]">✦</span>
          <span className="absolute -bottom-1.5 text-[10px] text-[#c9a84c]">✦</span>
        </div>

        {/* Brand Name */}
        <div className="space-y-1">
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-wider text-[#f6f0e7] leading-tight">
            NOOR HERBAL
          </h1>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.36em] text-[#c9a84c]">
            ENTERPRISES
          </p>
        </div>

        <p className="text-xs text-[#a09a8f] uppercase tracking-[0.24em] max-w-xs font-normal">
          Handcrafted in Pakistan • Est. Tradition
        </p>

      </div>

      {/* Bottom Progress Bar */}
      <div className="relative z-10 pb-4 w-full max-w-xs flex flex-col items-center space-y-3">
        <div className="w-full h-1 rounded-full bg-[#25201a] overflow-hidden p-0.5 border border-[#c9a84c]/20 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#c9a84c] via-[#f4db8d] to-[#c9a84c] transition-all duration-100 ease-out shadow-md"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8e8578]">
          <span>PREPARING ATELIER</span>
          <span className="text-[#c9a84c]">{progress}%</span>
        </div>
      </div>

    </div>
  );
}
