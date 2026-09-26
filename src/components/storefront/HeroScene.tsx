"use client";

import dynamic from "next/dynamic";

// Dynamic import with SSR disabled to ensure zero hydration mismatch and fast initial page paint
const Hero3DCanvas = dynamic(
  () => import("@/components/storefront/Hero3DCanvas").then((mod) => mod.Hero3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[550px] flex items-center justify-center select-none">
        <div
          className="w-44 h-44 rounded-full border border-[#c9a84c]/20 flex items-center justify-center animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, rgba(14,13,12,0.4) 70%)",
          }}
        >
          <div className="w-24 h-24 rounded-full border border-[#c9a84c]/40" />
        </div>
      </div>
    ),
  }
);

export default function HeroScene() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" aria-hidden="true">
      <Hero3DCanvas />
    </div>
  );
}
