import "server-only";

import { createHash } from "node:crypto";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const FOLDER = "noor-herbal-enterprises/catalogue";

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

export type UploadedImage = {
  url: string;
  publicId: string;
  width: number | null;
  height: number | null;
  format: string | null;
};

function config(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
}

export function cloudinaryIsConfigured() {
  return Boolean(config());
}

function signature(parameters: Record<string, string | number | boolean>, apiSecret: string) {
  const payload = Object.entries(parameters)
    .filter(([, value]) => value !== "" && value !== undefined && value !== null)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

function hasImageSignature(bytes: Uint8Array, type: string) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes.slice(0, 8).join(",") === "137,80,78,71,13,10,26,10";
  if (type === "image/webp") return new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  return false;
}

export async function uploadCatalogImage(file: File): Promise<UploadedImage> {
  const settings = config();
  if (!settings) throw new Error("Cloudinary is not configured.");

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (extension === "jfif") {
    throw new Error("JFIF files are not accepted. Convert the image to JPG, PNG, or WebP before uploading.");
  }
  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) throw new Error("Images must be between 1 byte and 5 MB.");
  if (!ALLOWED_TYPES.has(file.type) || !EXTENSIONS.has(extension)) throw new Error("Use a JPG, PNG, or WebP image.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasImageSignature(bytes, file.type)) throw new Error("The uploaded file is not a valid image.");

  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder: FOLDER, timestamp };
  const upload = new FormData();
  upload.append("file", new Blob([bytes], { type: file.type }), file.name);
  upload.append("api_key", settings.apiKey);
  upload.append("timestamp", String(timestamp));
  upload.append("folder", FOLDER);
  upload.append("signature", signature(params, settings.apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${settings.cloudName}/image/upload`, {
    method: "POST",
    body: upload,
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error("Cloudinary rejected the image upload.");

  const result = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    width?: number;
    height?: number;
    format?: string;
  };
  if (!result.secure_url || !result.public_id) throw new Error("Cloudinary returned incomplete image details.");

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width ?? null,
    height: result.height ?? null,
    format: result.format ?? null,
  };
}

/** Best-effort cleanup. A database change must not be rolled back for a CDN cleanup failure. */
export async function destroyCatalogImages(publicIds: Array<string | null | undefined>) {
  const settings = config();
  if (!settings) return { attempted: 0, removed: 0 };

  const ids = [...new Set(publicIds.filter((id): id is string => Boolean(id?.trim())))];
  const results = await Promise.allSettled(ids.map(async (publicId) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const params = { invalidate: true, public_id: publicId, timestamp };
    const body = new URLSearchParams({
      api_key: settings.apiKey,
      public_id: publicId,
      timestamp: String(timestamp),
      invalidate: "true",
      signature: signature(params, settings.apiSecret),
    });
    const response = await fetch(`https://api.cloudinary.com/v1_1/${settings.cloudName}/image/destroy`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error("Cloudinary could not remove an image.");
  }));

  return { attempted: ids.length, removed: results.filter((result) => result.status === "fulfilled").length };
}
