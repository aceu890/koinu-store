import { PrintFontScope } from "@/components/print-font-scope";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <PrintFontScope>{children}</PrintFontScope>;
}
