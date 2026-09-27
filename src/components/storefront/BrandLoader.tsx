"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const DISPLAY_DURATION = 1050;
const FADE_DURATION = 420;

/** A one-time, CSS-driven brand reveal for the storefront. */
export function BrandLoader() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    setVisible(true);

    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    const exitTimer = setTimeout(() => {
      setExiting(true);
      fadeTimer = setTimeout(() => setVisible(false), FADE_DURATION);
    }, DISPLAY_DURATION);

    return () => {
      clearTimeout(exitTimer);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes nhe-loader-rise {
          from { opacity: 0; transform: translateY(18px) scale(.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes nhe-loader-mark-rise {
          from { opacity: 0; transform: scale(.82) rotate(-8deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes nhe-loader-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes nhe-loader-orbit-reverse {
          from { transform: rotate(360deg) scale(.82); }
          to { transform: rotate(0deg) scale(.82); }
        }
        @keyframes nhe-loader-breathe {
          0%, 100% { opacity: .4; transform: scale(.94); }
          50% { opacity: .95; transform: scale(1.08); }
        }
        @keyframes nhe-loader-scan {
          0%, 18% { transform: translateX(-140%); opacity: 0; }
          38% { opacity: .9; }
          72%, 100% { transform: translateX(140%); opacity: 0; }
        }
        @keyframes nhe-loader-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes nhe-loader-dot {
          0%, 100% { opacity: .25; transform: scale(.78); }
          50% { opacity: 1; transform: scale(1); }
        }
        .nhe-loader-rise { animation: nhe-loader-rise 720ms cubic-bezier(.22,1,.36,1) 120ms both; }
        .nhe-loader-mark { animation: nhe-loader-mark-rise 900ms cubic-bezier(.16,1,.3,1) 40ms both; }
        .nhe-loader-orbit { animation: nhe-loader-orbit 12s linear infinite; }
        .nhe-loader-orbit-reverse { animation: nhe-loader-orbit-reverse 16s linear infinite; }
        .nhe-loader-breathe { animation: nhe-loader-breathe 3.8s ease-in-out infinite; }
        .nhe-loader-scan { animation: nhe-loader-scan 2.2s cubic-bezier(.4,0,.2,1) 420ms infinite; }
        .nhe-loader-progress { animation: nhe-loader-progress 1.25s cubic-bezier(.4,0,.2,1) 100ms both; transform-origin: left; }
        .nhe-loader-dot { animation: nhe-loader-dot 1.1s ease-in-out infinite; }
        .nhe-loader-dot:nth-child(2) { animation-delay: 140ms; }
        .nhe-loader-dot:nth-child(3) { animation-delay: 280ms; }
      `}</style>

      <div
        aria-label="Loading Noor Herbal Enterprises"
        aria-live="polite"
        aria-busy="true"
        role="status"
        className="nhe-loader fixed inset-0 z-[99999] overflow-hidden select-none"
        style={{
          opacity: exiting ? 0 : 1,
          pointerEvents: exiting ? "none" : "auto",
          transition: `opacity ${FADE_DURATION}ms cubic-bezier(.22,1,.36,1)`,
        }}
      >
        <div className="nhe-loader-backdrop" aria-hidden="true" />
        <div className="nhe-loader-grid" aria-hidden="true" />
        <div className="nhe-loader-vignette" aria-hidden="true" />

        <div className="nhe-loader-top nhe-loader-rise">
          <span className="nhe-loader-top-line" />
          <span>NOOR HERBAL ENTERPRISES</span>
          <span className="nhe-loader-top-line" />
        </div>

        <div className="nhe-loader-center">
          <div className="nhe-loader-mark" aria-hidden="true">
            <span className="nhe-loader-halo nhe-loader-breathe" />
            <span className="nhe-loader-orbit nhe-loader-orbit-one" />
            <span className="nhe-loader-orbit nhe-loader-orbit-reverse nhe-loader-orbit-two" />
            <span className="nhe-loader-crosshair nhe-loader-crosshair-one" />
            <span className="nhe-loader-crosshair nhe-loader-crosshair-two" />
            <div className="nhe-loader-logo-frame">
              <Image
                src="/logo-02.png"
                alt="Noor Herbal Enterprises"
                width={1880}
                height={562}
                priority
                sizes="(max-width: 640px) 78vw, 360px"
                className="nhe-loader-logo"
              />
              <span className="nhe-loader-scan" />
            </div>
          </div>

          <div className="nhe-loader-copy nhe-loader-rise">
            <span className="nhe-loader-kicker">HANDCRAFTED IN PAKISTAN</span>
            <span className="nhe-loader-divider" />
            <span className="nhe-loader-caption">A considered collection of botanical essentials</span>
          </div>
        </div>

        <div className="nhe-loader-bottom nhe-loader-rise">
          <div className="nhe-loader-progress-track" aria-hidden="true">
            <span className="nhe-loader-progress" />
          </div>
          <div className="nhe-loader-status">
            <span>PREPARING THE ATELIER</span>
            <span className="nhe-loader-dots" aria-hidden="true">
              <i className="nhe-loader-dot" />
              <i className="nhe-loader-dot" />
              <i className="nhe-loader-dot" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
