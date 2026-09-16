"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPrice, orderStatusLabel, paymentLabel } from "@/lib/format";
import type { AdminOrder, OrderStatus } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/types";

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (status !== "all" && order.status !== status) return false;
      if (!needle) return true;
      return (
        order.customerName.toLowerCase().includes(needle) ||
        order.email.toLowerCase().includes(needle) ||
        order.id.toLowerCase().includes(needle)
      );
    });
  }, [orders, query, status]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nombre, email o ID"
          className="w-full rounded-full border border-ink/10 bg-surface px-4 py-2.5 text-sm outline-none ring-magenta/30 focus:ring"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as "all" | OrderStatus)}
          className="rounded-full border border-ink/10 bg-surface px-4 py-2.5 text-sm"
        >
          <option value="all">Todos los estados</option>
          {ORDER_STATUSES.map((value) => (
            <option key={value} value={value}>
              {orderStatusLabel(value)}
            </option>
          ))}
        </select>
      </div>

      {!filtered.length ? (
        <p className="mt-8 text-sm text-ink/55">No hay pedidos con ese filtro.</p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-3xl border border-ink/10 bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/45">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Pago</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/pedidos/${order.id}`} className="font-semibold hover:text-magenta">
                      {order.customerName}
                    </Link>
                    <p className="text-xs text-ink/45">{order.email}</p>
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {new Date(order.createdAt).toLocaleString("es-CL")}
                  </td>
                  <td className="px-4 py-3">{paymentLabel(order.paymentMethod)}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone: Record<string, string> = {
    pending: "bg-amber/20 text-ink",
    paid: "bg-teal/15 text-teal",
    in_production: "bg-magenta/15 text-magenta-dark",
    shipped: "bg-ink/10 text-ink",
    completed: "bg-teal/20 text-teal",
    cancelled: "bg-ink/10 text-ink/50",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone[status] ?? "bg-ink/10"}`}>
      {orderStatusLabel(status)}
    </span>
  );
}
