"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { orderStatusLabel } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/types";

export function OrderStatusForm({ id, status }: { id: string; status: OrderStatus }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onChange(next: OrderStatus) {
    setValue(next);
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "No se pudo actualizar");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setValue(status);
    } finally {
      setSaving(false);
    }
  }

  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Estado</span>
      <select
        value={value}
        disabled={saving}
        onChange={(event) => onChange(event.target.value as OrderStatus)}
        className="mt-1 w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
      >
        {ORDER_STATUSES.map((item) => (
          <option key={item} value={item}>
            {orderStatusLabel(item)}
          </option>
        ))}
      </select>
      {saving ? <p className="mt-1 text-xs text-ink/45">Guardando…</p> : null}
      {error ? <p className="mt-1 text-xs text-magenta-dark">{error}</p> : null}
    </label>
  );
}
