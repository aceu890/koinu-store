import { blobFromDataUrl, fileFromBlob, isDataUrl, isPublicAsset } from "@/lib/image-client";
import type { CartItem, CustomDetails, PrintSide, PrintStamp } from "@/lib/types";

async function replaceUploadable(
  value: string | null | undefined,
  key: string,
  form: FormData,
) {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (isDataUrl(value)) {
    form.append(key, fileFromBlob(await blobFromDataUrl(value), key));
    return key;
  }
  if (isPublicAsset(value)) {
    const response = await fetch(value);
    if (!response.ok) return value;
    const blob = await response.blob();
    const okType = /image\/(jpeg|jpg|png|webp)/i.test(blob.type) || /\.(jpe?g|png|webp)$/i.test(value);
    if (!okType) return value;
    form.append(key, fileFromBlob(blob, key));
    return key;
  }
  return value;
}

async function persistCustom(custom: CustomDetails, itemIndex: number, form: FormData) {
  const stamps: PrintStamp[] = [];
  if (custom.stamps?.length) {
    for (const [index, stamp] of custom.stamps.entries()) {
      stamps.push({
        ...stamp,
        artworkDataUrl:
          (await replaceUploadable(stamp.artworkDataUrl, `i${itemIndex}-art-${index}`, form)) ??
          stamp.artworkDataUrl,
        printFileUrl:
          (await replaceUploadable(
            stamp.printFileUrl ?? stamp.artworkDataUrl,
            `i${itemIndex}-print-${index}`,
            form,
          )) ?? stamp.printFileUrl,
      });
    }
  }

  const previewBySide: Partial<Record<PrintSide, string>> = {};
  for (const [side, url] of Object.entries(custom.previewBySide ?? {})) {
    const next = await replaceUploadable(url, `i${itemIndex}-pos-${side}`, form);
    if (next) previewBySide[side as PrintSide] = next;
  }

  return {
    ...custom,
    artworkDataUrl:
      stamps[0]?.printFileUrl ??
      stamps[0]?.artworkDataUrl ??
      (await replaceUploadable(custom.artworkDataUrl, `i${itemIndex}-art`, form)),
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
  if (!response.ok || !data.urls) {
    const raw = data.error || "";
    throw new Error(
      !raw || raw === "fetch failed" || raw === "Load failed"
        ? "No se pudieron guardar las fotos del diseño. Inténtalo de nuevo."
        : raw,
    );
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
