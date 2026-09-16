import type { Metadata } from "next";
import { Mascot } from "@/components/mascot";
import { GalleryExplorer } from "@/components/gallery-explorer";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Galería",
  description: "Productos de sublimación y estampados ya listos.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-6 sm:py-12">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink/50 sm:text-xs">Catálogo</p>
          <h1 className="mt-1 font-display text-2xl font-bold sm:mt-2 sm:text-4xl">Galería de productos</h1>
          <p className="mt-2 max-w-xl text-sm text-ink/70 sm:mt-3 sm:text-base">
            Piezas que ya salieron del taller. Si prefieres algo único, usa Personaliza.
          </p>
        </div>
        <div className="hidden w-36 sm:block">
          <Mascot name="search" alt="Encuentra lo que necesitas" size={220} />
        </div>
      </div>
      <div className="mt-6 sm:mt-10">
        <GalleryExplorer products={products} />
      </div>
    </div>
  );
}
