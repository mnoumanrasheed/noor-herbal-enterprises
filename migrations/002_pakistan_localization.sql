-- =============================================================
-- Migration 002: Pakistan localization
-- Safe to re-run. Existing orders and product records are preserved.
-- Historical order addresses are intentionally not rewritten.
-- =============================================================

ALTER TABLE orders ALTER COLUMN country SET DEFAULT 'PK';

INSERT INTO site_settings (key, value)
VALUES
  ('contact_email', 'noorherbalenterprises@gmail.com'),
  ('contact_phone', '+92 300 5599174'),
  ('contact_instagram', 'https://www.instagram.com/noorherbalenterprices/'),
  ('hero_eyebrow', 'The Noor Herbal collection'),
  ('hero_title', 'A considered ritual' || CHR(10) || 'for every day.'),
  ('hero_description', 'Discover chutneys, pickles, oils, and herbal shampoos composed with care for kitchens, shelves, and daily routines.'),
  ('hero_cta_label', 'Shop the collection'),
  ('hero_visual_category', 'The complete collection'),
  ('currency_code', 'PKR'),
  ('currency_symbol', 'Rs')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Shipping is not fixed until an approved policy/rate is configured.
DELETE FROM site_settings
WHERE key IN ('free_shipping_threshold_paise', 'shipping_flat_rate_paise');
