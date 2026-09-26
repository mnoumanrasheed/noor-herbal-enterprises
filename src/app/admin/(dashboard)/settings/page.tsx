import type { Metadata } from "next";
import { sql } from "@/lib/db";
import {
  DEFAULT_BRAND_STORY_CONTENT,
  DEFAULT_CONTACT_SETTINGS,
  DEFAULT_HERO_SETTINGS,
  DEFAULT_STORE_SETTINGS,
} from "@/lib/site-settings";
import { SettingsForm, type EditableSettings } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Site & Store Settings — Admin" };

async function getEditableSettings(): Promise<EditableSettings> {
  const rows = await sql`
    SELECT key, value FROM site_settings
    WHERE key IN (
      'contact_email', 'contact_phone', 'contact_instagram',
      'hero_eyebrow', 'hero_title', 'hero_description', 'hero_cta_label', 'hero_visual_category',
      'homepage_copy', 'featured_content', 'footer_content',
      'announcement_bar_text', 'shipping_fee_paise', 'free_shipping_threshold_paise',
      'shipping_policy', 'returns_policy', 'bank_transfer_details',
      'story_heading', 'story_body_one', 'story_body_two', 'story_mission', 'story_vision',
      'story_opening_image', 'story_opening_image_alt', 'story_opening_image_public_id',
      'story_mission_image', 'story_mission_image_alt', 'story_mission_image_public_id',
      'story_vision_image', 'story_vision_image_alt', 'story_vision_image_public_id'
    )
  `;
  const values = Object.fromEntries(rows.map((row) => [String(row.key), String(row.value ?? "")]));

  const shippingFeeRs = Math.round(
    Number.parseInt(values.shipping_fee_paise || String(DEFAULT_STORE_SETTINGS.shippingFeePaise), 10) / 100
  );
  const freeShippingThresholdRs = Math.round(
    Number.parseInt(values.free_shipping_threshold_paise || String(DEFAULT_STORE_SETTINGS.freeShippingThresholdPaise), 10) / 100
  );

  return {
    email: values.contact_email || DEFAULT_CONTACT_SETTINGS.email,
    phone: values.contact_phone || DEFAULT_CONTACT_SETTINGS.phone,
    instagram: values.contact_instagram || DEFAULT_CONTACT_SETTINGS.instagram,
    heroEyebrow: values.hero_eyebrow || DEFAULT_HERO_SETTINGS.eyebrow,
    heroTitle: values.hero_title || DEFAULT_HERO_SETTINGS.title,
    heroDescription: values.hero_description || DEFAULT_HERO_SETTINGS.description,
    heroCtaLabel: values.hero_cta_label || DEFAULT_HERO_SETTINGS.ctaLabel,
    heroVisualCategory: values.hero_visual_category || DEFAULT_HERO_SETTINGS.visualCategory,
    homepageCopy: values.homepage_copy || "Discover chutneys, pickles, oils, and shampoos composed with care for kitchens, shelves, and daily routines.",
    featuredContent: values.featured_content || "A considered selection from the Noor Herbal collection.",
    footerContent: values.footer_content || "Thoughtful pantry and personal care essentials, prepared for everyday rituals.",
    announcementBarText: values.announcement_bar_text || DEFAULT_STORE_SETTINGS.announcementBarText,
    shippingFeeRs,
    freeShippingThresholdRs,
    shippingPolicy: values.shipping_policy || DEFAULT_STORE_SETTINGS.shippingPolicy,
    returnsPolicy: values.returns_policy || DEFAULT_STORE_SETTINGS.returnsPolicy,
    bankTransferDetails: values.bank_transfer_details || DEFAULT_STORE_SETTINGS.bankTransferDetails,
    storyHeading: values.story_heading || DEFAULT_BRAND_STORY_CONTENT.heading,
    storyBodyOne: values.story_body_one || DEFAULT_BRAND_STORY_CONTENT.bodyOne,
    storyBodyTwo: values.story_body_two || DEFAULT_BRAND_STORY_CONTENT.bodyTwo,
    storyMission: values.story_mission || DEFAULT_BRAND_STORY_CONTENT.mission,
    storyVision: values.story_vision || DEFAULT_BRAND_STORY_CONTENT.vision,
    storyOpeningImage: values.story_opening_image || DEFAULT_BRAND_STORY_CONTENT.openingImage,
    storyOpeningImageAlt: values.story_opening_image_alt || DEFAULT_BRAND_STORY_CONTENT.openingImageAlt,
    storyOpeningImagePublicId: values.story_opening_image_public_id || "",
    storyMissionImage: values.story_mission_image || DEFAULT_BRAND_STORY_CONTENT.missionImage,
    storyMissionImageAlt: values.story_mission_image_alt || DEFAULT_BRAND_STORY_CONTENT.missionImageAlt,
    storyMissionImagePublicId: values.story_mission_image_public_id || "",
    storyVisionImage: values.story_vision_image || DEFAULT_BRAND_STORY_CONTENT.visionImage,
    storyVisionImageAlt: values.story_vision_image_alt || DEFAULT_BRAND_STORY_CONTENT.visionImageAlt,
    storyVisionImagePublicId: values.story_vision_image_public_id || "",
  };
}

export default async function AdminSettingsPage() {
  let settings;
  try {
    settings = await getEditableSettings();
  } catch {
    settings = null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#111827] mb-1">
          Store & Site Configuration
        </h1>
        <p className="text-sm text-[#6b7280]">
          Manage contact information, delivery rates, hero copy, announcement bars, and brand story texts.
        </p>
      </div>

      {settings ? (
        <SettingsForm settings={settings} />
      ) : (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Could not load settings from database. Please verify connection.
        </div>
      )}
    </div>
  );
}
