"use client";

import { useState } from "react";
import Image from "next/image";

export type AdminImage = {
  url: string;
  publicId: string;
  altText: string;
  width?: number | null;
  height?: number | null;
  format?: string | null;
};

export function AdminImageUpload({
  images,
  onChange,
  multiple = false,
}: {
  images: AdminImage[];
  onChange: (images: AdminImage[]) => void;
  multiple?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    const next = multiple ? [...images] : [];
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const result = (await response.json()) as { error?: string } & Partial<AdminImage>;
        if (!response.ok || !result.url || !result.publicId) throw new Error(result.error || "Upload failed.");
        next.push({ url: result.url, publicId: result.publicId, altText: "", width: result.width, height: result.height, format: result.format });
        if (!multiple) break;
      }
      onChange(next);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The image could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  function updateAlt(index: number, altText: string) {
    onChange(images.map((image, imageIndex) => imageIndex === index ? { ...image, altText } : image));
  }

  return (
    <div className="space-y-3">
      <label className="field-label">{multiple ? "Product images" : "Category image"}</label>
      <input type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} disabled={busy} onChange={(event) => upload(event.target.files)} className="admin-file-input" />
      <p className="text-xs text-[#7e776d]">JPG, PNG, or WebP. Maximum 5 MB per image. Uploads are validated on the server.</p>
      {error && <p role="alert" className="admin-form-error">{error}</p>}
      {busy && <p className="text-xs text-[#c9a84c]">Uploading securely…</p>}
      {images.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {images.map((image, index) => (
            <div key={`${image.publicId}-${index}`} className="admin-image-item">
              <Image src={image.url} alt={image.altText || "Uploaded catalogue image preview"} width={image.width || 1200} height={image.height || 900} className="admin-image-preview" />
              <div className="flex gap-2">
                <input value={image.altText} onChange={(event) => updateAlt(index, event.target.value)} placeholder="Useful alt text" aria-label={`Alt text for image ${index + 1}`} className="field-input" required />
                <button type="button" onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))} className="admin-remove-button">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
