import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from common CDN/storage domains
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.neoncdn.io" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
    ],
  },

  // Empty turbopack config silences the "no turbopack config" warning
  turbopack: {},
};

export default nextConfig;
