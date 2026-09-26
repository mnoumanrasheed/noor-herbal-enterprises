-- =============================================================
-- Migration 008: Full E-Commerce Production Architecture
-- Safe additions only; all existing data preserved.
-- =============================================================

-- Products SEO and lifecycle status
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- Orders enhanced metadata
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS admin_note TEXT,
  ADD COLUMN IF NOT EXISTS discount_paise INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS province TEXT,
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'PKR';

-- Order items product foreign key link
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL;

-- Inventory adjustment logs for audit trail
CREATE TABLE IF NOT EXISTS inventory_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id  UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  change_qty  INTEGER NOT NULL,
  reason      TEXT NOT NULL,
  order_id    UUID REFERENCES orders(id) ON DELETE SET NULL,
  admin_id    UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_logs_variant ON inventory_logs(variant_id, created_at DESC);

-- Essential default e-commerce site settings
INSERT INTO site_settings (key, value) VALUES
  ('store_name', 'Noor Herbal Enterprises'),
  ('shipping_fee_paise', '25000'),
  ('free_shipping_threshold_paise', '300000'),
  ('cod_enabled', 'true'),
  ('bank_transfer_enabled', 'true'),
  ('bank_transfer_details', 'Meezan Bank\nAccount Title: Noor Herbal Enterprises\nAccount Number: 0101-0102030405\nIBAN: PK12MEZN0001010102030405'),
  ('announcement_bar_text', 'Free delivery across Pakistan on orders over Rs. 3,000 • Pure, Handcrafted & Traditional'),
  ('shipping_policy', 'We deliver across all cities in Pakistan within 3 to 5 business days via tracked courier services. Standard flat shipping is Rs. 250, and free shipping applies automatically on all orders over Rs. 3,000.'),
  ('returns_policy', 'Customer satisfaction is our top priority. If your order arrives damaged, defective, or incorrect, please reach out on WhatsApp within 48 hours of delivery with pictures for a swift replacement or refund.')
ON CONFLICT (key) DO NOTHING;
