import Link from "next/link";
import type { Category } from "@/types";
import { CatalogMedia } from "@/components/storefront/CatalogMedia";

interface CategoryCardProps {
  category: Category;
  featured?: boolean;
}

export function CategoryCard({ category, featured = false }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`category-card group ${featured ? "category-card-featured" : ""}`}
      aria-label={`Browse ${category.name}`}
    >
      <CatalogMedia src={category.image_url} alt={category.image_alt || category.name} kind="category" />
      <div className="category-card-overlay" />
      <div className="category-card-copy">
        <p className="category-card-kicker">Collection {String(category.sort_order).padStart(2, "0")}</p>
        <h3 className="category-card-title">{category.name}</h3>
        {category.description ? <p className="category-card-description">{category.description}</p> : null}
        <span className="category-card-action">Explore collection <span aria-hidden="true">↗</span></span>
      </div>
    </Link>
  );
}
