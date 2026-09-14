import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Checkout</h1>
      <p className="mt-2 text-ink/65">Último paso: tus datos y confirmación del pedido.</p>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
