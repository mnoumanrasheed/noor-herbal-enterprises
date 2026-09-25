"use client";

import { useActionState, useState } from "react";
import { saveSiteSettings } from "@/app/admin/(dashboard)/settings/actions";
import { AdminImageUpload, type AdminImage } from "@/components/admin/AdminImageUpload";
import type { AdminActionState } from "@/app/admin/(dashboard)/categories/actions";

export type EditableSettings = {
  email: string;
  phone: string;
  instagram: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  visualCategory: string;
  homepageCopy: string;
  featuredContent: string;
  footerContent: string;
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
    <fieldset className="admin-section-rule">
      <legend className="field-label">{label}</legend>
      <p className="admin-field-hint mb-4">{helper}</p>
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
    <form action={action} className="admin-form-card mt-8">
      <label><span className="field-label">Contact email</span><input name="email" type="email" defaultValue={settings.email} className="field-input" required /></label>
      <label><span className="field-label">WhatsApp / phone</span><input name="phone" type="tel" defaultValue={settings.phone} className="field-input" required /></label>
      <label><span className="field-label">Instagram URL</span><input name="instagram" type="url" defaultValue={settings.instagram} className="field-input" required /></label>

      <div className="admin-section-rule"><p className="eyebrow">Homepage hero</p><p className="admin-field-hint">Control the headline, supporting copy, CTA, and featured visual selection.</p></div>
      <label><span className="field-label">Eyebrow</span><input name="heroEyebrow" defaultValue={settings.eyebrow} className="field-input" required /></label>
      <label><span className="field-label">Headline</span><textarea name="heroTitle" defaultValue={settings.title} className="field-input min-h-24 resize-y" required /></label>
      <label><span className="field-label">Supporting copy</span><textarea name="heroDescription" defaultValue={settings.description} className="field-input min-h-24 resize-y" required /></label>
      <label><span className="field-label">CTA label</span><input name="heroCtaLabel" defaultValue={settings.ctaLabel} className="field-input" required /></label>
      <label><span className="field-label">Featured visual selection</span><input name="heroVisualCategory" defaultValue={settings.visualCategory} className="field-input" required /></label>

      <div className="admin-section-rule"><p className="eyebrow">Storefront content</p><p className="admin-field-hint">Edit supporting copy used around the live catalogue and footer.</p></div>
      <label><span className="field-label">Homepage catalogue copy</span><textarea name="homepageCopy" defaultValue={settings.homepageCopy} className="field-input min-h-24 resize-y" required /></label>
      <label><span className="field-label">Featured content note</span><textarea name="featuredContent" defaultValue={settings.featuredContent} className="field-input min-h-20 resize-y" required /></label>
      <label><span className="field-label">Footer content</span><textarea name="footerContent" defaultValue={settings.footerContent} className="field-input min-h-20 resize-y" required /></label>

      <div className="admin-section-rule"><p className="eyebrow">Brand story</p><p className="admin-field-hint">This content appears on the homepage preview and the full Our Story page.</p></div>
      <label><span className="field-label">Story heading</span><textarea name="storyHeading" defaultValue={settings.storyHeading} className="field-input min-h-20 resize-y" required /></label>
      <label><span className="field-label">Story opening</span><textarea name="storyBodyOne" defaultValue={settings.storyBodyOne} className="field-input min-h-32 resize-y" required /></label>
      <label><span className="field-label">Story continuation</span><textarea name="storyBodyTwo" defaultValue={settings.storyBodyTwo} className="field-input min-h-32 resize-y" required /></label>
      <label><span className="field-label">Mission</span><textarea name="storyMission" defaultValue={settings.storyMission} className="field-input min-h-28 resize-y" required /></label>
      <label><span className="field-label">Vision</span><textarea name="storyVision" defaultValue={settings.storyVision} className="field-input min-h-28 resize-y" required /></label>

      <StoryImageField label="Story opening image" helper="Use a real Noor Herbal product image for the opening composition." urlName="storyOpeningImage" publicIdName="storyOpeningImagePublicId" altName="storyOpeningImageAlt" url={settings.storyOpeningImage} publicId={settings.storyOpeningImagePublicId} alt={settings.storyOpeningImageAlt} />
      <StoryImageField label="Mission image" helper="Use a real pantry product image for the mission section." urlName="storyMissionImage" publicIdName="storyMissionImagePublicId" altName="storyMissionImageAlt" url={settings.storyMissionImage} publicId={settings.storyMissionImagePublicId} alt={settings.storyMissionImageAlt} />
      <StoryImageField label="Vision image" helper="Use a real personal-care product image for the vision section." urlName="storyVisionImage" publicIdName="storyVisionImagePublicId" altName="storyVisionImageAlt" url={settings.storyVisionImage} publicId={settings.storyVisionImagePublicId} alt={settings.storyVisionImageAlt} />

      {state.error && <p role="alert" className="admin-form-error">{state.error}</p>}
      {state.message && <p role="status" className="admin-form-success">{state.message}</p>}
      <button type="submit" className="button-primary" disabled={pending}>{pending ? "Saving..." : "Save site settings"}</button>
    </form>
  );
}
