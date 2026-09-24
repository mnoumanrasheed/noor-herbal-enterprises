import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Noor Herbal Enterprises",
    template: "%s | Noor Herbal Enterprises",
  },
  description:
    "Pure, natural, and handcrafted herbal products. Chutneys, pickles, oils, and shampoos rooted in tradition.",
  keywords: ["herbal", "natural", "chutney", "pickles", "herbal oil", "herbal shampoo", "organic"],
  authors: [{ name: "Noor Herbal Enterprises" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Noor Herbal Enterprises",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
