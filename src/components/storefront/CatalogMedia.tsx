"use client";

import Image from "next/image";
import { useState } from "react";

interface CatalogMediaProps {
  src?: string | null;
  alt: string;
  kind?: "category" | "product";
  className?: string;
}

export function CatalogMedia({ src, alt, kind = "product", className = "" }: CatalogMediaProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`catalog-media catalog-media-${kind} ${className}`}>
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={kind === "category" ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 78vw, 280px"}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="catalog-media-fallback" aria-label={`${alt} image unavailable`}>
          <span aria-hidden="true" className="catalog-media-fallback-mark" />
          <span className="catalog-media-fallback-label">Image forthcoming</span>
        </div>
      )}
    </div>
  );
}
