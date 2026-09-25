/**
 * Neon serverless PostgreSQL client
 *
 * Use `sql` for simple tagged-template queries (serverless, per-request connections).
 * Use `getPool` when you need a pg-compatible Pool (e.g. NextAuth adapter).
 *
 * Both rely on DATABASE_URL from server-side environment only.
 * This file MUST NOT be imported by any client component.
 */

import { neon, neonConfig, Pool, type NeonQueryFunction } from "@neondatabase/serverless";

// Enable WebSocket support for the Pool API in Node.js environments
if (typeof WebSocket === "undefined") {
  // Dynamic import of ws only in server/Node context
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  neonConfig.webSocketConstructor = require("ws");
}

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("ep-placeholder") || url.includes("user:pass@")) {
    throw new Error(
      "DATABASE_URL is not configured. Add a real Neon connection string to the server environment."
    );
  }
  return url;
}

/**
 * Tagged-template SQL client for serverless (no persistent connection).
 * The client is lazy so a missing database does not crash the entire storefront
 * during module evaluation; callers can render the intentional prelaunch state.
 */
type SqlClient = NeonQueryFunction<false, false>;
let _sql: SqlClient | null = null;
function getSql(): SqlClient {
  if (!_sql) _sql = neon(getDatabaseUrl());
  return _sql;
}

export const sql = new Proxy((() => undefined) as unknown as SqlClient, {
  apply(_target, thisArg, args) {
    return Reflect.apply(getSql(), thisArg, args);
  },
  get(_target, property, receiver) {
    return Reflect.get(getSql(), property, receiver);
  },
});

/** pg-compatible Pool — used by NextAuth adapter and bulk operations */
let _pool: Pool | null = null;
export function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({ connectionString: getDatabaseUrl() });
  }
  return _pool;
}
