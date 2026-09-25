import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogEmpty, CatalogUnavailable } from "@/components/storefront/CategoryShowcase";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";
import type { Category, Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    if (!category) return { title: "Category not found" };
    return { title: category.name, description: category.description ?? undefined };
  } catch {
    return { title: "Category" };
  }
}

export const revalidate = 60;

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
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
    return <main className="catalog-page"><CatalogUnavailable /></main>;
  }
  if (!category) notFound();

  try {
    products = await getProductsByCategory(category.id);
  } catch {
    productsError = true;
  }

  return (
    <main className="catalog-page">
      <div className="site-shell px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="catalog-breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/categories">Shop</Link><span aria-hidden="true">/</span><span aria-current="page">{category.name}</span>
        </nav>
        <div className="category-page-heading">
          <div>
            <p className="eyebrow">Collection {String(category.sort_order).padStart(2, "0")}</p>
            <h1 className="category-page-title">{category.name}</h1>
          </div>
          {category.description ? <p className="category-page-description">{category.description}</p> : null}
        </div>
      </div>

      <div className="site-shell px-4 pb-20 sm:px-6 lg:px-8">
        {productsError ? <CatalogUnavailable /> : products.length === 0 ? <CatalogEmpty message={`There are no ${category.name.toLowerCase()} products listed yet.`} /> : (
          <div className="product-catalog-grid" role="list" aria-label={`${category.name} products`}>
            {products.map((product) => <div key={product.id} role="listitem"><ProductCard product={product} /></div>)}
          </div>
        )}
      </div>
    </main>
  );
}
