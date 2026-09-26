import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getActiveCategories, searchProducts } from "@/lib/queries";
import type { CatalogSortOption } from "@/types";

export const metadata: Metadata = {
  title: "Search Catalogue — Noor Herbal Enterprises",
  description: "Search our pure, handcrafted botanical collection and traditional pantry favourites.",
};

interface Props {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", category = "", sort = "featured" } = await searchParams;

  const [categories, products] = await Promise.all([
    getActiveCategories().catch(() => []),
    searchProducts({
      query: q,
      categorySlug: category || undefined,
      sort: sort as CatalogSortOption,
    }).catch(() => []),
  ]);

  return (
    <main className="catalog-page min-h-[70vh] pb-24 pt-10">
      <div className="site-shell px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-2">
            Storefront Search
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f6f0e7]">
            Find Your Ritual
          </h1>
          <p className="mt-3 text-sm text-[#a09a8f] leading-relaxed">
            Search our traditional chutneys, artisanal pickles, pure herbal oils, and hair care range.
          </p>

          {/* Search Form */}
          <form method="GET" action="/search" className="mt-8 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search by name, ingredients, SKU, or collection..."
                className="w-full rounded-2xl border border-[#38332a] bg-[#161412] px-5 py-4 text-sm text-[#f6f0e7] placeholder-[#6e675d] focus:border-[#c9a84c] focus:outline-none focus:ring-1 focus:ring-[#c9a84c]"
              />
              {category && <input type="hidden" name="category" value={category} />}
            </div>
            <button
              type="submit"
              className="button-primary px-6 py-4 text-xs uppercase tracking-[0.16em] font-semibold"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[#2a2620] py-4 mb-10">
          {/* Categories Pill Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/search?q=${encodeURIComponent(q)}&sort=${sort}`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                !category
                  ? "bg-[#c9a84c] text-[#0e0d0c] font-semibold"
                  : "border border-[#332f28] bg-[#161412] text-[#d8d2c7] hover:border-[#c9a84c]/50"
              }`}
            >
              All Categories
            </Link>
            {categories.map((cat) => {
              const isSelected = cat.slug === category;
              return (
                <Link
                  key={cat.id}
                  href={`/search?q=${encodeURIComponent(q)}&category=${cat.slug}&sort=${sort}`}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-[#c9a84c] text-[#0e0d0c] font-semibold"
                      : "border border-[#332f28] bg-[#161412] text-[#d8d2c7] hover:border-[#c9a84c]/50"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Results Count & Sort Dropdown */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8e8578]">
              {products.length} {products.length === 1 ? "result" : "results"}
              {q ? ` for "${q}"` : ""}
            </span>

            <form method="GET" action="/search">
              {q && <input type="hidden" name="q" value={q} />}
              {category && <input type="hidden" name="category" value={category} />}
              <select
                name="sort"
                defaultValue={sort}
                // @ts-expect-error form submission on change
                onChange="this.form.submit()"
                className="rounded-xl border border-[#332f28] bg-[#161412] px-3 py-1.5 text-xs text-[#d8d2c7] focus:border-[#c9a84c] focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Additions</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </form>
          </div>
        </div>

        {/* Results Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Search results">
            {products.map((product) => (
              <div key={product.id} role="listitem">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#2a2620] bg-[#141210] p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-12 h-12 rounded-full border border-[#c9a84c]/40 flex items-center justify-center text-[#c9a84c] mx-auto mb-4">
              🔍
            </div>
            <h3 className="font-display text-xl font-semibold text-white mb-2">No matching products found</h3>
            <p className="text-sm text-[#a09a8f] mb-6">
              We couldn&apos;t find anything matching your search. Try checking for spelling errors or browsing all categories.
            </p>
            <Link href="/categories" className="button-primary text-xs uppercase tracking-[0.16em]">
              Browse All Collections
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
