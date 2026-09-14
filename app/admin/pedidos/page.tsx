import { OrdersTable } from "@/components/admin/orders-table";
import { listOrders } from "@/lib/admin-data";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Ventas</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Pedidos</h1>
      <p className="mt-2 text-sm text-ink/60">
        {orders.length
          ? `${orders.length} ${orders.length === 1 ? "pedido" : "pedidos"} en el taller.`
          : "Cuando confirmen una compra, el pedido llega a esta lista."}
      </p>
      <div className="mt-6">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
