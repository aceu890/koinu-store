import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { deleteDemoOrders, seedDemoOrders } from "@/lib/admin-data";

export async function POST() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const result = await seedDemoOrders();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudieron crear los pedidos" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const result = await deleteDemoOrders();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudieron borrar los ejemplos" },
      { status: 500 },
    );
  }
}
