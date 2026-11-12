import { auth } from "@/lib/auth";

export default auth;

export const config = {
  matcher: [
    // Keep the administration area protected while the storefront stays public.
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
