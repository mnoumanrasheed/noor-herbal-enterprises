import type { Metadata } from "next";
import { ShopHero } from "@/components/storefront/ShopHero";
import { CategoryShowcase } from "@/components/storefront/CategoryShowcase";
import { getCategoryShowcases } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Shop the Collection — Noor Herbal Enterprises",
  description: "Explore handcrafted chutneys, pickles, oils, and herbal care created with tradition, care, and everyday use in mind.",
};

export const revalidate = 60;

export default async function CategoriesPage() {
  let categories = [] as Awaited<ReturnType<typeof getCategoryShowcases>>;
  let catalogError = false;

  try {
    categories = await getCategoryShowcases();
  } catch {
    catalogError = true;
  }

  return (
    <main className="catalog-page pb-24 bg-[#080706] text-[#f6f0e7]">
      {/* 1. Cinematic 100svh Shop Landing Hero */}
      <ShopHero categories={categories} />

      {/* 2. Editorial Collection Discovery Showcase */}
      <CategoryShowcase
        categories={categories}
        error={catalogError}
        eyebrow="COLLECTION DISCOVERY"
        heading="Find what belongs in your everyday."
        intro="Explore handcrafted chutneys, pickles, oils, and herbal care created with tradition, care, and everyday use in mind."
      />
    </main>
  );
}
