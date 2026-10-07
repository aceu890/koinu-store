import type { CustomDetails, PrintStamp } from "@/lib/types";
import { ORDER_ART_BUCKET, isSupabasePublicUrl, uploadPublicFile } from "@/lib/supabase/storage";

const DATA_URL = /^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/i;

function extFor(mime: string) {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  return "jpg";
}

function keepUrl(value: string | null | undefined) {
  if (!value) return null;
  if (value.startsWith("/Stickers/") || value.startsWith("/uploads/")) return value;
  if (isSupabasePublicUrl(value)) return value;
  if (value.startsWith("[uploaded]")) return null;
  return null;
}

async function saveBytes(bytes: Buffer, mime: string, orderId: string, name: string) {
  const ext = extFor(mime);
  const file = `${name}.${ext}`;
  const contentType = mime.includes("png")
    ? "image/png"
    : mime.includes("webp")
      ? "image/webp"
      : "image/jpeg";

  const remote = await uploadPublicFile(
    ORDER_ART_BUCKET,
    `orders/${orderId}/${file}`,
    bytes,
    contentType,
  );
  if (!remote) {
    throw new Error("Falta Storage de Supabase para guardar las imágenes");
  }
  return remote;
}

async function saveDataUrl(dataUrl: string, orderId: string, name: string) {
  const match = dataUrl.match(DATA_URL);
  if (!match) return keepUrl(dataUrl);
  return saveBytes(Buffer.from(match[2], "base64"), match[1], orderId, name);
}

async function persistAsset(value: string | null | undefined, orderId: string, name: string) {
  if (!value || value === "[uploaded]") return null;
  if (value.startsWith("data:")) return saveDataUrl(value, orderId, name);
  return keepUrl(value);
}

async function persistStamp(stamp: PrintStamp, orderId: string, name: string): Promise<PrintStamp> {
  const preview = (await persistAsset(stamp.artworkDataUrl, orderId, `${name}-preview`)) ?? stamp.artworkDataUrl;
  const printFileUrl =
    (await persistAsset(stamp.printFileUrl ?? stamp.artworkDataUrl, orderId, `${name}-sublimar`)) ?? preview;
  return {
    ...stamp,
    artworkDataUrl: preview,
    printFileUrl,
  };
}

export async function persistCustomDetails(
  custom: CustomDetails,
  orderId: string,
  itemKey: string,
): Promise<CustomDetails> {
  const prefix = itemKey.replace(/[^a-z0-9_-]/gi, "").slice(0, 24) || "item";

  const stamps = custom.stamps
    ? await Promise.all(
        custom.stamps.map((stamp, index) => persistStamp(stamp, orderId, `${prefix}-art-${index + 1}`)),
      )
    : custom.stamps;

  const previewBySide = custom.previewBySide
    ? Object.fromEntries(
        await Promise.all(
          Object.entries(custom.previewBySide).map(async ([side, url]) => {
            if (!url) return [side, url];
            return [side, (await persistAsset(url, orderId, `${prefix}-pos-${side}`)) ?? url];
          }),
        ),
      )
    : custom.previewBySide;

  const artworkDataUrl =
    stamps?.[0]?.printFileUrl ??
    stamps?.[0]?.artworkDataUrl ??
    (await persistAsset(custom.artworkDataUrl, orderId, `${prefix}-art`)) ??
    custom.artworkDataUrl ??
    null;

  return {
    ...custom,
    artworkDataUrl,
    stamps,
    previewBySide: previewBySide as CustomDetails["previewBySide"],
  };
}
