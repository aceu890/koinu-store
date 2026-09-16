import type { Metadata } from "next";
import { Mascot } from "@/components/mascot";
import { CustomizeWizard } from "@/components/customize-wizard";

export const metadata: Metadata = {
  title: "Personalizar",
  description: "Diseña tu prenda, taza o merch y agrégalo al carrito.",
};

export default function PersonalizarPage() {
  return (
    <div className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-12">
      <div className="hidden items-end gap-5 sm:flex">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.22em] text-magenta">
            Flujo de diseño
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold">
            Personaliza tu pieza
          </h1>
          <p className="mt-3 max-w-xl text-ink/70">
            Elige el producto, el color, tu arte y lo mandamos a producción.
          </p>
        </div>
        <div className="mb-2 w-20 shrink-0">
          <Mascot
            name="vamos-mascot"
            alt="¡Vamos a personalizar!"
            size={96}
            className="-rotate-6"
          />
        </div>
      </div>
      <h1 className="sr-only sm:hidden">Personaliza tu pieza</h1>
      <div className="mt-3 sm:mt-10">
        <CustomizeWizard />
      </div>
    </div>
  );
}
