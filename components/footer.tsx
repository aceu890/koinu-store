"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { Mascot } from "@/components/mascot";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer id="site-footer" className="relative z-40 mt-auto border-t border-on-panel/10 bg-panel text-on-panel">
      <div className="mx-auto grid max-w-6xl grid-cols-3 items-center gap-2 px-3 py-3.5 sm:gap-6 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full sm:h-12 sm:w-12">
              <BrandLogo size={96} />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[13px] font-bold leading-tight sm:text-lg">
                Koinu Store
              </p>
              <p className="mt-0.5 hidden text-xs leading-snug text-on-panel/65 sm:block">
                Sublimación y estampados.
              </p>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-center gap-1.5 sm:gap-3">
          <div className="w-12 shrink-0 sm:w-20">
            <Mascot name="here" alt="Estamos aquí" size={140} />
          </div>
          <div className="min-w-0 text-[10px] leading-tight sm:text-sm">
            <p className="font-display font-semibold">Taller</p>
            <p className="text-on-panel/65">Lun–sáb · 10 a 19 h</p>
            <p className="hidden text-on-panel/65 sm:block">Envíos a todo el país</p>
          </div>
        </div>

        <nav className="flex min-w-0 items-center justify-end gap-1.5 text-[10px] sm:gap-3 sm:text-sm">
          <a
            href="https://www.instagram.com/koinustore_dtf/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 shrink-0 sm:w-24"
          >
            <Mascot name="follow" alt="Síguenos en Instagram" size={160} />
          </a>
          <div className="flex flex-col items-end gap-0.5 sm:items-start sm:gap-1">
            <Link href="/personalizar" className="hover:text-magenta">
              Personalizar
            </Link>
            <Link href="/galeria" className="hover:text-magenta">
              Galería
            </Link>
            <Link href="/carrito" className="hover:text-magenta">
              Carrito
            </Link>
          </div>
        </nav>
      </div>
    </footer>
  );
}
