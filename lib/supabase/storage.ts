import { createServiceSupabase } from "@/lib/supabase/admin";
import { supabasePublicUrl } from "@/lib/supabase/config";

export const PRODUCT_IMAGES_BUCKET = "product-images";
export const ORDER_ART_BUCKET = "order-art";

export function isSupabasePublicUrl(value: string) {
  const base = supabasePublicUrl();
  if (!base || !value.startsWith("http")) return false;
  try {
    const url = new URL(value);
    const expected = new URL(base);
    return url.origin === expected.origin && url.pathname.startsWith("/storage/v1/object/public/");
  } catch {
    return false;
  }
}

export function isStoredImageUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value !== "[uploaded]" &&
    (value.startsWith("/") || value.startsWith("data:") || isSupabasePublicUrl(value))
  );
}

function storageMime(contentType: string) {
  if (contentType === "image/jpg") return "image/jpeg";
  return contentType || "image/jpeg";
}

export async function uploadPublicFile(
  bucket: string,
  objectPath: string,
  bytes: Buffer | Uint8Array,
  contentType: string,
) {
  const supabase = createServiceSupabase();
  if (!supabase) return null;

  const mime = storageMime(contentType);
  const { error } = await supabase.storage.from(bucket).upload(objectPath, bytes, {
    contentType: mime,
    upsert: true,
  });
  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}
