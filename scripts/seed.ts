/**
 * Database seed script
 * Usage: npx tsx scripts/seed.ts
 *
 * Seeds:
 *  1. The four initial categories (Chutney, Pickles, Oils, Shampoo)
 *  2. A single admin user from ADMIN_EMAIL + ADMIN_PASSWORD env vars
 *
 * Safe to re-run — uses ON CONFLICT DO NOTHING for categories
 * and ON CONFLICT (email) DO UPDATE for the admin (allows password reset).
 */

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set.");
  process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌  ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  process.exit(1);
}

const CATEGORIES = [
  {
    name: "Chutney",
    slug: "chutney",
    description: "Handcrafted chutneys made from fresh, natural ingredients.",
    sort_order: 1,
  },
  {
    name: "Pickles",
    slug: "pickles",
    description: "Traditional pickles prepared with authentic recipes.",
    sort_order: 2,
  },
  {
    name: "Oils",
    slug: "oils",
    description: "Pure, cold-pressed and infused herbal oils.",
    sort_order: 3,
  },
  {
    name: "Shampoo",
    slug: "shampoo",
    description: "Natural herbal shampoos free from harsh chemicals.",
    sort_order: 4,
  },
];

async function main() {
  const sql = neon(DATABASE_URL as string);

  // --- Categories ---
  console.log("▶  Seeding categories…");
  for (const cat of CATEGORIES) {
    await sql`
      INSERT INTO categories (name, slug, description, sort_order)
      VALUES (${cat.name}, ${cat.slug}, ${cat.description}, ${cat.sort_order})
      ON CONFLICT (slug) DO NOTHING
    `;
    console.log(`   ✓ ${cat.name}`);
  }

  // --- Admin user ---
  console.log("\n▶  Seeding admin user…");
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD as string, 12);
  await sql`
    INSERT INTO admin_users (email, password_hash, name)
    VALUES (${ADMIN_EMAIL}, ${passwordHash}, 'Administrator')
    ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash,
          updated_at    = NOW()
  `;
  console.log(`   ✓ Admin: ${ADMIN_EMAIL}`);

  console.log("\n✅  Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
