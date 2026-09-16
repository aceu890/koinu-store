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
import { pastelFill } from "@/lib/pastels";
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

const FLOW_STEPS = [
  {
    n: "01",
    t: "Elige",
    d: "Prenda, taza o accesorio.",
    mascot: "vamos-mascot",
  },
  {
    n: "02",
    t: "Personaliza",
    d: "Texto, imagen y posición.",
    mascot: "sending",
  },
  {
    n: "03",
    t: "Recibe",
    d: "Producción y envío a tu puerta.",
    mascot: "shipping",
  },
] as const;

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
              Estampa
              <br />
              tu idea.
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink/70">
              Camisetas, polerones, tazas y merch. Sube tu diseño o escribe un texto y
              nosotros lo sublimamos.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/personalizar"
                className="btn-personaliza inline-flex items-center gap-3 rounded-full px-6 py-4 font-display text-xl font-extrabold text-white sm:px-8 sm:py-5 sm:text-2xl"
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
            <div className="mt-4 hidden grid-cols-4 gap-2 sm:grid">
              {(
                [
                  { kind: "shirt", color: "#171411", design: "sakura" },
                  { kind: "mug", color: "#FFFFFF", design: "buenos-dias" },
                  { kind: "tote", color: "#F5E6C8", design: "mercado" },
                  { kind: "hoodie", color: "#F5E6C8", design: "koinu" },
                ] as const
              ).map((item, index) => (
                <div
                  key={item.kind}
                  className="rounded-2xl p-1.5 shadow transition duration-300 hover:-translate-y-1 hover:shadow-md"
                  style={pastelFill(index)}
                >
                  <ProductMock kind={item.kind} color={item.color} design={item.design} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-3 py-7 sm:px-6 sm:py-10">
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface sm:rounded-[2rem]">
          <div className="grid grid-cols-3">
            {FLOW_STEPS.map((step, index) => (
              <Link
                key={step.n}
                href="/personalizar"
                className={`group relative flex flex-col items-center px-2 py-5 text-center transition duration-200 hover:bg-magenta/[0.06] sm:px-6 sm:py-8 ${
                  index > 0 ? "border-l border-ink/10" : ""
                }`}
              >
                {index < FLOW_STEPS.length - 1 ? (
                  <span className="pointer-events-none absolute -right-3 top-[38%] z-10 hidden h-6 w-6 place-items-center rounded-full bg-surface text-magenta shadow-sm ring-1 ring-ink/10 sm:grid">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                ) : null}
                <span className="grid h-6 w-6 place-items-center rounded-full bg-magenta text-[10px] font-bold text-white sm:h-7 sm:w-7 sm:text-[11px]">
                  {step.n.replace(/^0/, "")}
                </span>
                <div className="relative mt-3 w-16 sm:mt-5 sm:w-32">
                  <div className="mascot-flow relative z-10 transition duration-300 group-hover:-translate-y-1 group-hover:scale-105">
                    <Mascot name={step.mascot} alt="" size={220} />
                  </div>
                  <span className="pointer-events-none absolute bottom-[8%] left-1/2 h-2.5 w-[68%] -translate-x-1/2 rounded-[100%] bg-[rgba(22,18,15,0.28)] blur-[7px] transition duration-300 group-hover:w-[54%] group-hover:opacity-60 sm:h-4 sm:blur-[10px]" />
                </div>
                <p className="mt-3 font-display text-sm font-bold sm:mt-4 sm:text-2xl">{step.t}</p>
                <p className="mt-1 max-w-[14rem] text-[10px] leading-snug text-ink/50 sm:mt-1.5 sm:text-sm">
                  {step.d}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-3 py-8 sm:px-6 sm:py-12">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/45 sm:text-xs">
              <Palette className="h-3.5 w-3.5 text-magenta" />
              Empieza aquí
            </p>
            <h2 className="mt-0.5 font-display text-xl font-bold tracking-tight sm:mt-1 sm:text-3xl">
              Bases para personalizar
            </h2>
            <p className="mt-0.5 hidden max-w-sm text-sm leading-relaxed text-ink/60 sm:mt-1 sm:block">
              Elige la prenda e ingresa al editor. Color, talla y diseño van después.
            </p>
          </div>
          <Link
            href="/personalizar"
            className="bg-personaliza group/cta hidden shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 font-display text-sm font-bold text-white sm:inline-flex"
          >
            <Paintbrush className="h-4 w-4" />
            Ir a personalizar
            <ArrowRight className="h-4 w-4 transition group-hover/cta:translate-x-0.5" />
          </Link>
        </div>

        <div className="rise-grid mt-4 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-4">
          {CUSTOMIZABLE_BASES.map((base, index) => {
            const Icon = BASE_ICONS[base.slug];
            return (
              <Link
                key={base.slug}
                href="/personalizar"
                className="group flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-[0_1px_2px_rgba(22,18,15,0.07)] transition duration-300 hover:-translate-y-1.5 hover:border-magenta hover:shadow-[0_14px_28px_rgba(255,61,127,0.16)] sm:rounded-3xl"
              >
                <div
                  className="relative flex aspect-square items-center justify-center overflow-hidden px-3 py-3 sm:aspect-4/5 sm:px-5 sm:py-4"
                  style={pastelFill(index)}
                >
                  <span className="absolute left-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/85 text-ink shadow-sm sm:left-3 sm:top-3 sm:h-9 sm:w-9">
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                  <div className="w-[78%] transition duration-500 group-hover:scale-110 group-hover:-rotate-2">
                    <ProductMock kind={base.slug} color={base.colors[0].hex} hidePrint />
                  </div>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-ink/25 to-transparent pb-2.5 pt-8 opacity-0 transition duration-300 group-hover:opacity-100 sm:pb-3.5">
                    <span className="bg-personaliza inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white sm:px-3 sm:text-xs">
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

      <section className="mx-auto max-w-6xl px-3 pb-12 sm:px-6 sm:pb-20">
        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-6 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden w-32 sm:block">
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

      <InstagramStrip />
    </div>
  );
}
