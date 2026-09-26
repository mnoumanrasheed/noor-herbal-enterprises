import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noor-herbal-enterprises.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/order-confirmation/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
