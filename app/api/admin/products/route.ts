import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { createStoreProduct, parseProductInput } from "@/lib/admin-data";

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const product = await createStoreProduct(parseProductInput(body));
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo crear" },
      { status: 400 },
    );
  }
}
