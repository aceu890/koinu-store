import { NextResponse } from "next/server";
import { putOrderArt } from "@/lib/order-art-store";

const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function extFromName(name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "png";
  if (lower.endsWith(".webp")) return "webp";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "jpg";
  return null;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const entries = [...form.entries()].filter((entry): entry is [string, File] => entry[1] instanceof File);
  if (!entries.length) {
    return NextResponse.json({ error: "No hay imágenes" }, { status: 400 });
  }
  if (entries.length > 24) {
    return NextResponse.json({ error: "Demasiadas imágenes" }, { status: 400 });
  }

  const batch = crypto.randomUUID();
  const urls: Record<string, string> = {};

  for (const [key, file] of entries) {
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Cada imagen debe pesar menos de 8 MB" }, { status: 400 });
    }
    const ext = ALLOWED.get(file.type) ?? extFromName(file.name);
    if (!ext) {
      return NextResponse.json({ error: "Usa JPG, PNG o WEBP" }, { status: 400 });
    }
    const safeKey = key.replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "file";
    const name = `${safeKey}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    try {
      urls[key] = await putOrderArt(
        `checkout/${batch}/${name}`,
        bytes,
        file.type || `image/${ext === "jpg" ? "jpeg" : ext}`,
      );
    } catch {
      return NextResponse.json(
        { error: "No se pudieron guardar las fotos del diseño. Inténtalo de nuevo." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ urls });
}
