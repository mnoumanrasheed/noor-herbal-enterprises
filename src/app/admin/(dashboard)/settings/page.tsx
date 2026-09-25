import type { Metadata } from "next";
import { sql } from "@/lib/db";
import { DEFAULT_CONTACT_SETTINGS, DEFAULT_HERO_SETTINGS } from "@/lib/site-settings";
import { SettingsForm, type EditableSettings } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Site Settings — Admin" };

async function getEditableSettings(): Promise<EditableSettings> {
  const rows = await sql`SELECT key, value FROM site_settings WHERE key IN ('contact_email', 'contact_phone', 'contact_instagram', 'hero_eyebrow', 'hero_title', 'hero_description', 'hero_cta_label', 'hero_visual_category', 'homepage_copy', 'featured_content', 'footer_content')`;
  const values = Object.fromEntries(rows.map((row) => [String(row.key), String(row.value ?? "")]));
  return {
    email: values.contact_email || DEFAULT_CONTACT_SETTINGS.email,
    phone: values.contact_phone || DEFAULT_CONTACT_SETTINGS.phone,
    instagram: values.contact_instagram || DEFAULT_CONTACT_SETTINGS.instagram,
    eyebrow: values.hero_eyebrow || DEFAULT_HERO_SETTINGS.eyebrow,
    title: values.hero_title || DEFAULT_HERO_SETTINGS.title,
    description: values.hero_description || DEFAULT_HERO_SETTINGS.description,
    ctaLabel: values.hero_cta_label || DEFAULT_HERO_SETTINGS.ctaLabel,
    visualCategory: values.hero_visual_category || DEFAULT_HERO_SETTINGS.visualCategory,
    homepageCopy: values.homepage_copy || "Discover chutneys, pickles, oils, and shampoos composed with care for kitchens, shelves, and daily routines.",
    featuredContent: values.featured_content || "A considered selection from the Noor Herbal collection.",
    footerContent: values.footer_content || "Thoughtful pantry and personal care essentials, prepared for everyday rituals.",
  };
}

export default async function AdminSettingsPage() {
  const settings = await getEditableSettings();
  return <div className="admin-narrow-page"><p className="eyebrow">Store configuration</p><h1 className="mt-3 font-display text-3xl font-semibold text-white">Site settings</h1><p className="mt-3 text-sm leading-6 text-[#aaa39a]">Manage the copy and contact values used by the storefront.</p><SettingsForm settings={settings} /></div>;
}
