"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function BackToTop() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    function update() {
      setShow(window.scrollY > 640);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!show) return null;
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/carrito") ||
    pathname.startsWith("/pedido")
  ) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-3 z-30 grid h-10 w-10 place-items-center rounded-full bg-panel text-on-panel shadow-lg sm:right-5"
      aria-label="Volver arriba"
    >
      ↑
    </button>
  );
}
