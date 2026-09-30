import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { PRODUCT_IMAGES_BUCKET, uploadPublicFile } from "@/lib/supabase/storage";

const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Sube una imagen" }, { status: 400 });
  }
  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Máximo 4 MB" }, { status: 400 });
  }

  const ext = ALLOWED.get(file.type);
  if (!ext) {
    return NextResponse.json({ error: "Usa JPG, PNG, WEBP o GIF" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  try {
    const remote = await uploadPublicFile(PRODUCT_IMAGES_BUCKET, name, bytes, file.type);
    if (remote) {
      return NextResponse.json({ url: remote });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo subir a Storage";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const dir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return NextResponse.json({ url: `/uploads/products/${name}` });
}
