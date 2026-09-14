import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { updateOrderStatus } from "@/lib/admin-data";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  let status: string;
  try {
    const body = (await request.json()) as { status?: string };
    status = String(body.status ?? "");
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  try {
    const order = await updateOrderStatus(id, status as OrderStatus);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo actualizar" },
      { status: 400 },
    );
  }
}
