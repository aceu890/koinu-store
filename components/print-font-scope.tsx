import { PRINT_FONT_CLASSNAME } from "@/lib/print-font-vars";

export function PrintFontScope({ children }: { children: React.ReactNode }) {
  return <div className={PRINT_FONT_CLASSNAME}>{children}</div>;
}
