import { blobFromDataUrl, fileFromBlob, isDataUrl } from "@/lib/image-client";
import type { CartItem, CustomDetails, PrintSide, PrintStamp } from "@/lib/types";

async function replaceDataUrl(
  value: string | null | undefined,
  key: string,
  form: FormData,
) {
  if (!isDataUrl(value)) return value ?? null;
  form.append(key, fileFromBlob(await blobFromDataUrl(value), key));
  return key;
}

async function persistCustom(custom: CustomDetails, itemIndex: number, form: FormData) {
  const stamps: PrintStamp[] = [];
  if (custom.stamps?.length) {
    for (const [index, stamp] of custom.stamps.entries()) {
      stamps.push({
        ...stamp,
        artworkDataUrl:
          (await replaceDataUrl(stamp.artworkDataUrl, `i${itemIndex}-art-${index}`, form)) ??
          stamp.artworkDataUrl,
        printFileUrl:
          (await replaceDataUrl(
            stamp.printFileUrl ?? stamp.artworkDataUrl,
            `i${itemIndex}-print-${index}`,
            form,
          )) ?? stamp.printFileUrl,
      });
    }
  }

  const previewBySide: Partial<Record<PrintSide, string>> = {};
  for (const [side, url] of Object.entries(custom.previewBySide ?? {})) {
    const next = await replaceDataUrl(url, `i${itemIndex}-pos-${side}`, form);
    if (next) previewBySide[side as PrintSide] = next;
  }

  return {
    ...custom,
    artworkDataUrl:
      stamps[0]?.printFileUrl ??
      stamps[0]?.artworkDataUrl ??
      (await replaceDataUrl(custom.artworkDataUrl, `i${itemIndex}-art`, form)),
    stamps: stamps.length ? stamps : custom.stamps,
    previewBySide: Object.keys(previewBySide).length ? previewBySide : custom.previewBySide,
  };
}

export async function persistCartMedia(items: CartItem[]): Promise<CartItem[]> {
  const form = new FormData();
  const prepared = await Promise.all(
    items.map(async (item, index) => {
      if (!item.custom) return item;
      return {
        ...item,
        custom: await persistCustom(item.custom, index, form),
      };
    }),
  );

  if (![...form.keys()].length) return prepared;

  const response = await fetch("/api/orders/media", { method: "POST", body: form });
  const data = (await response.json()) as {
    urls?: Record<string, string>;
    error?: string;
    code?: string;
  };
  if (data.code === "NO_STORAGE" || response.status === 503) {
    return prepared;
  }
  if (!response.ok || !data.urls) {
    throw new Error(data.error || "No se pudieron guardar las imágenes del diseño");
  }

  const urls = data.urls;
  const swap = (value: string | null | undefined) => (value && urls[value] ? urls[value] : value) ?? null;

  return prepared.map((item) => {
    if (!item.custom) return item;
    const stamps = item.custom.stamps?.map((stamp) => ({
      ...stamp,
      artworkDataUrl: swap(stamp.artworkDataUrl) ?? stamp.artworkDataUrl,
      printFileUrl: swap(stamp.printFileUrl) ?? stamp.printFileUrl,
    }));
    const previewBySide = item.custom.previewBySide
      ? Object.fromEntries(
          Object.entries(item.custom.previewBySide).map(([side, url]) => [side, swap(url) ?? url]),
        )
      : item.custom.previewBySide;
    return {
      ...item,
      custom: {
        ...item.custom,
        artworkDataUrl:
          swap(item.custom.artworkDataUrl) ?? stamps?.[0]?.printFileUrl ?? stamps?.[0]?.artworkDataUrl ?? null,
        stamps,
        previewBySide,
      },
    };
  });
}
