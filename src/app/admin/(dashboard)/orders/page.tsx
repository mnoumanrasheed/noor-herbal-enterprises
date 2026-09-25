import type { Metadata } from "next";
import { getAllOrders, getOrderReport } from "@/lib/queries";
import { formatPrice, type OrderStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { OrderStatusActions } from "@/components/admin/OrderStatusActions";

export const metadata: Metadata = { title: "Order inquiries — Admin" };

const statusVariant: Record<OrderStatus, "gold" | "green" | "red" | "blue" | "gray"> = { pending: "gold", confirmed: "green", processing: "blue", shipped: "blue", delivered: "green", cancelled: "red", refunded: "gray" };

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof getAllOrders>> = [];
  let report: Awaited<ReturnType<typeof getOrderReport>> | null = null;
  let error = "";
  try { [orders, report] = await Promise.all([getAllOrders(), getOrderReport()]); } catch { error = "Orders could not be loaded. Check the database connection."; }
  return <div>
    <div className="admin-page-heading"><div><p className="eyebrow">WhatsApp checkout</p><h1>Order inquiries</h1><p>Pending inquiries are not confirmed sales.</p></div></div>
    {error ? <div role="alert" className="admin-alert">{error}</div> : <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">{[
        ["Open inquiries", report?.inquiries ?? 0], ["Confirmed sales", report?.confirmed_sales ?? 0], ["Confirmed value", formatPrice(report?.confirmed_total_paise ?? 0)], ["Cancelled", report?.cancelled ?? 0],
      ].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-[#2e2e2e] bg-[#1c1c1c] p-4"><p className="text-xs uppercase tracking-widest text-[#777067]">{label}</p><p className="mt-2 font-display text-2xl text-[#f6f0e7]">{value}</p></div>)}</div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{["Reference", "Customer", "Items", "Total", "Status", "Actions"].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{orders.length === 0 ? <tr><td colSpan={6} className="admin-empty">No customer inquiries yet.</td></tr> : orders.map((order) => <tr key={order.id}><td><div className="font-mono text-xs text-[#e0c47a]">{order.order_number}</div><div className="mt-1 text-xs text-[#777067]">{new Date(order.created_at).toLocaleString("en-PK")}</div></td><td><div className="font-medium text-white">{order.customer_name}</div><div className="text-xs text-[#aaa39a]">{order.customer_phone}</div><div className="mt-1 text-xs text-[#777067]">{order.city}</div></td><td className="max-w-xs"><ul className="space-y-1 text-xs text-[#aaa39a]">{order.items?.map((item) => <li key={item.id}>{item.product_name} · {item.variant_name} × {item.quantity}</li>)}</ul></td><td className="text-[#e0c47a]">{formatPrice(order.total_paise)}</td><td><Badge variant={statusVariant[order.status]}>{order.status}</Badge></td><td><OrderStatusActions orderId={order.id} status={order.status} /></td></tr>)}</tbody></table></div>
    </>}
  </div>;
}
