import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice } from "@/types";
import { CatalogMedia } from "@/components/storefront/CatalogMedia";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0];
  const variant = product.variants?.[0];
  const hasStock = product.variants?.some((item) => (item.inventory?.quantity ?? 0) > 0) ?? false;

  return (
    <article className="product-card group">
      <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
        <CatalogMedia src={image?.url} alt={image?.alt_text ?? product.name} />
        <div className="product-card-copy">
          <div className="flex items-start justify-between gap-3">
            <h3 className="product-card-title">{product.name}</h3>
            {variant ? <p className="product-card-price">{formatPrice(variant.price_paise)}</p> : null}
          </div>
          {product.short_desc ? <p className="product-card-description">{product.short_desc}</p> : null}
          <p className={`product-card-status ${hasStock ? "product-card-status-available" : ""}`}>
            {product.variants?.length ? (hasStock ? "Available" : "Currently unavailable") : "Details coming soon"}
          </p>
        </div>
      </Link>
    </article>
  );
}
