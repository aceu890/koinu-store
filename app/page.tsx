import Link from "next/link";
import {
  ArrowRight,
  Box,
  Coffee,
  HardHat,
  Images,
  Paintbrush,
  Palette,
  Printer,
  Shirt,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Mascot } from "@/components/mascot";
import { WelcomeMascot } from "@/components/welcome-mascot";
import { ProductGrid } from "@/components/product-card";
import { ProductMock } from "@/components/product-mock";
import { CUSTOMIZABLE_BASES } from "@/lib/catalog";
import { getFeaturedProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { InstagramStrip } from "@/components/instagram-strip";
import type { ProductKind } from "@/lib/types";

export const dynamic = "force-dynamic";

const BASE_ICONS: Record<ProductKind, typeof Shirt> = {
  shirt: Shirt,
  hoodie: Shirt,
  mug: Coffee,
  tote: ShoppingBag,
  cap: HardHat,
  print3d: Box,
};

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-magenta/20 blur-3xl" />
          <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-teal/15 blur-3xl" />
          <div className="halftone absolute inset-0" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-3 py-10 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              <Printer className="h-3.5 w-3.5 text-magenta" />
              Taller de sublimación
            </p>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
              Estampá
              <br />
              tu idea.
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink/70">
              Camisetas, buzos, tazas y merch. Subí tu diseño o escribí un texto y
              nosotros lo sublimamos.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/personalizar"
                className="btn-personaliza inline-flex items-center gap-3 rounded-full bg-magenta px-6 py-4 font-display text-xl font-extrabold text-white hover:bg-magenta-dark sm:px-8 sm:py-5 sm:text-2xl"
              >
                <Sparkles className="h-6 w-6" />
                Personaliza
              </Link>
              <Link
                href="/galeria"
                className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface/70 px-5 py-3 font-semibold transition hover:border-ink"
              >
                Ver galería <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <WelcomeMascot />
            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="rounded-2xl bg-surface/80 p-1.5 shadow transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <ProductMock kind="shirt" color="#171411" design="sakura" />
              </div>
              <div className="rounded-2xl bg-panel p-1.5 shadow transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <ProductMock kind="mug" color="#FFFFFF" design="buenos-dias" />
              </div>
              <div className="rounded-2xl bg-teal p-1.5 shadow transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <ProductMock kind="tote" color="#F5E6C8" design="mercado" />
              </div>
              <div className="rounded-2xl bg-surface/80 p-1.5 shadow transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <ProductMock kind="hoodie" color="#4B5563" design="koinu" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            {
              n: "01",
              t: "Elegí",
              d: "Prenda, taza o accesorio.",
              mascot: "vamos-mascot",
              href: "/personalizar",
            },
            {
              n: "02",
              t: "Personalizá",
              d: "Texto, imagen y posición.",
              mascot: "sending",
              href: "/personalizar",
            },
            {
              n: "03",
              t: "Recibí",
              d: "Producción y envío a tu puerta.",
              mascot: "shipping",
              href: "/personalizar",
            },
          ].map((step) => (
            <Link
              key={step.n}
              href={step.href}
              className="rounded-2xl border border-on-panel/10 bg-panel p-2.5 text-on-panel transition duration-200 hover:-translate-y-1 hover:border-magenta hover:shadow-[0_12px_28px_rgba(255,61,127,0.22)] sm:rounded-3xl sm:p-5"
            >
              <div className="mx-auto w-12 sm:w-28">
                <Mascot name={step.mascot} alt="" size={180} />
              </div>
              <p className="mt-1.5 font-display text-[10px] font-bold text-magenta sm:mt-2 sm:text-sm">
                {step.n}
              </p>
              <p className="mt-0.5 font-display text-[13px] font-bold sm:mt-1 sm:text-xl">{step.t}</p>
              <p className="mt-0.5 hidden text-[11px] leading-snug text-on-panel/65 sm:mt-1 sm:block sm:text-sm">
                {step.d}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-3 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-6 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden w-32 rounded-2xl bg-panel p-1.5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(255,61,127,0.2)] sm:block sm:rounded-3xl sm:p-2">
              <Mascot name="featured" alt="Productos destacados" size={200} />
            </div>
            <div>
              <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-ink/50 sm:text-xs">
                <Images className="h-3.5 w-3.5 text-magenta" />
                Galería
              </p>
              <h2 className="font-display text-xl font-bold sm:text-3xl">Ya hechos, listos para llevar</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden w-24 rounded-2xl bg-panel p-1.5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(255,61,127,0.2)] md:block sm:rounded-3xl sm:p-2">
              <Mascot name="new-products" alt="Nuevos productos" size={160} />
            </div>
            <Link
              href="/galeria"
              className="group/link inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-magenta"
            >
              Ver todos
              <ArrowRight className="h-4 w-4 transition group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="mx-auto max-w-6xl px-3 pb-12 sm:px-6 sm:pb-20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="w-16 shrink-0 rounded-2xl bg-panel p-1 transition duration-300 hover:-translate-y-1 sm:w-32 sm:rounded-3xl sm:p-2 sm:shadow-[0_12px_28px_rgba(22,18,15,0.16)] sm:hover:shadow-[0_14px_28px_rgba(255,61,127,0.22)]">
              <Mascot name="continue" alt="Continuar, vamos a ver más" size={220} />
            </div>
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/45 sm:text-xs">
                <Palette className="h-3.5 w-3.5 text-magenta" />
                Empezá acá
              </p>
              <h2 className="mt-0.5 font-display text-xl font-bold tracking-tight sm:mt-1 sm:text-3xl">
                Bases para personalizar
              </h2>
              <p className="mt-0.5 hidden max-w-sm text-sm leading-relaxed text-ink/60 sm:mt-1 sm:block">
                Elegí la prenda e ingresá al editor. Color, talle y diseño van después.
              </p>
            </div>
          </div>
          <Link
            href="/personalizar"
            className="group/cta hidden shrink-0 items-center justify-center gap-2 rounded-full bg-magenta px-5 py-3 font-display text-sm font-bold text-white hover:bg-magenta-dark sm:inline-flex"
          >
            <Paintbrush className="h-4 w-4" />
            Ir a personalizar
            <ArrowRight className="h-4 w-4 transition group-hover/cta:translate-x-0.5" />
          </Link>
        </div>

        <div className="rise-grid mt-4 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-4">
          {CUSTOMIZABLE_BASES.map((base) => {
            const Icon = BASE_ICONS[base.slug];
            return (
              <Link
                key={base.slug}
                href="/personalizar"
                className="group flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-[0_1px_2px_rgba(22,18,15,0.07)] transition duration-300 hover:-translate-y-1.5 hover:border-magenta hover:shadow-[0_14px_28px_rgba(255,61,127,0.16)] sm:rounded-3xl"
              >
                <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#2a211c,#16120f)] px-3 py-3 sm:aspect-4/5 sm:px-5 sm:py-4">
                  <span className="absolute left-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-surface/95 text-ink shadow-sm sm:left-3 sm:top-3 sm:h-9 sm:w-9">
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                  <div className="w-[78%] transition duration-500 group-hover:scale-110 group-hover:-rotate-2">
                    <ProductMock kind={base.slug} color={base.colors[0].hex} hidePrint />
                  </div>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-black/55 to-transparent pb-2.5 pt-8 opacity-0 transition duration-300 group-hover:opacity-100 sm:pb-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-magenta px-2.5 py-1 text-[10px] font-bold text-white sm:px-3 sm:text-xs">
                      Personalizar
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-2 py-2 sm:px-4 sm:py-3.5">
                  <p className="font-display text-sm font-bold leading-tight transition group-hover:text-magenta sm:text-lg">
                    {base.name}
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink/55 sm:mt-1 sm:text-sm">
                    desde {formatPrice(base.basePrice)}
                  </p>
                  <div className="mt-1.5 hidden flex-wrap gap-1.5 sm:mt-3 sm:flex">
                    {base.colors.slice(0, 6).map((color) => (
                      <span
                        key={color.hex}
                        className="h-3.5 w-3.5 rounded-full border border-ink/15 transition group-hover:scale-110"
                        style={{ background: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <InstagramStrip />
    </div>
  );
}
