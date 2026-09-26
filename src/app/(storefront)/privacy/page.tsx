import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Noor Herbal Enterprises",
  description: "Privacy and data protection principles for Noor Herbal Enterprises.",
};

export default function PrivacyPage() {
  return (
    <main className="policy-page pb-24 pt-10">
      <div className="site-shell max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#2a2620] pb-8 mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-2">
            Legal & Privacy
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#f6f0e7]">
            Privacy Policy
          </h1>
        </div>

        <div className="rounded-3xl border border-[#28241e] bg-[#141210] p-6 sm:p-10 space-y-6 text-sm text-[#bfb7aa] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#c9a84c]">1. Information We Collect</h2>
            <p>
              When you browse our storefront or place an order, we collect only the essential information necessary to process delivery: your name, contact phone/WhatsApp number, delivery address, city, and optional email address.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#c9a84c]">2. How We Use Your Data</h2>
            <p>
              We use your information strictly to prepare, fulfill, package, and deliver your orders through our courier partners in Pakistan, as well as to provide order updates via WhatsApp or SMS.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#c9a84c]">3. Data Protection & Sharing</h2>
            <p>
              We never sell, lease, or distribute your personal contact information to third-party marketing companies. Data is shared solely with trusted courier logistics providers for address fulfillment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#c9a84c]">4. Inquiries & Rights</h2>
            <p>
              If you have any questions regarding your stored order details or wish to have historical contact records removed, please reach out via our official contact channels.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
