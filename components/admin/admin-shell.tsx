"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChartNoAxesCombined,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const links = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/estadisticas", label: "Números", icon: ChartNoAxesCombined },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/productos", label: "Productos", icon: Package },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="hidden border-r border-on-panel/10 bg-panel text-on-panel lg:flex lg:min-h-dvh lg:flex-col">
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-on-panel/10">
            <BrandLogo size={88} />
          </span>
          <div>
            <p className="font-display text-lg font-bold leading-tight">Koinu Admin</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-on-panel/50">
              Taller · Store
            </p>
          </div>
        </div>
        <nav className="space-y-1 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${
                  active ? "bg-on-panel text-panel" : "text-on-panel/70 hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.href === "/admin/estadisticas" ? "Estadísticas" : link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto px-3 py-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-on-panel/60 hover:text-on-panel"
          >
            <Store className="h-4 w-4" />
            Ver tienda
          </Link>
          <button
            type="button"
            onClick={logout}
            className="mt-1 flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-sm text-on-panel/60 hover:text-magenta"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-ink/10 bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-ink/5">
              <BrandLogo size={72} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-base font-bold leading-none">Koinu Admin</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-ink/45">Taller</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href="/"
              aria-label="Ver tienda"
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/10"
            >
              <Store className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={logout}
              aria-label="Salir"
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/10"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-8 sm:py-6">{children}</div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-ink/10 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-semibold ${
                active ? "text-magenta" : "text-ink/45"
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
