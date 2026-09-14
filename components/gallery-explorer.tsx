"use client";

import { useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-card";
import type { Product } from "@/lib/types";

export function GalleryExplorer({ products }: { products: Product[] }) {
  const [category, setCategory] = useState("todos");

  const filtered = useMemo(
    () =>
      category === "todos"
        ? products
        : products.filter((product) => product.category === category),
    [category, products],
  );

  return (
    <div>
      <div className="-mx-3 mb-4 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:mx-0 sm:mb-8 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setCategory(item.slug)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold sm:px-4 sm:py-2 sm:text-sm ${
              category === item.slug ? "bg-ink text-paper" : "bg-surface text-ink/70 shadow-sm"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <ProductGrid products={filtered} />
    </div>
  );
}
