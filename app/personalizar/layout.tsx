import { PrintFontScope } from "@/components/print-font-scope";

export default function PersonalizarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrintFontScope>{children}</PrintFontScope>;
}
