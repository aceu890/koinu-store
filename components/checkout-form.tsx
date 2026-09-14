"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Mascot } from "@/components/mascot";
import { useCartStore, useCartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import type { CheckoutPayload } from "@/lib/types";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const hydrated = useCartStore((state) => state.hydrated);
  const clear = useCartStore((state) => state.clear);
  const total = useCartTotal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      paymentMethod: form.get("paymentMethod") === "efectivo" ? "efectivo" : "transferencia",
      items,
    };

    if (!payload.customerName || !payload.email || !payload.address) {
      setError("Completá nombre, email y dirección.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { id?: string; error?: string; offline?: boolean };

      if (!response.ok || !data.id) {
        throw new Error(data.error || "No se pudo crear el pedido");
      }

      clear();
      const qs = new URLSearchParams({
        total: String(total),
        ...(data.offline ? { offline: "1" } : {}),
      });
      router.push(`/pedido/${data.id}?${qs.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al confirmar");
      setLoading(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center py-10">
        <div className="w-40">
          <Mascot name="loading" alt="Cargando" size={240} />
        </div>
        <p className="mt-3 text-ink/50">Cargando…</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <div className="w-44">
          <Mascot name="keep-shopping-alt" alt="¡Sigue comprando!" size={260} />
        </div>
        <p className="mt-3 text-ink/70">No hay productos para checkout. Volvé al carrito.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4 rounded-3xl border border-ink/10 bg-surface/70 p-6">
        <h2 className="font-display text-2xl font-bold">Datos de entrega</h2>
        <Field name="customerName" label="Nombre y apellido" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="phone" label="Teléfono" />
        <Field name="address" label="Dirección" required />
        <Field name="city" label="Ciudad" />
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Notas</span>
          <textarea
            name="notes"
            rows={3}
            className="mt-1 w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none focus:ring focus:ring-magenta/30"
            placeholder="Horario, referencias, detalle del diseño…"
          />
        </label>
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-wider text-ink/50">
            Pago
          </legend>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="radio" name="paymentMethod" value="transferencia" defaultChecked />
            Transferencia bancaria
          </label>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="radio" name="paymentMethod" value="efectivo" />
            Efectivo / contraentrega
          </label>
        </fieldset>
        {error ? <p className="text-sm text-magenta-dark">{error}</p> : null}
      </div>

      <aside className="h-fit rounded-3xl bg-panel p-6 text-on-panel">
            <div className="mb-4 w-40">
              <Mascot name="payment" alt="Métodos de pago fáciles y seguros" size={240} />
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-amber">Tu pedido</p>
        <ul className="mt-4 space-y-2 text-sm text-on-panel/80">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span>
                {item.quantity}× {item.name}
              </span>
              <span>{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex justify-between font-display text-2xl font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </p>
        <button
          type="submit"
          disabled={loading}
          className="btn-personaliza mt-6 w-full rounded-full bg-magenta py-3 font-display font-bold text-white disabled:opacity-60"
        >
          {loading ? "Confirmando…" : "Confirmar compra"}
        </button>
        {loading ? (
          <div className="mx-auto mt-4 w-32">
            <Mascot name="loading" alt="Cargando" size={200} />
          </div>
        ) : null}
        <p className="mt-3 text-xs text-on-panel/50">
          Esta es la base del checkout. Más adelante se puede conectar Mercado Pago u otro medio.
        </p>
        <div className="mx-auto mt-4 w-36">
          <Mascot name="secure-alt" alt="Compra segura, tus datos protegidos" size={220} />
        </div>
      </aside>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-ink/50">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none focus:ring focus:ring-magenta/30"
      />
    </label>
  );
}
