-- =============================================================
-- Migration 001: Initial Schema
-- Noor Herbal Enterprises
-- Run with: npm run db:migrate
-- =============================================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------
-- SITE SETTINGS
-- Key/value store for configurable site options.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- CATEGORIES
-- Top-level product groupings (Chutney, Pickles, Oils, Shampoo)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active, sort_order);

-- -------------------------------------------------------------
-- PRODUCTS
-- One product per category row; variants handle sizing/pricing.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  short_desc    TEXT,
  ingredients   TEXT,
  how_to_use    TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;

-- -------------------------------------------------------------
-- PRODUCT IMAGES
-- Ordered images per product.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id, sort_order);

-- -------------------------------------------------------------
-- PRODUCT VARIANTS
-- Each variant is a distinct purchasable SKU (size/flavour/etc.)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_variants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku            TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,           -- e.g. "250g", "500ml"
  price_paise    INTEGER NOT NULL,        -- price in Pakistani paise, integer avoids float rounding
  compare_price_paise INTEGER,            -- crossed-out "was" price
  weight_grams   INTEGER,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT price_positive CHECK (price_paise > 0)
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);

-- -------------------------------------------------------------
-- INVENTORY
-- One row per variant. Updated on each order.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory (
  variant_id       UUID PRIMARY KEY REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity         INTEGER NOT NULL DEFAULT 0,
  low_stock_alert  INTEGER NOT NULL DEFAULT 5,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT qty_non_negative CHECK (quantity >= 0)
);

-- -------------------------------------------------------------
-- ADMIN USERS
-- Single-administrator model; email + bcrypt password hash.
-- NextAuth Credentials provider reads this table.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NextAuth required tables (v5 database session strategy) -----
CREATE TABLE IF NOT EXISTS accounts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL,
  type                TEXT NOT NULL,
  provider            TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token       TEXT,
  access_token        TEXT,
  expires_at          INTEGER,
  token_type          TEXT,
  scope               TEXT,
  id_token            TEXT,
  session_state       TEXT,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL UNIQUE,
  user_id       UUID NOT NULL,
  expires       TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token      TEXT NOT NULL,
  expires    TIMESTAMPTZ NOT NULL,
  UNIQUE(identifier, token)
);

-- -------------------------------------------------------------
-- ORDERS
-- Customer orders placed via the storefront.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT NOT NULL UNIQUE,   -- human-readable e.g. NHE-000001
  status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  -- Customer info (denormalised — no customer accounts in foundation stage)
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT,
  -- Shipping address
  address_line1    TEXT NOT NULL,
  address_line2    TEXT,
  city             TEXT NOT NULL,
  state            TEXT NOT NULL,
  postal_code      TEXT NOT NULL,
  country          TEXT NOT NULL DEFAULT 'PK',
  -- Financials (all in paise)
  subtotal_paise   INTEGER NOT NULL,
  shipping_paise   INTEGER NOT NULL DEFAULT 0,
  total_paise      INTEGER NOT NULL,
  -- Payment
  payment_method   TEXT,
  payment_status   TEXT NOT NULL DEFAULT 'pending'
                     CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_ref      TEXT,
  -- Timestamps
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status, created_at DESC);

-- -------------------------------------------------------------
-- ORDER ITEMS
-- Line items referencing the variant at time of order.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id             UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id           UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  -- Snapshot fields — preserve data even if product is deleted
  product_name         TEXT NOT NULL,
  variant_name         TEXT NOT NULL,
  sku                  TEXT NOT NULL,
  unit_price_paise     INTEGER NOT NULL,
  quantity             INTEGER NOT NULL,
  line_total_paise     INTEGER NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT qty_positive CHECK (quantity > 0),
  CONSTRAINT price_positive CHECK (unit_price_paise > 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- -------------------------------------------------------------
-- Automatic updated_at trigger function
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to every table with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'site_settings','categories','products','product_variants',
    'inventory','admin_users','orders'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%I_updated_at ON %I;
       CREATE TRIGGER trg_%I_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
      t, t, t, t
    );
  END LOOP;
END;
$$;

-- -------------------------------------------------------------
-- Default site settings
-- -------------------------------------------------------------
INSERT INTO site_settings (key, value) VALUES
  ('site_name',        'Noor Herbal Enterprises'),
  ('site_tagline',     'Traditional. Thoughtful. Handcrafted.'),
  ('contact_email',    'noorherbalenterprises@gmail.com'),
  ('contact_phone',    '+92 300 5599174'),
  ('contact_instagram','https://www.instagram.com/noorherbalenterprices/'),
  ('hero_eyebrow',     'The Noor Herbal collection'),
  ('hero_title',       'A considered ritual' || CHR(10) || 'for every day.'),
  ('hero_description', 'Discover chutneys, pickles, oils, and herbal shampoos composed with care for kitchens, shelves, and daily routines.'),
  ('hero_cta_label',   'Shop the collection'),
  ('hero_visual_category', 'The complete collection'),
  ('contact_address',  ''),
  ('currency_code',    'PKR'),
  ('currency_symbol',  'Rs')
ON CONFLICT (key) DO NOTHING;
