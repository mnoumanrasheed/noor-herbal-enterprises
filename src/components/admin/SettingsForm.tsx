"use client";

import { useActionState, useState } from "react";
import { saveSiteSettings } from "@/app/admin/(dashboard)/settings/actions";
import { AdminImageUpload, type AdminImage } from "@/components/admin/AdminImageUpload";
import type { AdminActionState } from "@/app/admin/(dashboard)/categories/actions";

export type EditableSettings = {
  email: string;
  phone: string;
  instagram: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroCtaLabel: string;
  heroVisualCategory: string;
  homepageCopy: string;
  featuredContent: string;
  footerContent: string;
  announcementBarText: string;
  shippingFeeRs: number;
  freeShippingThresholdRs: number;
  shippingPolicy: string;
  returnsPolicy: string;
  bankTransferDetails: string;
  storyHeading: string;
  storyBodyOne: string;
  storyBodyTwo: string;
  storyMission: string;
  storyVision: string;
  storyOpeningImage: string;
  storyOpeningImageAlt: string;
  storyOpeningImagePublicId: string;
  storyMissionImage: string;
  storyMissionImageAlt: string;
  storyMissionImagePublicId: string;
  storyVisionImage: string;
  storyVisionImageAlt: string;
  storyVisionImagePublicId: string;
};

function StoryImageField({
  label,
  helper,
  urlName,
  publicIdName,
  altName,
  url,
  publicId,
  alt,
}: {
  label: string;
  helper: string;
  urlName: string;
  publicIdName: string;
  altName: string;
  url: string;
  publicId: string;
  alt: string;
}) {
  const [images, setImages] = useState<AdminImage[]>([
    { url, publicId: publicId || null, altText: alt },
  ]);
  const image = images[0];

  return (
    <fieldset className="admin-section-rule border-t border-[#2d2924] pt-6">
      <legend className="field-label text-sm font-semibold text-[#f6f0e7]">{label}</legend>
      <p className="admin-field-hint mb-4 text-xs text-[#8e8578]">{helper}</p>
      <AdminImageUpload images={images} onChange={setImages} label={label} />
      <input type="hidden" name={urlName} value={image?.url || ""} />
      <input type="hidden" name={publicIdName} value={image?.publicId || ""} />
      <input type="hidden" name={altName} value={image?.altText || ""} />
    </fieldset>
  );
}

