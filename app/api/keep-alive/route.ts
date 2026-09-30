import { NextResponse } from "next/server";
import { pingSupabaseDatabase } from "@/lib/supabase/keep-alive";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  try {
    await pingSupabaseDatabase();
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Keep-alive falló";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
