import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchase } from "@/components/storefront/ProductPurchase";
import { CatalogMedia } from "@/components/storefront/CatalogMedia";
import { CatalogUnavailable } from "@/components/storefront/CategoryShowcase";
import { getProductBySlug } from "@/lib/queries";
import type { Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Product not found" };
    return { title: product.name, description: product.short_desc ?? product.description ?? undefined };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product: Product | null = null;
  try {
    product = await getProductBySlug(slug);
  } catch {
    return <main className="catalog-page"><CatalogUnavailable /></main>;
  }
  if (!product) notFound();

  const variants = product.variants ?? [];
  const image = product.images?.[0];

  return (
    <main className="catalog-page">
      <div className="site-shell px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="catalog-breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/categories">Shop</Link>{product.category_slug ? <><span aria-hidden="true">/</span><Link href={`/categories/${product.category_slug}`}>{product.category_name ?? "Collection"}</Link></> : null}<span aria-hidden="true">/</span><span aria-current="page">{product.name}</span>
        </nav>
        <div className="product-detail-grid">
          <div className="product-detail-media"><CatalogMedia src={image?.url} alt={image?.alt_text ?? product.name} /></div>
          <div className="product-detail-copy">
            <p className="eyebrow">{product.category_name ?? "Noor Herbal collection"}</p>
            <h1 className="product-detail-title">{product.name}</h1>
            {product.short_desc ? <p className="product-detail-lede">{product.short_desc}</p> : null}
            {product.description ? <div className="product-detail-description">{product.description}</div> : null}

            {variants.length > 0 ? <ProductPurchase productId={product.id} productName={product.name} variants={variants} /> : <p className="catalog-empty-inline">Pricing and options will be listed when available.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
