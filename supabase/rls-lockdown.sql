-- Cierra lectura/escritura pública de pedidos. Correr en SQL Editor (proyecto ya existente).
-- El catálogo sigue público. Pedidos solo vía service role (API y admin).

drop policy if exists "orders_public_insert" on public.orders;
drop policy if exists "orders_public_read_own" on public.orders;
drop policy if exists "order_items_public_insert" on public.order_items;
drop policy if exists "order_items_public_read" on public.order_items;
