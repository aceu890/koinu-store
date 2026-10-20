import { PrintFontScope } from "@/components/print-font-scope";

export default function PedidoLayout({ children }: { children: React.ReactNode }) {
  return <PrintFontScope>{children}</PrintFontScope>;
}
