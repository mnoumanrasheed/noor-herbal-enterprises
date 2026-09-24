import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

// Placeholder gradient backgrounds per category (used until real images are added)
const CATEGORY_GRADIENTS: Record<string, string> = {
  chutney: "from-green-800 to-green-600",
  pickles: "from-yellow-800 to-amber-600",
  oils:    "from-orange-900 to-orange-600",
  shampoo: "from-purple-900 to-purple-600",
};

export function CategoryCard({ category }: CategoryCardProps) {
  const gradient = CATEGORY_GRADIENTS[category.slug] ?? "from-[#1c1c1c] to-[#4a4a4a]";

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block overflow-hidden rounded-[12px] bg-[#0f0f0f]"
      aria-label={`Browse ${category.name}`}
    >
      {/* Image or gradient placeholder */}
      <div className={`aspect-[4/3] w-full bg-gradient-to-br ${gradient}`}>
        {category.image_url && (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
      </div>

      {/* Gold overlay bar at bottom */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4">
        <h3 className="font-display text-xl font-semibold text-white">{category.name}</h3>
        {category.description && (
          <p className="mt-1 line-clamp-1 text-xs text-[#d4cfc5]">{category.description}</p>
        )}
        <span
          className="mt-2 inline-block text-xs font-medium text-[#c9a84c] group-hover:underline"
          aria-hidden="true"
        >
          Shop now →
        </span>
      </div>
    </Link>
  );
}
