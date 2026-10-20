"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { KoinuLoader } from "@/components/koinu-loader";
import { ProductMock } from "@/components/product-mock";
import { WebpayTrustBlock } from "@/components/webpay-marks";
import { formatPrice, sideLabel } from "@/lib/format";
import { cartWhatsAppHref } from "@/lib/whatsapp-order";
import { useCartStore, useCartTotal } from "@/lib/cart-store";
import type { CartItem, PrintPlacement, PrintSide } from "@/lib/types";
import { PRINT_SIDES } from "@/lib/types";

function cartPreviewSides(item: CartItem): PrintSide[] {
  const stamps = item.custom?.stamps ?? [];
  const sides = item.custom?.printSides ?? [];
  const found = PRINT_SIDES.filter(
    (side) =>
      stamps.some((stamp) => stamp.side === side) ||
      sides.includes(side) ||
      Boolean(item.custom?.text?.trim() && item.custom.textPlacements?.[side]),
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
    return <KoinuLoader page label="Cargando el carrito…" />;
  }

  if (!items.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-ink/20 bg-surface/50 px-6 py-12 text-center">
        <ShoppingBag className="mx-auto h-8 w-8 text-ink/30" aria-hidden />
        <p className="mt-4 font-display text-2xl font-bold">El carrito está vacío</p>
        <p className="mt-2 text-ink/60">Personaliza una prenda o recorre la galería.</p>
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
              {cartPreviewSides(item).map((side) => {
                const preview = item.custom?.previewBySide?.[side];
                return (
                  <div key={side} className="h-28 w-20 overflow-hidden rounded-2xl bg-mock px-1">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="" className="h-full w-full object-contain" />
                    ) : (
                      <ProductMock
                        kind={item.productKind}
                        color={item.color ?? "#F7F4EF"}
                        design={item.design}
                        text={item.custom?.text}
                        textColor={item.custom?.textColor}
                        textFont={item.custom?.textFont}
                        textPlacement={item.custom?.textPlacements?.[side] ?? null}
                        position={side === "back" ? "back" : item.custom?.position}
                        view={side}
                        stamps={item.custom?.stamps}
                        artworkUrl={item.custom?.artworkDataUrl}
                        placement={placementForSide(item, side)}
                      />
                    )}
                  </div>
                );
              })}
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
          className="btn-pago mt-6 block rounded-full py-3 text-center font-display font-bold text-white"
        >
          Continuar al pago
        </Link>
        <a
          href={cartWhatsAppHref(items, total)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 font-display font-bold text-white transition hover:bg-[#1ebe57]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
            <path d="M12.04 2c-5.5 0-9.96 4.45-9.96 9.94 0 1.75.46 3.46 1.33 4.97L2 22l5.24-1.37A9.94 9.94 0 0 0 12.04 22c5.5 0 9.96-4.46 9.96-9.96C22 6.45 17.54 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.61-2.89-1.25-4.77-4.16-4.92-4.35-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.26-.29.57-.36.76-.36h.54c.17 0 .41-.07.64.49.24.58.8 2 .87 2.14.07.14.12.31.02.5-.1.2-.14.31-.28.48-.14.16-.3.37-.42.49-.14.14-.28.29-.12.56.16.28.7 1.16 1.5 1.88 1.04.93 1.91 1.22 2.18 1.36.28.13.43.11.6-.07.16-.17.7-.81.89-1.09.19-.28.37-.23.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
          </svg>
          Comprar por WhatsApp
        </a>
        <p className="mt-2 text-center text-[11px] leading-relaxed text-on-panel/50">
          Se envían talla, color y ubicación. Las fotos del diseño las adjuntas tú en el chat.
        </p>
        <div className="mt-4">
          <WebpayTrustBlock onDark compact />
        </div>
      </aside>
    </div>
  );
}
