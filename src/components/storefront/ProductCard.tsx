import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { formatPrice } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const images = product.images ?? [];
  const primaryImage = images[0];
  const secondaryImage = images[1];

  const variants = (product.variants ?? []).filter((v) => v.is_active);
  const minPrice = variants.length > 0
    ? Math.min(...variants.map((v) => v.price_paise))
    : null;
  const maxPrice = variants.length > 0
    ? Math.max(...variants.map((v) => v.price_paise))
    : null;

  const comparePrice = variants[0]?.compare_price_paise;
  const totalStock = variants.reduce((acc, v) => acc + (v.inventory?.quantity ?? 0), 0);
  const isOutOfStock = variants.length > 0 && totalStock <= 0;
  const isLowStock = variants.length > 0 && totalStock > 0 && totalStock <= 5;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#2a2620] bg-[#141210] transition-all duration-300 hover:border-[#c9a84c]/50 hover:shadow-2xl hover:shadow-[#c9a84c]/5 hover:-translate-y-1">
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#1a1715]">
        <Link
          href={`/products/${product.slug}`}
          className="block h-full w-full"
          aria-label={`View ${product.name}`}
        >
          {primaryImage ? (
            <div className="relative h-full w-full">
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt_text ?? product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={`object-cover object-center transition-all duration-500 group-hover:scale-105 ${
                  secondaryImage ? "group-hover:opacity-0" : ""
                }`}
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage.url}
                  alt={secondaryImage.alt_text ?? product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="absolute inset-0 object-cover object-center opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
              )}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-[#665f54]">
              Noor Herbal
            </div>
          )}
        </Link>

        {/* Badges Overlay */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
          {product.is_featured && (
            <span className="rounded-full border border-[#c9a84c]/40 bg-[#161412]/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9a84c]">
              Featured
            </span>
          )}
          {isOutOfStock ? (
            <span className="rounded-full bg-red-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-200">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="rounded-full bg-amber-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">
              Low Stock
            </span>
          ) : null}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category Label */}
        {product.category_name && (
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8e8578] mb-1.5">
            {product.category_name}
          </p>
        )}

        {/* Product Title */}
        <h3 className="font-display text-lg font-semibold text-[#f6f0e7] transition-colors group-hover:text-[#c9a84c] line-clamp-1">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Short description */}
        {product.short_desc && (
          <p className="mt-1 text-xs text-[#a09a8f] line-clamp-2 leading-relaxed">
            {product.short_desc}
          </p>
        )}

        {/* Spacer */}
        <div className="mt-auto pt-4" />

        {/* Pricing & Action */}
        <div className="flex items-center justify-between border-t border-[#25221d] pt-3">
          <div className="flex items-baseline gap-2">
            {minPrice !== null ? (
              <>
                <span className="font-display text-base font-bold text-[#c9a84c]">
                  {variants.length > 1 && minPrice !== maxPrice ? `From ${formatPrice(minPrice)}` : formatPrice(minPrice)}
                </span>
                {comparePrice && comparePrice > minPrice && (
                  <span className="text-xs text-[#6e675d] line-through">
                    {formatPrice(comparePrice)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs text-[#8e8578]">Pricing available soon</span>
            )}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="text-xs font-semibold uppercase tracking-[0.15em] text-[#d8d2c7] hover:text-[#c9a84c] transition-colors inline-flex items-center gap-1"
          >
            <span>View</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
