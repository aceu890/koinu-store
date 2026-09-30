import type { PrintStamp } from "@/lib/types";

export function stampPrintUrl(stamp: Pick<PrintStamp, "artworkDataUrl" | "printFileUrl">) {
  return stamp.printFileUrl || stamp.artworkDataUrl;
}

export function stampPrintName(
  stamp: {
    printFileName?: string;
    printFileUrl?: string;
    artworkDataUrl: string;
    side?: string;
  },
  index: number,
) {
  if (stamp.printFileName) return stamp.printFileName;
  const source = stampPrintUrl(stamp);
  const fromPath = source.split("/").pop()?.split("?")[0];
  if (fromPath && !fromPath.startsWith("data:")) {
    try {
      return decodeURIComponent(fromPath);
    } catch {
      return fromPath;
    }
  }
  return `estampa-${stamp.side ?? "diseno"}-${index + 1}.png`;
}

export function adminPrintDownloadHref(src: string, name: string) {
  if (src.startsWith("data:")) return src;
  const params = new URLSearchParams({ src, name });
  return `/api/admin/print-file?${params.toString()}`;
}
