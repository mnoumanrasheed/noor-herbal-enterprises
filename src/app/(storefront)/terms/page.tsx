import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Noor Herbal Enterprises",
  description: "Terms and conditions of service for purchases and use of the Noor Herbal Enterprises website.",
};

export default function TermsPage() {
  return (
    <main className="policy-page pb-24 pt-10">
      <div className="site-shell max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#2a2620] pb-8 mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-2">
            Terms of Service
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#f6f0e7]">
            Terms & Conditions
          </h1>
        </div>

        <div className="rounded-3xl border border-[#28241e] bg-[#141210] p-6 sm:p-10 space-y-6 text-sm text-[#bfb7aa] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#c9a84c]">1. Orders & Pricing</h2>
            <p>
              All prices displayed on the store are listed in Pakistani Rupees (PKR) and include applicable product costs. Standard shipping fees apply unless qualified for free shipping promotions. Noor Herbal Enterprises reserves the right to cancel or adjust orders in rare cases of technical pricing discrepancies or unforeseen stock shortages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#c9a84c]">2. Product Descriptions & Authenticity</h2>
            <p>
              Our products are handcrafted in small batches using traditional methods. Minor natural variations in color, consistency, and aroma are inherent characteristics of pure, artisanal herbal and food preparations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#c9a84c]">3. Delivery & Inspection</h2>
            <p>
              Customers are encouraged to inspect parcels upon receipt. Any transit damages or discrepancies should be reported to our WhatsApp care desk within 48 hours for swift resolution.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
