/**
 * Next.js 16 Proxy (formerly Middleware) — handles admin route protection.
 *
 * Uses NextAuth v5's `auth` helper.
 * Unauthenticated requests to /admin/* (except /admin/login) are
 * redirected to /admin/login by the `authorized` callback in auth.ts.
 */

export { auth as proxy } from "@/lib/auth";

export const config = {
  // Apply to all /admin/* routes
  matcher: ["/admin/:path*"],
};
