import { PrintFontScope } from "@/components/print-font-scope";

export default function CarritoLayout({ children }: { children: React.ReactNode }) {
  return <PrintFontScope>{children}</PrintFontScope>;
}
