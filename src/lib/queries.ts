/**
 * Server-side data access helpers.
 * All functions in this file are SERVER-ONLY — they talk directly to the DB.
 * Do NOT import this file from client components.
 */

import { sql } from "@/lib/db";
import type { Category, Product } from "@/types";

export async function getActiveCategories(): Promise<Category[]> {
  const rows = await sql`
    SELECT id, name, slug, description, image_url, sort_order, is_active, created_at, updated_at
    FROM categories
    WHERE is_active = TRUE
    ORDER BY sort_order ASC, name ASC
  `;
  return rows as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const rows = await sql`
    SELECT id, name, slug, description, image_url, sort_order, is_active, created_at, updated_at
    FROM categories
    WHERE slug = ${slug} AND is_active = TRUE
    LIMIT 1
  `;
  return (rows[0] as Category) ?? null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await sql`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = TRUE AND p.is_featured = TRUE
    ORDER BY p.sort_order ASC
    LIMIT 8
  `;
  return rows as Product[];
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const rows = await sql`
    SELECT p.*
    FROM products p
    WHERE p.category_id = ${categoryId} AND p.is_active = TRUE
    ORDER BY p.sort_order ASC, p.name ASC
  `;
  return rows as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await sql`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ${slug} AND p.is_active = TRUE
    LIMIT 1
  `;
  return (rows[0] as Product) ?? null;
}

// ---- Admin queries ----

export async function getAllCategories(): Promise<Category[]> {
  const rows = await sql`
    SELECT * FROM categories ORDER BY sort_order ASC, name ASC
  `;
  return rows as Category[];
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await sql`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;
  return rows as Product[];
}
