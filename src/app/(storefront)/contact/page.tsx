import type { Metadata } from "next";
import { getContactSettings } from "@/lib/queries";
import { DEFAULT_CONTACT_SETTINGS, type ContactSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Noor Herbal Enterprises by email, WhatsApp, or Instagram.",
};

export default async function ContactPage() {
  let settings: ContactSettings = DEFAULT_CONTACT_SETTINGS;
  try {
    settings = await getContactSettings();
  } catch {
    // Render the configured defaults until the database is available.
  }
  const whatsappNumber = settings.phone.replace(/\D/g, "");

  return (
    <div className="page-shell">
      <p className="eyebrow">We are here to help</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-6xl">Let&apos;s talk.</h1>
      <p className="mt-6 max-w-xl text-base leading-8 text-[#aaa39a]">For product questions, order support, or a simple hello, reach us through any of the channels below.</p>
      <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        <a className="contact-card" href={`mailto:${settings.email}`}><span className="eyebrow">Email</span><span className="mt-3 break-words text-sm text-white">{settings.email}</span></a>
        <a className="contact-card" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer"><span className="eyebrow">WhatsApp</span><span className="mt-3 text-sm text-white">{settings.phone}</span></a>
        <a className="contact-card" href={settings.instagram} target="_blank" rel="noreferrer"><span className="eyebrow">Instagram</span><span className="mt-3 text-sm text-white">@noorherbalenterprices</span></a>
      </div>
    </div>
  );
}
