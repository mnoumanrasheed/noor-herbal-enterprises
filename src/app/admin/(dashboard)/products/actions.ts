"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { isAdminAccessError, requireAdmin } from "@/lib/admin";
import { destroyCatalogImages } from "@/lib/cloudinary";
import { sql } from "@/lib/db";
import { z } from "zod";
import type { AdminActionState } from "../categories/actions";

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().trim().min(1).max(400).nullable().optional(),
  altText: z.string().trim().min(3, "Add useful alt text for every image.").max(160),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  format: z.string().max(12).nullable().optional(),
});

const variantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Every variant needs a name.").max(80),
  sku: z.string().trim().max(80).optional(),
  pricePaise: z.coerce.number().int().positive("Price must be greater than zero."),
  comparePricePaise: z.coerce.number().int().positive().nullable().optional(),
  weightGrams: z.coerce.number().int().positive().nullable().optional(),
  quantity: z.coerce.number().int().min(0, "Stock cannot be negative."),
  lowStockAlert: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
});

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Enter a product name.").max(160),
  slug: z.string().trim().max(200).optional(),
  sku: z.string().trim().max(80).optional(),
  categoryId: z.string().uuid("Choose a category."),
  shortDesc: z.string().trim().max(240).optional(),
  description: z.string().trim().max(5000).optional(),
  ingredients: z.string().trim().max(3000).optional(),
  howToUse: z.string().trim().max(3000).optional(),
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(300).optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  images: z.array(imageSchema).min(1, "Add at least one product image before saving.").max(8, "Use up to 8 images."),
  variants: z.array(variantSchema).min(1, "Add at least one variant before saving."),
});

function jsonField(formData: FormData, key: string) {
  try { return JSON.parse(String(formData.get(key) || "[]")); } catch { return null; }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || `product-${Date.now()}`;
}

function readProduct(formData: FormData) {
  const rawName = String(formData.get("name") || "");
  const rawSlug = String(formData.get("slug") || "").trim();
  // Auto-generate slug from name if blank or invalid
  const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rawSlug) ? rawSlug : slugify(rawName);
  return productSchema.safeParse({
    id: String(formData.get("id") || "") || undefined,
    name: rawName,
    slug,
    sku: String(formData.get("sku") || "").trim() || undefined,
    categoryId: formData.get("categoryId"),
    shortDesc: formData.get("shortDesc") || "",
    description: formData.get("description") || "",
    ingredients: formData.get("ingredients") || "",
    howToUse: formData.get("howToUse") || "",
    seoTitle: formData.get("seoTitle") || "",
    seoDescription: formData.get("seoDescription") || "",
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    images: jsonField(formData, "images"),
    variants: jsonField(formData, "variants"),
  });
}


