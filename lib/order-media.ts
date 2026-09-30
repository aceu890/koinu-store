import { copyFile, mkdir, writeFile } from "fs/promises";
import path from "path";
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

function publicFilePath(url: string) {
  const clean = decodeURIComponent(url.split("?")[0]).replace(/^\/+/, "");
  const abs = path.resolve(process.cwd(), "public", clean);
  const root = path.resolve(process.cwd(), "public");
  if (!abs.startsWith(root)) return null;
  return abs;
}

function orderUrl(dir: string, file: string) {
  return `/uploads/orders/${path.basename(dir)}/${file}`;
}

async function saveBytes(
  bytes: Buffer,
  mime: string,
  dir: string,
  name: string,
) {
  const ext = extFor(mime);
  const file = `${name}.${ext}`;
  const contentType = mime.includes("png")
    ? "image/png"
    : mime.includes("webp")
      ? "image/webp"
      : "image/jpeg";

  const remote = await uploadPublicFile(
    ORDER_ART_BUCKET,
    `orders/${path.basename(dir)}/${file}`,
    bytes,
    contentType,
  );
  if (remote) return remote;

  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, file), bytes);
  return orderUrl(dir, file);
}

async function saveDataUrl(dataUrl: string, dir: string, name: string) {
  const match = dataUrl.match(DATA_URL);
  if (!match) return keepUrl(dataUrl);
  return saveBytes(Buffer.from(match[2], "base64"), match[1], dir, name);
}

async function persistAsset(value: string | null | undefined, dir: string, name: string) {
  if (!value || value === "[uploaded]") return null;
  if (value.startsWith("data:")) return saveDataUrl(value, dir, name);
  const kept = keepUrl(value);
  if (!kept) return null;
  if (kept.startsWith("/uploads/orders/") || isSupabasePublicUrl(kept) || kept.startsWith("/Stickers/")) {
    return kept;
  }
  const src = publicFilePath(kept);
  if (!src) return kept;
  const ext = path.extname(src) || ".png";
  const file = `${name}${ext}`;
  try {
    await mkdir(dir, { recursive: true });
    await copyFile(src, path.join(dir, file));
    return orderUrl(dir, file);
  } catch {
    return kept;
  }
}

async function persistStamp(stamp: PrintStamp, dir: string, name: string): Promise<PrintStamp> {
  const preview = (await persistAsset(stamp.artworkDataUrl, dir, `${name}-preview`)) ?? stamp.artworkDataUrl;
  const printFileUrl =
    (await persistAsset(stamp.printFileUrl ?? stamp.artworkDataUrl, dir, `${name}-sublimar`)) ?? preview;
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
  const dir = path.join(process.cwd(), "public", "uploads", "orders", orderId);
  const prefix = itemKey.replace(/[^a-z0-9_-]/gi, "").slice(0, 24) || "item";

  const stamps = custom.stamps
    ? await Promise.all(
        custom.stamps.map((stamp, index) => persistStamp(stamp, dir, `${prefix}-art-${index + 1}`)),
      )
    : custom.stamps;

  const previewBySide = custom.previewBySide
    ? Object.fromEntries(
        await Promise.all(
          Object.entries(custom.previewBySide).map(async ([side, url]) => {
            if (!url) return [side, url];
            return [side, (await persistAsset(url, dir, `${prefix}-pos-${side}`)) ?? url];
          }),
        ),
      )
    : custom.previewBySide;

  const artworkDataUrl =
    stamps?.[0]?.printFileUrl ??
    stamps?.[0]?.artworkDataUrl ??
    (await persistAsset(custom.artworkDataUrl, dir, `${prefix}-art`)) ??
    custom.artworkDataUrl ??
    null;

  return {
    ...custom,
    artworkDataUrl,
    stamps,
    previewBySide: previewBySide as CustomDetails["previewBySide"],
  };
}
