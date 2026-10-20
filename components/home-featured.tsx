import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import { ProductGrid } from "@/components/product-card";
import { getFeaturedProducts } from "@/lib/products";

export async function HomeFeatured() {
  const featured = await getFeaturedProducts();

  return (
    <section className="mx-auto max-w-6xl px-3 pb-12 sm:px-6 sm:pb-20">
      <div className="mb-4 flex items-end justify-between gap-3 sm:mb-6">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-ink/50 sm:text-xs">
            <Images className="h-3.5 w-3.5 text-magenta" />
            Galería
          </p>
          <h2 className="font-display text-xl font-bold sm:text-3xl">Ya hechos, listos para llevar</h2>
        </div>
        <Link
          href="/galeria"
          className="group/link inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-magenta"
        >
          Ver todos
          <ArrowRight className="h-4 w-4 transition group-hover/link:translate-x-0.5" />
        </Link>
      </div>
      <ProductGrid products={featured} pastel="solid" />
    </section>
  );
}

export function HomeFeaturedFallback() {
  return (
    <section className="mx-auto max-w-6xl px-3 pb-12 sm:px-6 sm:pb-20">
      <div className="mb-4 h-10 w-48 rounded-lg bg-ink/5 sm:mb-6" />
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
        {Array.from({ length: 9 }, (_, index) => (
          <div key={index} className="aspect-square rounded-xl bg-ink/5 sm:rounded-2xl" />
        ))}
      </div>
    </section>
  );
}
