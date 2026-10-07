import Link from "next/link";
import { Package, ShoppingBag, Sparkles, Wallet } from "lucide-react";
import { StatusPill } from "@/components/admin/orders-table";
import { getDashboardStats } from "@/lib/admin-data";
import { isDefaultAdminPassword } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/format";
import { isSupabaseConfigured, isSupabaseWriteConfigured } from "@/lib/supabase/config";

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
      <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Resumen</h1>
      {isDefaultAdminPassword() ? (
        <p className="mt-3 rounded-2xl border border-amber/40 bg-amber/15 px-4 py-3 text-sm">
          Estás usando la contraseña local por defecto. Definí{" "}
          <code className="font-semibold">ADMIN_PASSWORD</code> en <code>.env.local</code> antes de
          publicar.
        </p>
      ) : null}
      {!isSupabaseConfigured() ? (
        <p className="mt-3 rounded-2xl border border-ink/10 bg-surface px-4 py-3 text-sm">
          Base local: pedidos y productos se guardan en este computador. Cuando pegues las claves de
          Supabase en <code className="font-semibold">.env.local</code>, todo pasa a la nube.
        </p>
      ) : !isSupabaseWriteConfigured() ? (
        <p className="mt-3 rounded-2xl border border-amber/40 bg-amber/15 px-4 py-3 text-sm">
          Supabase está leyendo, pero falta <code className="font-semibold">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          para guardar productos, fotos y cambiar el estado de los pedidos.
        </p>
      ) : (
        <p className="mt-3 rounded-2xl border border-teal/40 bg-teal/15 px-4 py-3 text-sm">
          Base: Supabase. Catálogo, pedidos y fotos de sublimación van a la nube.
        </p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-ink/10 bg-surface p-3.5 sm:rounded-3xl sm:p-5">
              <div className="flex items-center justify-between text-ink/45">
                <p className="text-[10px] font-bold uppercase tracking-wider sm:text-xs">{card.label}</p>
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-2 font-display text-xl font-bold sm:mt-3 sm:text-2xl">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-2 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
        <Link
          href="/admin/estadisticas"
          className="grid h-11 place-items-center rounded-full bg-ink px-5 text-sm font-semibold text-paper sm:h-auto sm:py-2.5"
        >
          Ver estadísticas
        </Link>
        <Link
          href="/admin/pedidos"
          className="grid h-11 place-items-center rounded-full border border-ink/15 px-5 text-sm font-semibold sm:h-auto sm:py-2.5"
        >
          Ver pedidos
        </Link>
        <Link
          href="/admin/productos/nuevo"
          className="grid h-11 place-items-center rounded-full bg-magenta px-5 text-sm font-semibold text-white sm:h-auto sm:py-2.5"
        >
          Subir producto
        </Link>
      </div>

      <h2 className="mt-10 font-display text-xl font-bold">Últimos pedidos</h2>
      {!stats.recentOrders.length ? (
        <p className="mt-3 text-sm text-ink/55">
          Todavía no hay pedidos. Cuando alguien compre, aparecen aquí.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-ink/10 overflow-hidden rounded-3xl border border-ink/10 bg-surface">
          {stats.recentOrders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/admin/pedidos/${order.id}`}
                className="flex items-center justify-between gap-3 px-3 py-3 hover:bg-paper/80 sm:px-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{order.customerName}</p>
                  <p className="mt-0.5 truncate text-xs text-ink/45">
                    {new Date(order.createdAt).toLocaleDateString("es-CL")} · {order.items.length}{" "}
                    {order.items.length === 1 ? "ítem" : "ítems"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
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
