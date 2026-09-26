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
  DEFAULT_STORE_SETTINGS,
  type ContactSettings,
  type BrandStoryContent,
  type HeroSettings,
  type StorefrontContent,
  type StoreSettings,
} from "@/lib/site-settings";
import type {
  Category,
  CatalogSortOption,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
} from "@/types";

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

export async function getStoreSettings(): Promise<StoreSettings> {
  const rows = await sql`
    SELECT key, value
    FROM site_settings WHERE key IN (
      'store_name', 'shipping_fee_paise', 'free_shipping_threshold_paise',
      'cod_enabled', 'bank_transfer_enabled', 'bank_transfer_details',
      'announcement_bar_text', 'shipping_policy', 'returns_policy',
      'whatsapp_phone'
    )
  `;

  const values = Object.fromEntries(
    rows.map((row) => [String(row.key), String(row.value ?? "")]),
  );

  return {
    storeName: values.store_name || DEFAULT_STORE_SETTINGS.storeName,
    shippingFeePaise: Number.parseInt(values.shipping_fee_paise || String(DEFAULT_STORE_SETTINGS.shippingFeePaise), 10),
    freeShippingThresholdPaise: Number.parseInt(values.free_shipping_threshold_paise || String(DEFAULT_STORE_SETTINGS.freeShippingThresholdPaise), 10),
    codEnabled: values.cod_enabled !== "false",
    bankTransferEnabled: values.bank_transfer_enabled !== "false",
    bankTransferDetails: values.bank_transfer_details || DEFAULT_STORE_SETTINGS.bankTransferDetails,
    announcementBarText: values.announcement_bar_text || DEFAULT_STORE_SETTINGS.announcementBarText,
    shippingPolicy: values.shipping_policy || DEFAULT_STORE_SETTINGS.shippingPolicy,
    returnsPolicy: values.returns_policy || DEFAULT_STORE_SETTINGS.returnsPolicy,
    whatsappPhone: values.whatsapp_phone || DEFAULT_STORE_SETTINGS.whatsappPhone,
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
    SELECT id, name, slug, description, image_url, image_public_id, image_alt, sort_order, is_active, created_at, updated_at,
      (SELECT COUNT(*)::int FROM products p WHERE p.category_id = categories.id AND p.is_active = TRUE) AS product_count
    FROM categories
    WHERE is_active = TRUE
    ORDER BY sort_order ASC, name ASC
  `;
  return rows as unknown as Category[];
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

export async function getProductsByCategory(
  categoryId: string,
  sort: CatalogSortOption = "featured"
): Promise<Product[]> {
  let orderBy = "p.sort_order ASC, p.name ASC";
  if (sort === "newest") {
    orderBy = "p.created_at DESC";
  } else if (sort === "name_asc") {
    orderBy = "p.name ASC";
  } else if (sort === "name_desc") {
    orderBy = "p.name DESC";
  } else if (sort === "price_asc") {
    orderBy = "(SELECT MIN(pv.price_paise) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = TRUE) ASC NULLS LAST";
  } else if (sort === "price_desc") {
    orderBy = "(SELECT MAX(pv.price_paise) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = TRUE) DESC NULLS LAST";
  }

  const rows = await sql`
    SELECT ${sql.unsafe(PRODUCT_SELECT)}
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = ${categoryId} AND p.is_active = TRUE
    ORDER BY ${sql.unsafe(orderBy)}
  `;
  return rows as unknown as Product[];
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
  return (rows[0] as unknown as Category) ?? null;
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
  return rows as unknown as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await sql`
    SELECT ${sql.unsafe(PRODUCT_SELECT)}
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ${slug} AND p.is_active = TRUE
    LIMIT 1
  `;
  return (rows[0] as unknown as Product) ?? null;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number = 4
): Promise<Product[]> {
  const sameCategoryRows = await sql`
    SELECT ${sql.unsafe(PRODUCT_SELECT)}
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = ${categoryId}
      AND p.id <> ${productId}
      AND p.is_active = TRUE
    ORDER BY p.is_featured DESC, p.sort_order ASC, p.created_at DESC
    LIMIT ${limit}
  `;

  let products = sameCategoryRows as unknown as Product[];

  if (products.length < limit) {
    const needed = limit - products.length;
    const existingIds = [productId, ...products.map((p) => p.id)];
    const backfillRows = await sql`
      SELECT ${sql.unsafe(PRODUCT_SELECT)}
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id <> ALL(${existingIds}::uuid[])
        AND p.is_active = TRUE
      ORDER BY p.is_featured DESC, p.sort_order ASC
      LIMIT ${needed}
    `;
    products = [...products, ...(backfillRows as unknown as Product[])];
  }

  return products;
}

export async function searchProducts({
  query = "",
  categorySlug,
  sort = "featured",
}: {
  query?: string;
  categorySlug?: string;
  sort?: CatalogSortOption;
}): Promise<Product[]> {
  const cleanQuery = query.trim().toLowerCase();

  let orderBy = "p.is_featured DESC, p.sort_order ASC, p.name ASC";
  if (sort === "newest") {
    orderBy = "p.created_at DESC";
  } else if (sort === "name_asc") {
    orderBy = "p.name ASC";
  } else if (sort === "name_desc") {
    orderBy = "p.name DESC";
  } else if (sort === "price_asc") {
    orderBy = "(SELECT MIN(pv.price_paise) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = TRUE) ASC NULLS LAST";
  } else if (sort === "price_desc") {
    orderBy = "(SELECT MAX(pv.price_paise) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = TRUE) DESC NULLS LAST";
  }

  if (cleanQuery && categorySlug) {
    const searchPattern = `%${cleanQuery}%`;
    const rows = await sql`
      SELECT ${sql.unsafe(PRODUCT_SELECT)}
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
        AND c.slug = ${categorySlug}
        AND (
          LOWER(p.name) LIKE ${searchPattern}
          OR LOWER(COALESCE(p.short_desc, '')) LIKE ${searchPattern}
          OR LOWER(COALESCE(p.description, '')) LIKE ${searchPattern}
          OR LOWER(COALESCE(p.ingredients, '')) LIKE ${searchPattern}
          OR LOWER(COALESCE(p.sku, '')) LIKE ${searchPattern}
          OR EXISTS (
            SELECT 1 FROM product_variants pv
            WHERE pv.product_id = p.id AND LOWER(pv.sku) LIKE ${searchPattern}
          )
        )
      ORDER BY ${sql.unsafe(orderBy)}
    `;
    return rows as unknown as Product[];
  }

  if (cleanQuery) {
    const searchPattern = `%${cleanQuery}%`;
    const rows = await sql`
      SELECT ${sql.unsafe(PRODUCT_SELECT)}
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
        AND (
          LOWER(p.name) LIKE ${searchPattern}
          OR LOWER(c.name) LIKE ${searchPattern}
          OR LOWER(COALESCE(p.short_desc, '')) LIKE ${searchPattern}
          OR LOWER(COALESCE(p.description, '')) LIKE ${searchPattern}
          OR LOWER(COALESCE(p.ingredients, '')) LIKE ${searchPattern}
          OR LOWER(COALESCE(p.sku, '')) LIKE ${searchPattern}
          OR EXISTS (
            SELECT 1 FROM product_variants pv
            WHERE pv.product_id = p.id AND LOWER(pv.sku) LIKE ${searchPattern}
          )
        )
      ORDER BY ${sql.unsafe(orderBy)}
    `;
    return rows as unknown as Product[];
  }

  if (categorySlug) {
    const rows = await sql`
      SELECT ${sql.unsafe(PRODUCT_SELECT)}
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE AND c.slug = ${categorySlug}
      ORDER BY ${sql.unsafe(orderBy)}
    `;
    return rows as unknown as Product[];
  }

  const rows = await sql`
    SELECT ${sql.unsafe(PRODUCT_SELECT)}
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = TRUE
    ORDER BY ${sql.unsafe(orderBy)}
  `;
  return rows as unknown as Product[];
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const rows = await sql`
    SELECT o.*, COALESCE((
      SELECT json_agg(oi ORDER BY oi.created_at)
      FROM order_items oi WHERE oi.order_id = o.id
    ), '[]'::json) AS items
    FROM orders o
    WHERE o.order_number = ${orderNumber}
    LIMIT 1
  `;
  return (rows[0] as unknown as Order) ?? null;
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
  return rows as unknown as Category[];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const rows = await sql`SELECT * FROM categories WHERE id = ${id} LIMIT 1`;
  return (rows[0] as unknown as Category) ?? null;
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await sql`
    SELECT ${sql.unsafe(PRODUCT_SELECT)}
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;
  return rows as unknown as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const rows = await sql`
    SELECT ${sql.unsafe(PRODUCT_SELECT)}
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ${id}
    LIMIT 1
  `;
  return (rows[0] as unknown as Product) ?? null;
}

export async function getAllOrders(filters?: {
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}): Promise<Order[]> {
  let query = `
    SELECT o.*, COALESCE((
      SELECT json_agg(oi ORDER BY oi.created_at)
      FROM order_items oi WHERE oi.order_id = o.id
    ), '[]'::json) AS items
    FROM orders o
    WHERE 1=1
  `;

  if (filters?.status) {
    query += ` AND o.status = '${filters.status.replace(/'/g, "")}'`;
  }
  if (filters?.paymentStatus) {
    query += ` AND o.payment_status = '${filters.paymentStatus.replace(/'/g, "")}'`;
  }
  if (filters?.search?.trim()) {
    const pattern = `%${filters.search.trim().toLowerCase()}%`;
    query += ` AND (LOWER(o.order_number) LIKE '${pattern}' OR LOWER(o.customer_name) LIKE '${pattern}' OR LOWER(COALESCE(o.customer_phone, '')) LIKE '${pattern}' OR LOWER(COALESCE(o.city, '')) LIKE '${pattern}')`;
  }

  query += ` ORDER BY o.created_at DESC`;

  const rows = await sql`${sql.unsafe(query)}`;
  return rows as unknown as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const rows = await sql`
    SELECT o.*, COALESCE((
      SELECT json_agg(oi ORDER BY oi.created_at)
      FROM order_items oi WHERE oi.order_id = o.id
    ), '[]'::json) AS items
    FROM orders o
    WHERE o.id = ${id}
    LIMIT 1
  `;
  return (rows[0] as unknown as Order) ?? null;
}

export async function getOrderReport() {
  const rows = await sql`
    SELECT
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_orders,
      COUNT(*) FILTER (WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered'))::int AS active_orders,
      COUNT(*) FILTER (WHERE status = 'delivered')::int AS delivered_orders,
      COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled_orders,
      COALESCE(SUM(total_paise) FILTER (WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered')), 0)::int AS total_revenue_paise,
      COUNT(*)::int AS total_orders
    FROM orders
  `;
  return rows[0] as unknown as {
    pending_orders: number;
    active_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    total_revenue_paise: number;
    total_orders: number;
  };
}

export interface InventoryItemRow {
  variant_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  category_name: string;
  variant_name: string;
  sku: string;
  price_paise: number;
  quantity: number;
  low_stock_alert: number;
  is_active: boolean;
  updated_at: string;
}

export async function getInventoryOverview(): Promise<InventoryItemRow[]> {
  const rows = await sql`
    SELECT
      pv.id AS variant_id,
      p.id AS product_id,
      p.name AS product_name,
      p.slug AS product_slug,
      c.name AS category_name,
      pv.name AS variant_name,
      pv.sku,
      pv.price_paise,
      COALESCE(i.quantity, 0) AS quantity,
      COALESCE(i.low_stock_alert, 5) AS low_stock_alert,
      pv.is_active,
      COALESCE(i.updated_at, pv.updated_at) AS updated_at
    FROM product_variants pv
    JOIN products p ON pv.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN inventory i ON i.variant_id = pv.id
    ORDER BY p.name ASC, pv.sort_order ASC
  `;
  return rows as unknown as InventoryItemRow[];
}

export async function getAdminDashboardSummary() {
  const recentOrdersQuery = await sql`
    SELECT o.*, COALESCE((
      SELECT json_agg(oi ORDER BY oi.created_at)
      FROM order_items oi WHERE oi.order_id = o.id
    ), '[]'::json) AS items
    FROM orders o
    ORDER BY o.created_at DESC
    LIMIT 6
  `;

  const [categories, products, report, inventory] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
    getOrderReport(),
    getInventoryOverview(),
  ]);

  const recentOrders = recentOrdersQuery as unknown as Order[];

  const lowStockCount = inventory.filter(
    (item) => item.quantity > 0 && item.quantity <= item.low_stock_alert
  ).length;

  const outOfStockCount = inventory.filter((item) => item.quantity === 0).length;

  return {
    categoryCount: categories.length,
    productCount: products.length,
    publishedProductCount: products.filter((p) => p.is_active).length,
    draftProductCount: products.filter((p) => !p.is_active).length,
    pendingOrdersCount: report.pending_orders,
    activeOrdersCount: report.active_orders,
    deliveredOrdersCount: report.delivered_orders,
    cancelledOrdersCount: report.cancelled_orders,
    totalRevenuePaise: report.total_revenue_paise,
    lowStockCount,
    outOfStockCount,
    recentOrders,
  };
}
