/**
 * Server-side data access helpers.
 * All functions in this file are SERVER-ONLY — they talk directly to the DB.
 * Do NOT import this file from client components.
 */

import { sql } from "@/lib/db";
import {
  DEFAULT_CONTACT_SETTINGS,
  DEFAULT_BRAND_STORY_CONTENT,
  DEFAULT_HERO_SETTINGS,
  DEFAULT_STOREFRONT_CONTENT,
  type ContactSettings,
  type BrandStoryContent,
  type HeroSettings,
  type StorefrontContent,
} from "@/lib/site-settings";
import type { Category, Order, Product } from "@/types";

export async function getContactSettings(): Promise<ContactSettings> {
  const rows = await sql`
    SELECT key, value
    FROM site_settings
    WHERE key IN ('contact_email', 'contact_phone', 'contact_instagram')
  `;

  const settings = Object.fromEntries(
    rows.map((row) => [String(row.key), String(row.value ?? "")]),
  );

  return {
    email: settings.contact_email || DEFAULT_CONTACT_SETTINGS.email,
    phone: settings.contact_phone || DEFAULT_CONTACT_SETTINGS.phone,
    instagram: settings.contact_instagram || DEFAULT_CONTACT_SETTINGS.instagram,
  };
}

export async function getHeroSettings(): Promise<HeroSettings> {
  const rows = await sql`
    SELECT key, value
    FROM site_settings
    WHERE key IN ('hero_eyebrow', 'hero_title', 'hero_description', 'hero_cta_label', 'hero_visual_category')
  `;
  const settings = Object.fromEntries(
    rows.map((row) => [String(row.key), String(row.value ?? "")]),
  );

  return {
    eyebrow: settings.hero_eyebrow || DEFAULT_HERO_SETTINGS.eyebrow,
    title: settings.hero_title || DEFAULT_HERO_SETTINGS.title,
    description: settings.hero_description || DEFAULT_HERO_SETTINGS.description,
    ctaLabel: settings.hero_cta_label || DEFAULT_HERO_SETTINGS.ctaLabel,
    visualCategory: settings.hero_visual_category || DEFAULT_HERO_SETTINGS.visualCategory,
  };
}

export async function getStorefrontContent(): Promise<StorefrontContent> {
  const rows = await sql`SELECT key, value FROM site_settings WHERE key IN ('homepage_copy', 'featured_content', 'footer_content')`;
  const values = Object.fromEntries(rows.map((row) => [String(row.key), String(row.value ?? "")]));
  return {
    homepageCopy: values.homepage_copy || DEFAULT_STOREFRONT_CONTENT.homepageCopy,
    featuredContent: values.featured_content || DEFAULT_STOREFRONT_CONTENT.featuredContent,
    footerContent: values.footer_content || DEFAULT_STOREFRONT_CONTENT.footerContent,
  };
}

export async function getBrandStoryContent(): Promise<BrandStoryContent> {
  const rows = await sql`
    SELECT key, value
    FROM site_settings
    WHERE key IN (
      'story_heading', 'story_body_one', 'story_body_two', 'story_mission', 'story_vision',
      'story_opening_image', 'story_opening_image_alt', 'story_opening_image_public_id',
      'story_mission_image', 'story_mission_image_alt', 'story_mission_image_public_id',
      'story_vision_image', 'story_vision_image_alt', 'story_vision_image_public_id'
    )
  `;
  const values = Object.fromEntries(rows.map((row) => [String(row.key), String(row.value ?? "")]));
  return {
    heading: values.story_heading || DEFAULT_BRAND_STORY_CONTENT.heading,
    bodyOne: values.story_body_one || DEFAULT_BRAND_STORY_CONTENT.bodyOne,
    bodyTwo: values.story_body_two || DEFAULT_BRAND_STORY_CONTENT.bodyTwo,
    mission: values.story_mission || DEFAULT_BRAND_STORY_CONTENT.mission,
    vision: values.story_vision || DEFAULT_BRAND_STORY_CONTENT.vision,
    openingImage: values.story_opening_image || DEFAULT_BRAND_STORY_CONTENT.openingImage,
    openingImageAlt: values.story_opening_image_alt || DEFAULT_BRAND_STORY_CONTENT.openingImageAlt,
    openingImagePublicId: values.story_opening_image_public_id || null,
    missionImage: values.story_mission_image || DEFAULT_BRAND_STORY_CONTENT.missionImage,
    missionImageAlt: values.story_mission_image_alt || DEFAULT_BRAND_STORY_CONTENT.missionImageAlt,
    missionImagePublicId: values.story_mission_image_public_id || null,
    visionImage: values.story_vision_image || DEFAULT_BRAND_STORY_CONTENT.visionImage,
    visionImageAlt: values.story_vision_image_alt || DEFAULT_BRAND_STORY_CONTENT.visionImageAlt,
    visionImagePublicId: values.story_vision_image_public_id || null,
  };
}

