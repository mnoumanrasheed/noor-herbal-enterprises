"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { readCart, writeCart, type CartItem } from "@/lib/cart";
import { formatPrice } from "@/types";

type QuoteLine = {
  variant_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  variant_name: string;
  sku: string;
  price_paise: number;
  stock_quantity: number;
  image_url?: string | null;
};

export function CartExperience() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setCart(readCart());
    sync();
    window.addEventListener("noor-cart-updated", sync);
    return () => window.removeEventListener("noor-cart-updated", sync);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchQuotes() {
      if (!cart.length) {
        setLines([]);
        setLoading(false);
        setLoadError(null);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(cart),
        });
        const payload = (await response.json()) as { lines?: QuoteLine[]; error?: string };
        if (!cancelled) {
          if (!response.ok) {
            setLoadError(payload.error || "Unable to refresh prices right now.");
          } else {
            setLines(payload.lines || []);
            setLoadError(null);
          }
        }
      } catch {
        if (!cancelled) setLoadError("Unable to reach inventory service.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchQuotes();
    return () => {
      cancelled = true;
    };
  }, [cart]);

  const changeQuantity = (variantId: string, nextQty: number, maxStock?: number) => {
    if (nextQty < 1) return;
    if (maxStock !== undefined && nextQty > maxStock) return;
    const nextCart = cart.map((item) =>
      item.variantId === variantId ? { ...item, quantity: nextQty } : item
    );
    writeCart(nextCart);
  };

  const removeItem = (variantId: string) => {
    const nextCart = cart.filter((item) => item.variantId !== variantId);
    writeCart(nextCart);
  };

  const displayLines = useMemo(
    () =>
      cart.map((item) => ({
        item,
        quote: lines.find((line) => line.variant_id === item.variantId),
      })),
    [cart, lines]
  );

  const subtotal = displayLines.reduce(
    (total, { item, quote }) =>
      total + (quote ? Number(quote.price_paise) * item.quantity : 0),
    0
  );

  const hasUnavailable = displayLines.some(
    ({ item, quote }) => !quote || Number(quote.stock_quantity) < item.quantity
  );

  if (!cart.length) {
    return (
      <div className="site-shell min-h-[55vh] px-4 py-20 text-center flex flex-col items-center justify-center">
        <div className="rounded-full bg-[#1e1a16] p-6 text-3xl mb-4 border border-[#332f28]">
          🛍️
        </div>
        <h1 className="font-display text-3xl font-bold text-[#f6f0e7] mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-sm text-[#a09a8f] max-w-sm mb-8">
          Explore our collection of authentic pickles, traditional chutneys, hair oils, and herbal shampoos.
        </p>
        <Link href="/categories" className="button-primary text-xs uppercase tracking-[0.2em]">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page pb-24 pt-8">
      <div className="site-shell px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Page Title */}
        <div className="border-b border-[#2a2620] pb-6 mb-8">
          <p className="text-xs uppercase tracking-[0.16em] text-[#c9a84c] mb-1 font-semibold">
            Shopping Cart
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#f6f0e7]">
            Your Selected Essentials ({cart.reduce((t, i) => t + i.quantity, 0)})
          </h1>
        </div>

        {loadError && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200 mb-6">
            {loadError}
          </div>
        )}

        {/* Cart Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Cart Items List */}
          <section aria-label="Cart items" className="lg:col-span-8 space-y-4">
            {loading ? (
              <div className="rounded-2xl border border-[#2a2620] bg-[#141210] p-12 text-center text-sm text-[#a09a8f]">
                Refreshing cart from live inventory…
              </div>
            ) : (
              displayLines.map(({ item, quote }) => {
                const isItemUnavailable = !quote || Number(quote.stock_quantity) <= 0;
                const isExceedingStock = quote && Number(quote.stock_quantity) < item.quantity;

                return (
                  <article
                    key={item.variantId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#25221d] bg-[#141210] p-4 sm:p-6"
                  >
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-[#2e2a24] bg-[#181614]">
                        {quote?.image_url ? (
                          <Image
                            src={quote.image_url}
                            alt={quote.product_name}
                            fill
                            sizes="80px"
                            className="object-cover object-center"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase text-[#6e675d]">
                            Noor
                          </div>
                        )}
                      </div>

                      {/* Product & Variant info */}
                      <div>
                        <h2 className="font-display text-base sm:text-lg font-semibold text-[#f6f0e7]">
                          {quote?.product_slug ? (
                            <Link href={`/products/${quote.product_slug}`} className="hover:text-[#c9a84c] transition-colors">
                              {quote.product_name}
                            </Link>
                          ) : (
                            item.productName
                          )}
                        </h2>
                        <p className="text-xs text-[#a09a8f] mt-0.5">
                          {quote ? `${quote.variant_name}` : "Item currently unavailable"}
                        </p>
                        {quote && (
                          <p className="font-display text-sm font-semibold text-[#c9a84c] mt-1 sm:hidden">
                            {formatPrice(Number(quote.price_paise) * item.quantity)}
                          </p>
                        )}
                        {isItemUnavailable ? (
                          <p className="text-[11px] font-medium text-red-400 mt-1">This item is currently out of stock.</p>
                        ) : isExceedingStock ? (
                          <p className="text-[11px] font-medium text-amber-400 mt-1">
                            Only {quote.stock_quantity} available in stock.
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* Quantity controls & Line Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-[#25221d] pt-3 sm:pt-0">
                      {/* Quantity Selector */}
                      <div className="flex items-center rounded-xl border border-[#332f28] bg-[#181614]">
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.variantId, item.quantity - 1, quote?.stock_quantity)}
                          disabled={item.quantity <= 1 || isItemUnavailable}
                          className="px-3 py-1.5 text-[#d8d2c7] hover:text-[#c9a84c] disabled:opacity-30 text-sm"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-[#f6f0e7]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.variantId, item.quantity + 1, quote?.stock_quantity)}
                          disabled={isItemUnavailable || (quote && item.quantity >= quote.stock_quantity)}
                          className="px-3 py-1.5 text-[#d8d2c7] hover:text-[#c9a84c] disabled:opacity-30 text-sm"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Price (Desktop) */}
                      <div className="hidden sm:block text-right min-w-[100px]">
                        <p className="font-display text-base font-bold text-[#c9a84c]">
                          {quote ? formatPrice(Number(quote.price_paise) * item.quantity) : "—"}
                        </p>
                        <p className="text-[10px] text-[#6e675d]">
                          {quote ? `${formatPrice(Number(quote.price_paise))} each` : ""}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="text-xs text-[#8e8578] hover:text-red-400 transition-colors p-1"
                        aria-label={`Remove ${item.productName}`}
                      >
                        ✕
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </section>

          {/* Right: Order Summary & Checkout Action */}
          <aside className="lg:col-span-4">
            <div className="rounded-3xl border border-[#2d2924] bg-[#141210] p-6 sm:p-7 sticky top-24 shadow-2xl">
              <h2 className="font-display text-xl font-bold text-[#f6f0e7] mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 border-b border-[#25221d] pb-5 text-sm text-[#bfb7aa]">
                <div className="flex justify-between">
                  <span>Products Subtotal</span>
                  <span className="font-medium text-[#f6f0e7]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  <span className="text-xs text-[#c9a84c] font-semibold bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-2 py-0.5 rounded-full">
                    Decided on WhatsApp
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline py-4 border-b border-[#25221d]">
                <span className="font-display text-lg font-bold text-[#f6f0e7]">Subtotal Total</span>
                <span className="font-display text-2xl font-bold text-[#c9a84c]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/checkout"
                  className={`button-primary w-full py-4 text-center text-xs uppercase tracking-[0.2em] font-semibold ${
                    hasUnavailable || !cart.length || loading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Proceed to Checkout
                </Link>

                <p className="text-center text-[11px] text-[#8e8578]">
                  Delivery charges will be confirmed via WhatsApp chat.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
