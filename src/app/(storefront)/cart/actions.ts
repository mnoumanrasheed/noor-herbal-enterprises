"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sql } from "@/lib/db";
import { formatPrice } from "@/types";

const WHATSAPP_NUMBER = "923005599174";

const cartSchema = z.array(z.object({
  productId: z.string().uuid(),
  productName: z.string().max(200),
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
})).min(1, "Your cart is empty.").max(30);

const inquirySchema = z.object({
  customerName: z.string().trim().min(2, "Enter your name.").max(160),
  customerPhone: z.string().trim().regex(/^[+()\-\s\d]{7,25}$/, "Enter a valid phone number."),
  city: z.string().trim().min(2, "Enter your city.").max(100),
  address: z.string().trim().min(8, "Enter a complete delivery address.").max(500),
  note: z.string().trim().max(1000).optional(),
  cart: cartSchema,
});

export type InquiryState = {
  ok: boolean;
  error?: string;
  orderNumber?: string;
  whatsappUrl?: string;
};

function parseForm(formData: FormData) {
  let cart: unknown;
  try { cart = JSON.parse(String(formData.get("cart") || "[]")); } catch { cart = null; }
  return inquirySchema.safeParse({
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    city: formData.get("city"),
    address: formData.get("address"),
    note: formData.get("note") || "",
    cart,
  });
}

export async function createInquiry(_previous: InquiryState, formData: FormData): Promise<InquiryState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the checkout details." };
  const data = parsed.data;
  const quantities = new Map<string, number>();
  data.cart.forEach((line) => quantities.set(line.variantId, Math.min(99, (quantities.get(line.variantId) ?? 0) + line.quantity)));
  const variantIds = [...quantities.keys()];

  try {
    const rows = await sql`
      SELECT pv.id AS variant_id, pv.product_id, pv.name AS variant_name, pv.sku, pv.price_paise,
        p.name AS product_name, p.is_active AS product_active,
        c.is_active AS category_active, pv.is_active AS variant_active,
        COALESCE(i.quantity, 0) AS quantity
      FROM product_variants pv
      JOIN products p ON p.id = pv.product_id
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN inventory i ON i.variant_id = pv.id
      WHERE pv.id = ANY(${variantIds}::uuid[])
    `;
    if (rows.length !== variantIds.length) return { ok: false, error: "One or more cart items are no longer available." };

    const normalized = rows.map((row) => ({
      variantId: String(row.variant_id), productId: String(row.product_id), productName: String(row.product_name),
      variantName: String(row.variant_name), sku: String(row.sku), pricePaise: Number(row.price_paise), quantity: Number(row.quantity),
      available: Boolean(row.product_active) && Boolean(row.category_active) && Boolean(row.variant_active),
    }));
    for (const line of normalized) {
      const requested = quantities.get(line.variantId) ?? 0;
      if (!line.available) return { ok: false, error: `${line.productName} is no longer visible in the catalogue.` };
      if (line.quantity < requested) return { ok: false, error: `Only ${line.quantity} of ${line.productName} (${line.variantName}) is currently available.` };
    }

    const orderId = randomUUID();
    const orderNumber = `NHE-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${orderId.slice(0, 6).toUpperCase()}`;
    const subtotal = normalized.reduce((total, line) => total + line.pricePaise * (quantities.get(line.variantId) ?? 0), 0);
    const queries = [sql`
      INSERT INTO orders (id, order_number, status, customer_name, customer_email, customer_phone, address_line1, address_line2, city, state, postal_code, country, customer_note, subtotal_paise, shipping_paise, total_paise, payment_method, payment_status, stock_deducted)
      VALUES (${orderId}, ${orderNumber}, 'pending', ${data.customerName}, ${null}, ${data.customerPhone}, ${data.address}, ${null}, ${data.city}, ${null}, ${null}, 'PK', ${data.note || null}, ${subtotal}, 0, ${subtotal}, ${null}, 'pending', FALSE)
    `];
    normalized.forEach((line) => {
      const quantity = quantities.get(line.variantId) ?? 0;
      queries.push(sql`
        INSERT INTO order_items (order_id, variant_id, product_name, variant_name, sku, unit_price_paise, quantity, line_total_paise)
        VALUES (${orderId}, ${line.variantId}, ${line.productName}, ${line.variantName}, ${line.sku}, ${line.pricePaise}, ${quantity}, ${line.pricePaise * quantity})
      `);
    });
    await sql.transaction(queries);
    revalidatePath("/admin/orders");

    const messageLines = [
      "Assalam-o-alaikum Noor Herbal Enterprises,",
      "",
      `Order inquiry: ${orderNumber}`,
      "",
      "Items:",
      ...normalized.map((line) => {
        const quantity = quantities.get(line.variantId) ?? 0;
        return `• ${line.productName} — ${line.variantName} × ${quantity} @ ${formatPrice(line.pricePaise)} = ${formatPrice(line.pricePaise * quantity)}`;
      }),
      "",
      `Subtotal: ${formatPrice(subtotal)}`,
      "Delivery and payment to be confirmed.",
      "",
      `Name: ${data.customerName}`,
      `Phone: ${data.customerPhone}`,
      `City: ${data.city}`,
      `Address: ${data.address}`,
      ...(data.note ? [`Note: ${data.note}`] : []),
    ];
    return { ok: true, orderNumber, whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageLines.join("\n"))}` };
  } catch {
    return { ok: false, error: "We could not save your inquiry. Please try again shortly." };
  }
}
