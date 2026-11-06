import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * A transparent, reversible way to temporarily pause the public storefront.
 *
 * Set STOREFRONT_MODE=maintenance in the deployment environment to show the
 * maintenance page. Admin and admin API routes deliberately remain available
 * so the store can be managed and restored without a code change.
 */
const storefrontIsInMaintenance = process.env.STOREFRONT_MODE === "maintenance";

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (storefrontIsInMaintenance && !isAdminArea) {
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = "/maintenance";

    return NextResponse.rewrite(maintenanceUrl, {
      status: 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }
});

export const config = {
  matcher: [
    // Public pages, excluding Next assets, API endpoints, the maintenance page,
    // and direct requests for static public files.
    "/((?!api|_next/static|_next/image|favicon.ico|maintenance|.*\\..*$).*)",
    // Preserve existing authentication for the administration area.
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
