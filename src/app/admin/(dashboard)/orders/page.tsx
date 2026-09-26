import type { Metadata } from "next";
import Link from "next/link";
import { getAllOrders, getOrderReport } from "@/lib/queries";
import { formatPrice, type Order, type OrderItem, type OrderStatus, type PaymentStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { OrderStatusActions } from "@/components/admin/OrderStatusActions";

export const metadata: Metadata = { title: "Order Management — Admin" };

const statusVariant: Record<OrderStatus, "gold" | "green" | "red" | "blue" | "gray"> = {
  pending: "gold",
  confirmed: "green",
  processing: "blue",
  shipped: "blue",
  delivered: "green",
  cancelled: "red",
  refunded: "gray",
};

interface Props {
  searchParams: Promise<{
    search?: string;
    status?: string;
    payment?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { search = "", status = "", payment = "" } = await searchParams;

  let orders: Order[] = [];
  let report = null;
  let error = "";

  try {
    [orders, report] = await Promise.all([
      getAllOrders({
        search: search || undefined,
        status: (status as OrderStatus) || undefined,
        paymentStatus: (payment as PaymentStatus) || undefined,
      }),
      getOrderReport(),
    ]);
  } catch {
    error = "Orders could not be loaded. Please check database connectivity.";
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[#111827] mb-1">
          Store Orders & Inquiries
        </h1>
        <p className="text-sm text-[#6b7280]">
          Manage and track all storefront orders, payment verification, and delivery dispatch.
        </p>
      </div>

      {error ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Pending Orders", value: report?.pending_orders ?? 0, color: "text-amber-600", bg: "bg-amber-50", icon: "⏳" },
              { label: "Active Orders", value: report?.active_orders ?? 0, color: "text-blue-600", bg: "bg-blue-50", icon: "🚀" },
              { label: "Delivered Orders", value: report?.delivered_orders ?? 0, color: "text-emerald-600", bg: "bg-emerald-50", icon: "✅" },
              { label: "Total Revenue", value: formatPrice(report?.total_revenue_paise ?? 0), color: "text-[#b8913f]", bg: "bg-[#c9a84c]/10", icon: "💰" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[#e2e5ee] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                    {stat.label}
                  </p>
                  <span className={`text-lg rounded-lg p-1 ${stat.bg}`}>{stat.icon}</span>
                </div>
                <p className={`font-display text-2xl sm:text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filter and Search Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-[#e2e5ee] py-4 bg-white px-4 rounded-xl shadow-sm">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/orders"
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  !status ? "bg-[#c9a84c] text-white shadow-sm" : "border border-[#e2e5ee] bg-white text-[#6b7280] hover:border-[#c9a84c]/50 hover:text-[#b8913f]"
                }`}
              >
                All Orders
              </Link>
              {(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as OrderStatus[]).map((s) => (
                <Link
                  key={s}
                  href={`/admin/orders?status=${s}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    status === s ? "bg-[#c9a84c] text-white shadow-sm" : "border border-[#e2e5ee] bg-white text-[#6b7280] hover:border-[#c9a84c]/50 hover:text-[#b8913f]"
                  }`}
                >
                  {s}
                </Link>
              ))}
            </div>

            {/* Search Input */}
            <form method="GET" action="/admin/orders" className="flex items-center gap-2">
              {status && <input type="hidden" name="status" value={status} />}
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search order #, customer, phone, city..."
                className="rounded-xl border border-[#e2e5ee] bg-[#f9fafb] px-4 py-1.5 text-xs text-[#374151] placeholder-[#9ca3af] focus:border-[#c9a84c] focus:outline-none focus:bg-white w-full sm:w-64 transition-colors"
              />
              <button
                type="submit"
                className="rounded-xl border border-[#e2e5ee] bg-white px-3 py-1.5 text-xs font-semibold text-[#374151] hover:border-[#c9a84c] hover:text-[#b8913f] transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Orders Table */}
          <div className="rounded-2xl border border-[#e2e5ee] bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#f3f4f6] bg-[#f9fafb] text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                  <tr>
                    <th className="px-4 py-3">Order # & Date</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Destination</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-sm text-[#9ca3af]">
                        No orders match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="font-mono text-xs font-bold text-[#c9a84c] hover:text-[#b8913f] hover:underline block"
                          >
                            {order.order_number}
                          </Link>
                          <span className="text-[10px] text-[#9ca3af] block mt-0.5">
                            {new Date(order.created_at).toLocaleDateString("en-PK", { dateStyle: "medium" })}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#111827] text-xs sm:text-sm">{order.customer_name}</p>
                          <p className="text-xs text-[#9ca3af]">{order.customer_phone}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#6b7280]">
                          {order.city}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#6b7280] max-w-xs truncate">
                          {order.items?.map((item: OrderItem) => `${item.product_name} (${item.variant_name} × ${item.quantity})`).join(", ") || "—"}
                        </td>
                        <td className="px-4 py-3 font-display font-bold text-[#111827] text-xs">
                          {formatPrice(order.total_paise)}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] uppercase font-semibold border ${
                            order.payment_status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-[#f9fafb] text-[#6b7280] border-[#e2e5ee]"
                          }`}>
                            {order.payment_method === "bank_transfer" ? "Bank" : "COD"} · {order.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusVariant[order.status] || "gold"}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <OrderStatusActions orderId={order.id} status={order.status} />
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="rounded-lg border border-[#e2e5ee] bg-white px-3 py-1 text-xs font-semibold text-[#374151] hover:border-[#c9a84c] hover:text-[#b8913f] transition-colors"
                            >
                              Details →
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
