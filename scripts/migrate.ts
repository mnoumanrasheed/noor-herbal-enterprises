/**
 * Database migration runner
 * Usage: npx tsx scripts/migrate.ts
 *
 * Reads migration SQL files from /migrations in filename order
 * and executes them against the Neon database.
 * Safe to re-run — all DDL uses IF NOT EXISTS / ON CONFLICT DO NOTHING.
 */

import { Pool, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const DATABASE_URL = process.env.DATABASE_URL;

// The migration runner uses Neon Pool directly, so configure Node WebSockets
// here as well as in src/lib/db.ts.
neonConfig.webSocketConstructor = WebSocket;

if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set. Copy .env.local.example → .env.local and fill it in.");
  process.exit(1);
}

async function main() {
  // Use pg Pool for migrations — supports multi-statement SQL files
  const pool = new Pool({ connectionString: DATABASE_URL as string });
  const client = await pool.connect();

  const migrationsDir = join(process.cwd(), "migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`▶  Running ${files.length} migration(s)…\n`);

  for (const file of files) {
    const filePath = join(migrationsDir, file);
    const content = readFileSync(filePath, "utf8");
    console.log(`  ⟶  ${file}`);
    try {
      await client.query("BEGIN");
      await client.query(content);
      await client.query("COMMIT");
      console.log(`     ✓ done`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(`     ✗ FAILED: ${file}`);
      console.error(err);
      client.release();
      await pool.end();
      process.exit(1);
    }
  }

  client.release();
  await pool.end();
  console.log("\n✅  All migrations applied successfully.");
}

main();
