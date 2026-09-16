import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { ProductVisual } from "@/components/product-visual";
import { Mascot } from "@/components/mascot";
import { formatPrice } from "@/lib/format";
import { pastelBackdrop, pastelFill } from "@/lib/pastels";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  pastelIndex,
  pastelMode = "gradient",
}: {
  product: Product;
  pastelIndex?: number;
  pastelMode?: "gradient" | "solid";
}) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/8 bg-surface shadow-[0_1px_2px_rgba(22,18,15,0.07)] transition duration-300 hover:-translate-y-1.5 hover:border-magenta hover:shadow-[0_14px_28px_rgba(255,61,127,0.16)] sm:rounded-2xl"
    >
      <div
        className={`relative aspect-square overflow-hidden ${pastelIndex == null ? "bg-mock" : ""}`}
        style={
          pastelIndex == null
            ? undefined
            : pastelMode === "solid"
              ? pastelFill(pastelIndex)
              : pastelBackdrop(pastelIndex)
        }
      >
        {product.featured ? (
          <span className="absolute left-1.5 top-1.5 z-10 inline-flex items-center gap-1 rounded-full bg-ink px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-paper sm:left-2.5 sm:top-2.5 sm:px-2 sm:text-[10px]">
            <Star className="h-2.5 w-2.5 fill-amber text-amber sm:h-3 sm:w-3" />
            Destacado
          </span>
        ) : null}
        <span className="absolute right-1.5 top-1.5 z-10 grid h-7 w-7 place-items-center rounded-full bg-ink/80 text-paper opacity-0 shadow transition duration-300 group-hover:opacity-100 sm:right-2.5 sm:top-2.5 sm:h-8 sm:w-8">
          <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
        {product.imageUrl ? (
          <ProductVisual
            product={product}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-2.5 transition duration-500 group-hover:scale-110 sm:p-5">
            <div className="w-[82%] sm:w-[78%]">
              <ProductVisual product={product} />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-2 py-2 sm:px-3.5 sm:py-3">
        <p className="hidden text-[10px] uppercase tracking-[0.16em] text-ink/40 sm:block">
          {product.category}
        </p>
        <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-ink/90 transition group-hover:text-magenta sm:mt-1 sm:font-display sm:text-base sm:font-bold">
          {product.name}
        </h3>
        <p className="mt-auto pt-1.5 font-display text-[15px] font-bold sm:pt-2 sm:text-lg">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

export function ProductGrid({
  products,
  pastel,
}: {
  products: Product[];
  pastel?: boolean | "gradient" | "solid";
}) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/20 p-8 text-center sm:p-10">
        <div className="mx-auto w-32 sm:w-44">
          <Mascot name="no-products" alt="Sin productos" size={260} />
        </div>
        <p className="mt-3 text-sm text-ink/60">No hay productos en esta categoría todavía.</p>
      </div>
    );
  }

  const pastelMode = pastel === "solid" ? "solid" : pastel ? "gradient" : undefined;

  return (
    <div className="rise-grid grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          pastelIndex={pastelMode ? index : undefined}
          pastelMode={pastelMode}
        />
      ))}
    </div>
  );
}
