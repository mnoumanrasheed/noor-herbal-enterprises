import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function hasImageSignature(bytes: Uint8Array, type: string) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes.slice(0, 8).join(",") === "137,80,78,71,13,10,26,10";
  if (type === "image/webp") return new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  return false;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return errorResponse("You must be signed in as an administrator.", 401);

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return errorResponse("Cloudinary is not configured. Add the server-side Cloudinary credentials before uploading.", 503);
  }

  const body = await request.formData();
  const file = body.get("file");
  if (!(file instanceof File)) return errorResponse("Choose an image file to upload.");
  if (file.size <= 0 || file.size > MAX_BYTES) return errorResponse("Images must be between 1 byte and 5 MB.");
  if (!ALLOWED_TYPES.has(file.type)) return errorResponse("Use a JPG, PNG, or WebP image.");

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!EXTENSIONS.has(extension)) return errorResponse("The file extension does not match a supported image type.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasImageSignature(bytes, file.type)) return errorResponse("The uploaded file is not a valid image.");

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "noor-herbal-enterprises/catalogue";
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(signatureBase).digest("hex");

  const upload = new FormData();
  upload.append("file", new Blob([bytes], { type: file.type }), file.name);
  upload.append("api_key", apiKey);
  upload.append("timestamp", String(timestamp));
  upload.append("folder", folder);
  upload.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: upload,
  });
  if (!response.ok) return errorResponse("Cloudinary rejected the image upload.", 502);

  const result = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    width?: number;
    height?: number;
    format?: string;
  };
  if (!result.secure_url || !result.public_id) return errorResponse("Cloudinary returned incomplete image details.", 502);

  return NextResponse.json({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width ?? null,
    height: result.height ?? null,
    format: result.format ?? file.type.replace("image/", ""),
  });
}
