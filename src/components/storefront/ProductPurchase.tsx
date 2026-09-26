"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductVariant } from "@/types";
import { formatPrice } from "@/types";
import { readCart, writeCart } from "@/lib/cart";

interface ProductPurchaseProps {
  productId: string;
  productName: string;
  variants: ProductVariant[];
  whatsappNumber?: string;
}

export function ProductPurchase({
  productId,
  productName,
  variants,
  whatsappNumber = "+923005599174",
}: ProductPurchaseProps) {
  const router = useRouter();

  // Pick first available variant or first item
  const firstAvailable = variants.find((v) => (v.inventory?.quantity ?? 0) > 0) ?? variants[0];
  const [selectedId, setSelectedId] = useState(firstAvailable?.id);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const selected = variants.find((v) => v.id === selectedId) ?? firstAvailable;
  const stock = selected?.inventory?.quantity ?? 0;
  const isOutOfStock = !selected || stock <= 0;
  const isLowStock = !isOutOfStock && stock <= 5;

  const comparePrice = selected?.compare_price_paise;
  const currentPrice = selected?.price_paise ?? 0;
  const savings = comparePrice && comparePrice > currentPrice
    ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
    : 0;

  function handleQuantityChange(delta: number) {
    setQuantity((prev) => Math.max(1, Math.min(stock > 0 ? stock : 1, prev + delta)));
  }

  function handleAddToCart() {
    if (!selected || isOutOfStock) return;
    const current = readCart();
    const existingIndex = current.findIndex((item) => item.variantId === selected.id);

    let next;
    if (existingIndex > -1) {
      next = current.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: Math.min(stock, item.quantity + quantity) }
          : item
      );
    } else {
      next = [
        ...current,
        {
          productId,
          productName,
          variantId: selected.id,
          quantity,
        },
      ];
    }

    writeCart(next);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  }

  function handleBuyNow() {
    if (!selected || isOutOfStock) return;
    handleAddToCart();
    router.push("/checkout");
  }

  // Construct WhatsApp inquiry link
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappMessage = encodeURIComponent(
    `Hello Noor Herbal Enterprises! I would like to inquire about purchasing:\n\n*Product:* ${productName}\n*Option:* ${selected?.name ?? "Standard"}\n*Quantity:* ${quantity}\n*Price:* ${formatPrice(currentPrice * quantity)}\n\nPlease advise on availability and delivery details.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="space-y-6">
      {/* Price & Savings Display */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-display text-3xl font-bold text-[#c9a84c]">
          {formatPrice(currentPrice)}
        </span>
        {comparePrice && comparePrice > currentPrice && (
          <>
            <span className="text-base text-[#7a7367] line-through">
              {formatPrice(comparePrice)}
            </span>
            <span className="rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/40 px-2.5 py-0.5 text-xs font-semibold text-[#c9a84c]">
              Save {savings}%
            </span>
          </>
        )}
      </div>

      {/* Variant Selector */}
      {variants.length > 0 && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#a09a8f] mb-3">
            Select Size / Option: <span className="text-[#f6f0e7]">{selected?.name}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5" role="radiogroup">
            {variants.map((variant) => {
              const isSelected = variant.id === selected?.id;
              const varStock = variant.inventory?.quantity ?? 0;
              const varOutOfStock = varStock <= 0;

              return (
                <button
                  key={variant.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={varOutOfStock}
                  onClick={() => {
                    setSelectedId(variant.id);
                    setQuantity(1);
                  }}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-[#c9a84c] bg-[#1f1b15] shadow-md shadow-[#c9a84c]/10"
                      : varOutOfStock
                      ? "border-[#25221d] bg-[#141210]/50 opacity-50 cursor-not-allowed"
                      : "border-[#332f28] bg-[#181614] hover:border-[#c9a84c]/50"
                  }`}
                >
                  <span className={`text-sm font-medium ${isSelected ? "text-[#c9a84c]" : "text-[#f6f0e7]"}`}>
                    {variant.name}
                  </span>
                  <span className="text-xs text-[#a09a8f] mt-1">
                    {formatPrice(variant.price_paise)}
                  </span>
                  {varOutOfStock ? (
                    <span className="text-[10px] text-red-400 mt-1 uppercase tracking-wider">Out of stock</span>
                  ) : varStock <= 5 ? (
                    <span className="text-[10px] text-amber-400 mt-1 uppercase tracking-wider">Only {varStock} left</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock Status Indicator */}
      <div className="flex items-center gap-2 text-sm">
        {isOutOfStock ? (
          <>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-red-400 font-medium">Currently Out of Stock</span>
          </>
        ) : isLowStock ? (
          <>
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-400 font-medium">Low Stock — Only {stock} remaining</span>
          </>
        ) : (
          <>
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-green-400 font-medium">In Stock • Ready for dispatch across Pakistan</span>
          </>
        )}
      </div>

      {/* Quantity Selector & Action Buttons */}
      {!isOutOfStock && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a09a8f]">Quantity</span>
            <div className="flex items-center rounded-xl border border-[#38332a] bg-[#181614]">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="px-3.5 py-2 text-[#d8d2c7] hover:text-[#c9a84c] disabled:opacity-30 text-base"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center font-display font-semibold text-[#f6f0e7]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= stock}
                className="px-3.5 py-2 text-[#d8d2c7] hover:text-[#c9a84c] disabled:opacity-30 text-base"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <span className="text-xs text-[#8e8578]">
              Subtotal: <strong className="text-[#c9a84c] font-semibold">{formatPrice(currentPrice * quantity)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`button-primary w-full py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all ${
                addedSuccess ? "bg-green-600 text-white border-green-500" : ""
              }`}
            >
              {addedSuccess ? "✓ Added to Cart" : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full rounded-xl border border-[#c9a84c] bg-[#1e1b15] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0e0d0c] transition-all shadow-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Question / Inquiry Shortcut */}
      <div className="border-t border-[#25221d] pt-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 text-xs font-medium text-[#c9a84c] hover:text-[#dfbc5e] transition-colors"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
            💬
          </span>
          <span>Have a question about this product? Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
