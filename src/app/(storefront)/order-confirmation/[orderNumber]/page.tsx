import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByNumber, getStoreSettings } from "@/lib/queries";
import { formatPrice } from "@/types";

interface Props {
  params: Promise<{ orderNumber: string }>;
}

export const metadata: Metadata = {
  title: "Order Confirmation — Noor Herbal Enterprises",
  description: "Thank you for your order with Noor Herbal Enterprises.",
};

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;

  let order;
  let storeSettings;
  try {
    [order, storeSettings] = await Promise.all([
      getOrderByNumber(orderNumber),
      getStoreSettings(),
    ]);
  } catch {
    order = null;
  }

  if (!order) {
    notFound();
  }

  const items = order.items ?? [];
  const whatsappPhone = storeSettings?.whatsappPhone || "+923005599174";
  const cleanPhone = whatsappPhone.replace(/[^0-9]/g, "");

  // Prefilled WhatsApp order summary
  const itemsText = items
    .map((item) => `• ${item.product_name} (${item.variant_name}) x ${item.quantity} - ${formatPrice(item.line_total_paise)}`)
    .join("\n");

  const whatsappMessage = encodeURIComponent(
    `Hello Noor Herbal Enterprises! I have placed an order.\n\n*Order #:* ${order.order_number}\n*Name:* ${order.customer_name}\n*Phone:* ${order.customer_phone}\n*City:* ${order.city}\n*Address:* ${order.address_line1}\n*Payment Method:* ${order.payment_method === "bank_transfer" ? "Bank Transfer" : "Cash on Delivery"}\n\n*Items:*\n${itemsText}\n\n*Total Amount:* ${formatPrice(order.total_paise)}\n\nPlease let me know once it is dispatched.`
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <main className="order-confirmation-page pb-24 pt-10">
      <div className="site-shell max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="rounded-3xl border border-[#2d2924] bg-[#141210] p-8 sm:p-12 text-center shadow-2xl mb-10">
          <div className="w-16 h-16 rounded-full bg-green-900/30 border border-green-500/40 text-green-400 flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg">
            ✓
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-2">
            Order Successfully Placed
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#f6f0e7]">
            Thank You, {order.customer_name.split(" ")[0]}!
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#bfb7aa] max-w-lg mx-auto leading-relaxed">
            Your order reference is <strong className="text-[#c9a84c] font-mono text-base">{order.order_number}</strong>. We have logged your order in our system and are preparing it for packaging.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button-primary px-6 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold inline-flex items-center gap-2"
            >
              <span>💬 Confirm / Share on WhatsApp</span>
            </a>
            <Link
              href="/categories"
              className="rounded-xl border border-[#38332a] bg-[#1a1715] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#d8d2c7] hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Customer & Shipping Summary */}
          <div className="rounded-3xl border border-[#28241e] bg-[#141210] p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-[#f6f0e7] border-b border-[#25221d] pb-3 mb-4">
              Delivery Information
            </h2>
            <div className="space-y-3 text-sm text-[#bfb7aa]">
              <div>
                <span className="text-xs uppercase text-[#8e8578] block">Recipient</span>
                <span className="text-[#f6f0e7] font-medium">{order.customer_name}</span>
              </div>
              <div>
                <span className="text-xs uppercase text-[#8e8578] block">Phone / WhatsApp</span>
                <span className="text-[#f6f0e7]">{order.customer_phone}</span>
              </div>
              {order.customer_email && (
                <div>
                  <span className="text-xs uppercase text-[#8e8578] block">Email</span>
                  <span>{order.customer_email}</span>
                </div>
              )}
              <div>
                <span className="text-xs uppercase text-[#8e8578] block">Shipping Address</span>
                <p className="text-[#f6f0e7] leading-relaxed">
                  {order.address_line1}
                  {order.city ? `, ${order.city}` : ""}
                  {order.province ? `, ${order.province}` : ""}
                  {order.postal_code ? ` ${order.postal_code}` : ""}
                </p>
              </div>
              {order.customer_note && (
                <div>
                  <span className="text-xs uppercase text-[#8e8578] block">Instructions</span>
                  <p className="italic text-xs">{order.customer_note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment & Status Summary */}
          <div className="rounded-3xl border border-[#28241e] bg-[#141210] p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-[#f6f0e7] border-b border-[#25221d] pb-3 mb-4">
              Order & Payment Details
            </h2>
            <div className="space-y-3 text-sm text-[#bfb7aa]">
              <div>
                <span className="text-xs uppercase text-[#8e8578] block">Order Date</span>
                <span>{new Date(order.created_at).toLocaleString("en-PK", { dateStyle: "long", timeStyle: "short" })}</span>
              </div>
              <div>
                <span className="text-xs uppercase text-[#8e8578] block">Payment Method</span>
                <span className="text-[#c9a84c] font-semibold">
                  {order.payment_method === "bank_transfer" ? "Direct Bank Transfer" : "Cash on Delivery (COD)"}
                </span>
              </div>
              <div>
                <span className="text-xs uppercase text-[#8e8578] block">Order Status</span>
                <span className="inline-flex items-center rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/40 px-3 py-1 text-xs font-semibold text-[#c9a84c] uppercase tracking-wider mt-1">
                  {order.status}
                </span>
              </div>
              {order.payment_method === "bank_transfer" && (
                <div className="mt-4 rounded-xl border border-[#38332a] bg-[#181614] p-3 text-xs text-[#d8d2c7] space-y-1">
                  <p className="font-semibold text-[#c9a84c]">Meezan Bank Transfer Details:</p>
                  <p>Title: Noor Herbal Enterprises</p>
                  <p>Account: 0101-0102030405</p>
                  <p>IBAN: PK12MEZN0001010102030405</p>
                  <p className="text-[11px] text-[#8e8578] mt-1">
                    Please share receipt on WhatsApp with Order #{order.order_number}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="rounded-3xl border border-[#28241e] bg-[#141210] p-6 sm:p-8 shadow-xl">
          <h2 className="font-display text-xl font-bold text-[#f6f0e7] mb-6">
            Purchased Items
          </h2>

          <div className="divide-y divide-[#25221d]">
            {items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm text-[#f6f0e7]">{item.product_name}</p>
                  <p className="text-xs text-[#8e8578]">{item.variant_name} • SKU: {item.sku}</p>
                  <p className="text-xs text-[#a09a8f] mt-0.5">
                    {formatPrice(item.unit_price_paise)} × {item.quantity}
                  </p>
                </div>
                <p className="font-display text-base font-bold text-[#c9a84c]">
                  {formatPrice(item.line_total_paise)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#25221d] pt-6 mt-4 space-y-2.5 text-sm text-[#bfb7aa]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-[#f6f0e7]">{formatPrice(order.subtotal_paise)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-medium text-[#f6f0e7]">
                {order.shipping_paise === 0 ? <span className="text-green-400 font-semibold">FREE</span> : formatPrice(order.shipping_paise)}
              </span>
            </div>
            <div className="flex justify-between items-baseline border-t border-[#25221d] pt-4 text-base">
              <span className="font-display font-bold text-[#f6f0e7]">Grand Total</span>
              <span className="font-display text-2xl font-bold text-[#c9a84c]">
                {formatPrice(order.total_paise)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
