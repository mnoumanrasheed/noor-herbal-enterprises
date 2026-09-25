-- =============================================================
-- Migration 006: editable brand story content
-- Defaults use supplied brand copy and authentic local product images.
-- Existing settings are never overwritten.
-- =============================================================

INSERT INTO site_settings (key, value) VALUES
  ('story_heading', 'Everyday moments deserve a little more care.'),
  ('story_body_one', 'Noor Herbal Enterprises brings together two parts of daily life: the flavours we share and the care we give ourselves. From chutneys and pickles at the table to hair oil and shampoo in our personal care range, our collection is made for familiar routines and meaningful moments.'),
  ('story_body_two', 'We believe a good product should feel considered from the moment you discover it. That belief shapes how we present our collection: with clarity, warmth, and attention to detail. Whether you are choosing something for a meal or for your daily care routine, we want the experience to feel simple, personal, and worth returning to.'),
  ('story_mission', 'To bring thoughtfully presented food and personal care products into everyday life, while making it easy for customers to discover, choose, and order with confidence.'),
  ('story_vision', 'To build Noor Herbal Enterprises into a trusted name for everyday favourites—known for a distinctive collection, a welcoming shopping experience, and lasting relationships with customers.'),
  ('story_opening_image', '/images/products/noor-herbal-hair-oil.jpeg'),
  ('story_opening_image_alt', 'Noor Herbal hair oil bottle'),
  ('story_mission_image', '/images/products/aloo-bukharay-ki-chutney.jpeg'),
  ('story_mission_image_alt', 'Noor Herbal Aloo Bukhara chutney jar'),
  ('story_vision_image', '/images/products/noor-herbal-shampoo-source.jpeg'),
  ('story_vision_image_alt', 'Noor Herbal shampoo bottle')
ON CONFLICT (key) DO NOTHING;
