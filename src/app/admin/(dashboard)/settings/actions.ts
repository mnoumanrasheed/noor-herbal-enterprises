"use server";

import { revalidatePath } from "next/cache";
import { isAdminAccessError, requireAdmin } from "@/lib/admin";
import { sql } from "@/lib/db";
import { DEFAULT_CONTACT_SETTINGS, DEFAULT_STORE_SETTINGS } from "@/lib/site-settings";
import type { AdminActionState } from "../categories/actions";
import { z } from "zod";

const imageReference = z.string().trim().max(2000).refine((value) => {
  if (!value || value.startsWith("/")) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}, "Use an uploaded HTTPS image URL or a local image path.");

const settingsSchema = z.object({
  email: z.string().trim().email("Enter a valid contact email."),
  phone: z.string().trim().min(7, "Enter a valid WhatsApp number.").max(25),
  instagram: z.string().trim().url("Instagram must be a full URL.").refine((url) => new URL(url).hostname.endsWith("instagram.com"), "Instagram must be a full Instagram URL."),
  heroEyebrow: z.string().trim().min(2).max(120),
  heroTitle: z.string().trim().min(2).max(240),
  heroDescription: z.string().trim().min(2).max(1000),
  heroCtaLabel: z.string().trim().min(2).max(80),
  heroVisualCategory: z.string().trim().min(2).max(120),
  homepageCopy: z.string().trim().min(2).max(1500),
  featuredContent: z.string().trim().min(2).max(1000),
  footerContent: z.string().trim().min(2).max(1000),
  announcementBarText: z.string().trim().min(2).max(300),
  shippingFeeRs: z.coerce.number().min(0).max(50000),
  freeShippingThresholdRs: z.coerce.number().min(0).max(500000),
  shippingPolicy: z.string().trim().min(10).max(2000),
  returnsPolicy: z.string().trim().min(10).max(2000),
  bankTransferDetails: z.string().trim().min(10).max(2000),
  storyHeading: z.string().trim().min(2).max(240),
  storyBodyOne: z.string().trim().min(20).max(2000),
  storyBodyTwo: z.string().trim().min(20).max(2000),
  storyMission: z.string().trim().min(20).max(1000),
  storyVision: z.string().trim().min(20).max(1000),
  storyOpeningImage: imageReference,
  storyOpeningImageAlt: z.string().trim().min(3).max(160),
  storyOpeningImagePublicId: z.string().trim().max(400),
  storyMissionImage: imageReference,
  storyMissionImageAlt: z.string().trim().min(3).max(160),
  storyMissionImagePublicId: z.string().trim().max(400),
  storyVisionImage: imageReference,
  storyVisionImageAlt: z.string().trim().min(3).max(160),
  storyVisionImagePublicId: z.string().trim().max(400),
});

