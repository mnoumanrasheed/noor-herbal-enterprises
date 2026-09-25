/**
 * Applies each SQL migration once and records it in schema_migrations.
 * Run only after selecting the intended Neon database:
 *   npm run db:migrate
 */

import { Pool, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const databaseUrl = process.env.DATABASE_URL;

neonConfig.webSocketConstructor = WebSocket;

function validDatabaseUrl(value: string | undefined) {
  return Boolean(value && !value.includes("ep-placeholder") && !value.includes("user:pass@"));
}

if (!validDatabaseUrl(databaseUrl)) {
  console.error("DATABASE_URL is not configured with a real Neon connection string.");
  process.exit(1);
}

async function main() {
  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    await client.query([
      "CREATE TABLE IF NOT EXISTS schema_migrations (",
      "filename TEXT PRIMARY KEY,",
      "applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()",
      ")",
    ].join(" "));

    const migrationsDir = join(process.cwd(), "migrations");
    const files = readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();
    const applied = await client.query<{ filename: string }>("SELECT filename FROM schema_migrations");
    const appliedFiles = new Set(applied.rows.map((row) => row.filename));
    const pending = files.filter((file) => !appliedFiles.has(file));

    if (!pending.length) {
      console.log("Database schema is already up to date.");
      return;
    }

    console.log("Applying " + pending.length + " database migration(s).");
    for (const file of pending) {
      const content = readFileSync(join(migrationsDir, file), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(content);
        await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
        await client.query("COMMIT");
        console.log("Applied " + file);
      } catch {
        await client.query("ROLLBACK");
        console.error("Migration failed at " + file + ". No credentials or connection details were printed.");
        process.exitCode = 1;
        return;
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(() => {
  console.error("Migration could not connect to the database. No credentials were printed.");
  process.exit(1);
});
