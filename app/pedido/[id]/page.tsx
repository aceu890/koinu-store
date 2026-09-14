import type { Metadata } from "next";
import Link from "next/link";
import { Mascot } from "@/components/mascot";
import { formatPrice } from "@/lib/format";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pedido confirmado",
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ total?: string; offline?: string }>;
};

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createServerSupabase();

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

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <div className="mx-auto w-52">
        <Mascot name="all-ready" alt="¡Todo listo! Disfruta tu compra" size={320} />
      </div>
      <h1 className="mt-4 font-display text-4xl font-bold">Pedido confirmado</h1>
      <p className="mt-3 text-ink/70">
        {name ? `Gracias, ${name}. ` : "Gracias. "}
        Recibimos tu orden y el taller la va a preparar.
      </p>
      <div className="mt-8 rounded-3xl border border-ink/10 bg-surface/70 p-6 text-left">
        <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Número de pedido</p>
        <p className="mt-1 break-all font-mono text-sm">{id}</p>
        <p className="mt-4 text-sm text-ink/60">Estado: {status === "pending" ? "Pendiente de pago / producción" : status}</p>
        {total ? (
          <p className="mt-2 font-display text-2xl font-bold">{formatPrice(total)}</p>
        ) : null}
        {query.offline === "1" ? (
          <p className="mt-3 text-xs text-ink/50">
            Pedido guardado en modo local (Supabase aún no está configurado).
          </p>
        ) : null}
      </div>
      <div className="mx-auto mt-6 w-44">
        <Mascot name="order-shipping" alt="Tu pedido está en camino" size={260} />
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/galeria" className="rounded-full border border-ink px-5 py-3 font-semibold">
          Seguir mirando
        </Link>
        <Link
          href="/personalizar"
          className="rounded-full bg-magenta px-5 py-3 font-display font-bold text-white"
        >
          Personalizar otra
        </Link>
      </div>
    </div>
  );
}
