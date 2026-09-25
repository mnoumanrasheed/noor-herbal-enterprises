"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
import { DEFAULT_CONTACT_SETTINGS } from "@/lib/site-settings";
import type { AdminActionState } from "../categories/actions";

export async function saveSiteSettings(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Your admin session has expired. Sign in again." };

  const email = String(formData.get("email") || "").trim() || DEFAULT_CONTACT_SETTINGS.email;
  const phone = String(formData.get("phone") || "").trim() || DEFAULT_CONTACT_SETTINGS.phone;
  const instagram = String(formData.get("instagram") || "").trim() || DEFAULT_CONTACT_SETTINGS.instagram;
  const heroEyebrow = String(formData.get("heroEyebrow") || "").trim() || "The Noor Herbal collection";
  const heroTitle = String(formData.get("heroTitle") || "").trim() || "A considered ritual\nfor every day.";
  const heroDescription = String(formData.get("heroDescription") || "").trim() || "Discover chutneys, pickles, oils, and herbal shampoos composed with care for kitchens, shelves, and daily routines.";
  const heroCtaLabel = String(formData.get("heroCtaLabel") || "").trim() || "Shop the collection";
  const heroVisualCategory = String(formData.get("heroVisualCategory") || "").trim() || "The complete collection";
  const homepageCopy = String(formData.get("homepageCopy") || "").trim() || "Discover chutneys, pickles, oils, and shampoos composed with care for kitchens, shelves, and daily routines.";
  const featuredContent = String(formData.get("featuredContent") || "").trim() || "A considered selection from the Noor Herbal collection.";
  const footerContent = String(formData.get("footerContent") || "").trim() || "Thoughtful pantry and personal care essentials, prepared for everyday rituals.";

  if (!email.includes("@")) return { ok: false, error: "Enter a valid contact email." };
  if (!instagram.startsWith("https://www.instagram.com/")) {
    return { ok: false, error: "Instagram must be a full Instagram URL." };
  }

  for (const [key, value] of [
    ["contact_email", email],
    ["contact_phone", phone],
    ["contact_instagram", instagram],
    ["hero_eyebrow", heroEyebrow],
    ["hero_title", heroTitle],
    ["hero_description", heroDescription],
    ["hero_cta_label", heroCtaLabel],
    ["hero_visual_category", heroVisualCategory],
    ["homepage_copy", homepageCopy],
    ["featured_content", featuredContent],
    ["footer_content", footerContent],
  ]) {
    await sql`
      INSERT INTO site_settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Site settings saved." };
}
