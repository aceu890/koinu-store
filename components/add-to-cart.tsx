"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function AddToCart({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [size, setSize] = useState(product.sizes[0] ?? null);
  const [qty, setQty] = useState(1);

  function add(goToCart = false) {
    addItem({
      kind: "catalog",
      name: product.name,
      unitPrice: product.price,
      quantity: qty,
      productSlug: product.slug,
      productKind: product.kind,
      color: product.colors[0],
      size,
      design: product.design,
    });
    if (goToCart) router.push("/carrito");
  }

  return (
    <div className="mt-8">
      {product.sizes.length ? (
        <>
          <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Talle</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSize(item)}
                className={`min-w-12 rounded-full border px-3 py-2 text-sm font-semibold ${
                  size === item ? "border-ink bg-ink text-paper" : "border-ink/15"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </>
      ) : null}

      <div className="mt-5 flex items-center gap-3">
        <span className="text-sm">Cantidad</span>
        <input
          type="number"
          min={1}
          max={20}
          value={qty}
          onChange={(event) => setQty(Number(event.target.value) || 1)}
          className="w-20 rounded-xl border border-ink/10 px-3 py-2"
        />
      </div>

      <p className="mt-4 font-display text-3xl font-bold">{formatPrice(product.price * qty)}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => add(false)}
          className="rounded-full border border-ink px-6 py-3 font-semibold"
        >
          Agregar al carrito
        </button>
        <button
          type="button"
          onClick={() => add(true)}
          className="rounded-full bg-magenta px-6 py-3 font-display font-bold text-white hover:bg-magenta-dark"
        >
          Comprar ahora
        </button>
      </div>
    </div>
  );
}
