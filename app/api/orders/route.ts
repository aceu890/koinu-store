import { NextResponse } from "next/server";
import { buildLocalOrder, saveLocalOrder } from "@/lib/admin-data";
import { persistCustomDetails } from "@/lib/order-media";
import { createServerSupabase } from "@/lib/supabase/server";
import type { CartItem, CheckoutPayload } from "@/lib/types";

function isItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as CartItem;
  return (
    typeof item.name === "string" &&
    typeof item.unitPrice === "number" &&
    typeof item.quantity === "number" &&
    (item.kind === "catalog" || item.kind === "custom")
  );
}

export async function POST(request: Request) {
  let body: CheckoutPayload;

  try {
    body = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items.filter(isItem) : [];
  if (!body.customerName?.trim() || !body.email?.trim() || !body.address?.trim()) {
    return NextResponse.json({ error: "Faltan datos del cliente" }, { status: 400 });
  }
  if (!items.length) {
    return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
  }

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const supabase = await createServerSupabase();

  async function withSavedArt(orderId: string): Promise<CartItem[]> {
    return Promise.all(
      items.map(async (item, index) => {
        if (!item.custom) return item;
        return {
          ...item,
          custom: await persistCustomDetails(item.custom, orderId, `item-${index + 1}`),
        };
      }),
    );
  }

  if (!supabase) {
    const id = crypto.randomUUID();
    try {
      const savedItems = await withSavedArt(id);
      await saveLocalOrder(buildLocalOrder({ ...body, items: savedItems }, id, total));
      return NextResponse.json({
        id,
        total,
        offline: true,
      });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "No se pudieron guardar las imágenes" },
        { status: 500 },
      );
    }
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: body.customerName.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || null,
      address: body.address.trim(),
      city: body.city?.trim() || null,
      notes: body.notes?.trim() || null,
      payment_method: body.paymentMethod,
      status: "pending",
      total,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message ?? "No se pudo crear el pedido" },
      { status: 500 },
    );
  }

  let savedItems: CartItem[];
  try {
    savedItems = await withSavedArt(order.id);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudieron guardar las imágenes" },
      { status: 500 },
    );
  }

  const rows = savedItems.map((item) => ({
    order_id: order.id,
    kind: item.kind,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    details: {
      productSlug: item.productSlug ?? null,
      color: item.color ?? null,
      colorName: item.colorName ?? null,
      size: item.size ?? null,
      design: item.design ?? null,
      productKind: item.productKind,
      custom: item.custom ?? null,
    },
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(rows);
  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  await saveLocalOrder(buildLocalOrder({ ...body, items: savedItems }, order.id, total));
  return NextResponse.json({ id: order.id, total });
}
