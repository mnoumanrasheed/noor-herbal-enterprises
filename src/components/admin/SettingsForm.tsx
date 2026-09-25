"use client";

import { useActionState } from "react";
import { saveSiteSettings } from "@/app/admin/(dashboard)/settings/actions";
import type { AdminActionState } from "@/app/admin/(dashboard)/categories/actions";

export type EditableSettings = { email: string; phone: string; instagram: string; eyebrow: string; title: string; description: string; ctaLabel: string; visualCategory: string; homepageCopy: string; featuredContent: string; footerContent: string };

export function SettingsForm({ settings }: { settings: EditableSettings }) {
  const [state, action, pending] = useActionState<AdminActionState, FormData>(saveSiteSettings, { ok: false });
  return <form action={action} className="admin-form-card mt-8">
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
    {state.error && <p role="alert" className="admin-form-error">{state.error}</p>}
    {state.message && <p role="status" className="admin-form-success">{state.message}</p>}
    <button type="submit" className="button-primary" disabled={pending}>{pending ? "Saving…" : "Save site settings"}</button>
  </form>;
}
