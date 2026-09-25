import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";

const cartSchema = z.array(z.object({
  productId: z.string().uuid(),
  productName: z.string().max(200),
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
})).min(1).max(30);

export async function POST(request: Request) {
  const parsed = cartSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "The cart contains invalid items." }, { status: 400 });
  const variantIds = [...new Set(parsed.data.map((item) => item.variantId))];
  const rows = await sql`
    SELECT pv.id AS variant_id, pv.product_id, pv.name AS variant_name, pv.sku, pv.price_paise,
      p.name AS product_name, p.slug AS product_slug,
      i.quantity AS stock_quantity,
      (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order, created_at LIMIT 1) AS image_url
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN inventory i ON i.variant_id = pv.id
    WHERE pv.id = ANY(${variantIds}::uuid[]) AND pv.is_active = TRUE AND p.is_active = TRUE AND c.is_active = TRUE
  `;
  return NextResponse.json({ lines: rows });
}
