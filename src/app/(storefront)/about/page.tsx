import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Learn about Noor Herbal Enterprises and our considered approach to everyday herbal goods.",
};

export default function AboutPage() {
  return (
    <div className="page-shell">
      <p className="eyebrow">The Noor Herbal approach</p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-6xl">Made for rituals that matter.</h1>
      <div className="mt-10 max-w-2xl space-y-5 text-base leading-8 text-[#aaa39a]">
        <p>Noor Herbal Enterprises brings together familiar flavours and considered everyday care, shaped by the richness of Pakistan&apos;s traditions.</p>
        <p>We believe good products should feel personal: thoughtfully prepared, clearly presented, and made to earn a place in your routine.</p>
      </div>
    </div>
  );
}
