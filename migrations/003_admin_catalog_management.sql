-- =============================================================
-- Migration 003: Admin catalogue management metadata
-- Safe additions only; existing catalogue records are preserved.
-- =============================================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sku TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku_unique
  ON products(sku)
  WHERE sku IS NOT NULL AND sku <> '';

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS image_alt TEXT;

ALTER TABLE product_images
  ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT,
  ADD COLUMN IF NOT EXISTS width INTEGER,
  ADD COLUMN IF NOT EXISTS height INTEGER,
  ADD COLUMN IF NOT EXISTS format TEXT;

INSERT INTO site_settings (key, value) VALUES
  ('footer_content', 'Thoughtful pantry and personal care essentials, prepared for everyday rituals.'),
  ('featured_content', 'A considered selection from the Noor Herbal collection.'),
  ('homepage_copy', 'Discover chutneys, pickles, oils, and shampoos composed with care for kitchens, shelves, and daily routines.')
ON CONFLICT (key) DO NOTHING;