export async function getActiveCategories(): Promise<Category[]> {
  const rows = await sql`
    SELECT id, name, slug, description, image_url, image_public_id, image_alt, sort_order, is_active, created_at, updated_at
    FROM categories
    WHERE is_active = TRUE
    ORDER BY sort_order ASC, name ASC
  `;
  return rows as Category[];
}

const PRODUCT_SELECT = `
  p.*,
  c.name AS category_name,
  c.slug AS category_slug,
  COALESCE((
    SELECT json_agg(pi ORDER BY pi.sort_order, pi.created_at)
    FROM product_images pi
    WHERE pi.product_id = p.id
  ), '[]'::json) AS images,
  COALESCE((
    SELECT json_agg(
      json_build_object(
        'id', pv.id,
        'product_id', pv.product_id,
        'sku', pv.sku,
        'name', pv.name,
        'price_paise', pv.price_paise,
        'compare_price_paise', pv.compare_price_paise,
        'weight_grams', pv.weight_grams,
        'is_active', pv.is_active,
        'sort_order', pv.sort_order,
        'created_at', pv.created_at,
        'updated_at', pv.updated_at,
        'inventory', CASE WHEN i.variant_id IS NULL THEN NULL ELSE json_build_object(
          'variant_id', i.variant_id,
          'quantity', i.quantity,
          'low_stock_alert', i.low_stock_alert,
          'updated_at', i.updated_at
        ) END
      ) ORDER BY pv.sort_order, pv.created_at
    )
    FROM product_variants pv
    LEFT JOIN inventory i ON i.variant_id = pv.id
    WHERE pv.product_id = p.id AND pv.is_active = TRUE
  ), '[]'::json) AS variants
`;

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const rows = await sql`
    SELECT ${sql.unsafe(PRODUCT_SELECT)}
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = ${categoryId} AND p.is_active = TRUE
    ORDER BY p.sort_order ASC, p.name ASC
  `;
  return rows as Product[];
}

export async function getCategoryShowcases(): Promise<Category[]> {
  const categories = await getActiveCategories();
  return Promise.all(
    categories.map(async (category) => ({
      ...category,
      products: await getProductsByCategory(category.id),
    })),
  );
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const rows = await sql`
    SELECT id, name, slug, description, image_url, image_public_id, image_alt, sort_order, is_active, created_at, updated_at
    FROM categories
    WHERE slug = ${slug} AND is_active = TRUE
    LIMIT 1
  `;
  return (rows[0] as Category) ?? null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await sql`
    SELECT ${sql.unsafe(PRODUCT_SELECT)}
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = TRUE AND p.is_featured = TRUE
    ORDER BY p.sort_order ASC
    LIMIT 8
  `;
  return rows as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await sql`
    SELECT ${sql.unsafe(PRODUCT_SELECT)}
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ${slug} AND p.is_active = TRUE
    LIMIT 1
  `;
  return (rows[0] as Product) ?? null;
}

// ---- Admin queries ----

export async function getAllCategories(): Promise<Category[]> {
  const rows = await sql`
    SELECT c.*, COUNT(p.id)::int AS product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id
    ORDER BY c.sort_order ASC, c.name ASC
  `;
  return rows as Category[];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const rows = await sql`SELECT * FROM categories WHERE id = ${id} LIMIT 1`;
  return (rows[0] as Category) ?? null;
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await sql`
    SELECT ${sql.unsafe(PRODUCT_SELECT)}
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;
  return rows as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const rows = await sql`
    SELECT ${sql.unsafe(PRODUCT_SELECT)}
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ${id}
    LIMIT 1
  `;
  return (rows[0] as Product) ?? null;
}

export async function getAllOrders(): Promise<Order[]> {
  const rows = await sql`
    SELECT o.*, COALESCE((
      SELECT json_agg(oi ORDER BY oi.created_at)
      FROM order_items oi WHERE oi.order_id = o.id
    ), '[]'::json) AS items
    FROM orders o
    ORDER BY o.created_at DESC
  `;
  return rows as Order[];
}

export async function getOrderReport() {
  const rows = await sql`
    SELECT
      COUNT(*) FILTER (WHERE status = 'pending')::int AS inquiries,
      COUNT(*) FILTER (WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered'))::int AS confirmed_sales,
      COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled,
      COALESCE(SUM(total_paise) FILTER (WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered')), 0)::int AS confirmed_total_paise
    FROM orders
  `;
  return rows[0] as { inquiries: number; confirmed_sales: number; cancelled: number; confirmed_total_paise: number };
}
