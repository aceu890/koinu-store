"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlaskConical, Trash2 } from "lucide-react";

export function SimulateOrders() {
  const router = useRouter();
  const [busy, setBusy] = useState<"seed" | "clear" | null>(null);
  const [message, setMessage] = useState("");

  async function run(action: "seed" | "clear") {
    if (action === "seed") {
      const ok = window.confirm(
        "Se van a crear 6 pedidos de ejemplo (pendiente, pagado, en producción, enviado, entregado y anulado) para recorrer el panel. No son ventas reales.",
      );
      if (!ok) return;
    } else {
      const ok = window.confirm("Se borran solo los pedidos marcados como DEMO. Los pedidos reales no se tocan.");
      if (!ok) return;
    }

    setBusy(action);
    setMessage("");
    try {
      const response = await fetch("/api/admin/demo-orders", {
        method: action === "seed" ? "POST" : "DELETE",
      });
      const data = (await response.json()) as { created?: number; removed?: number; error?: string };
      if (!response.ok) throw new Error(data.error || "No se pudo completar");
      setMessage(
        action === "seed"
          ? `Listo: ${data.created ?? 0} pedidos de ejemplo en el panel.`
          : data.removed
            ? `Se quitaron ${data.removed} pedidos de ejemplo.`
            : "No había pedidos de ejemplo.",
      );
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-ink/10 bg-surface px-4 py-4 sm:rounded-3xl sm:px-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">Mientras llega Webpay</p>
      <p className="mt-1 text-sm leading-relaxed text-ink/70">
        Podés cargar pedidos de prueba para ver números, estados y el detalle. También se puede comprar de verdad
        por transferencia desde la tienda.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => run("seed")}
          disabled={Boolean(busy)}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-paper disabled:opacity-50"
        >
          <FlaskConical className="h-4 w-4" />
          {busy === "seed" ? "Creando…" : "Simular pedidos"}
        </button>
        <button
          type="button"
          onClick={() => run("clear")}
          disabled={Boolean(busy)}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-sm font-semibold disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          {busy === "clear" ? "Quitando…" : "Quitar ejemplos"}
        </button>
      </div>
      {message ? <p className="mt-2 text-sm text-ink/60">{message}</p> : null}
    </div>
  );
}
