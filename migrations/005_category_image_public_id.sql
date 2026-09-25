-- =============================================================
-- Migration 005: retain Cloudinary metadata for category images
-- Existing category data is preserved.
-- =============================================================

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS image_public_id TEXT;
