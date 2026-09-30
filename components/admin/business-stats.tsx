import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { percentChange, type BusinessStats } from "@/lib/business-stats";

function Delta({ current, previous, suffix }: { current: number; previous: number; suffix: string }) {
  const change = percentChange(current, previous);
  if (!previous && !current) {
    return <p className="mt-1 text-xs text-ink/45">Sin datos aún</p>;
  }
  const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
  const tone = change > 0 ? "text-teal" : change < 0 ? "text-magenta-dark" : "text-ink/45";
  return (
    <p className={`mt-1 inline-flex items-center gap-0.5 text-xs font-semibold ${tone}`}>
      <Icon className="h-3.5 w-3.5" />
      {change === 0 ? "Igual" : `${change > 0 ? "+" : ""}${change}%`} {suffix}
    </p>
  );
}

export function BusinessStatsView({ stats }: { stats: BusinessStats }) {
  const maxWeek = Math.max(...stats.weeks.map((week) => week.revenue), 1);
  const mixTotal = stats.customQty + stats.catalogQty;
  const customPct = mixTotal ? Math.round((stats.customQty / mixTotal) * 100) : 0;

  const cards = [
    {
      label: "Este mes",
      value: formatPrice(stats.thisMonth.revenue),
      current: stats.thisMonth.revenue,
      previous: stats.lastMonth.revenue,
      suffix: "vs mes anterior",
    },
    {
      label: "Pedidos del mes",
      value: String(stats.thisMonth.orders),
      current: stats.thisMonth.orders,
      previous: stats.lastMonth.orders,
      suffix: "vs mes anterior",
    },
    {
      label: "Ticket promedio",
      value: formatPrice(stats.thisMonth.ticket),
      current: stats.thisMonth.ticket,
      previous: stats.lastMonth.ticket,
      suffix: "vs mes anterior",
    },
    {
      label: "Últimos 30 días",
      value: formatPrice(stats.last30.revenue),
      current: stats.last30.revenue,
      previous: stats.prev30.revenue,
      suffix: "vs 30 días antes",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-ink/10 bg-surface p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink/45">{card.label}</p>
            <p className="mt-2 font-display text-2xl font-bold leading-none">{card.value}</p>
            <Delta current={card.current} previous={card.previous} suffix={card.suffix} />
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-2xl border border-ink/10 bg-surface p-4 sm:p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold">Ventas por semana</h2>
              <p className="text-xs text-ink/50">Las últimas 8 semanas, sin cancelados.</p>
            </div>
            <p className="text-sm font-semibold text-ink/70">
              Total histórico {formatPrice(stats.allTime.revenue)}
            </p>
          </div>
          <div className="mt-4">
            <div className="flex h-32 items-end gap-1.5 sm:h-40 sm:gap-2">
              {stats.weeks.map((week) => {
                const height = week.revenue ? Math.max(8, Math.round((week.revenue / maxWeek) * 100)) : 3;
                return (
                  <div key={week.key} className="flex h-full min-w-0 flex-1 items-end" title={`${week.orders} pedidos · ${formatPrice(week.revenue)}`}>
                    <div
                      className="w-full rounded-t-md bg-magenta/80"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-1 flex gap-1.5 sm:gap-2">
              {stats.weeks.map((week) => (
                <span
                  key={`${week.key}-label`}
                  className="min-w-0 flex-1 truncate text-center text-[9px] font-semibold uppercase text-ink/45 sm:text-[10px]"
                >
                  {week.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-surface p-4 sm:p-5">
          <h2 className="font-display text-lg font-bold">Taller ahora</h2>
          <p className="text-xs text-ink/50">Pedidos activos y ya salidos.</p>
          <dl className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-amber/15 px-3 py-3">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-ink/45">En curso</dt>
              <dd className="mt-1 font-display text-2xl font-bold">{stats.inProgress}</dd>
            </div>
            <div className="rounded-xl bg-teal/15 px-3 py-3">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-ink/45">Listos</dt>
              <dd className="mt-1 font-display text-2xl font-bold">{stats.done}</dd>
            </div>
          </dl>
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">Qué se vende</p>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full bg-magenta" style={{ width: `${customPct}%` }} />
            </div>
            <p className="mt-2 text-xs text-ink/60">
              {customPct}% personalizado
              {mixTotal ? ` · ${stats.customQty} vs ${stats.catalogQty} de galería` : " · todavía no hay ventas"}
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-ink/10 bg-surface p-4 sm:p-5">
        <h2 className="font-display text-lg font-bold">Lo más pedido</h2>
        <p className="text-xs text-ink/50">Por cantidad, en todos los pedidos activos.</p>
        {!stats.topProducts.length ? (
          <p className="mt-4 text-sm text-ink/55">Cuando entren pedidos, acá vas a ver qué se lleva más.</p>
        ) : (
          <ul className="mt-3 divide-y divide-ink/10">
            {stats.topProducts.map((product, index) => (
              <li key={product.name} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {index + 1}. {product.name}
                  </p>
                  <p className="text-xs text-ink/45">
                    {product.quantity} {product.quantity === 1 ? "unidad" : "unidades"}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold">{formatPrice(product.revenue)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
