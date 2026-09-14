import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminToken,
  getAdminPassword,
  passwordsMatch,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!getAdminPassword()) {
    return NextResponse.json(
      { error: "Configurá ADMIN_PASSWORD en el servidor." },
      { status: 500 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!passwordsMatch(password)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createAdminToken(), adminCookieOptions());
  return response;
}
