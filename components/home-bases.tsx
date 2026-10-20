"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Coffee,
  HardHat,
  Paintbrush,
  Palette,
  Shirt,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { BasePreview } from "@/components/base-preview";
import { CUSTOMIZABLE_BASES } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { pastelFill } from "@/lib/pastels";
import type { ProductKind } from "@/lib/types";

const BASE_ICONS: Partial<Record<ProductKind, typeof Shirt>> = {
  shirt: Shirt,
  hoodie: Shirt,
  mug: Coffee,
  tote: ShoppingBag,
  cap: HardHat,
};

function BaseCard({
  slug,
  name,
  basePrice,
  colors,
  index,
}: (typeof CUSTOMIZABLE_BASES)[number] & { index: number }) {
  const Icon = BASE_ICONS[slug] ?? Shirt;
  return (
    <Link
      href="/personalizar"
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-[0_1px_2px_rgba(22,18,15,0.07)] transition duration-300 hover:-translate-y-1.5 hover:border-magenta hover:shadow-[0_14px_28px_rgba(255,61,127,0.16)] sm:rounded-3xl"
    >
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden px-4 py-4 sm:px-5 sm:py-5"
        style={pastelFill(index)}
      >
        <span className="absolute left-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/85 text-ink shadow-sm sm:left-3 sm:top-3 sm:h-9 sm:w-9">
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
        <div className="w-[78%]">
          <BasePreview kind={slug} color={colors[0].hex} delayMs={index * 400} />
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
          {name}
        </p>
        <p className="mt-0.5 text-[12px] text-ink/55 sm:mt-1 sm:text-sm">
          desde {formatPrice(basePrice)}
        </p>
        <div className="mt-1.5 hidden flex-wrap gap-1.5 sm:mt-3 sm:flex">
          {colors.slice(0, 6).map((color) => (
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
}

function BasesSlider() {
  const [index, setIndex] = useState(0);
  const total = CUSTOMIZABLE_BASES.length;

  function go(step: number) {
    setIndex((current) => (current + step + total) % total);
  }

  return (
    <div className="relative mt-4">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {CUSTOMIZABLE_BASES.map((base, slide) => (
            <div key={base.slug} className="w-full shrink-0">
              <BaseCard {...base} index={slide} />
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex aspect-square items-center justify-between px-2">
        <button
          type="button"
          aria-label="Base anterior"
          onClick={() => go(-1)}
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white/95 text-ink shadow-md ring-1 ring-ink/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Siguiente base"
          onClick={() => go(1)}
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white/95 text-ink shadow-md ring-1 ring-ink/10"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-3 flex justify-center gap-2">
        {CUSTOMIZABLE_BASES.map((base, slide) => (
          <button
            key={base.slug}
            type="button"
            aria-label={`Ver ${base.name}`}
            onClick={() => setIndex(slide)}
            className={`h-2 rounded-full transition ${
              slide === index ? "w-6 bg-magenta" : "w-2 bg-ink/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function HomeBases() {
  return (
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

      <div className="sm:hidden">
        <BasesSlider />
      </div>
      <div className="mt-8 hidden gap-4 sm:grid sm:grid-cols-3">
        {CUSTOMIZABLE_BASES.map((base, index) => (
          <BaseCard key={base.slug} {...base} index={index} />
        ))}
        <Link
          href="/personalizar"
          className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-[0_1px_2px_rgba(22,18,15,0.07)] transition duration-300 hover:-translate-y-1.5 hover:border-magenta hover:shadow-[0_14px_28px_rgba(255,61,127,0.16)] sm:rounded-3xl"
        >
          <div className="bg-personaliza relative flex aspect-square items-center justify-center overflow-hidden px-5 py-5">
            <span className="absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-magenta shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="flex flex-col items-center text-center text-white">
              <Sparkles className="h-12 w-12 opacity-90" />
              <p className="mt-3 font-display text-2xl font-extrabold leading-tight">
                Entra y
                <br />
                personaliza
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col px-4 py-3.5">
            <p className="font-display text-lg font-bold leading-tight transition group-hover:text-magenta">
              Tu idea, tu prenda
            </p>
            <p className="mt-1 text-sm text-ink/55">Color, talla y diseño en el editor.</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-magenta">
              Empezar
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
