"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCartCount, useCartStore } from "@/lib/cart-store";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/personalizar", label: "Personalizar" },
  { href: "/galeria", label: "Galería" },
];

export function Header() {
  const pathname = usePathname();
  const count = useCartCount();
  const hydrated = useCartStore((state) => state.hydrated);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-3 sm:h-16 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full">
            <BrandLogo size={96} priority />
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-bold tracking-tight">Koinu</p>
            <p className="-mt-0.5 text-[10px] uppercase tracking-[0.22em] text-ink/60">
              Store · Print
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                pathname === link.href ? "text-magenta" : "text-ink/70 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/carrito"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-surface/80 hover:border-ink/30"
            aria-label="Carrito"
            onClick={() => setOpen(false)}
          >
            <ShoppingBag className="h-4 w-4" />
            {hydrated && count > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-magenta px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menú"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-ink/10 bg-paper px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
