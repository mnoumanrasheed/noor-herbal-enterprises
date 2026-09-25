import Link from "next/link";
import type { Category } from "@/types";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { ProductCard } from "@/components/storefront/ProductCard";

interface CategoryShowcaseProps {
  categories: Category[];
  error?: boolean;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  featuredContent?: string;
}

export function CatalogUnavailable() {
  return (
    <div className="catalog-state" role="alert">
      <p className="eyebrow">Catalog unavailable</p>
      <h2 className="mt-3 font-display text-2xl text-[#f6f0e7]">We could not reach the collection.</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#aaa39a]">The catalogue is temporarily unavailable. Please try again shortly.</p>
      <Link href="/contact" className="button-primary mt-6">Contact us</Link>
    </div>
  );
}

export function CatalogEmpty({ message = "The collection is being prepared." }: { message?: string }) {
  return (
    <div className="catalog-state" role="status">
      <p className="eyebrow">No collections yet</p>
      <h2 className="mt-3 font-display text-2xl text-[#f6f0e7]">Nothing is listed here yet.</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#aaa39a]">{message}</p>
    </div>
  );
}

export function CategoryShowcase({
  categories,
  error = false,
  eyebrow = "The collection",
  heading = "Four ways into the Noor Herbal world.",
  intro = "Browse by ritual, then take a closer look at the products currently available.",
  featuredContent,
}: CategoryShowcaseProps) {
  return (
    <section aria-labelledby="categories-heading" className="category-showcase-section">
      <div className="site-shell px-4 sm:px-6 lg:px-8">
        <div className="category-showcase-heading">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="categories-heading" className="category-showcase-title">{heading}</h2>
          </div>
          <div className="category-showcase-intro"><p>{intro}</p>{featuredContent ? <p className="category-showcase-featured">{featuredContent}</p> : null}</div>
        </div>

        {error ? <CatalogUnavailable /> : categories.length === 0 ? <CatalogEmpty /> : (
          <div className="category-showcase-list">
            {categories.map((category) => {
              const products = category.products ?? [];
              return (
                <article key={category.id} className="category-editorial-row">
                  <CategoryCard category={category} featured />
                  <div className="category-products-panel">
                    <div className="category-products-heading">
                      <div>
                        <p className="category-products-kicker">{String(category.sort_order).padStart(2, "0")} / Collection</p>
                        <h3 className="category-products-title">{category.name}</h3>
                        {category.description ? <p className="category-products-description">{category.description}</p> : null}
                      </div>
                      <Link href={`/categories/${category.slug}`} className="text-link">View all <span aria-hidden="true">↗</span></Link>
                    </div>
                    {products.length > 0 ? (
                      <div className="product-row" role="list" aria-label={`${category.name} products`} tabIndex={0}>
                        {products.map((product) => <div key={product.id} role="listitem" className="product-row-item"><ProductCard product={product} /></div>)}
                      </div>
                    ) : (
                      <div className="catalog-empty-inline" role="status">No products are listed in this collection yet.</div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
