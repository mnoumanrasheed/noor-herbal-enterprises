// =============================================================
// Noor Herbal Enterprises — shared domain types
// =============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  short_desc: string | null;
  ingredients: string | null;
  how_to_use: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined fields (optional)
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
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
}

export interface Inventory {
  variant_id: string;
  quantity: number;
  low_stock_alert: number;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  subtotal_paise: number;
  shipping_paise: number;
  total_paise: number;
  payment_method: string | null;
  payment_status: PaymentStatus;
  payment_ref: string | null;
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

export interface OrderItem {
  id: string;
  order_id: string;
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

// ------------------------------------------------------------
// Utility helpers
// ------------------------------------------------------------

/** Convert paise (integer) to formatted INR string e.g. "₹ 250.00" */
export function formatPrice(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}
