"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const PRODUCTS = [
  {
    id: "chutney",
    src: "/images/products/aloo-bukharay-ki-chutney-cutout.png",
    sizes: "(max-width: 767px) 28vw, 14vw",
  },
  {
    id: "pickle",
    src: "/images/products/crush-mango-pickle.jpeg",
    sizes: "(max-width: 767px) 35vw, 19vw",
  },
  {
    id: "oil",
    src: "/images/products/noor-herbal-hair-oil-cutout.png",
    sizes: "(max-width: 767px) 25vw, 13vw",
  },
  {
    id: "shampoo",
    src: "/images/products/noor-herbal-shampoo.jpeg",
    sizes: "(max-width: 767px) 34vw, 17vw",
  },
] as const;

/**
 * A responsive 2.5D composition. The supplied images are front photography,
 * so movement is intentionally limited to depth, light and small offsets.
 */
export default function HeroScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = window.requestAnimationFrame(() => setMotionReady(true));

    const reset = () => {
      stage.style.setProperty("--hero-pointer-x", "0px");
      stage.style.setProperty("--hero-pointer-y", "0px");
      stage.style.setProperty("--hero-pointer-x-inverse", "0px");
      stage.style.setProperty("--hero-pointer-y-inverse", "0px");
    };
    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      const bounds = stage.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
      stage.style.setProperty("--hero-pointer-x", `${x * 14}px`);
      stage.style.setProperty("--hero-pointer-y", `${y * 10}px`);
      stage.style.setProperty("--hero-pointer-x-inverse", `${x * -10}px`);
      stage.style.setProperty("--hero-pointer-y-inverse", `${y * -7}px`);
    };
    const onScroll = () => {
      if (reducedMotion) return;
      const progress = Math.max(0, Math.min(1, window.scrollY / Math.max(window.innerHeight, 1)));
      stage.style.setProperty("--hero-scroll", `${progress * -18}px`);
    };

    reset();
    onScroll();
    stage.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerleave", reset, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", reset);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={`hero-product-stage hero-studio-stage${motionReady ? " hero-studio-motion-ready" : ""}`}
      aria-hidden="true"
    >
      <div className="hero-studio-aura" />
      <div className="hero-studio-arc hero-studio-arc-one" />
      <div className="hero-studio-arc hero-studio-arc-two" />
      <div className="hero-studio-pedestal" />
      <div className="hero-studio-light-sweep" />

      {PRODUCTS.map((product) => (
        <div key={product.id} className={`hero-product hero-product-${product.id}`}>
          <div className="hero-product-inner">
            <span className="hero-product-contact-shadow" />
            <Image src={product.src} alt="" fill priority sizes={product.sizes} />
          </div>
        </div>
      ))}
    </div>
  );
}
