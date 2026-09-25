"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createInquiry, type InquiryState } from "@/app/(storefront)/cart/actions";
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
};

const initialState: InquiryState = { ok: false };

export function CartExperience() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [state, formAction, pending] = useActionState(createInquiry, initialState);
  const popupRef = useRef<Window | null>(null);

  useEffect(() => {
    const sync = () => setCart(readCart());
    sync();
    window.addEventListener("noor-cart-updated", sync);
    return () => window.removeEventListener("noor-cart-updated", sync);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function quote() {
      if (!cart.length) { setLines([]); setLoading(false); return; }
      setLoading(true); setLoadError("");
      try {
        const response = await fetch("/api/cart", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(cart) });
        const payload = await response.json() as { lines?: QuoteLine[]; error?: string };
        if (!response.ok) throw new Error(payload.error || "The cart could not be refreshed.");
        if (!cancelled) setLines(payload.lines || []);
      } catch (error) {
        if (!cancelled) { setLines([]); setLoadError(error instanceof Error ? error.message : "The cart could not be refreshed."); }
      } finally { if (!cancelled) setLoading(false); }
    }
    void quote();
    return () => { cancelled = true; };
  }, [cart]);

  useEffect(() => {
    if (state.ok && state.whatsappUrl) {
      writeCart([]);
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.location.href = state.whatsappUrl;
      }
      popupRef.current = null;
    } else if (state.error && popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
      popupRef.current = null;
    }
  }, [state]);

  const displayLines = useMemo(() => cart.map((item) => ({ item, quote: lines.find((line) => line.variant_id === item.variantId) })), [cart, lines]);
  const subtotal = displayLines.reduce((total, { item, quote }) => total + (quote ? Number(quote.price_paise) * item.quantity : 0), 0);
  const hasUnavailable = displayLines.some(({ item, quote }) => !quote || Number(quote.stock_quantity) < item.quantity);

  function changeQuantity(variantId: string, quantity: number) {
    const next = cart.map((item) => item.variantId === variantId ? { ...item, quantity: Math.max(1, Math.min(99, quantity || 1)) } : item);
    writeCart(next);
  }
  function removeItem(variantId: string) { writeCart(cart.filter((item) => item.variantId !== variantId)); }
  function prepareWhatsApp() {
    const popup = window.open("about:blank", "_blank");
    if (popup) { popup.opener = null; popup.document.title = "Preparing WhatsApp order"; popupRef.current = popup; }
  }

  if (!loading && !cart.length && !state.ok) return <div className="page-shell text-center"><p className="eyebrow">Your selection</p><h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-6xl">Your cart is empty.</h1><p className="mx-auto mt-6 max-w-md text-base leading-8 text-[#aaa39a]">Explore the collection and add an available product option when you are ready.</p><Link href="/categories" className="button-primary mt-8">Explore products</Link></div>;

  if (state.ok) return <div className="page-shell text-center"><p className="eyebrow">Inquiry saved</p><h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-6xl">Your inquiry is ready.</h1><p className="mx-auto mt-6 max-w-md text-base leading-8 text-[#aaa39a]">Reference {state.orderNumber}. This is an inquiry, not a confirmed sale. Confirm availability, delivery, and payment directly with Noor Herbal Enterprises.</p><a href={state.whatsappUrl} target="_blank" rel="noreferrer" className="button-primary mt-8">Open WhatsApp</a><p className="mt-4 text-sm text-[#aaa39a]">If WhatsApp did not open automatically, use the button above.</p></div>;

  return <div className="cart-page"><div className="site-shell px-4 py-12 sm:px-6 lg:px-8"><div className="cart-heading"><div><p className="eyebrow">Your selection</p><h1>Review your order inquiry.</h1></div><Link href="/categories" className="text-link">Continue shopping</Link></div>
    {loadError && <div role="alert" className="catalog-state">{loadError}</div>}
    <div className="cart-layout"><section aria-label="Cart items" className="cart-lines">{loading ? <p className="text-[#aaa39a]">Refreshing your cart…</p> : displayLines.map(({ item, quote }) => <article key={item.variantId} className="cart-line"><div><h2>{quote?.product_name || item.productName}</h2><p>{quote ? `${quote.variant_name} · ${quote.sku}` : "This option is no longer available."}</p>{quote && Number(quote.stock_quantity) < item.quantity ? <p className="cart-line-warning">Only {quote.stock_quantity} available right now.</p> : null}</div><div className="cart-line-actions"><label className="sr-only" htmlFor={`quantity-${item.variantId}`}>Quantity for {item.productName}</label><input id={`quantity-${item.variantId}`} value={item.quantity} onChange={(event) => changeQuantity(item.variantId, Number(event.target.value))} type="number" min="1" max="99" className="cart-quantity" /><p>{quote ? formatPrice(Number(quote.price_paise) * item.quantity) : "—"}</p><button type="button" onClick={() => removeItem(item.variantId)} className="admin-remove-button">Remove</button></div></article>)}</section>
      <aside className="cart-checkout"><h2>Send an inquiry</h2><p className="mt-2 text-sm leading-6 text-[#aaa39a]">We will check your request before confirming delivery or payment.</p><div className="cart-total"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><p className="cart-total-note">No delivery charge or payment method has been assumed.</p>
        <form action={formAction} onSubmit={prepareWhatsApp} className="mt-6 space-y-4"><input type="hidden" name="cart" value={JSON.stringify(cart)} /><label><span className="field-label">Name</span><input name="customerName" className="field-input" required /></label><label><span className="field-label">Phone / WhatsApp</span><input name="customerPhone" type="tel" className="field-input" required /></label><label><span className="field-label">City</span><input name="city" className="field-input" required /></label><label><span className="field-label">Address</span><textarea name="address" className="field-input min-h-24 resize-y" required /></label><label><span className="field-label">Note (optional)</span><textarea name="note" className="field-input min-h-20 resize-y" /></label>{state.error && <p role="alert" className="admin-form-error">{state.error}</p>}<button type="submit" disabled={pending || loading || hasUnavailable || !cart.length} className="button-primary w-full">{pending ? "Saving inquiry…" : "Continue to WhatsApp"}</button></form>
      </aside></div></div></div>;
}
