import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Finalizar compra",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">Pago seguro</p>
      <h1 className="mt-1 font-display text-4xl font-bold">Finalizar compra</h1>
      <p className="mt-2 max-w-xl text-ink/65">
        Completa tus datos de envío y elige Webpay o transferencia. Revisamos el pedido antes de
        despachar.
      </p>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
