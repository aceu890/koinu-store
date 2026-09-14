"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const links = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
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

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="border-b border-on-panel/10 bg-panel text-on-panel lg:min-h-screen lg:border-b-0 lg:border-r">
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
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible lg:px-3">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap ${
                  active ? "bg-on-panel text-panel" : "text-on-panel/70 hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden px-3 pt-6 lg:block">
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
      <div className="min-w-0">
        <div className="flex items-center justify-end gap-2 border-b border-ink/10 px-4 py-3 lg:hidden">
          <Link href="/" className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold">
            Tienda
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold"
          >
            Salir
          </button>
        </div>
        <div className="px-4 py-6 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
