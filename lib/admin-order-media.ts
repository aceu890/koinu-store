import { adminPrintDownloadHref, stampPrintName, stampPrintUrl } from "@/lib/print-file";
import { isStoredImageUrl } from "@/lib/supabase/storage";
import type { AdminOrder, AdminOrderItem, PrintSide } from "@/lib/types";
import { PRINT_SIDES } from "@/lib/types";

export type CustomDetailsView = {
  size?: string | null;
  colorName?: string;
  printSides?: string[];
  stamps?: Array<{
    side?: string;
    artworkDataUrl?: string;
    printFileUrl?: string;
    printFileName?: string;
    widthPx?: number;
    heightPx?: number;
  }>;
  text?: string;
  artworkDataUrl?: string | null;
  previewBySide?: Partial<Record<PrintSide, string>>;
};

export type OrderPrintAsset = {
  key: string;
  src: string;
  preview: string;
  name: string;
  side?: string;
  widthPx?: number;
  heightPx?: number;
  downloadHref: string;
};

export function isShownImage(value: unknown): value is string {
  return isStoredImageUrl(value);
}

export function customFromItem(item: AdminOrderItem): CustomDetailsView | null {
  const custom = item.details?.custom;
  if (!custom || typeof custom !== "object") return null;
  return custom as CustomDetailsView;
}

export function printAssetsFromItem(item: AdminOrderItem): OrderPrintAsset[] {
  const custom = customFromItem(item);
  const arts = (custom?.stamps ?? [])
    .map((stamp, index) => {
      const src = stampPrintUrl({
        artworkDataUrl: stamp.artworkDataUrl ?? "",
        printFileUrl: stamp.printFileUrl,
      });
      const name = stampPrintName(
        {
          printFileName: stamp.printFileName,
          printFileUrl: stamp.printFileUrl,
          artworkDataUrl: stamp.artworkDataUrl ?? "",
          side: stamp.side,
        },
        index,
      );
      return {
        key: `${item.id}-art-${index}`,
        src,
        preview: stamp.artworkDataUrl || src,
        name,
        side: stamp.side,
        widthPx: stamp.widthPx,
        heightPx: stamp.heightPx,
        downloadHref: isShownImage(src) ? adminPrintDownloadHref(src, name) : "",
      };
    })
    .filter((art) => isShownImage(art.src));

  if (!arts.length && isShownImage(custom?.artworkDataUrl)) {
    const src = custom.artworkDataUrl;
    const name = "estampa-original.png";
    arts.push({
      key: `${item.id}-art`,
      src,
      preview: src,
      name,
      side: custom.printSides?.[0],
      downloadHref: adminPrintDownloadHref(src, name),
    });
  }
  return arts;
}

export function previewAssetsFromItem(item: AdminOrderItem): OrderPrintAsset[] {
  const custom = customFromItem(item);
  if (!custom?.previewBySide) return [];
  return PRINT_SIDES.flatMap((side) => {
    const src = custom.previewBySide?.[side];
    if (!isShownImage(src)) return [];
    const name = `posicion-${side}.jpg`;
    return [
      {
        key: `${item.id}-pos-${side}`,
        src,
        preview: src,
        name,
        side,
        downloadHref: adminPrintDownloadHref(src, name),
      },
    ];
  });
}

export function orderPrintAssets(order: AdminOrder) {
  return order.items.flatMap(printAssetsFromItem);
}

export function orderPreviewAssets(order: AdminOrder) {
  return order.items.flatMap(previewAssetsFromItem);
}

export function orderThumbnails(order: AdminOrder) {
  const print = orderPrintAssets(order);
  if (print.length) return print;
  return orderPreviewAssets(order);
}
