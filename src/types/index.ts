// =============================================================
// Noor Herbal Enterprises — Shared Domain Types
// =============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  image_alt: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  products?: Product[];
  product_count?: number;
}

export type ProductStatus = "draft" | "published" | "archived";

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  short_desc: string | null;
  ingredients: string | null;
  how_to_use: string | null;
  status: ProductStatus;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  category_name?: string;
  category_slug?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
  cloudinary_public_id?: string | null;
  width?: number | null;
  height?: number | null;
  format?: string | null;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  price_paise: number;
  compare_price_paise: number | null;
  weight_grams: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined
  inventory?: Inventory;
  product_name?: string;
}

export interface Inventory {
  variant_id: string;
  quantity: number;
  low_stock_alert: number;
  updated_at: string;
}

export interface InventoryLog {
  id: string;
  variant_id: string;
  change_qty: number;
  reason: string;
  order_id: string | null;
  admin_id: string | null;
  created_at: string;
  // Joined
  sku?: string;
  variant_name?: string;
  product_name?: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  province: string | null;
  postal_code: string | null;
  country: string;
  subtotal_paise: number;
  shipping_paise: number;
  discount_paise: number;
  total_paise: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_ref: string | null;
  customer_note?: string | null;
  admin_note?: string | null;
  stock_deducted?: boolean;
  whatsapp_opened_at?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "cod" | "bank_transfer" | "online" | string;

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_name: string;
  sku: string;
  unit_price_paise: number;
  quantity: number;
  line_total_paise: number;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string | null;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export type CatalogSortOption =
  | "featured"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";

// ------------------------------------------------------------
// Utility helpers
// ------------------------------------------------------------

/** Convert paise (integer) to a formatted Pakistani rupee string (e.g., Rs 1,250). */
export function formatPrice(paise: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

/** Get starting price in paise for a product with multiple variants */
export function getMinVariantPrice(variants?: ProductVariant[]): number | null {
  if (!variants || variants.length === 0) return null;
  const activeVariants = variants.filter((v) => v.is_active);
  if (activeVariants.length === 0) return null;
  return Math.min(...activeVariants.map((v) => v.price_paise));
}

/** Check if product has any available stock */
export function isProductInStock(variants?: ProductVariant[]): boolean {
  if (!variants || variants.length === 0) return false;
  return variants.some((v) => v.is_active && (v.inventory?.quantity ?? 0) > 0);
}
