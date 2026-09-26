"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { getPool } from "@/lib/db";
import { getStoreSettings } from "@/lib/queries";

const cartItemSchema = z.object({
  productId: z.string(),
  productName: z.string().max(200),
  variantId: z.string(),
  quantity: z.number().int().min(1).max(99),
  pricePaise: z.number().optional(),
  variantName: z.string().optional(),
});

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name.").max(120),
  customerPhone: z.string().trim().min(10, "Please enter a valid phone number with city/network code.").max(30),
  customerEmail: z.string().trim().email("Please enter a valid email address.").or(z.literal("")).optional(),
  address: z.string().trim().min(6, "Please provide your complete street delivery address.").max(300),
  city: z.string().trim().min(2, "Please enter your city.").max(80),
  province: z.string().trim().max(80).optional(),
  postalCode: z.string().trim().max(20).optional(),
  customerNote: z.string().trim().max(500).optional(),
  cartJson: z.string().min(2, "Cart is empty."),
});

export type CheckoutState = {
  ok: boolean;
  orderNumber?: string;
  totalPaise?: number;
  whatsappUrl?: string;
  error?: string;
};

export async function submitCheckout(
  _prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail") || "",
    address: formData.get("address"),
    city: formData.get("city"),
    province: formData.get("province") || "",
    postalCode: formData.get("postalCode") || "",
    customerNote: formData.get("customerNote") || "",
    cartJson: formData.get("cartJson"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check all required fields." };
  }

  const data = parsed.data;

  let cartItems: z.infer<typeof cartItemSchema>[];
  try {
    const rawCart = JSON.parse(data.cartJson);
    const parsedCart = z.array(cartItemSchema).min(1, "Your cart is empty.").safeParse(rawCart);
    if (!parsedCart.success) {
      return { ok: false, error: "Your cart items are invalid. Please refresh the page." };
    }
    cartItems = parsedCart.data;
  } catch {
    return { ok: false, error: "Failed to process cart data." };
  }

  const storeSettings = await getStoreSettings().catch(() => ({
    whatsappPhone: "+923005599174",
  }));

  const cleanPhone = (storeSettings.whatsappPhone || "+923005599174").replace(/[^0-9]/g, "");
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `NHE-${randomSuffix}`;

  // Process cart lines
  let verifiedOrderLines: {
    productName: string;
    variantName: string;
    unitPricePaise: number;
    quantity: number;
    lineTotalPaise: number;
  }[] = [];
  let subtotalPaise = 0;

  try {
    const client = await getPool().connect();
    try {
      await client.query("BEGIN");
      const variantIds = cartItems.map((item) => item.variantId).filter((id) => id && id.length === 36);
      
      let variantMap = new Map();
      if (variantIds.length > 0) {
        const variantQuery = await client.query(
          `SELECT
            pv.id AS variant_id,
            pv.product_id,
            pv.name AS variant_name,
            p.name AS product_name,
            pv.price_paise
          FROM product_variants pv
          JOIN products p ON p.id = pv.product_id
          WHERE pv.id = ANY($1::uuid[])`,
          [variantIds]
        );
        variantMap = new Map(variantQuery.rows.map((row) => [row.variant_id, row]));
      }

      for (const item of cartItems) {
        const v = variantMap.get(item.variantId);
        const price = v ? Number(v.price_paise) : (item.pricePaise || 50000);
        const pName = v ? v.product_name : item.productName;
        const vName = v ? v.variant_name : (item.variantName || "");
        const lineTotal = price * item.quantity;
        subtotalPaise += lineTotal;
        verifiedOrderLines.push({
          productName: pName,
          variantName: vName,
          unitPricePaise: price,
          quantity: item.quantity,
          lineTotalPaise: lineTotal,
        });
      }

      const orderId = randomUUID();

      // Insert Order record if table exists
      await client.query(
        `INSERT INTO orders (
          id, order_number, status, customer_name, customer_email, customer_phone,
          address_line1, city, state, province, postal_code, country,
          subtotal_paise, shipping_paise, discount_paise, total_paise, currency,
          payment_method, payment_status, customer_note
        ) VALUES (
          $1, $2, 'pending', $3, $4, $5,
          $6, $7, $8, $9, $10, 'PK',
          $11, 0, 0, $11, 'PKR',
          'whatsapp', 'pending', $12
        )`,
        [
          orderId,
          orderNumber,
          data.customerName,
          data.customerEmail || null,
          data.customerPhone,
          data.address,
          data.city,
          data.province || data.city,
          data.province || null,
          data.postalCode || null,
          subtotalPaise,
          data.customerNote || null,
        ]
      ).catch(() => {/* DB insert optional */});

      await client.query("COMMIT").catch(() => {});
    } finally {
      client.release();
    }
  } catch {
    /* Fallback */
    subtotalPaise = cartItems.reduce((acc, item) => acc + (item.pricePaise || 50000) * item.quantity, 0);
    verifiedOrderLines = cartItems.map((item) => ({
      productName: item.productName,
      variantName: item.variantName || "",
      unitPricePaise: item.pricePaise || 50000,
      quantity: item.quantity,
      lineTotalPaise: (item.pricePaise || 50000) * item.quantity,
    }));
  }

  const formatPkr = (paise: number) => `Rs. ${(paise / 100).toLocaleString("en-PK")}`;

  const todayDate = new Date().toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Build Premium WhatsApp message content
  const itemLines = verifiedOrderLines
    .map(
      (line, index) =>
        `  ${index + 1}️⃣ *${line.productName}* ${line.variantName ? `(${line.variantName})` : ""}\n      Qty: *${line.quantity}*  |  Price: *${formatPkr(line.lineTotalPaise)}*`
    )
    .join("\n\n");

  const messageText = `✨ *NOOR HERBAL ENTERPRISES* ✨
📜 *OFFICIAL ORDER CONFIRMATION*

━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 *ORDER REF:* #${orderNumber}
📅 *DATE:* ${todayDate}
━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *CUSTOMER DETAILS*
▫️ *Full Name:* ${data.customerName}
▫️ *Phone / WhatsApp:* ${data.customerPhone}
${data.customerEmail ? `▫️ *Email:* ${data.customerEmail}\n` : ""}▫️ *City / Region:* ${data.city}${data.province ? `, ${data.province}` : ""}
▫️ *Delivery Address:* ${data.address}
${data.customerNote && data.customerNote.trim().toLowerCase() !== "no" ? `▫️ *Special Instructions:* ${data.customerNote}\n` : ""}
🛒 *ORDERED ITEMS*
${itemLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 *PAYMENT & BILL SUMMARY*
▫️ *Products Subtotal:* ${formatPkr(subtotalPaise)}
▫️ *Delivery Charges:* 💬 *To be confirmed via Chat*
👉 *GRAND TOTAL:* *${formatPkr(subtotalPaise)}* _(Excl. Delivery)_
━━━━━━━━━━━━━━━━━━━━━━━━━━

🌿 *Thank you for choosing Noor Herbal Enterprises!*
We prepare every jar and formula with natural care. Please confirm delivery timing.`;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;

  return {
    ok: true,
    orderNumber,
    totalPaise: subtotalPaise,
    whatsappUrl,
  };
}
