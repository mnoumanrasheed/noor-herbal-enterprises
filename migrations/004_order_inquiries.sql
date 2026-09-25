-- =============================================================
-- Migration 004: WhatsApp order inquiries and safe stock tracking
-- Existing orders and records are preserved.
-- =============================================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_note TEXT,
  ADD COLUMN IF NOT EXISTS stock_deducted BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS whatsapp_opened_at TIMESTAMPTZ;

-- Inquiries collect only the contact and delivery information requested.
ALTER TABLE orders
  ALTER COLUMN customer_email DROP NOT NULL,
  ALTER COLUMN state DROP NOT NULL,
  ALTER COLUMN postal_code DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_orders_inquiries
  ON orders(status, stock_deducted, created_at DESC);
