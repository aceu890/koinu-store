import { OrdersTable } from "@/components/admin/orders-table";
import { listOrders } from "@/lib/admin-data";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Ventas</p>
      <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Pedidos</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/60">
        {orders.length
          ? "Estampa y posición van juntas en cada pedido. Descargá desde las miniaturas o entrá a Ver detalle."
          : "Cuando confirmen una compra, el pedido llega a esta lista."}
      </p>
      <div className="mt-6">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
