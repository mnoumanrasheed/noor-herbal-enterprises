"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getPool } from "@/lib/db";

const requestSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["confirmed", "processing", "shipped", "delivered", "cancelled"]),
});

export type OrderActionResult = { ok: boolean; message: string; error?: string };

export async function transitionOrder(orderId: string, status: "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"): Promise<OrderActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Unauthorized", error: "Your admin session has expired." };
  const parsed = requestSchema.safeParse({ orderId, status });
  if (!parsed.success) return { ok: false, message: "Invalid request", error: "The order update is invalid." };

  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const orderResult = await client.query<{ id: string; status: string; stock_deducted: boolean }>("SELECT id, status, stock_deducted FROM orders WHERE id = $1 FOR UPDATE", [orderId]);
    const order = orderResult.rows[0];
    if (!order) { await client.query("ROLLBACK"); return { ok: false, message: "Order not found", error: "This order no longer exists." }; }

    if (status === "confirmed") {
      if (order.status === "confirmed" && order.stock_deducted) { await client.query("COMMIT"); return { ok: true, message: "This order is already confirmed." }; }
      if (order.status !== "pending") { await client.query("ROLLBACK"); return { ok: false, message: "Invalid transition", error: "Only pending inquiries can be confirmed." }; }
      const items = await client.query<{ variant_id: string | null; quantity: number; stock: number | null }>("SELECT oi.variant_id, oi.quantity, i.quantity AS stock FROM order_items oi LEFT JOIN inventory i ON i.variant_id = oi.variant_id WHERE oi.order_id = $1 FOR UPDATE OF i", [orderId]);
      if (!items.rows.length || items.rows.some((item) => !item.variant_id || item.stock === null || item.stock < item.quantity)) {
        await client.query("ROLLBACK");
        return { ok: false, message: "Insufficient stock", error: "Current stock is insufficient to confirm this inquiry." };
      }
      for (const item of items.rows) {
        const result = await client.query("UPDATE inventory SET quantity = quantity - $1 WHERE variant_id = $2 AND quantity >= $1", [item.quantity, item.variant_id]);
        if (result.rowCount !== 1) { await client.query("ROLLBACK"); return { ok: false, message: "Stock changed", error: "Stock changed while confirming. Refresh and try again." }; }
      }
      await client.query("UPDATE orders SET status = 'confirmed', stock_deducted = TRUE WHERE id = $1", [orderId]);
    } else if (status === "cancelled") {
      if (order.status === "cancelled") { await client.query("COMMIT"); return { ok: true, message: "This order is already cancelled." }; }
      if (order.status === "delivered") { await client.query("ROLLBACK"); return { ok: false, message: "Invalid transition", error: "Delivered orders cannot be cancelled from this screen." }; }
      if (order.stock_deducted) {
        const items = await client.query<{ variant_id: string | null; quantity: number; stock: number | null }>("SELECT oi.variant_id, oi.quantity, i.quantity AS stock FROM order_items oi LEFT JOIN inventory i ON i.variant_id = oi.variant_id WHERE oi.order_id = $1 FOR UPDATE OF i", [orderId]);
        if (items.rows.some((item) => !item.variant_id || item.stock === null)) { await client.query("ROLLBACK"); return { ok: false, message: "Stock cannot be restored", error: "A variant is missing, so this confirmed order cannot be cancelled safely." }; }
        for (const item of items.rows) await client.query("UPDATE inventory SET quantity = quantity + $1 WHERE variant_id = $2", [item.quantity, item.variant_id]);
      }
      await client.query("UPDATE orders SET status = 'cancelled', stock_deducted = FALSE WHERE id = $1", [orderId]);
    } else {
      const previous: Record<string, string> = { processing: "confirmed", shipped: "processing", delivered: "shipped" };
      if (order.status === status) { await client.query("COMMIT"); return { ok: true, message: `This order is already marked ${status}.` }; }
      if (order.status !== previous[status] || !order.stock_deducted) { await client.query("ROLLBACK"); return { ok: false, message: "Invalid transition", error: `Mark the order confirmed before moving it to ${status}.` }; }
      await client.query("UPDATE orders SET status = $1 WHERE id = $2", [status, orderId]);
    }
    await client.query("COMMIT");
    revalidatePath("/admin/orders");
    return { ok: true, message: status === "confirmed" ? "Inquiry confirmed and stock deducted." : status === "cancelled" ? "Order cancelled. Confirmed stock has been restored when applicable." : `Order marked ${status}.` };
  } catch {
    try { await client.query("ROLLBACK"); } catch { /* transaction already closed */ }
    return { ok: false, message: "Update failed", error: "The order status could not be changed. Try again." };
  } finally {
    client.release();
  }
}
