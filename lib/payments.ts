import type { PaymentMethod } from "@/lib/types";

export const PAYMENT_METHODS: PaymentMethod[] = ["webpay", "transferencia", "efectivo"];

export function parsePaymentMethod(value: FormDataEntryValue | null): PaymentMethod {
  if (value === "transferencia" || value === "efectivo" || value === "webpay") return value;
  return "webpay";
}
