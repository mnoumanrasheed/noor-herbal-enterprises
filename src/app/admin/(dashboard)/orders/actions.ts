"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin";
import { getPool } from "@/lib/db";
import type { OrderStatus, PaymentStatus } from "@/types";

const statusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
});

const updateDetailsSchema = z.object({
  orderId: z.string().uuid(),
  adminNote: z.string().trim().max(1000).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]),
});

export type OrderActionResult = { ok: boolean; message: string; error?: string };

export async function transitionOrder(
  orderId: string,
  status: OrderStatus
): Promise<OrderActionResult> {
  const session = await getAdminSession();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized", error: "Your admin session has expired." };
  }
  const parsed = statusSchema.safeParse({ orderId, status });
  if (!parsed.success) {
    return { ok: false, message: "Invalid request", error: "The order update status is invalid." };
  }

  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const orderResult = await client.query<{
      id: string;
      status: string;
      stock_deducted: boolean;
      order_number: string;
    }>("SELECT id, status, stock_deducted, order_number FROM orders WHERE id = $1 FOR UPDATE", [orderId]);
    const order = orderResult.rows[0];
    if (!order) {
      await client.query("ROLLBACK");
      return { ok: false, message: "Order not found", error: "This order no longer exists." };
    }

    if (status === "cancelled") {
      if (order.status === "cancelled") {
        await client.query("COMMIT");
        return { ok: true, message: "This order is already cancelled." };
      }
      // If stock was deducted, restore it to inventory
      if (order.stock_deducted) {
        const items = await client.query<{ variant_id: string | null; quantity: number }>(
          "SELECT variant_id, quantity FROM order_items WHERE order_id = $1",
          [orderId]
        );
        for (const item of items.rows) {
          if (item.variant_id) {
            await client.query(
              "UPDATE inventory SET quantity = quantity + $1, updated_at = NOW() WHERE variant_id = $2",
              [item.quantity, item.variant_id]
            );
            await client.query(
              "INSERT INTO inventory_logs (variant_id, change_qty, reason, order_id, admin_id) VALUES ($1, $2, 'order_cancelled', $3, $4)",
              [item.variant_id, item.quantity, orderId, session.user.id || null]
            );
          }
        }
      }
      await client.query(
        "UPDATE orders SET status = 'cancelled', stock_deducted = FALSE, updated_at = NOW() WHERE id = $1",
        [orderId]
      );
    } else {
      // If confirming an order where stock wasn't deducted yet
      if (status === "confirmed" && !order.stock_deducted) {
        const items = await client.query<{ variant_id: string | null; quantity: number; stock: number | null }>(
          "SELECT oi.variant_id, oi.quantity, i.quantity AS stock FROM order_items oi LEFT JOIN inventory i ON i.variant_id = oi.variant_id WHERE oi.order_id = $1 FOR UPDATE OF i",
          [orderId]
        );
        for (const item of items.rows) {
          if (item.variant_id) {
            await client.query(
              "UPDATE inventory SET quantity = quantity - $1, updated_at = NOW() WHERE variant_id = $2 AND quantity >= $1",
              [item.quantity, item.variant_id]
            );
            await client.query(
              "INSERT INTO inventory_logs (variant_id, change_qty, reason, order_id, admin_id) VALUES ($1, $2, 'order_confirmed', $3, $4)",
              [item.variant_id, -item.quantity, orderId, session.user.id || null]
            );
          }
        }
        await client.query(
          "UPDATE orders SET status = $1, stock_deducted = TRUE, updated_at = NOW() WHERE id = $2",
          [status, orderId]
        );
      } else {
        await client.query(
          "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2",
          [status, orderId]
        );
      }
    }

    await client.query("COMMIT");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin");
    return { ok: true, message: `Order status updated to ${status}.` };
  } catch {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* closed */
    }
    return { ok: false, message: "Update failed", error: "Could not change status. Please try again." };
  } finally {
    client.release();
  }
}

export async function updateOrderAdminDetails(
  orderId: string,
  paymentStatus: PaymentStatus,
  adminNote?: string
): Promise<OrderActionResult> {
  const session = await getAdminSession();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized", error: "Your admin session has expired." };
  }

  const parsed = updateDetailsSchema.safeParse({ orderId, paymentStatus, adminNote });
  if (!parsed.success) {
    return { ok: false, message: "Invalid parameters", error: parsed.error.issues[0]?.message };
  }

  const client = await getPool().connect();
  try {
    await client.query(
      "UPDATE orders SET payment_status = $1, admin_note = $2, updated_at = NOW() WHERE id = $3",
      [parsed.data.paymentStatus, parsed.data.adminNote || null, orderId]
    );
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { ok: true, message: "Order payment status and notes updated." };
  } catch {
    return { ok: false, message: "Update failed", error: "Could not update order record." };
  } finally {
    client.release();
  }
}
