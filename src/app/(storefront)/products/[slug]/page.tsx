import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { ProductPurchase } from "@/components/storefront/ProductPurchase";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CatalogUnavailable } from "@/components/storefront/CategoryShowcase";
import {
  getProductBySlug,
  getRelatedProducts,
  getStoreSettings,
} from "@/lib/queries";
import type { Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Product not found — Noor Herbal Enterprises" };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noor-herbal-enterprises.vercel.app";
    const title = product.seo_title || `${product.name} — Noor Herbal Enterprises`;
    const description =
      product.seo_description ||
      product.short_desc ||
      product.description ||
      "Pure, handcrafted herbal and pantry essentials from Noor Herbal Enterprises.";

    const ogImage = product.images?.[0]?.url;

    return {
      title,
      description,
      alternates: {
        canonical: `${siteUrl}/products/${product.slug}`,
      },
      openGraph: {
        title,
        description,
        url: `${siteUrl}/products/${product.slug}`,
        siteName: "Noor Herbal Enterprises",
        images: ogImage ? [{ url: ogImage, alt: product.name }] : [],
        locale: "en_PK",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    return { title: "Product — Noor Herbal Enterprises" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  let product: Product | null = null;
  let relatedProducts: Product[] = [];
  let storeSettings;

  try {
    product = await getProductBySlug(slug);
    if (product) {
      [relatedProducts, storeSettings] = await Promise.all([
        getRelatedProducts(product.id, product.category_id, 4),
        getStoreSettings(),
      ]);
    }
  } catch {
    return (
      <main className="catalog-page min-h-[60vh] flex items-center justify-center">
        <CatalogUnavailable />
      </main>
    );
  }

  if (!product) notFound();

  const variants = product.variants ?? [];
  const activeVariants = variants.filter((v) => v.is_active);
  const minPrice = activeVariants.length > 0
    ? Math.min(...activeVariants.map((v) => v.price_paise)) / 100
    : 0;

  // JSON-LD Structured Data for Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_desc || product.description,
    image: product.images?.map((img) => img.url),
    sku: product.sku || undefined,
    brand: {
      "@type": "Brand",
      name: "Noor Herbal Enterprises",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "PKR",
      lowPrice: minPrice,
      offerCount: activeVariants.length,
      availability: activeVariants.some((v) => (v.inventory?.quantity ?? 0) > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Collection", item: "/categories" },
      ...(product.category_slug
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: product.category_name || "Category",
              item: `/categories/${product.category_slug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: product.name,
              item: `/products/${product.slug}`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: `/products/${product.slug}`,
            },
          ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="catalog-page pb-24 pt-8">
        <div className="site-shell px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Bar */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#8e8578]">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <span aria-hidden="true" className="text-[#4a443b]">/</span>
            <Link href="/categories" className="hover:text-[#c9a84c] transition-colors">Shop</Link>
            {product.category_slug && (
              <>
                <span aria-hidden="true" className="text-[#4a443b]">/</span>
                <Link href={`/categories/${product.category_slug}`} className="hover:text-[#c9a84c] transition-colors">
                  {product.category_name}
                </Link>
              </>
            )}
            <span aria-hidden="true" className="text-[#4a443b]">/</span>
            <span aria-current="page" className="text-[#c9a84c] font-semibold truncate max-w-[240px]">
              {product.name}
            </span>
          </nav>

          {/* Product Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left: Product Media Gallery */}
            <div className="lg:col-span-6">
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Right: Product Purchase & Copy Details */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Category & Status Badges */}
              <div className="flex items-center gap-2 mb-3">
                {product.category_name && (
                  <Link
                    href={`/categories/${product.category_slug}`}
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] hover:underline"
                  >
                    {product.category_name}
                  </Link>
                )}
                {product.is_featured && (
                  <span className="rounded-full border border-[#c9a84c]/40 bg-[#161412] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9a84c]">
                    Featured
                  </span>
                )}
              </div>

              {/* Product Heading */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f6f0e7] leading-tight mb-4">
                {product.name}
              </h1>

              {/* Short description */}
              {product.short_desc && (
                <p className="text-base text-[#bfb7aa] leading-relaxed mb-6">
                  {product.short_desc}
                </p>
              )}

              {/* Purchase Component (Variants, Stock, Quantity, Add to Cart, WhatsApp) */}
              <div className="rounded-2xl border border-[#2d2924] bg-[#141210] p-6 sm:p-7 shadow-xl mb-8">
                <ProductPurchase
                  productId={product.id}
                  productName={product.name}
                  variants={product.variants ?? []}
                />
              </div>

              {/* Trust Badges Strip */}
              <div className="grid grid-cols-3 gap-3 border-y border-[#25221d] py-5 text-center">
                <div>
                  <p className="text-sm font-semibold text-[#c9a84c]">100% Homemade</p>
                  <p className="text-[11px] text-[#8e8578] mt-0.5">Pure traditional recipes</p>
                </div>
                <div className="border-x border-[#25221d]">
                  <p className="text-sm font-semibold text-[#c9a84c]">Delivery All Over Pakistan</p>
                  <p className="text-[11px] text-[#8e8578] mt-0.5">Direct nationwide delivery</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#c9a84c]">Artisanal Small Batch</p>
                  <p className="text-[11px] text-[#8e8578] mt-0.5">100% Pure & Fresh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Information Accordion / Details Tabs */}
          <div className="mt-16 sm:mt-20 border-t border-[#2a2620] pt-12">
            <h2 className="font-display text-2xl font-bold text-[#f6f0e7] mb-8">
              Product Details & Heritage
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Description */}
              {product.description && (
                <div className="rounded-2xl border border-[#25221d] bg-[#141210] p-6 sm:p-8">
                  <h3 className="font-display text-lg font-semibold text-[#c9a84c] mb-3">
                    About This Preparation
                  </h3>
                  <div className="text-sm text-[#bfb7aa] leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>
                </div>
              )}

              {/* Ingredients / Composition */}
              {product.ingredients && (
                <div className="rounded-2xl border border-[#25221d] bg-[#141210] p-6 sm:p-8">
                  <h3 className="font-display text-lg font-semibold text-[#c9a84c] mb-3">
                    Pure Ingredients
                  </h3>
                  <div className="text-sm text-[#bfb7aa] leading-relaxed whitespace-pre-line">
                    {product.ingredients}
                  </div>
                </div>
              )}

              {/* How to use / Instructions */}
              {product.how_to_use && (
                <div className="rounded-2xl border border-[#25221d] bg-[#141210] p-6 sm:p-8">
                  <h3 className="font-display text-lg font-semibold text-[#c9a84c] mb-3">
                    Recommended Usage & Ritual
                  </h3>
                  <div className="text-sm text-[#bfb7aa] leading-relaxed whitespace-pre-line">
                    {product.how_to_use}
                  </div>
                </div>
              )}

              {/* Shipping & Delivery Policy */}
              <div className="rounded-2xl border border-[#25221d] bg-[#141210] p-6 sm:p-8">
                <h3 className="font-display text-lg font-semibold text-[#c9a84c] mb-3">
                  Delivery & Guarantee
                </h3>
                <p className="text-sm text-[#bfb7aa] leading-relaxed">
                  {storeSettings?.shippingPolicy ||
                    "We deliver across Pakistan within 3 to 5 business days via tracked courier services. Standard flat shipping is Rs. 250, and free shipping applies automatically on all orders over Rs. 3,000."}
                </p>
                <div className="mt-4 pt-4 border-t border-[#25221d]">
                  <p className="text-xs text-[#8e8578] leading-relaxed">
                    {storeSettings?.returnsPolicy ||
                      "If your package arrives damaged or defective, please contact us on WhatsApp within 48 hours for immediate replacement."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section (Mandatory) */}
          {relatedProducts.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-20 sm:mt-28 border-t border-[#2a2620] pt-14">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c]">
                    Considered Pairings
                  </p>
                  <h2 id="related-heading" className="font-display text-2xl sm:text-3xl font-bold text-[#f6f0e7] mt-1">
                    You May Also Like
                  </h2>
                </div>
                <Link
                  href="/categories"
                  className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-[0.16em] text-[#c9a84c] hover:underline"
                >
                  View All Collection →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
