import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import { uploadCatalogImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return errorResponse("Administrator sign-in is required to upload images.", 401);

  try {
    const body = await request.formData();
    const file = body.get("file");
    if (!(file instanceof File)) return errorResponse("Choose an image file to upload.");

    const image = await uploadCatalogImage(file);
    return NextResponse.json(image);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The image could not be uploaded.";
    if (message === "Cloudinary is not configured.") {
      return errorResponse("Cloudinary is not configured. Add the server-side Cloudinary credentials before uploading.", 503);
    }
    if (message.includes("JFIF") || message.includes("JPG, PNG, or WebP") || message.includes("valid image") || message.includes("5 MB")) {
      return errorResponse(message);
    }
    return errorResponse("The image could not be uploaded. Check the Cloudinary configuration and try again.", 502);
  }
}
