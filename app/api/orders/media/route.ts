import { NextResponse } from "next/server";
import { ORDER_ART_BUCKET, uploadPublicFile } from "@/lib/supabase/storage";

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
      const remote = await uploadPublicFile(
        ORDER_ART_BUCKET,
        `checkout/${batch}/${name}`,
        bytes,
        file.type || `image/${ext === "jpg" ? "jpeg" : ext}`,
      );
      if (!remote) {
        return NextResponse.json(
          {
            error:
              process.env.NODE_ENV === "production"
                ? "No se pudieron guardar las imágenes. Inténtalo de nuevo."
                : "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor. En Netlify: Site configuration → Environment variables.",
            code: "NO_STORAGE",
          },
          { status: 503 },
        );
      }
      urls[key] = remote;
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo subir a Storage";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  return NextResponse.json({ urls });
}
