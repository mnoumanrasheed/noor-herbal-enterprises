import React from "react";
import type { Metadata } from "next";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { getActiveCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Shop All Categories",
  description: "Browse our full range of natural herbal products.",
};

export const revalidate = 60;

export default async function CategoriesPage() {
  let categories: Awaited<ReturnType<typeof getActiveCategories>> = [];
  try {
    categories = await getActiveCategories();
  } catch {
    categories = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-[#0f0f0f] mb-2">
        All Categories
      </h1>
      <p className="text-[#4a4a4a] mb-10">
        Choose a category to explore our handcrafted products.
      </p>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      ) : (
        <p className="text-[#4a4a4a]">
          Categories are loading. Please check back shortly.
        </p>
      )}
    </div>
  );
}
