import type { Metadata } from "next";
import { getContactSettings } from "@/lib/queries";
import { DEFAULT_CONTACT_SETTINGS, type ContactSettings } from "@/lib/site-settings";
import { ContactExperience } from "@/components/storefront/ContactExperience";

export const metadata: Metadata = {
  title: "Contact Us — Noor Herbal Enterprises",
  description:
    "Get in touch with Noor Herbal Enterprises for product inquiries, customer support, collaborations, or order assistance via WhatsApp, Email, or Instagram.",
};

export default async function ContactPage() {
  let settings: ContactSettings = DEFAULT_CONTACT_SETTINGS;
  try {
    settings = await getContactSettings();
  } catch {
    // Render the configured defaults until the database is available.
  }

  return <ContactExperience settings={settings} />;
}
