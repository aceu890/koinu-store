"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

export function AdminLoginForm({ usingDefault }: { usingDefault: boolean }) {
  const router = useRouter();
  const search = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "No se pudo entrar");
      router.replace(search.get("next") || "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al entrar");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-[2rem] border border-ink/10 bg-surface p-8 shadow-sm">
        <div className="mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-full">
          <BrandLogo size={128} />
        </div>
        <h1 className="mt-4 text-center font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-center text-sm text-ink/60">
          Acceso al taller de Koinu Store.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Contraseña
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoFocus
              className="mt-1 w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 outline-none ring-magenta/30 focus:ring"
            />
          </label>
          {usingDefault ? (
            <p className="text-xs text-ink/50">
              En local la clave por defecto es <code className="font-semibold">koinu</code>.
              Cambiala con <code className="font-semibold">ADMIN_PASSWORD</code>.
            </p>
          ) : null}
          {error ? <p className="text-sm text-magenta-dark">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-magenta py-3 font-display font-bold text-white disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
