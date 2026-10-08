import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { ClearCart } from "@/components/clear-cart";
import { WebpayTrustBlock } from "@/components/webpay-marks";
import { formatPrice, orderStatusLabel, paymentLabel } from "@/lib/format";
import { createServiceSupabase } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Pago recibido",
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ total?: string; offline?: string; pago?: string }>;
};

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = createServiceSupabase();

  let total = Number(query.total ?? 0);
  let status = "pending";
  let name = "";

  if (supabase && query.offline !== "1") {
    const { data } = await supabase
      .from("orders")
      .select("total, status, customer_name")
      .eq("id", id)
      .maybeSingle();
    if (data) {
      total = data.total;
      status = data.status;
      name = data.customer_name;
    }
  }

  const payment = query.pago ? paymentLabel(query.pago) : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <ClearCart />
      <div className="flex justify-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/15 text-teal">
          <CircleCheck className="h-7 w-7" aria-hidden />
        </span>
      </div>
      <h1 className="mt-5 text-center font-display text-4xl font-bold">Pago recibido</h1>
      <p className="mt-3 text-center text-ink/70">
        {name ? `Gracias, ${name}. ` : "Gracias. "}
        El pedido quedó confirmado y ya aparece en el taller.
      </p>
      <div className="mt-8 rounded-3xl border border-ink/10 bg-surface p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">Número de pedido</p>
        <p className="mt-1 break-all font-mono text-sm">{id}</p>
        <p className="mt-4 text-sm text-ink/60">
          Estado: {status === "pending" ? "Pagado" : orderStatusLabel(status)}
        </p>
        {payment ? <p className="mt-1 text-sm text-ink/60">Pago: {payment}</p> : null}
        {total ? (
          <p className="mt-3 font-display text-2xl font-bold">{formatPrice(total)}</p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-ink/60">
          El cobro quedó registrado. El taller ya puede ver el pedido y pasarlo a producción.
        </p>
        {query.offline === "1" && process.env.NODE_ENV !== "production" ? (
          <p className="mt-3 text-xs text-ink/50">
            Pedido guardado en modo local (Supabase aún no está configurado).
          </p>
        ) : null}
      </div>
      <div className="mt-5">
        <WebpayTrustBlock />
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/galeria" className="rounded-full border border-ink px-5 py-3 font-semibold">
          Seguir mirando
        </Link>
        <Link
          href="/personalizar"
          className="rounded-full bg-ink px-5 py-3 font-display font-bold text-white"
        >
          Hacer otro pedido
        </Link>
      </div>
    </div>
  );
}
