"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { whatsappHref } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import type { StoreKit } from "@/lib/kits";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2c-5.5 0-9.96 4.45-9.96 9.94 0 1.75.46 3.46 1.33 4.97L2 22l5.24-1.37A9.94 9.94 0 0 0 12.04 22c5.5 0 9.96-4.46 9.96-9.96C22 6.45 17.54 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.61-2.89-1.25-4.77-4.16-4.92-4.35-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.26-.29.57-.36.76-.36h.54c.17 0 .41-.07.64.49.24.58.8 2 .87 2.14.07.14.12.31.02.5-.1.2-.14.31-.28.48-.14.16-.3.37-.42.49-.14.14-.28.29-.12.56.16.28.7 1.16 1.5 1.88 1.04.93 1.91 1.22 2.18 1.36.28.13.43.11.6-.07.16-.17.7-.81.89-1.09.19-.28.37-.23.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

export function KitCta({ kit }: { kit: StoreKit }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  function addToCart() {
    addItem({
      kind: "catalog",
      name: kit.name,
      unitPrice: kit.price,
      productSlug: kit.slug,
      productKind: kit.productKind,
      color: kit.color,
      colorName: kit.contents,
      size: kit.size ?? null,
    });
    router.push("/carrito");
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      {kit.action === "personalizar" ? (
        <Link
          href="/personalizar"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 font-display text-sm font-bold text-paper transition hover:-translate-y-0.5"
        >
          <Sparkles className="h-4 w-4" />
          Personalizar
        </Link>
      ) : (
        <button
          type="button"
          onClick={addToCart}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 font-display text-sm font-bold text-paper transition hover:-translate-y-0.5"
        >
          <ShoppingBag className="h-4 w-4" />
          Llevar
        </button>
      )}
      <a
        href={whatsappHref(
          `Hola Koinu Store, me interesa ${kit.name} (${kit.contents}) a ${formatPrice(kit.price)}.`,
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-4 text-sm font-semibold text-ink transition hover:bg-[#25D366]/18"
      >
        <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
        Pedir por WhatsApp
      </a>
    </div>
  );
}
