import Link from "next/link";
import { Package, ShoppingBag, Sparkles, Wallet } from "lucide-react";
import { StatusPill } from "@/components/admin/orders-table";
import { getDashboardStats } from "@/lib/admin-data";
import { isDefaultAdminPassword } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/format";

export default async function AdminHomePage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Pedidos", value: String(stats.orderCount), icon: ShoppingBag },
    { label: "En curso", value: String(stats.pendingCount), icon: Sparkles },
    { label: "Facturado", value: formatPrice(stats.revenue), icon: Wallet },
    {
      label: "Productos",
      value: `${stats.inStockCount}/${stats.productCount}`,
      icon: Package,
    },
  ];

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Taller</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Resumen</h1>
      {isDefaultAdminPassword() ? (
        <p className="mt-3 rounded-2xl border border-amber/40 bg-amber/15 px-4 py-3 text-sm">
          Estás usando la contraseña local por defecto. Definí{" "}
          <code className="font-semibold">ADMIN_PASSWORD</code> en <code>.env.local</code> antes de
          publicar.
        </p>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-3xl border border-ink/10 bg-surface p-5">
              <div className="flex items-center justify-between text-ink/45">
                <p className="text-xs font-bold uppercase tracking-wider">{card.label}</p>
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/pedidos"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper"
        >
          Ver pedidos
        </Link>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-full bg-magenta px-5 py-2.5 text-sm font-semibold text-white"
        >
          Subir producto
        </Link>
      </div>

      <h2 className="mt-10 font-display text-xl font-bold">Últimos pedidos</h2>
      {!stats.recentOrders.length ? (
        <p className="mt-3 text-sm text-ink/55">
          Todavía no hay pedidos. Cuando alguien compre, aparecen acá.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-ink/10 overflow-hidden rounded-3xl border border-ink/10 bg-surface">
          {stats.recentOrders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/admin/pedidos/${order.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-paper/80"
              >
                <div>
                  <p className="font-semibold">{order.customerName}</p>
                  <p className="text-xs text-ink/45">
                    {new Date(order.createdAt).toLocaleString("es-AR")} · {order.items.length}{" "}
                    {order.items.length === 1 ? "ítem" : "ítems"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={order.status} />
                  <p className="font-display font-bold">{formatPrice(order.total)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
