import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Temporarily unavailable",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0e0d0c] px-6 py-16 text-[#f6f0e7]">
      <section className="w-full max-w-xl border border-[#bc9233]/50 bg-[#151412] p-8 text-center shadow-2xl sm:p-12">
        <p className="mb-5 text-xs font-semibold tracking-[0.28em] text-[#f1dd7a]">
          NOOR HERBAL ENTERPRISES
        </p>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">
          We&apos;ll be back soon.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-7 text-[#ded6c9]">
          Our online store is temporarily unavailable while we make an update.
          Please check back shortly.
        </p>
      </section>
    </main>
  );
}
