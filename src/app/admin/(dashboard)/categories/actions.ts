"use server";

import { revalidatePath } from "next/cache";
import { destroyCatalogImages } from "@/lib/cloudinary";
import { isAdminAccessError, requireAdmin } from "@/lib/admin";
import { sql } from "@/lib/db";
import { z } from "zod";

export type AdminActionState = { ok: boolean; message?: string; error?: string };

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Enter a category name.").max(80),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug with hyphens."),
  description: z.string().trim().max(500).optional(),
  imageUrl: z.string().trim().url("Choose an uploaded image or leave the image empty.").or(z.literal("")),
  imagePublicId: z.string().trim().max(400).optional(),
  imageAlt: z.string().trim().max(160).optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.enum(["on", "true", "false"]).optional(),
});

function readCategory(formData: FormData) {
  return categorySchema.safeParse({
    id: String(formData.get("id") || "") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || "",
    imageUrl: formData.get("imageUrl") || "",
    imagePublicId: formData.get("imagePublicId") || "",
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

    let previousPublicId: string | null = null;
    if (data.id) {
      const previousRows = await sql`SELECT image_public_id FROM categories WHERE id = ${data.id} LIMIT 1`;
      if (!previousRows.length) return { ok: false, error: "That category no longer exists. Refresh the list and try again." };
      previousPublicId = previousRows[0]?.image_public_id ? String(previousRows[0].image_public_id) : null;
      await sql`
        UPDATE categories
        SET name = ${data.name}, slug = ${data.slug}, description = ${data.description || null},
            image_url = ${data.imageUrl || null}, image_public_id = ${data.imagePublicId || null}, image_alt = ${data.imageAlt || null},
            sort_order = ${data.sortOrder}, is_active = ${active}
        WHERE id = ${data.id}
      `;
    } else {
      await sql`
        INSERT INTO categories (name, slug, description, image_url, image_public_id, image_alt, sort_order, is_active)
        VALUES (${data.name}, ${data.slug}, ${data.description || null}, ${data.imageUrl || null}, ${data.imagePublicId || null}, ${data.imageAlt || null}, ${data.sortOrder}, ${active})
      `;
    }
    if (previousPublicId && previousPublicId !== data.imagePublicId) await destroyCatalogImages([previousPublicId]);
    revalidatePath("/admin/categories");
    revalidatePath("/categories", "layout");
    return { ok: true, message: data.id ? "Category updated." : "Category created." };
  } catch (error) {
    if ((error as { code?: string }).code === "23505") return { ok: false, error: "That category slug is already in use." };
    if (isAdminAccessError(error)) return { ok: false, error: "Your admin session has expired. Sign in again." };
    return { ok: false, error: "The category could not be saved. Check the database connection and try again." };
  }
}

const deleteCategorySchema = z.string().uuid();

export async function deleteCategory(id: string): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = deleteCategorySchema.safeParse(id);
    if (!parsed.success) return { ok: false, error: "The category identifier is invalid." };

    const rows = await sql`
      SELECT c.image_public_id, COUNT(p.id)::int AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      WHERE c.id = ${parsed.data}
      GROUP BY c.id
    `;
    const category = rows[0] as { image_public_id?: string | null; product_count?: number } | undefined;
    if (!category) return { ok: false, error: "That category no longer exists." };
    if (Number(category.product_count ?? 0) > 0) return { ok: false, error: "Move or delete this category's products before deleting the category." };

    await sql`DELETE FROM categories WHERE id = ${parsed.data}`;
    await destroyCatalogImages([category.image_public_id]);
    revalidatePath("/admin/categories");
    revalidatePath("/categories", "layout");
    return { ok: true, message: "Category deleted." };
  } catch (error) {
    if (isAdminAccessError(error)) return { ok: false, error: "Your admin session has expired. Sign in again." };
    return { ok: false, error: "The category could not be deleted. Check the database connection and try again." };
  }
}