export async function saveProduct(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = readProduct(formData);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the product fields." };
    const data = parsed.data;
    // Auto-assign variant SKUs if not provided
    data.variants = data.variants.map((variant, i) => ({
      ...variant,
      sku: variant.sku?.trim() || `${data.slug}-v${i + 1}-${Date.now()}`,
    }));
    const productId = data.id ?? randomUUID();
    const variantIds = data.variants.map((variant) => variant.id ?? randomUUID());
    let removedImagePublicIds: string[] = [];

    if (data.id) {
      const productRows = await sql`SELECT id FROM products WHERE id = ${data.id} LIMIT 1`;
      if (!productRows.length) return { ok: false, error: "That product no longer exists. Refresh the product list and try again." };
      const existingVariantRows = await sql`SELECT id FROM product_variants WHERE product_id = ${data.id}`;
      const existingVariantIds = new Set(existingVariantRows.map((row) => String(row.id)));
      if (data.variants.some((variant) => variant.id && !existingVariantIds.has(variant.id))) {
        return { ok: false, error: "One of the submitted variants does not belong to this product." };
      }
      const existingImages = await sql`SELECT cloudinary_public_id FROM product_images WHERE product_id = ${data.id}`;
      const incomingPublicIds = new Set(data.images.map((image) => image.publicId).filter((id): id is string => Boolean(id)));
      removedImagePublicIds = existingImages
        .map((image) => image.cloudinary_public_id ? String(image.cloudinary_public_id) : "")
        .filter((publicId) => Boolean(publicId) && !incomingPublicIds.has(publicId));
    }

    const queries = [sql`
      INSERT INTO products (
        id, category_id, name, slug, sku, short_desc, description, ingredients, how_to_use,
        seo_title, seo_description, sort_order, is_active, is_featured
      )
      VALUES (
        ${productId}, ${data.categoryId}, ${data.name}, ${data.slug}, ${data.sku || null},
        ${data.shortDesc || null}, ${data.description || null}, ${data.ingredients || null}, ${data.howToUse || null},
        ${data.seoTitle || null}, ${data.seoDescription || null}, ${data.sortOrder}, ${data.isActive}, ${data.isFeatured}
      )
      ON CONFLICT (id) DO UPDATE SET
        category_id = EXCLUDED.category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, sku = EXCLUDED.sku,
        short_desc = EXCLUDED.short_desc, description = EXCLUDED.description, ingredients = EXCLUDED.ingredients, how_to_use = EXCLUDED.how_to_use,
        seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
        sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active, is_featured = EXCLUDED.is_featured
    `, sql`DELETE FROM product_images WHERE product_id = ${productId}`];

    data.images.forEach((image, index) => queries.push(sql`
      INSERT INTO product_images (product_id, url, alt_text, sort_order, cloudinary_public_id, width, height, format)
      VALUES (${productId}, ${image.url}, ${image.altText}, ${index}, ${image.publicId}, ${image.width ?? null}, ${image.height ?? null}, ${image.format ?? null})
    `));

    const keepIds = data.variants.filter((variant) => variant.id).map((variant) => variant.id as string);
    queries.push(keepIds.length ? sql`DELETE FROM product_variants WHERE product_id = ${productId} AND id <> ALL(${keepIds}::uuid[])` : sql`DELETE FROM product_variants WHERE product_id = ${productId}`);
    data.variants.forEach((variant, index) => {
      const variantId = variantIds[index];
      queries.push(sql`
        INSERT INTO product_variants (id, product_id, sku, name, price_paise, compare_price_paise, weight_grams, is_active, sort_order)
        VALUES (${variantId}, ${productId}, ${variant.sku}, ${variant.name}, ${variant.pricePaise}, ${variant.comparePricePaise ?? null}, ${variant.weightGrams ?? null}, ${variant.isActive}, ${index})
        ON CONFLICT (id) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, price_paise = EXCLUDED.price_paise,
          compare_price_paise = EXCLUDED.compare_price_paise, weight_grams = EXCLUDED.weight_grams, is_active = EXCLUDED.is_active, sort_order = EXCLUDED.sort_order
      `);
      queries.push(sql`
        INSERT INTO inventory (variant_id, quantity, low_stock_alert)
        VALUES (${variantId}, ${variant.quantity}, ${variant.lowStockAlert})
        ON CONFLICT (variant_id) DO UPDATE SET quantity = EXCLUDED.quantity, low_stock_alert = EXCLUDED.low_stock_alert
      `);
    });

    await sql.transaction(queries);
    await destroyCatalogImages(removedImagePublicIds);
    revalidatePath("/admin/products");
    revalidatePath("/admin/inventory");
    revalidatePath("/", "layout");
    revalidatePath("/categories", "layout");
    return { ok: true, message: data.id ? "Product updated." : "Product created." };
  } catch (error) {
    if ((error as { code?: string }).code === "23505") return { ok: false, error: "That product slug or SKU is already in use." };
    if (isAdminAccessError(error)) return { ok: false, error: "Your admin session has expired. Sign in again." };
    return { ok: false, error: "The product could not be saved. Check the database connection and try again." };
  }
}

const deleteProductSchema = z.string().uuid();

export async function deleteProduct(id: string): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const parsed = deleteProductSchema.safeParse(id);
    if (!parsed.success) return { ok: false, error: "The product identifier is invalid." };

    const images = await sql`SELECT cloudinary_public_id FROM product_images WHERE product_id = ${parsed.data}`;
    const deleted = await sql`DELETE FROM products WHERE id = ${parsed.data} RETURNING id`;
    if (!deleted.length) return { ok: false, error: "That product no longer exists." };

    await destroyCatalogImages(images.map((image) => image.cloudinary_public_id ? String(image.cloudinary_public_id) : null));
    revalidatePath("/admin/products");
    revalidatePath("/admin/inventory");
    revalidatePath("/", "layout");
    revalidatePath("/categories", "layout");
    return { ok: true, message: "Product deleted." };
  } catch (error) {
    if (isAdminAccessError(error)) return { ok: false, error: "Your admin session has expired. Sign in again." };
    return { ok: false, error: "The product could not be deleted. Check the database connection and try again." };
  }
}
