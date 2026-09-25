import Link from "next/link";
import type { Category } from "@/types";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { CatalogMedia } from "@/components/storefront/CatalogMedia";
import { ProductCard } from "@/components/storefront/ProductCard";

interface CategoryShowcaseProps {
  categories: Category[];
  error?: boolean;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  featuredContent?: string;
}

const PRELAUNCH_COLLECTIONS = [
  {
    name: "Chutney",
    slug: "chutney",
    description: "Aloo Bukharay Ki Chutney, presented for the table.",
    note: "Authentic product photography",
    image: "/images/products/aloo-bukharay-ki-chutney-cutout.png",
    imageAlt: "Noor Herbal Aloo Bukharay Ki Chutney jar",
    product: "Aloo Bukharay Ki Chutney",
  },
  {
    name: "Pickles",
    slug: "pickles",
    description: "Crush Mango Pickle, presented for the collection.",
    note: "Authentic product photography",
    image: "/images/products/crush-mango-pickle.jpeg",
    imageAlt: "Noor Herbal Crush Mango Pickle jar",
    product: "Crush Mango Pickle",
  },
  {
    name: "Oils",
    slug: "oils",
    description: "Noor Herbal Hair Oil for the daily-care collection.",
    note: "Authentic product photography",
    image: "/images/products/noor-herbal-hair-oil-cutout.png",
    imageAlt: "Noor Herbal Hair Oil bottle",
    product: "Noor Herbal Hair Oil",
  },
  {
    name: "Shampoo",
    slug: "shampoo",
    description: "Noor Herbal Shampoo for everyday care.",
    note: "Authentic product photography",
    image: "/images/products/noor-herbal-shampoo.jpeg",
    imageAlt: "Noor Herbal Shampoo bottle",
    product: "Noor Herbal Shampoo",
  },
];

function PrelaunchCollections() {
  return (
    <div className="prelaunch-state">
      <div className="prelaunch-state-copy">
        <p className="eyebrow">Shop the Noor Herbal edit</p>
        <h3>Pantry staples and daily care, chosen with intention.</h3>
        <p>Explore the four collection previews. Live product details will appear when the catalogue is connected.</p>
        <Link href="/contact" className="button-secondary">Ask about availability <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="prelaunch-category-sections" aria-label="Noor Herbal collection categories">
        {PRELAUNCH_COLLECTIONS.map((category, index) => (
          <article key={category.slug} className={`prelaunch-category-section prelaunch-category-${category.slug}`}>
            <div className="prelaunch-category-media">
              <CatalogMedia src={category.image} alt={category.imageAlt} kind="category" className={`prelaunch-media-${category.slug}`} />
              <span className="prelaunch-category-note">{category.note}</span>
            </div>
            <div className="prelaunch-category-copy">
              <div className="prelaunch-category-number">0{index + 1}</div>
              <h4>{category.name}</h4>
              <p>{category.description}</p>
              <div className="prelaunch-product-card"><span>Collection preview</span><strong>{category.product}</strong><small>Product details coming soon</small></div>
              <Link href={`/categories/${category.slug}`} className="text-link">Enter collection <span aria-hidden="true">↗</span></Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CatalogUnavailable() {
  return <PrelaunchCollections />;
}

export function CatalogEmpty({ message = "The collection is being prepared." }: { message?: string }) {
  return <div role="status" aria-label={message}><PrelaunchCollections /></div>;
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
