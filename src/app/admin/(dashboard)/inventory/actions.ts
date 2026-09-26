"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin";
import { sql } from "@/lib/db";

const stockAdjustSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.coerce.number().int().min(0, "Stock quantity cannot be negative."),
  lowStockAlert: z.coerce.number().int().min(0).max(9999).default(5),
  reason: z.string().trim().min(2, "Please state a reason for adjustment.").max(200),
});

export type InventoryActionState = {
  ok: boolean;
  message?: string;
  error?: string;
};

export async function adjustInventoryStock(
  variantId: string,
  newQuantity: number,
  lowStockAlert: number,
  reason: string
): Promise<InventoryActionState> {
  try {
    const session = await getAdminSession();
    if (!session?.user) {
      return { ok: false, error: "Unauthorized. Please sign in again." };
    }

    const parsed = stockAdjustSchema.safeParse({
      variantId,
      quantity: newQuantity,
      lowStockAlert,
      reason,
    });

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid stock values." };
    }

    const data = parsed.data;

    // Read current stock to determine change quantity
    const currentRows = await sql`
      SELECT quantity FROM inventory WHERE variant_id = ${data.variantId} LIMIT 1
    `;
    const oldQty = currentRows[0]?.quantity ?? 0;
    const changeQty = data.quantity - oldQty;

    await sql.transaction([
      sql`
        INSERT INTO inventory (variant_id, quantity, low_stock_alert, updated_at)
        VALUES (${data.variantId}, ${data.quantity}, ${data.lowStockAlert}, NOW())
        ON CONFLICT (variant_id) DO UPDATE
        SET quantity = EXCLUDED.quantity, low_stock_alert = EXCLUDED.low_stock_alert, updated_at = NOW()
      `,
      sql`
        INSERT INTO inventory_logs (variant_id, change_qty, reason, admin_id)
        VALUES (${data.variantId}, ${changeQty}, ${data.reason}, ${session.user.id || null})
      `,
    ]);

    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/", "layout");

    return { ok: true, message: `Stock updated to ${data.quantity} units.` };
  } catch {
    return { ok: false, error: "Failed to update stock. Check database connection." };
  }
}
