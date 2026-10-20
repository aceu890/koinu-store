import { Gift, Percent } from "lucide-react";
import { KitCta } from "@/components/kit-cta";
import { STORE_KITS } from "@/lib/kits";
import { formatPrice } from "@/lib/format";

export function KitsOffers() {
  return (
    <section id="kits" className="mx-auto max-w-6xl px-3 pb-10 sm:px-6 sm:pb-14">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/45 sm:text-xs">
            <Gift className="h-3.5 w-3.5 text-magenta" />
            Combos
          </p>
          <h2 className="mt-0.5 font-display text-xl font-bold tracking-tight sm:mt-1 sm:text-3xl">
            Kits y ofertas
          </h2>
          <p className="mt-0.5 hidden max-w-md text-sm leading-relaxed text-ink/60 sm:mt-1 sm:block">
            Combos reales del taller y promociones del momento.
          </p>
        </div>
      </div>

      <div className="rise-grid mt-4 grid gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-4">
        {STORE_KITS.map((kit) => {
          const saved = kit.originalPrice ? kit.originalPrice - kit.price : 0;
          return (
            <article
              key={kit.id}
              className="flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-[0_1px_2px_rgba(22,18,15,0.07)] sm:rounded-3xl"
            >
              <div className="relative aspect-square overflow-hidden bg-mock">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={kit.imageUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-paper sm:left-3 sm:top-3 sm:px-2.5">
                  {kit.badge}
                </span>
                {saved > 0 ? (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-magenta px-2 py-0.5 text-[10px] font-bold text-white sm:right-3 sm:top-3">
                    <Percent className="h-3 w-3" />
                    Ahorras {formatPrice(saved)}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col px-3 py-3 sm:px-4 sm:py-4">
                <h3 className="font-display text-base font-bold leading-tight sm:text-lg">
                  {kit.name}
                </h3>
                <p className="mt-1 text-[12px] leading-relaxed text-ink/60 sm:text-sm">
                  {kit.blurb}
                </p>
                <p className="mt-2 text-[11px] text-ink/45 sm:text-xs">{kit.contents}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="font-display text-xl font-bold sm:text-2xl">
                    {formatPrice(kit.price)}
                  </p>
                  {kit.originalPrice ? (
                    <p className="text-sm text-ink/40 line-through">
                      {formatPrice(kit.originalPrice)}
                    </p>
                  ) : null}
                </div>
                <div className="mt-auto">
                  <KitCta kit={kit} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
