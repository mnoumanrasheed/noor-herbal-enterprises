"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
import { z } from "zod";

export type AdminActionState = { ok: boolean; message?: string; error?: string };

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Enter a category name.").max(80),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug with hyphens."),
  description: z.string().trim().max(500).optional(),
  imageUrl: z.string().trim().url("Choose an uploaded image or leave the image empty.").or(z.literal("")),
  imageAlt: z.string().trim().max(160).optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.enum(["on", "true", "false"]).optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function readCategory(formData: FormData) {
  return categorySchema.safeParse({
    id: String(formData.get("id") || "") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || "",
    imageUrl: formData.get("imageUrl") || "",
    imageAlt: formData.get("imageAlt") || "",
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") || "false",
  });
}

export async function saveCategory(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = readCategory(formData);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the category fields." };
    const data = parsed.data;
    const active = data.isActive === "on" || data.isActive === "true";

    if (data.id) {
      await sql`
        UPDATE categories
        SET name = ${data.name}, slug = ${data.slug}, description = ${data.description || null},
            image_url = ${data.imageUrl || null}, image_alt = ${data.imageAlt || null},
            sort_order = ${data.sortOrder}, is_active = ${active}
        WHERE id = ${data.id}
      `;
    } else {
      await sql`
        INSERT INTO categories (name, slug, description, image_url, image_alt, sort_order, is_active)
        VALUES (${data.name}, ${data.slug}, ${data.description || null}, ${data.imageUrl || null}, ${data.imageAlt || null}, ${data.sortOrder}, ${active})
      `;
    }
    revalidatePath("/admin/categories");
    revalidatePath("/categories", "layout");
    return { ok: true, message: data.id ? "Category updated." : "Category created." };
  } catch (error) {
    if ((error as { code?: string }).code === "23505") return { ok: false, error: "That category slug is already in use." };
    if (error instanceof Error && error.message === "Unauthorized") return { ok: false, error: "Your admin session has expired. Sign in again." };
    return { ok: false, error: "The category could not be saved. Check the database connection and try again." };
  }
}
