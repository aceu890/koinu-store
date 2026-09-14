import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { StatusPill } from "@/components/admin/orders-table";
import { getOrder } from "@/lib/admin-data";
import { formatPrice, kindLabel, paymentLabel, sideLabel } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/pedidos" className="text-sm text-ink/50 hover:text-ink">
        ← Pedidos
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{order.customerName}</h1>
          <p className="mt-1 font-mono text-xs text-ink/45">{order.id}</p>
        </div>
        <StatusPill status={order.status} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-ink/10 bg-surface p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/45">Cliente</p>
          <p className="mt-2 text-sm">{order.email}</p>
          {order.phone ? <p className="text-sm">{order.phone}</p> : null}
          <p className="mt-2 text-sm">
            {order.address}
            {order.city ? ` · ${order.city}` : ""}
          </p>
          {order.notes ? <p className="mt-3 text-sm text-ink/70">{order.notes}</p> : null}
        </div>
        <div className="rounded-3xl border border-ink/10 bg-surface p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/45">Pedido</p>
          <p className="mt-2 text-sm">{new Date(order.createdAt).toLocaleString("es-AR")}</p>
          <p className="text-sm">Pago: {paymentLabel(order.paymentMethod)}</p>
          <p className="mt-2 font-display text-2xl font-bold">{formatPrice(order.total)}</p>
          <div className="mt-4">
            <OrderStatusForm id={order.id} status={order.status} />
          </div>
        </div>
      </div>

      <h2 className="mt-8 font-display text-xl font-bold">Ítems</h2>
      <ul className="mt-3 space-y-3">
        {order.items.map((item) => {
          const details = item.details;
          const custom = details.custom as
            | {
                size?: string | null;
                colorName?: string;
                printSides?: string[];
                stamps?: unknown[];
                text?: string;
              }
            | null
            | undefined;
          return (
            <li key={item.id} className="rounded-3xl border border-ink/10 bg-surface p-5">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-xs text-ink/45">
                    {item.kind === "custom" ? "Personalizado" : "Galería"}
                    {typeof details.productKind === "string"
                      ? ` · ${kindLabel(String(details.productKind))}`
                      : ""}
                    {typeof details.size === "string" && details.size
                      ? ` · talle ${details.size}`
                      : custom?.size
                        ? ` · talle ${custom.size}`
                        : ""}
                    {typeof details.colorName === "string" && details.colorName
                      ? ` · ${details.colorName}`
                      : custom?.colorName
                        ? ` · ${custom.colorName}`
                        : ""}
                  </p>
                  {custom?.printSides?.length ? (
                    <p className="mt-1 text-xs text-ink/55">
                      Caras: {custom.printSides.map((side) => sideLabel(side)).join(", ")}
                      {Array.isArray(custom.stamps) ? ` · ${custom.stamps.length} estampas` : ""}
                    </p>
                  ) : null}
                  {custom?.text ? (
                    <p className="mt-1 text-sm text-ink/70">Texto: “{custom.text}”</p>
                  ) : null}
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                  <p className="font-display font-bold">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
