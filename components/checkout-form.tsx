"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, Lock, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { KoinuLoader } from "@/components/koinu-loader";
import { WebpayLogo, WebpayTrustBlock } from "@/components/webpay-marks";
import { useCartStore, useCartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { persistCartMedia } from "@/lib/order-media-client";
import { parsePaymentMethod } from "@/lib/payments";
import type { CheckoutPayload } from "@/lib/types";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const hydrated = useCartStore((state) => state.hydrated);
  const total = useCartTotal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [method, setMethod] = useState<"webpay" | "transferencia">("webpay");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return;

    const form = new FormData(event.currentTarget);
    const payload: CheckoutPayload = {
      customerName: String(form.get("customerName") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      address: String(form.get("address") ?? "").trim(),
      city: String(form.get("city") ?? "").trim(),
      notes: String(form.get("notes") ?? "").trim(),
      paymentMethod: parsePaymentMethod(form.get("paymentMethod")),
      items,
    };

    if (!payload.customerName || !payload.email || !payload.address) {
      setError("Completa nombre, email y dirección.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const itemsWithMedia = await persistCartMedia(items);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, items: itemsWithMedia }),
      });
      const data = (await response.json()) as { id?: string; error?: string; offline?: boolean };

      if (!response.ok || !data.id) {
        throw new Error(data.error || "No se pudo crear el pedido");
      }

      const qs = new URLSearchParams({
        total: String(total),
        pago: payload.paymentMethod,
        ...(data.offline ? { offline: "1" } : {}),
      });
      router.replace(`/pedido/${data.id}?${qs.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al confirmar");
      setLoading(false);
    }
  }

  if (!hydrated) {
    return <KoinuLoader page label="Cargando el checkout…" />;
  }

  if (!items.length && !loading) {
    return (
      <div className="rounded-3xl border border-ink/10 bg-surface px-6 py-14 text-center">
        <ShoppingBag className="mx-auto h-8 w-8 text-ink/30" aria-hidden />
        <p className="mt-4 font-display text-xl font-bold">No hay productos para pagar</p>
        <p className="mt-2 text-sm text-ink/60">Vuelve al carrito o recorre la galería.</p>
        <Link
          href="/carrito"
          className="mt-6 inline-block rounded-full border border-ink px-5 py-2.5 text-sm font-semibold"
        >
          Ir al carrito
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      {loading ? <KoinuLoader overlay label="Creando tu pedido…" /> : null}
      <div className="space-y-6">
        <section className="rounded-3xl border border-ink/10 bg-surface p-6 sm:p-7">
          <h2 className="font-display text-xl font-bold">Datos de envío</h2>
          <p className="mt-1 text-sm text-ink/55">Usamos estos datos solo para despachar tu pedido.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field name="customerName" label="Nombre y apellido" required className="sm:col-span-2" />
            <Field name="email" label="Email" type="email" required />
            <Field name="phone" label="Teléfono" type="tel" />
            <Field name="address" label="Dirección" required className="sm:col-span-2" />
            <Field name="city" label="Comuna / ciudad" />
            <label className="block sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Notas</span>
              <textarea
                name="notes"
                rows={3}
            className="mt-1 w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 outline-none focus:ring-2 focus:ring-ink/15"
                placeholder="Referencias de despacho, horario u otras indicaciones"
              />
            </label>
          </div>
        </section>

        <fieldset className="rounded-3xl border border-ink/10 bg-surface p-6 sm:p-7">
          <legend className="sr-only">Medio de pago</legend>
          <h2 className="font-display text-xl font-bold">Medio de pago</h2>
          <p className="mt-1 text-sm text-ink/55">
            Al confirmar, el pedido queda en el taller. Webpay se conecta después; por ahora el cobro se coordina
            aparte.
          </p>

          <label
            className={`mt-5 flex cursor-pointer gap-4 rounded-2xl border p-4 transition ${
              method === "webpay" ? "border-ink bg-paper" : "border-ink/10 bg-paper/40"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="webpay"
              checked={method === "webpay"}
              onChange={() => setMethod("webpay")}
              className="mt-1"
            />
            <span className="min-w-0 flex-1">
              <WebpayLogo className="h-8 w-auto" />
              <span className="mt-2 block text-sm text-ink/60">
                Te enviamos el link de cobro al email.
              </span>
            </span>
          </label>

          <label
            className={`mt-3 flex cursor-pointer gap-4 rounded-2xl border p-4 transition ${
              method === "transferencia" ? "border-ink bg-paper" : "border-ink/10 bg-paper/40"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="transferencia"
              checked={method === "transferencia"}
              onChange={() => setMethod("transferencia")}
              className="mt-1"
            />
            <span className="min-w-0 flex-1">
              <span className="text-sm font-semibold">Transferencia bancaria</span>
              <span className="mt-1 block text-sm text-ink/60">
                Te enviamos los datos de la cuenta para transferir el total.
              </span>
            </span>
          </label>
        </fieldset>

        {error ? <p className="text-sm text-magenta-dark">{error}</p> : null}
      </div>

      <aside className="h-fit space-y-4 lg:sticky lg:top-6">
        <div className="rounded-3xl border border-ink/10 bg-surface p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">Resumen</p>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span className="text-ink/70">
                  {item.quantity}× {item.name}
                </span>
                <span className="shrink-0 font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 text-sm text-ink/55">
            <span>Envío</span>
            <span>A coordinar</span>
          </div>
          <p className="mt-3 flex justify-between font-display text-2xl font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 font-display font-bold text-white disabled:opacity-60"
          >
            {loading ? "Procesando pedido…" : "Confirmar pedido"}
          </button>
          <p className="mt-3 text-center text-xs text-ink/45">
            Al confirmar, el pedido aparece en el taller. El pago con tarjeta se habilita cuando esté Webpay.
          </p>
        </div>

        <WebpayTrustBlock />

        <ul className="grid gap-3 rounded-3xl border border-ink/10 bg-surface p-5 text-sm text-ink/70 sm:grid-cols-2 lg:grid-cols-1">
          <TrustItem icon={Lock} text="Conexión segura" />
          <TrustItem icon={ShieldCheck} text="Datos protegidos" />
          <TrustItem icon={Truck} text="Despacho a todo Chile" />
          <TrustItem icon={BadgeCheck} text="Taller de sublimación" />
        </ul>
      </aside>
    </form>
  );
}

function TrustItem({
  icon: Icon,
  text,
}: {
  icon: typeof Lock;
  text: string;
}) {
  return (
    <li className="flex items-center gap-2.5">
      <Icon className="h-4 w-4 shrink-0 text-teal" aria-hidden />
      {text}
    </li>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  className,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-xs font-bold uppercase tracking-wider text-ink/50">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={
          name === "customerName"
            ? "name"
            : name === "email"
              ? "email"
              : name === "phone"
                ? "tel"
                : name === "address"
                  ? "street-address"
                  : name === "city"
                    ? "address-level2"
                    : undefined
        }
        className="mt-1 w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 outline-none focus:ring-2 focus:ring-ink/15"
      />
    </label>
  );
}
