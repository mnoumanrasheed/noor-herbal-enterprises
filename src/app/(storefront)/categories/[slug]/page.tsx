import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogEmpty, CatalogUnavailable } from "@/components/storefront/CategoryShowcase";
import { CategoryHero } from "@/components/storefront/CategoryHero";

import { ProductCard } from "@/components/storefront/ProductCard";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";
import type { CatalogSortOption, Category, Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    if (!category) return { title: "Collection not found — Noor Herbal Enterprises" };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noor-herbal-enterprises.vercel.app";
    const title = `${category.name} Collection — Noor Herbal Enterprises`;
    const description =
      category.description ||
      `Discover pure and handcrafted ${category.name.toLowerCase()} products from Noor Herbal Enterprises.`;

    return {
      title,
      description,
      alternates: {
        canonical: `${siteUrl}/categories/${category.slug}`,
      },
      openGraph: {
        title,
        description,
        url: `${siteUrl}/categories/${category.slug}`,
        siteName: "Noor Herbal Enterprises",
        type: "website",
      },
    };
  } catch {
    return { title: "Collection — Noor Herbal Enterprises" };
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort = "featured" } = await searchParams;

  let category: Category | null = null;
  let products: Product[] = [];
  let categoryError = false;
  let productsError = false;

  try {
    category = await getCategoryBySlug(slug);
  } catch {
    categoryError = true;
  }

  if (categoryError) {
    return (
      <main className="catalog-page min-h-[60vh] flex items-center justify-center">
        <CatalogUnavailable />
      </main>
    );
  }

  if (!category) notFound();

  try {
    products = await getProductsByCategory(category.id, sort as CatalogSortOption);
  } catch {
    productsError = true;
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Collection", item: "/categories" },
      { "@type": "ListItem", position: 3, name: category.name, item: `/categories/${category.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="catalog-page pb-24">
        {/* Reusable 100svh Category Hero System */}
        <CategoryHero
          category={category}
          productCount={products.length}
          currentSort={sort}
          index={category.sort_order || 1}
        />

        {/* Products Grid & Catalog Content Section */}
        <div id="collection-products" className="site-shell px-4 sm:px-6 lg:px-8 pt-16">
          {productsError ? (
            <CatalogUnavailable />
          ) : products.length === 0 ? (
            <CatalogEmpty message={`There are no ${category.name.toLowerCase()} products listed in this batch yet.`} />
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              role="list"
              aria-label={`${category.name} products`}
            >
              {products.map((product) => (
                <div key={product.id} role="listitem">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

    </>
  );
}
