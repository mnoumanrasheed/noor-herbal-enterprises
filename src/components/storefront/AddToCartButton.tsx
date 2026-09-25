"use client";

import { useState } from "react";
import type { ProductVariant } from "@/types";
import { readCart, writeCart } from "@/lib/cart";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  variant?: ProductVariant;
  disabled?: boolean;
}

export function AddToCartButton({ productId, productName, variant, disabled = false }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function addToCart() {
    if (!variant || disabled) return;
    const current = readCart();
    const existing = current.find((item) => item.variantId === variant.id);
    const next = existing
      ? current.map((item) => item.variantId === variant.id ? { ...item, quantity: Math.min(99, item.quantity + 1) } : item)
      : [...current, { productId, productName, variantId: variant.id, quantity: 1 }];
    writeCart(next);
    setAdded(true);
  }

  return (
    <button type="button" onClick={addToCart} disabled={disabled || !variant} className="button-primary product-add-button">
      {added ? "Added to cart" : disabled || !variant ? "Unavailable" : "Add to cart"}
    </button>
  );
}