export function SettingsForm({ settings }: { settings: EditableSettings }) {
  const [state, action, pending] = useActionState<AdminActionState, FormData>(saveSiteSettings, { ok: false });

  return (
    <form action={action} className="rounded-3xl border border-[#2d2924] bg-[#141210] p-6 sm:p-10 shadow-2xl space-y-8 max-w-4xl">
      {/* 1. Contact & Social Channels */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-white border-b border-[#25221d] pb-3">
          1. Brand Contact & Socials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Contact Email</span>
            <input name="email" type="email" defaultValue={settings.email} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none" required />
          </label>
          <label>
            <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">WhatsApp / Phone</span>
            <input name="phone" type="tel" defaultValue={settings.phone} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none" required />
          </label>
        </div>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Instagram Profile URL</span>
          <input name="instagram" type="url" defaultValue={settings.instagram} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none" required />
        </label>
      </div>

      {/* 2. Business & Shipping Policies */}
      <div className="space-y-4 border-t border-[#25221d] pt-6">
        <h2 className="font-display text-xl font-bold text-white border-b border-[#25221d] pb-3">
          2. Store Delivery & Payment Settings
        </h2>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Announcement Bar Text</span>
          <input name="announcementBarText" defaultValue={settings.announcementBarText} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none" required />
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Standard Delivery Flat Fee (PKR)</span>
            <input name="shippingFeeRs" type="number" defaultValue={settings.shippingFeeRs} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none" required />
          </label>
          <label>
            <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Free Delivery Threshold (PKR)</span>
            <input name="freeShippingThresholdRs" type="number" defaultValue={settings.freeShippingThresholdRs} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none" required />
          </label>
        </div>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Direct Bank Transfer Details</span>
          <textarea name="bankTransferDetails" defaultValue={settings.bankTransferDetails} rows={3} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none font-mono text-xs resize-y" required />
        </label>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Shipping Policy Text</span>
          <textarea name="shippingPolicy" defaultValue={settings.shippingPolicy} rows={2} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none resize-y" required />
        </label>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Returns & Guarantee Policy Text</span>
          <textarea name="returnsPolicy" defaultValue={settings.returnsPolicy} rows={2} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none resize-y" required />
        </label>
      </div>

      {/* 3. Hero Section Copy */}
      <div className="space-y-4 border-t border-[#25221d] pt-6">
        <h2 className="font-display text-xl font-bold text-white border-b border-[#25221d] pb-3">
          3. Homepage 3D Hero Copy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Eyebrow</span>
            <input name="heroEyebrow" defaultValue={settings.heroEyebrow} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none" required />
          </label>
          <label>
            <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">CTA Button Label</span>
            <input name="heroCtaLabel" defaultValue={settings.heroCtaLabel} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none" required />
          </label>
        </div>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Headline</span>
          <input name="heroTitle" defaultValue={settings.heroTitle} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none" required />
        </label>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Hero Supporting Description</span>
          <textarea name="heroDescription" defaultValue={settings.heroDescription} rows={2} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none resize-y" required />
        </label>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Collection Category Tag</span>
          <input name="heroVisualCategory" defaultValue={settings.heroVisualCategory} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none" required />
        </label>
      </div>

      {/* 4. Storefront Editorial Content */}
      <div className="space-y-4 border-t border-[#25221d] pt-6">
        <h2 className="font-display text-xl font-bold text-white border-b border-[#25221d] pb-3">
          4. Storefront Editorial Content
        </h2>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Homepage Catalogue Copy</span>
          <textarea name="homepageCopy" defaultValue={settings.homepageCopy} rows={2} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none resize-y" required />
        </label>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Featured Note</span>
          <textarea name="featuredContent" defaultValue={settings.featuredContent} rows={2} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none resize-y" required />
        </label>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Footer Summary Copy</span>
          <textarea name="footerContent" defaultValue={settings.footerContent} rows={2} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none resize-y" required />
        </label>
      </div>

      {/* 5. Brand Story & Images */}
      <div className="space-y-6 border-t border-[#25221d] pt-6">
        <h2 className="font-display text-xl font-bold text-white border-b border-[#25221d] pb-3">
          5. Brand Story & Photography
        </h2>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Story Heading</span>
          <input name="storyHeading" defaultValue={settings.storyHeading} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none" required />
        </label>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Story Opening Paragraph</span>
          <textarea name="storyBodyOne" defaultValue={settings.storyBodyOne} rows={3} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none resize-y" required />
        </label>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Story Continuation</span>
          <textarea name="storyBodyTwo" defaultValue={settings.storyBodyTwo} rows={3} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none resize-y" required />
        </label>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Our Mission</span>
          <textarea name="storyMission" defaultValue={settings.storyMission} rows={2} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none resize-y" required />
        </label>
        <label className="block">
          <span className="field-label text-xs uppercase tracking-wider text-[#a09a8f] block mb-1.5">Our Vision</span>
          <textarea name="storyVision" defaultValue={settings.storyVision} rows={2} className="w-full rounded-xl border border-[#38332a] bg-[#181614] px-4 py-3 text-sm text-white focus:border-[#c9a84c] focus:outline-none resize-y" required />
        </label>

        <StoryImageField label="Story Opening Image" helper="High quality authentic product photo for opening story block" urlName="storyOpeningImage" publicIdName="storyOpeningImagePublicId" altName="storyOpeningImageAlt" url={settings.storyOpeningImage} publicId={settings.storyOpeningImagePublicId} alt={settings.storyOpeningImageAlt} />
        <StoryImageField label="Mission Section Image" helper="Artisanal food/pantry preparation photo" urlName="storyMissionImage" publicIdName="storyMissionImagePublicId" altName="storyMissionImageAlt" url={settings.storyMissionImage} publicId={settings.storyMissionImagePublicId} alt={settings.storyMissionImageAlt} />
        <StoryImageField label="Vision Section Image" helper="Personal care and herbal formulation photo" urlName="storyVisionImage" publicIdName="storyVisionImagePublicId" altName="storyVisionImageAlt" url={settings.storyVisionImage} publicId={settings.storyVisionImagePublicId} alt={settings.storyVisionImageAlt} />
      </div>

      {state.error && (
        <div role="alert" className="rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-200">
          {state.error}
        </div>
      )}
      {state.message && (
        <div role="status" className="rounded-xl border border-green-500/40 bg-green-950/40 p-4 text-xs text-green-200">
          {state.message}
        </div>
      )}

      <button type="submit" className="button-primary w-full py-4 text-xs uppercase tracking-[0.2em] font-semibold" disabled={pending}>
        {pending ? "Saving Store Settings…" : "Save All Store Settings"}
      </button>
    </form>
  );
}
