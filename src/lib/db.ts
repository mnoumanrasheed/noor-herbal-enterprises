/**
 * Neon serverless PostgreSQL client
 *
 * Use `sql` for simple tagged-template queries (serverless, per-request connections).
 * Use `getPool` when you need a pg-compatible Pool (e.g. NextAuth adapter).
 *
 * Both rely on DATABASE_URL from server-side environment only.
 * This file MUST NOT be imported by any client component.
 */

import { neon, neonConfig, Pool } from "@neondatabase/serverless";

// Enable WebSocket support for the Pool API in Node.js environments
if (typeof WebSocket === "undefined") {
  // Dynamic import of ws only in server/Node context
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  neonConfig.webSocketConstructor = require("ws");
}

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (see .env.local.example)."
    );
  }
  return url;
}

/** Tagged-template SQL client for serverless (no persistent connection) */
export const sql = neon(getDatabaseUrl());

/** pg-compatible Pool — used by NextAuth adapter and bulk operations */
let _pool: Pool | null = null;
export function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({ connectionString: getDatabaseUrl() });
  }
  return _pool;
}
