-- Koinu Store — schema + seed
-- Pegá este archivo en el SQL Editor de Supabase y ejecutalo.

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price integer not null,
  category text not null,
  kind text not null,
  design text not null default 'blank',
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  featured boolean not null default false,
  in_stock boolean not null default true,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  phone text,
  address text not null,
  city text,
  notes text,
  payment_method text not null,
  status text not null default 'pending',
  total integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  kind text not null,
  product_name text not null,
  quantity integer not null,
  unit_price integer not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  using (true);

drop policy if exists "orders_public_insert" on public.orders;
create policy "orders_public_insert"
  on public.orders for insert
  with check (true);

drop policy if exists "orders_public_read_own" on public.orders;
create policy "orders_public_read_own"
  on public.orders for select
  using (true);

drop policy if exists "order_items_public_insert" on public.order_items;
create policy "order_items_public_insert"
  on public.order_items for insert
  with check (true);

drop policy if exists "order_items_public_read" on public.order_items;
create policy "order_items_public_read"
  on public.order_items for select
  using (true);

insert into public.products
  (slug, name, description, price, category, kind, design, colors, sizes, featured)
values
  (
    'camiseta-sakura-night',
    'Camiseta Sakura Night',
    'Estampado floral sobre negro. Sublimación de alta definición, tela 100% poliéster premium.',
    18990, 'camisetas', 'shirt', 'sakura', array['#111111'], array['S','M','L','XL'], true
  ),
  (
    'buzo-koinu-club',
    'Buzo Koinu Club',
    'Buzo oversized con estampado club. Interior frisa, print duradero al lavado.',
    34990, 'buzos', 'hoodie', 'koinu', array['#1F2937'], array['S','M','L','XL','XXL'], true
  ),
  (
    'taza-buenos-dias',
    'Taza Buenos días, jefe',
    'Taza cerámica 11 oz con sublimación envolvente. Apta microondas.',
    8990, 'tazas', 'mug', 'buenos-dias', array['#FFFFFF'], array[]::text[], true
  ),
  (
    'tote-mercado-vintage',
    'Tote Mercado Vintage',
    'Bolso de lona gruesa con estampado vintage.',
    12990, 'bolsos', 'tote', 'mercado', array['#F5E6C8'], array[]::text[], true
  ),
  (
    'gorra-studio-print',
    'Gorra Studio Print',
    'Gorra trucker con estampado del taller. Ajuste snapback.',
    11990, 'gorras', 'cap', 'studio', array['#0F766E'], array['Única'], false
  ),
  (
    'camiseta-pixel-pup',
    'Camiseta Pixel Pup',
    'Ilustración pixel del perrito Koinu. Colores vivos, cuello reforzado.',
    17990, 'camisetas', 'shirt', 'pixel', array['#F4E1C1'], array['S','M','L','XL'], true
  ),
  (
    'taza-cafe-plotter',
    'Taza Café & Plotter',
    'Homenaje al taller: café, plotter y deadline.',
    8490, 'tazas', 'mug', 'cafe', array['#FFFFFF'], array[]::text[], false
  ),
  (
    'buzo-overprint',
    'Buzo Overprint',
    'Tipografía grande estilo taller de serigrafía.',
    32990, 'buzos', 'hoodie', 'overprint', array['#7F1D1D'], array['M','L','XL','XXL'], false
  ),
  (
    'camiseta-ruta-nocturna',
    'Camiseta Ruta Nocturna',
    'Gráfico de carretera y neón.',
    19990, 'camisetas', 'shirt', 'ruta', array['#0B1220'], array['S','M','L','XL','XXL'], false
  ),
  (
    'tote-koinu',
    'Tote Koinu',
    'El isotipo del taller a gran escala.',
    11990, 'bolsos', 'tote', 'koinu', array['#FFFFFF'], array[]::text[], false
  ),
  (
    'gorra-flash-print',
    'Gorra Flash Print',
    'Frente estampado con rayo de taller.',
    10990, 'gorras', 'cap', 'flash', array['#1A1A1A'], array['Única'], true
  ),
  (
    'taza-team-koinu',
    'Taza Team Koinu',
    'Para el equipo, clientes y quien viva en el taller.',
    7990, 'tazas', 'mug', 'team', array['#FFFFFF'], array[]::text[], false
  )
on conflict (slug) do nothing;

alter table public.products add column if not exists image_url text;