export async function saveSiteSettings(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = settingsSchema.safeParse({
      email: String(formData.get("email") || "").trim() || DEFAULT_CONTACT_SETTINGS.email,
      phone: String(formData.get("phone") || "").trim() || DEFAULT_CONTACT_SETTINGS.phone,
      instagram: String(formData.get("instagram") || "").trim() || DEFAULT_CONTACT_SETTINGS.instagram,
      heroEyebrow: String(formData.get("heroEyebrow") || "").trim(),
      heroTitle: String(formData.get("heroTitle") || "").trim(),
      heroDescription: String(formData.get("heroDescription") || "").trim(),
      heroCtaLabel: String(formData.get("heroCtaLabel") || "").trim(),
      heroVisualCategory: String(formData.get("heroVisualCategory") || "").trim(),
      homepageCopy: String(formData.get("homepageCopy") || "").trim(),
      featuredContent: String(formData.get("featuredContent") || "").trim(),
      footerContent: String(formData.get("footerContent") || "").trim(),
      announcementBarText: String(formData.get("announcementBarText") || "").trim() || DEFAULT_STORE_SETTINGS.announcementBarText,
      shippingFeeRs: formData.get("shippingFeeRs") || 250,
      freeShippingThresholdRs: formData.get("freeShippingThresholdRs") || 3000,
      shippingPolicy: String(formData.get("shippingPolicy") || "").trim() || DEFAULT_STORE_SETTINGS.shippingPolicy,
      returnsPolicy: String(formData.get("returnsPolicy") || "").trim() || DEFAULT_STORE_SETTINGS.returnsPolicy,
      bankTransferDetails: String(formData.get("bankTransferDetails") || "").trim() || DEFAULT_STORE_SETTINGS.bankTransferDetails,
      storyHeading: String(formData.get("storyHeading") || "").trim(),
      storyBodyOne: String(formData.get("storyBodyOne") || "").trim(),
      storyBodyTwo: String(formData.get("storyBodyTwo") || "").trim(),
      storyMission: String(formData.get("storyMission") || "").trim(),
      storyVision: String(formData.get("storyVision") || "").trim(),
      storyOpeningImage: String(formData.get("storyOpeningImage") || "").trim(),
      storyOpeningImageAlt: String(formData.get("storyOpeningImageAlt") || "").trim(),
      storyOpeningImagePublicId: String(formData.get("storyOpeningImagePublicId") || "").trim(),
      storyMissionImage: String(formData.get("storyMissionImage") || "").trim(),
      storyMissionImageAlt: String(formData.get("storyMissionImageAlt") || "").trim(),
      storyMissionImagePublicId: String(formData.get("storyMissionImagePublicId") || "").trim(),
      storyVisionImage: String(formData.get("storyVisionImage") || "").trim(),
      storyVisionImageAlt: String(formData.get("storyVisionImageAlt") || "").trim(),
      storyVisionImagePublicId: String(formData.get("storyVisionImagePublicId") || "").trim(),
    });

    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the site settings." };
    const data = parsed.data;

    const shippingFeePaise = String(Math.round(data.shippingFeeRs * 100));
    const freeShippingThresholdPaise = String(Math.round(data.freeShippingThresholdRs * 100));

    for (const [key, value] of [
      ["contact_email", data.email],
      ["contact_phone", data.phone],
      ["contact_instagram", data.instagram],
      ["hero_eyebrow", data.heroEyebrow],
      ["hero_title", data.heroTitle],
      ["hero_description", data.heroDescription],
      ["hero_cta_label", data.heroCtaLabel],
      ["hero_visual_category", data.heroVisualCategory],
      ["homepage_copy", data.homepageCopy],
      ["featured_content", data.featuredContent],
      ["footer_content", data.footerContent],
      ["announcement_bar_text", data.announcementBarText],
      ["shipping_fee_paise", shippingFeePaise],
      ["free_shipping_threshold_paise", freeShippingThresholdPaise],
      ["shipping_policy", data.shippingPolicy],
      ["returns_policy", data.returnsPolicy],
      ["bank_transfer_details", data.bankTransferDetails],
      ["story_heading", data.storyHeading],
      ["story_body_one", data.storyBodyOne],
      ["story_body_two", data.storyBodyTwo],
      ["story_mission", data.storyMission],
      ["story_vision", data.storyVision],
      ["story_opening_image", data.storyOpeningImage],
      ["story_opening_image_alt", data.storyOpeningImageAlt],
      ["story_opening_image_public_id", data.storyOpeningImagePublicId],
      ["story_mission_image", data.storyMissionImage],
      ["story_mission_image_alt", data.storyMissionImageAlt],
      ["story_mission_image_public_id", data.storyMissionImagePublicId],
      ["story_vision_image", data.storyVisionImage],
      ["story_vision_image_alt", data.storyVisionImageAlt],
      ["story_vision_image_public_id", data.storyVisionImagePublicId],
    ]) {
      await sql`
        INSERT INTO site_settings (key, value)
        VALUES (${key}, ${value})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `;
    }

    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidatePath("/shipping-returns");
    revalidatePath("/checkout");
    return { ok: true, message: "Store settings saved successfully." };
  } catch (error) {
    if (isAdminAccessError(error)) return { ok: false, error: "Your admin session has expired. Sign in again." };
    return { ok: false, error: "The site settings could not be saved. Check the database connection." };
  }
}
