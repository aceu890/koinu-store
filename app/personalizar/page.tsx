import type { Metadata } from "next";
import { Mascot } from "@/components/mascot";
import { CustomizeWizard } from "@/components/customize-wizard";

export const metadata: Metadata = {
  title: "Personalizar",
  description: "Diseñá tu prenda, taza o merch y sumalo al carrito.",
};

export default function PersonalizarPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-magenta">Flujo de diseño</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Personaliza tu pieza</h1>
          <p className="mt-3 max-w-xl text-ink/70">
            Elegí el producto, el color, tu arte y lo mandamos a producción.
          </p>
        </div>
        <div className="w-40 sm:w-48">
          <Mascot name="vamos-mascot" alt="¡Vamos a personalizar!" size={220} />
        </div>
      </div>
      <div className="mt-10">
        <CustomizeWizard />
      </div>
    </div>
  );
}
