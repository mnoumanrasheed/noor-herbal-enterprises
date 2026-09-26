"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { submitCheckout, type CheckoutState } from "./actions";
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

const initialState: CheckoutState = { ok: false };

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [loading, setLoading] = useState(true);

  const [state, formAction, pending] = useActionState(submitCheckout, initialState);

  useEffect(() => {
    const currentCart = readCart();
    setCart(currentCart);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function quote() {
      if (!cart.length) {
        setLines([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(cart),
        });
        const payload = (await response.json()) as { lines?: QuoteLine[] };
        if (!cancelled && response.ok) {
          setLines(payload.lines || []);
        }
      } catch {
        /* fallback */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void quote();
    return () => {
      cancelled = true;
    };
  }, [cart]);

  // Handle redirect on successful order creation -> Open WhatsApp with prefilled message
  useEffect(() => {
    if (state.ok) {
      writeCart([]);
      if (state.whatsappUrl) {
        window.location.href = state.whatsappUrl;
      } else if (state.orderNumber) {
        router.push(`/order-confirmation/${state.orderNumber}`);
      }
    }
  }, [state, router]);

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

  if (!loading && !cart.length && !state.ok) {
    return (
      <div className="site-shell min-h-[60vh] px-4 py-20 text-center flex flex-col items-center justify-center">
        <h1 className="font-display text-3xl font-bold text-white mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-sm text-[#a09a8f] mb-8">
          Add some handcrafted items to your cart before proceeding to checkout.
        </p>
        <Link href="/categories" className="button-primary text-xs uppercase tracking-[0.2em]">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page pb-24 pt-8">
      <div className="site-shell px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Heading */}
        <div className="border-b border-[#2a2620] pb-6 mb-8">
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#8e8578]">
            <Link href="/cart" className="hover:text-[#c9a84c] transition-colors">Cart</Link>
            <span aria-hidden="true" className="text-[#4a443b]">/</span>
            <span aria-current="page" className="text-[#c9a84c] font-semibold">Order Details</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#f6f0e7]">
            Complete Your Order
          </h1>
        </div>

        {state.error && (
          <div role="alert" className="rounded-2xl border border-red-500/50 bg-red-950/40 p-5 text-sm text-red-200 mb-8 shadow-lg">
            <strong className="block font-semibold mb-1">Notice:</strong>
            {state.error}
          </div>
        )}

        {/* Checkout Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Customer Information & Delivery Form */}
          <div className="lg:col-span-7">
            <form action={formAction} className="space-y-8">
              <input type="hidden" name="cartJson" value={JSON.stringify(cart)} />

              {/* 1. Contact Info */}
              <section className="rounded-3xl border border-[#2d2924] bg-[#141210] p-6 sm:p-8 shadow-xl">
                <h2 className="font-display text-xl font-bold text-[#f6f0e7] mb-6 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c9a84c]/20 text-xs text-[#c9a84c] font-mono">
                    1
                  </span>
                  Customer Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="customerName" className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#a09a8f] mb-2">
                      Full Name *
                    </label>
                    <input
                      id="customerName"
                      name="customerName"
                      type="text"
                      required
                      placeholder="e.g. Muhammad Usman"
                      className="w-full rounded-xl border border-[#38332a] bg-[#1a1715] px-4 py-3.5 text-sm text-[#f6f0e7] placeholder-[#6e675d] focus:border-[#c9a84c] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="customerPhone" className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#a09a8f] mb-2">
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="customerPhone"
                        name="customerPhone"
                        type="tel"
                        required
                        placeholder="e.g. 0300 5599174"
                        className="w-full rounded-xl border border-[#38332a] bg-[#1a1715] px-4 py-3.5 text-sm text-[#f6f0e7] placeholder-[#6e675d] focus:border-[#c9a84c] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="customerEmail" className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#a09a8f] mb-2">
                        Email Address (Optional)
                      </label>
                      <input
                        id="customerEmail"
                        name="customerEmail"
                        type="email"
                        placeholder="name@example.com"
                        className="w-full rounded-xl border border-[#38332a] bg-[#1a1715] px-4 py-3.5 text-sm text-[#f6f0e7] placeholder-[#6e675d] focus:border-[#c9a84c] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Delivery Address */}
              <section className="rounded-3xl border border-[#2d2924] bg-[#141210] p-6 sm:p-8 shadow-xl">
                <h2 className="font-display text-xl font-bold text-[#f6f0e7] mb-6 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c9a84c]/20 text-xs text-[#c9a84c] font-mono">
                    2
                  </span>
                  Delivery Address in Pakistan
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#a09a8f] mb-2">
                      Complete Street Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      rows={3}
                      placeholder="House/Apartment #, Street, Sector/Block, Nearby Landmark"
                      className="w-full rounded-xl border border-[#38332a] bg-[#1a1715] px-4 py-3 text-sm text-[#f6f0e7] placeholder-[#6e675d] focus:border-[#c9a84c] focus:outline-none resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#a09a8f] mb-2">
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        placeholder="e.g. Lahore"
                        className="w-full rounded-xl border border-[#38332a] bg-[#1a1715] px-4 py-3.5 text-sm text-[#f6f0e7] placeholder-[#6e675d] focus:border-[#c9a84c] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="province" className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#a09a8f] mb-2">
                        Province / Region
                      </label>
                      <select
                        id="province"
                        name="province"
                        defaultValue="Punjab"
                        className="w-full rounded-xl border border-[#38332a] bg-[#1a1715] px-4 py-3.5 text-sm text-[#f6f0e7] focus:border-[#c9a84c] focus:outline-none"
                      >
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="Khyber Pakhtunkhwa">KPK</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Islamabad Capital Territory">Islamabad</option>
                        <option value="Azad Jammu & Kashmir">AJK</option>
                        <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="customerNote" className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#a09a8f] mb-2">
                      Special Instructions / Delivery Notes (Optional)
                    </label>
                    <textarea
                      id="customerNote"
                      name="customerNote"
                      rows={2}
                      placeholder="e.g. Preferred time, nearby landmark..."
                      className="w-full rounded-xl border border-[#38332a] bg-[#1a1715] px-4 py-3 text-sm text-[#f6f0e7] placeholder-[#6e675d] focus:border-[#c9a84c] focus:outline-none resize-y"
                    />
                  </div>
                </div>
              </section>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={pending || loading || !cart.length}
                className="button-primary w-full py-5 text-center text-sm uppercase tracking-[0.2em] font-bold shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>💬</span>
                {pending ? "Preparing WhatsApp Message…" : `Confirm & Order via WhatsApp • ${formatPrice(subtotal)}`}
              </button>
            </form>
          </div>

          {/* Right: Order Summary Sidebar */}
          <aside className="lg:col-span-5">
            <div className="rounded-3xl border border-[#2d2924] bg-[#141210] p-6 sm:p-8 sticky top-24 shadow-2xl">
              <h2 className="font-display text-xl font-bold text-[#f6f0e7] mb-6">
                Your Order Items ({cart.reduce((t, i) => t + i.quantity, 0)})
              </h2>

              {/* Lines list */}
              <div className="max-h-80 overflow-y-auto space-y-4 border-b border-[#25221d] pb-6 mb-6 pr-2">
                {displayLines.map(({ item, quote }) => (
                  <div key={item.variantId} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-[#2e2a24] bg-[#181614]">
                      {quote?.image_url ? (
                        <Image
                          src={quote.image_url}
                          alt={quote.product_name}
                          fill
                          sizes="64px"
                          className="object-cover object-center"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[9px] uppercase text-[#6e675d]">
                          Noor
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#f6f0e7] truncate">
                        {quote?.product_name || item.productName}
                      </p>
                      <p className="text-xs text-[#8e8578]">
                        {quote?.variant_name} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-display text-sm font-semibold text-[#c9a84c]">
                      {quote ? formatPrice(Number(quote.price_paise) * item.quantity) : "—"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-3 text-sm text-[#bfb7aa] border-b border-[#25221d] pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Products Subtotal</span>
                  <span className="font-medium text-[#f6f0e7]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  <span className="text-xs text-[#c9a84c] font-semibold bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-2.5 py-1 rounded-full">
                    Decided on WhatsApp
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-baseline mb-6">
                <div>
                  <span className="font-display text-lg font-bold text-[#f6f0e7] block">Products Total</span>
                  <span className="text-[10px] text-[#8e8578] uppercase tracking-wider">Excl. Delivery</span>
                </div>
                <span className="font-display text-3xl font-bold text-[#c9a84c]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Guarantee */}
              <div className="rounded-2xl bg-[#181614] border border-[#25221d] p-4 text-xs text-[#8e8578] space-y-2">
                <div className="flex items-center gap-2 text-[#c9a84c]">
                  <span>🌿</span>
                  <span className="font-semibold">Direct WhatsApp Confirmation</span>
                </div>
                <p>
                  After submitting, your order details will be sent directly via WhatsApp. Delivery charges will be finalized with you on chat.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
