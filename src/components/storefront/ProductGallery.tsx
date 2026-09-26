"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types";

interface ProductGalleryProps {
  images?: ProductImage[];
  productName: string;
}

export function ProductGallery({ images = [], productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = images[selectedIndex] ?? images[0];

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square w-full rounded-2xl border border-[#2a2620] bg-[#141210] flex items-center justify-center">
        <span className="text-xs uppercase tracking-widest text-[#665f54]">Noor Herbal</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main High-Resolution Image Display */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#2a2620] bg-[#141210] shadow-2xl">
        <Image
          src={activeImage.url}
          alt={activeImage.alt_text ?? productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />
      </div>

      {/* Thumbnails Row if multiple images */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2" role="tablist" aria-label="Product image thumbnails">
          {images.map((image, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={image.id || idx}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedIndex(idx)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition-all ${
                  isSelected
                    ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30 scale-105"
                    : "border-[#2a2620] opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt_text ?? `${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
