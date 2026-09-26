import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderDetailManager } from "@/components/admin/OrderDetailManager";
import { getOrderById } from "@/lib/queries";
import { formatPrice } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Order Details — Admin" };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  let order;
  try {
    order = await getOrderById(id);
  } catch {
    order = null;
  }

  if (!order) {
    notFound();
  }

  const items = order.items ?? [];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e5ee] pb-6">
        <div>
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-[#9ca3af]">
            <Link href="/admin/orders" className="hover:text-[#c9a84c] transition-colors">Orders</Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#c9a84c] font-mono">{order.order_number}</span>
          </nav>
          <h1 className="font-display text-2xl font-bold text-[#111827]">
            Order #{order.order_number}
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Placed on {new Date(order.created_at).toLocaleString("en-PK", { dateStyle: "full", timeStyle: "medium" })}
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="rounded-xl border border-[#e2e5ee] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#374151] hover:text-[#c9a84c] hover:border-[#c9a84c]/50 transition-colors self-start sm:self-auto shadow-sm"
        >
          ← Back to Orders
        </Link>
      </div>

      {/* Status & Actions Manager */}
      <OrderDetailManager order={order} />

      {/* Customer & Shipping Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="rounded-2xl border border-[#e2e5ee] bg-white p-6 shadow-sm">
          <h2 className="font-display text-base font-bold text-[#111827] border-b border-[#f3f4f6] pb-3 mb-4">
            Customer Information
          </h2>
          <div className="space-y-3 text-sm text-[#374151]">
            <div>
              <span className="text-[11px] uppercase text-[#9ca3af] block mb-0.5 font-semibold tracking-wider">Customer Name</span>
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase text-[#9ca3af] block mb-0.5 font-semibold tracking-wider">Phone / WhatsApp</span>
              <span>{order.customer_phone}</span>
            </div>
            {order.customer_email && (
              <div>
                <span className="text-[11px] uppercase text-[#9ca3af] block mb-0.5 font-semibold tracking-wider">Email</span>
                <span>{order.customer_email}</span>
              </div>
            )}
            {order.customer_note && (
              <div>
                <span className="text-[11px] uppercase text-[#9ca3af] block mb-0.5 font-semibold tracking-wider">Customer Note</span>
                <p className="italic text-xs bg-[#f9fafb] p-3 rounded-xl border border-[#e2e5ee] text-[#6b7280]">
                  &quot;{order.customer_note}&quot;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="rounded-2xl border border-[#e2e5ee] bg-white p-6 shadow-sm">
          <h2 className="font-display text-base font-bold text-[#111827] border-b border-[#f3f4f6] pb-3 mb-4">
            Delivery Destination
          </h2>
          <div className="space-y-3 text-sm text-[#374151]">
            <div>
              <span className="text-[11px] uppercase text-[#9ca3af] block mb-0.5 font-semibold tracking-wider">Street Address</span>
              <span className="font-medium">{order.address_line1}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase text-[#9ca3af] block mb-0.5 font-semibold tracking-wider">City & Region</span>
              <span>
                {order.city}
                {order.province ? `, ${order.province}` : ""}
                {order.postal_code ? ` (${order.postal_code})` : ""}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase text-[#9ca3af] block mb-0.5 font-semibold tracking-wider">Payment Method</span>
              <span className="text-[#b8913f] font-semibold">
                {order.payment_method === "bank_transfer" ? "Direct Bank Transfer" : "Cash on Delivery (COD)"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="rounded-2xl border border-[#e2e5ee] bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#f3f4f6]">
          <h2 className="font-display text-base font-bold text-[#111827]">Order Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f9fafb] border-b border-[#f3f4f6] text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Variant</th>
                <th className="px-6 py-3 text-center">Qty</th>
                <th className="px-6 py-3 text-right">Unit Price</th>
                <th className="px-6 py-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#111827]">
                    {item.product_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6b7280]">
                    {item.variant_name}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-[#374151]">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-[#6b7280]">
                    {formatPrice(item.unit_price_paise)}
                  </td>
                  <td className="px-6 py-4 text-right font-display font-bold text-[#b8913f]">
                    {formatPrice(item.line_total_paise)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-[#f3f4f6] px-6 py-5">
          <div className="max-w-xs ml-auto space-y-2 text-sm text-[#6b7280]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-[#374151]">{formatPrice(order.subtotal_paise)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-medium text-[#374151]">
                {order.shipping_paise === 0 ? <span className="text-emerald-600 font-semibold">FREE</span> : formatPrice(order.shipping_paise)}
              </span>
            </div>
            <div className="flex justify-between items-baseline border-t border-[#e2e5ee] pt-3 mt-2">
              <span className="font-display font-bold text-[#111827] text-base">Total</span>
              <span className="font-display text-2xl font-bold text-[#b8913f]">
                {formatPrice(order.total_paise)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
