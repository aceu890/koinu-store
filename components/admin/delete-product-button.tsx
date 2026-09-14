"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm(`¿Borrar “${name}” de la tienda?`)) return;
    setLoading(true);
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      alert(data.error || "No se pudo borrar");
      setLoading(false);
      return;
    }
    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      className="rounded-full border border-magenta/30 px-4 py-2 text-sm font-semibold text-magenta-dark disabled:opacity-60"
    >
      {loading ? "Borrando…" : "Borrar producto"}
    </button>
  );
}
