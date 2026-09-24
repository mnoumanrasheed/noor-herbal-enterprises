import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const cat = await getCategoryBySlug(slug);
    if (!cat) return { title: "Category not found" };
    return {
      title: cat.name,
      description: cat.description ?? undefined,
    };
  } catch {
    return { title: "Category" };
  }
}

export const revalidate = 60;

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  let category = null;
  let products = [];

  try {
    category = await getCategoryBySlug(slug);
    if (!category) notFound();
    products = await getProductsByCategory(category.id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#4a4a4a]">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="hover:text-[#c9a84c] transition-colors">Home</a></li>
          <li aria-hidden="true">/</li>
          <li><a href="/categories" className="hover:text-[#c9a84c] transition-colors">Shop</a></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-[#0f0f0f]">{category?.name}</li>
        </ol>
      </nav>

      <h1 className="font-display text-3xl font-bold text-[#0f0f0f] mb-2">
        {category?.name}
      </h1>
      {category?.description && (
        <p className="text-[#4a4a4a] mb-10 max-w-2xl">{category.description}</p>
      )}

      {products.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-[#e8e3d9] p-16 text-center">
          <p className="text-[#4a4a4a] font-medium">
            Products coming soon — check back shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-[12px] border border-[#e8e3d9] bg-white p-4 shadow-sm"
            >
              <div className="aspect-square bg-[#f5eecf] rounded-[8px] mb-4 flex items-center justify-center text-[#c9a84c]">
                <span className="text-4xl" aria-hidden="true">🌿</span>
              </div>
              <h2 className="font-display font-semibold text-[#0f0f0f]">{product.name}</h2>
              {product.short_desc && (
                <p className="mt-1 text-xs text-[#4a4a4a] line-clamp-2">{product.short_desc}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
