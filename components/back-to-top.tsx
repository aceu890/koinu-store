"use client";

import { useEffect, useState } from "react";
import { Mascot } from "@/components/mascot";

export function BackToTop() {
  const [show, setShow] = useState(false);
  const [bottom, setBottom] = useState(20);

  useEffect(() => {
    const footer = document.getElementById("site-footer");

    function update() {
      setShow(window.scrollY > 480);
      if (!footer) {
        setBottom(20);
        return;
      }
      const rect = footer.getBoundingClientRect();
      const overlap = window.innerHeight - rect.top;
      setBottom(overlap > 0 ? overlap + 12 : 20);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ bottom }}
      className="fixed right-3 z-30 w-14 rounded-2xl bg-panel p-1.5 shadow-lg transition hover:-translate-y-1 sm:right-5 sm:w-[4.75rem] sm:rounded-3xl sm:p-2"
      aria-label="Volver arriba"
    >
      <Mascot name="volver-arriba" alt="Volver arriba" size={160} />
    </button>
  );
}
