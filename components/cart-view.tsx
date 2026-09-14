"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { ProductMock } from "@/components/product-mock";
import { formatPrice, sideLabel } from "@/lib/format";
import { useCartStore, useCartTotal } from "@/lib/cart-store";
import type { CartItem, PrintPlacement, PrintSide } from "@/lib/types";
import { PRINT_SIDES } from "@/lib/types";

function cartPreviewSides(item: CartItem): PrintSide[] {
  const stamps = item.custom?.stamps ?? [];
  const sides = item.custom?.printSides ?? [];
  const found = PRINT_SIDES.filter(
    (side) => stamps.some((stamp) => stamp.side === side) || sides.includes(side),
  );
  return found.length ? found : ["front"];
}

function cartSidesLabel(item: CartItem) {
  const stamps = item.custom?.stamps ?? [];
  const parts = PRINT_SIDES.flatMap((side) => {
    const count = stamps.filter((stamp) => stamp.side === side).length;
    if (!count) return [];
    const name = sideLabel(side).toLowerCase();
    if (count === 1) return [name];
    return [`${count} en ${name}`];
  });
  if (parts.length) return ` · ${parts.join(" · ")}`;
  const sides = item.custom?.printSides ?? [];
  if (sides.length > 1) {
    return ` · ${sides.map((side) => sideLabel(side).toLowerCase()).join(" · ")}`;
  }
  if (sides[0]) return ` · ${sideLabel(sides[0]).toLowerCase()}`;
  return "";
}

function placementForSide(item: CartItem, side: PrintSide): PrintPlacement | undefined {
  if (side === "back") return item.custom?.placementBack ?? item.custom?.placement;
  if (side === "left") return item.custom?.placementLeft ?? item.custom?.placement;
  if (side === "right") return item.custom?.placementRight ?? item.custom?.placement;
  return item.custom?.placementFront ?? item.custom?.placement;
}

export function CartView() {
  const items = useCartStore((state) => state.items);
  const hydrated = useCartStore((state) => state.hydrated);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = useCartTotal();

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center py-10">
        <div className="w-40">
          <Mascot name="loading" alt="Cargando" size={240} />
        </div>
        <p className="mt-3 text-ink/50">Cargando carrito…</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-ink/20 bg-surface/50 px-6 py-12 text-center">
        <div className="mx-auto w-48">
          <Mascot name="keep-shopping-alt" alt="¡Sigue comprando!" size={280} />
        </div>
        <p className="mt-4 font-display text-2xl font-bold">El carrito está vacío</p>
        <p className="mt-2 text-ink/60">Personalizá una prenda o recorré la galería.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/personalizar"
            className="rounded-full bg-magenta px-5 py-3 font-display font-bold text-white"
          >
            Personalizar
          </Link>
          <Link href="/galeria" className="rounded-full border border-ink px-5 py-3 font-semibold">
            Ver galería
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-4 rounded-3xl border border-ink/10 bg-surface/70 p-4"
          >
            <div className="flex max-w-[11rem] shrink-0 flex-wrap gap-1">
              {cartPreviewSides(item).map((side) => (
                <div key={side} className="h-28 w-20 rounded-2xl bg-mock px-1">
                  <ProductMock
                    kind={item.productKind}
                    color={item.color ?? "#F7F4EF"}
                    design={item.design}
                    text={item.custom?.text}
                    textColor={item.custom?.textColor}
                    position={side === "back" ? "back" : item.custom?.position}
                    view={side}
                    stamps={item.custom?.stamps}
                    artworkUrl={item.custom?.artworkDataUrl}
                    placement={placementForSide(item, side)}
                  />
                </div>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display font-bold">{item.name}</p>
                  <p className="text-sm text-ink/55">
                    {item.kind === "custom" ? "Personalizado" : "Galería"}
                    {item.colorName ? ` · ${item.colorName}` : ""}
                    {item.size ? ` · ${item.size}` : ""}
                    {cartSidesLabel(item)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-ink/40 hover:text-magenta"
                  aria-label="Quitar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full border border-ink/10">
                  <button
                    type="button"
                    className="p-2"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Menos"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    className="p-2"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Más"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="font-semibold">{formatPrice(item.unitPrice * item.quantity)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-3xl bg-panel p-6 text-on-panel">
        <p className="text-xs uppercase tracking-[0.22em] text-amber">Resumen</p>
        <p className="mt-4 flex justify-between text-sm text-on-panel/70">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </p>
        <p className="mt-2 flex justify-between text-sm text-on-panel/70">
          <span>Envío</span>
          <span>A coordinar</span>
        </p>
        <p className="mt-4 flex justify-between font-display text-2xl font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </p>
        <Link
          href="/checkout"
          className="mt-6 block rounded-full bg-magenta py-3 text-center font-display font-bold text-white hover:bg-magenta-dark"
        >
          Continuar al checkout
        </Link>
      </aside>
    </div>
  );
}
