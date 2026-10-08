"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Download, ImageOff } from "lucide-react";
import {
  previewAssetsFromItem,
  printAssetsFromItem,
  type OrderPrintAsset,
} from "@/lib/admin-order-media";
import { formatPrice, orderStatusLabel, paymentLabel, sideLabel } from "@/lib/format";
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
        order.id.toLowerCase().includes(needle) ||
        order.items.some((item) => item.productName.toLowerCase().includes(needle))
      );
    });
  }, [orders, query, status]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por cliente, producto o ID"
          className="w-full rounded-full border border-ink/10 bg-surface px-4 py-2.5 text-sm outline-none ring-magenta/30 focus:ring"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as "all" | OrderStatus)}
          className="w-full rounded-full border border-ink/10 bg-surface px-4 py-2.5 text-sm sm:w-auto"
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
        <ul className="mt-5 space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: AdminOrder }) {
  const when = new Date(order.createdAt);
  const pieces = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="overflow-hidden rounded-2xl border border-ink/10 bg-surface sm:rounded-3xl">
      <div className="flex items-start gap-3 border-b border-ink/8 px-3 py-3 sm:px-5 sm:py-4">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="min-w-0 truncate font-display text-base font-bold leading-tight sm:text-lg">
              {order.customerName}
            </p>
            <StatusPill status={order.status} />
          </div>
          <p className="mt-1 text-xs text-ink/50">
            {when.toLocaleDateString("es-CL")}
            {" · "}
            {paymentLabel(order.paymentMethod)}
            {" · "}
            {pieces} {pieces === 1 ? "pieza" : "piezas"}
          </p>
          <p className="mt-0.5 truncate text-xs text-ink/40">{order.email}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-base font-bold sm:text-lg">{formatPrice(order.total)}</p>
          <Link
            href={`/admin/pedidos/${order.id}`}
            className="mt-2 hidden h-9 items-center justify-center gap-1 rounded-full bg-ink px-3 text-sm font-semibold text-paper sm:inline-flex"
          >
            Ver detalle
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <ul className="divide-y divide-ink/8">
        {order.items.map((item, index) => (
          <li key={`${order.id}-${item.id}-${index}`} className="px-3 py-3 sm:px-5 sm:py-4">
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold leading-tight">{item.productName}</p>
                <p className="mt-0.5 text-xs text-ink/45">
                  {item.kind === "custom" ? "Personalizado" : "Galería"}
                  {" · "}
                  {item.quantity}× {formatPrice(item.unitPrice)}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold">
                {formatPrice(item.unitPrice * item.quantity)}
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
              <AssetStrip title="Estampa" assets={printAssetsFromItem(item)} empty="Sin archivo" />
              <AssetStrip
                title="Posición"
                assets={previewAssetsFromItem(item)}
                empty="Sin referencia"
                dark
              />
            </div>
          </li>
        ))}
      </ul>

      <Link
        href={`/admin/pedidos/${order.id}`}
        className="flex h-11 items-center justify-center gap-1 border-t border-ink/8 text-sm font-semibold sm:hidden"
      >
        Ver detalle
        <ChevronRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

function AssetStrip({
  title,
  assets,
  empty,
  dark,
}: {
  title: string;
  assets: OrderPrintAsset[];
  empty: string;
  dark?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">{title}</p>
      {assets.length ? (
        <ul className="mt-1 flex gap-1.5 overflow-x-auto pb-0.5">
          {assets.map((asset) => (
            <li
              key={asset.key}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-ink/10 sm:h-20 sm:w-20 ${
                dark ? "bg-[#1c1815]" : "bg-paper"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.preview} alt={title} className="h-full w-full object-contain p-0.5" />
              {asset.side ? (
                <span className="absolute left-0.5 top-0.5 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-paper/90 px-1 py-px text-[8px] font-bold uppercase leading-tight text-ink">
                  {sideLabel(asset.side)}
                </span>
              ) : null}
              <a
                href={asset.downloadHref}
                download={asset.name}
                title={`Descargar ${asset.name}`}
                className="absolute bottom-0.5 right-0.5 grid h-6 w-6 place-items-center rounded-full bg-ink text-paper sm:h-7 sm:w-7"
              >
                <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="sr-only">Descargar {title}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-1 flex h-16 items-center gap-1.5 rounded-xl border border-dashed border-ink/15 px-2 text-[11px] text-ink/40 sm:h-20">
          <ImageOff className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{empty}</span>
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
