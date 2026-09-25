/**
 * Creates the four initial categories and the first administrator.
 * It never creates products, prices, or stock, and never overwrites an
 * existing administrator password.
 *
 * Run only after applying migrations to the intended Neon database:
 *   npm run db:seed
 */

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;
const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;

function validDatabaseUrl(value: string | undefined) {
  return Boolean(value && !value.includes("ep-placeholder") && !value.includes("user:pass@"));
}

if (!validDatabaseUrl(databaseUrl)) {
  console.error("DATABASE_URL is not configured with a real Neon connection string.");
  process.exit(1);
}
if (!adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
  console.error("ADMIN_EMAIL must be a valid administrator email address.");
  process.exit(1);
}
if (!adminPassword || adminPassword.length < 12) {
  console.error("ADMIN_PASSWORD must be at least 12 characters long.");
  process.exit(1);
}

const categories = [
  { name: "Chutney", slug: "chutney", description: "Handcrafted chutneys made with carefully selected ingredients.", sortOrder: 1 },
  { name: "Pickles", slug: "pickles", description: "Traditional pickles prepared with authentic recipes.", sortOrder: 2 },
  { name: "Oils", slug: "oils", description: "Pure, cold-pressed and infused herbal oils.", sortOrder: 3 },
  { name: "Shampoo", slug: "shampoo", description: "Herbal shampoos prepared for everyday care.", sortOrder: 4 },
];

async function main() {
  const sql = neon(databaseUrl as string);

  for (const category of categories) {
    await sql`
      INSERT INTO categories (name, slug, description, sort_order)
      VALUES (${category.name}, ${category.slug}, ${category.description}, ${category.sortOrder})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log("Initial categories are ready.");

  const passwordHash = await bcrypt.hash(adminPassword as string, 12);
  const inserted = await sql`
    INSERT INTO admin_users (email, password_hash, name)
    VALUES (${adminEmail}, ${passwordHash}, 'Administrator')
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `;
  console.log(inserted.length ? "First administrator created." : "Existing administrator retained.");
}

main().catch(() => {
  console.error("Seed could not complete. No credentials or connection details were printed.");
  process.exit(1);
});
