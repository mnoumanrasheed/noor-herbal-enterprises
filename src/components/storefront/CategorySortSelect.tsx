"use client";

import React from "react";

interface CategorySortSelectProps {
  defaultValue: string;
}

export function CategorySortSelect({ defaultValue }: CategorySortSelectProps) {
  return (
    <select
      id="sort-select"
      name="sort"
      defaultValue={defaultValue}
      onChange={(e) => e.target.form?.requestSubmit()}
      className="rounded-xl border border-[#332f28] bg-[#161412] px-3 py-2 text-xs text-[#d8d2c7] focus:border-[#c9a84c] focus:outline-none cursor-pointer"
    >
      <option value="featured">Featured First</option>
      <option value="newest">Newest Additions</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="name_asc">Name: A to Z</option>
      <option value="name_desc">Name: Z to A</option>
    </select>
  );
}
