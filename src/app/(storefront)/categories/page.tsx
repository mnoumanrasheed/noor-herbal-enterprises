import type { Metadata } from "next";
import { CategoryShowcase } from "@/components/storefront/CategoryShowcase";
import { getCategoryShowcases } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Shop the Collection",
  description: "Explore the Noor Herbal Enterprises collection by category.",
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
    <main className="catalog-page">
      <CategoryShowcase
        categories={categories}
        error={catalogError}
        eyebrow="Shop the collection"
        heading="Find your way in."
        intro="Each collection has its own rhythm. Browse the categories below and explore products when they are available."
      />
    </main>
  );
}
