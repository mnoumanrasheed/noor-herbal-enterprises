-- Keep existing installations aligned after preview image extensions were corrected.
-- These replacements are limited to the retired local paths.

UPDATE site_settings
SET value = '/images/products/aloo-bukharay-ki-chutney.jpeg'
WHERE key = 'story_mission_image'
  AND value = '/images/products/aloo-bukhara-chutney.jfif';
