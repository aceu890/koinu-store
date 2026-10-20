import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { ORDER_ART_BUCKET, uploadPublicFile } from "@/lib/supabase/storage";

type StoredArt = { bytes: Buffer; contentType: string };

const memory = new Map<string, StoredArt>();

function safeObjectPath(objectPath: string) {
  const clean = objectPath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!clean || clean.includes("..") || !/^[a-zA-Z0-9._/-]+$/.test(clean)) return null;
  return clean;
}

function diskFile(objectPath: string) {
  return path.join(process.cwd(), "public", "uploads", "orders", objectPath);
}

function mimeFromName(objectPath: string, fallback = "image/jpeg") {
  if (objectPath.endsWith(".png")) return "image/png";
  if (objectPath.endsWith(".webp")) return "image/webp";
  if (objectPath.endsWith(".jpg") || objectPath.endsWith(".jpeg")) return "image/jpeg";
  return fallback;
}

function toArrayBuffer(bytes: Buffer): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function saveBlobs(objectPath: string, bytes: Buffer, contentType: string) {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("order-art");
    await store.set(objectPath, toArrayBuffer(bytes), { metadata: { contentType } });
    return true;
  } catch {
    return false;
  }
}

async function readBlobs(objectPath: string): Promise<StoredArt | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("order-art");
    const result = await store.getWithMetadata(objectPath, { type: "arrayBuffer" });
    if (!result?.data) return null;
    const contentType =
      typeof result.metadata?.contentType === "string"
        ? result.metadata.contentType
        : mimeFromName(objectPath);
    return { bytes: Buffer.from(result.data), contentType };
  } catch {
    return null;
  }
}

export async function putOrderArt(objectPath: string, bytes: Buffer, contentType: string) {
  const clean = safeObjectPath(objectPath);
  if (!clean) throw new Error("Ruta de imagen inválida");
  memory.set(clean, { bytes, contentType });

  try {
    const remote = await uploadPublicFile(ORDER_ART_BUCKET, clean, bytes, contentType);
    if (remote) return remote;
  } catch {
    // Storage can be paused or unreachable; keep a local public copy.
  }

  const blobOk = await saveBlobs(clean, bytes, contentType);
  try {
    await mkdir(path.dirname(diskFile(clean)), { recursive: true });
    await writeFile(diskFile(clean), bytes);
  } catch (error) {
    if (!blobOk && !memory.has(clean)) {
      throw error instanceof Error ? error : new Error("No se pudieron guardar las fotos");
    }
  }

  return `/api/orders/media/${clean}`;
}

export async function getOrderArt(objectPath: string) {
  const clean = safeObjectPath(objectPath);
  if (!clean) return null;

  const cached = memory.get(clean);
  if (cached) return cached;

  const fromBlobs = await readBlobs(clean);
  if (fromBlobs) {
    memory.set(clean, fromBlobs);
    return fromBlobs;
  }

  try {
    const bytes = await readFile(diskFile(clean));
    return { bytes, contentType: mimeFromName(clean) };
  } catch {
    return null;
  }
}
