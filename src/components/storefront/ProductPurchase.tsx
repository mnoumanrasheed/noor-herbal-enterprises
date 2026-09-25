"use client";

import { useState } from "react";
import type { ProductVariant } from "@/types";
import { formatPrice } from "@/types";
import { AddToCartButton } from "@/components/storefront/AddToCartButton";

interface ProductPurchaseProps {
  productId: string;
  productName: string;
  variants: ProductVariant[];
}

export function ProductPurchase({ productId, productName, variants }: ProductPurchaseProps) {
  const firstAvailable = variants.find((variant) => (variant.inventory?.quantity ?? 0) > 0) ?? variants[0];
  const [selectedId, setSelectedId] = useState(firstAvailable?.id);
  const selected = variants.find((variant) => variant.id === selectedId) ?? firstAvailable;
  const unavailable = !selected || (selected.inventory?.quantity ?? 0) <= 0;

  return (
    <div>
      <div className="product-variants">
        <p className="field-label">Available options</p>
        <div className="product-variant-list" role="radiogroup" aria-label="Product variants">
          {variants.map((variant) => {
            const isSelected = variant.id === selected?.id;
            const isUnavailable = (variant.inventory?.quantity ?? 0) <= 0;
            return (
              <button key={variant.id} type="button" role="radio" aria-checked={isSelected} disabled={isUnavailable} onClick={() => setSelectedId(variant.id)} className={`product-variant ${isSelected ? "product-variant-selected" : ""}`}>
                <span>{variant.name}</span><span>{formatPrice(variant.price_paise)}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="product-detail-purchase">
        {selected ? <p className="product-detail-price">{formatPrice(selected.price_paise)}</p> : null}
        <AddToCartButton productId={productId} productName={productName} variant={selected} disabled={unavailable} />
      </div>
      <p className="product-detail-note">{unavailable ? "This option is currently unavailable." : "Availability is based on current catalog inventory."}</p>
    </div>
  );
}
