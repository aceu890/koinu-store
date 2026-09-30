import Link from "next/link";
import { ChevronLeft, Download } from "lucide-react";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { StatusPill } from "@/components/admin/orders-table";
import { getOrder } from "@/lib/admin-data";
import {
  customFromItem,
  previewAssetsFromItem,
  printAssetsFromItem,
} from "@/lib/admin-order-media";
import { formatPrice, kindLabel, paymentLabel, sideLabel } from "@/lib/format";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/pedidos" className="inline-flex items-center gap-1 text-sm text-ink/50 hover:text-ink">
        <ChevronLeft className="h-4 w-4" />
        Pedidos
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{order.customerName}</h1>
          <p className="mt-1 font-mono text-xs text-ink/45">{order.id}</p>
        </div>
        <StatusPill status={order.status} />
      </div>
      <p className="mt-3 text-sm text-ink/60">
        Acá está todo para producir: datos del cliente, archivos para sublimar y la foto de cómo va ubicado el diseño.
      </p>

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
          <p className="mt-2 text-sm">{new Date(order.createdAt).toLocaleString("es-CL")}</p>
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
          const custom = customFromItem(item);
          const arts = printAssetsFromItem(item);
          const previews = previewAssetsFromItem(item);
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
                      ? ` · talla ${details.size}`
                      : custom?.size
                        ? ` · talla ${custom.size}`
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

              {item.kind === "custom" ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink/45">
                      Archivo para sublimar
                    </p>
                    <p className="mt-1 text-xs text-ink/50">
                      Sticker o imagen original, listo para imprimir.
                    </p>
                    {arts.length ? (
                      <ul className="mt-2 grid grid-cols-2 gap-2">
                        {arts.map((art) => (
                          <li key={art.key} className="overflow-hidden rounded-2xl border border-ink/10 bg-paper">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={art.preview} alt="Diseño para sublimar" className="h-36 w-full object-contain p-2" />
                            <div className="flex items-center justify-between gap-2 px-2 pb-2 text-[11px] text-ink/55">
                              <span>
                                {art.side ? sideLabel(art.side) : "Diseño"}
                                {art.widthPx && art.heightPx ? ` · ${art.widthPx}×${art.heightPx}` : ""}
                              </span>
                              <a
                                href={art.downloadHref}
                                download={art.name}
                                className="inline-flex items-center gap-1 font-semibold text-magenta hover:underline"
                              >
                                <Download className="h-3 w-3" />
                                Descargar
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-ink/50">Sin archivo de diseño.</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink/45">
                      Referencia de posición
                    </p>
                    <p className="mt-1 text-xs text-ink/50">Así pidió ubicar el diseño en la prenda.</p>
                    {previews.length ? (
                      <ul className="mt-2 grid grid-cols-2 gap-2">
                        {previews.map((shot) => (
                          <li key={shot.key} className="overflow-hidden rounded-2xl border border-ink/10 bg-[#1c1815]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={shot.preview}
                              alt={`Posición ${shot.side ? sideLabel(shot.side) : ""}`}
                              className="h-36 w-full object-contain"
                            />
                            <div className="flex items-center justify-between gap-2 px-2 py-2 text-[11px] text-ink/70">
                              <span>{shot.side ? sideLabel(shot.side) : "Prenda"}</span>
                              <a
                                href={shot.downloadHref}
                                download={shot.name}
                                className="inline-flex items-center gap-1 font-semibold text-magenta hover:underline"
                              >
                                <Download className="h-3 w-3" />
                                Descargar
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-ink/50">
                        Este pedido no incluye foto de posición. Los nuevos sí la guardan.
                      </p>
                    )}
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
