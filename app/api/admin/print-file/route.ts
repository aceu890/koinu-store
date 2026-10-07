import path from "path";
import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { isSupabasePublicUrl } from "@/lib/supabase/storage";

function safePublicHref(url: string) {
  const clean = decodeURIComponent(url.split("?")[0]).replace(/^\/+/, "").replace(/\\/g, "/");
  if (!clean.startsWith("uploads/orders/") && !clean.startsWith("Stickers/")) return null;
  if (clean.includes("..")) return null;
  return `/${clean}`;
}

function safeName(value: string | null, fallback: string) {
  const raw = (value || fallback).replace(/[/\\?%*:|"<>]/g, "-").trim();
  return raw || fallback;
}

function mimeFromName(name: string) {
  const ext = path.extname(name).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

function attachment(bytes: Buffer | Uint8Array, name: string, type: string) {
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${name.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

export async function GET(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src") ?? "";
  const name = safeName(searchParams.get("name"), "estampa.png");

  if (isSupabasePublicUrl(src)) {
    try {
      const response = await fetch(src);
      if (!response.ok) {
        return NextResponse.json({ error: "No se encontró el archivo" }, { status: 404 });
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      const type = response.headers.get("content-type") || mimeFromName(name);
      return attachment(bytes, name, type);
    } catch {
      return NextResponse.json({ error: "No se encontró el archivo" }, { status: 404 });
    }
  }

  const href = safePublicHref(src);
  if (!href) {
    return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
  }

  try {
    const origin = new URL(request.url).origin;
    const response = await fetch(new URL(href, origin));
    if (!response.ok) {
      return NextResponse.json({ error: "No se encontró el archivo" }, { status: 404 });
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    const type = response.headers.get("content-type") || mimeFromName(name);
    return attachment(bytes, name, type);
  } catch {
    return NextResponse.json({ error: "No se encontró el archivo" }, { status: 404 });
  }
}
