import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { deleteStoreProduct, parseProductInput, updateStoreProduct } from "@/lib/admin-data";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const product = await updateStoreProduct(id, parseProductInput(body));
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo guardar" },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteStoreProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo borrar" },
      { status: 400 },
    );
  }
}
