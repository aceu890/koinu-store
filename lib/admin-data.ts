import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { PRODUCTS } from "@/lib/catalog";
import { slugify } from "@/lib/format";
import { createServiceSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import type {
  AdminOrder,
  AdminOrderItem,
  CartItem,
  CheckoutPayload,
  DesignKey,
  OrderStatus,
  Product,
  ProductKind,
} from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/types";

type LocalStore = {
  products: Product[];
  deletedProductIds: string[];
  orders: AdminOrder[];
  orderStatus: Record<string, OrderStatus>;
};

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

const emptyStore = (): LocalStore => ({
  products: [],
  deletedProductIds: [],
  orders: [],
  orderStatus: {},
});

function isStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

export function normalizeProduct(product: Product): Product {
  return {
    ...product,
    inStock: product.inStock !== false,
    imageUrl: product.imageUrl ?? null,
  };
}

function mergeProducts(base: Product[], store: LocalStore): Product[] {
  const deleted = new Set(store.deletedProductIds);
  const overlay = new Map(store.products.map((product) => [product.slug, normalizeProduct(product)]));
  const merged = base
    .filter((product) => !deleted.has(product.id) && !deleted.has(product.slug))
    .map((product) => overlay.get(product.slug) ?? normalizeProduct(product));
  const extras = store.products
    .map(normalizeProduct)
    .filter((product) => !merged.some((item) => item.slug === product.slug) && !deleted.has(product.id));
  return [...merged, ...extras];
}

async function readStore(): Promise<LocalStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<LocalStore>;
    return {
      products: Array.isArray(parsed.products) ? parsed.products : [],
      deletedProductIds: Array.isArray(parsed.deletedProductIds) ? parsed.deletedProductIds : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      orderStatus: parsed.orderStatus ?? {},
    };
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: LocalStore) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  kind: ProductKind;
  design: DesignKey;
  colors: string[];
  sizes: string[];
  featured: boolean;
  in_stock?: boolean;
  image_url?: string | null;
};

export function mapProductRow(row: ProductRow): Product {
  return normalizeProduct({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    price: row.price,
    category: row.category,
    kind: row.kind,
    design: row.design,
    colors: row.colors ?? [],
    sizes: row.sizes ?? [],
    featured: row.featured,
    inStock: row.in_stock !== false,
    imageUrl: row.image_url ?? null,
  });
}

function toProductRow(product: Product) {
  return {
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    kind: product.kind,
    design: product.design,
    colors: product.colors,
    sizes: product.sizes,
    featured: product.featured,
    in_stock: product.inStock !== false,
    image_url: product.imageUrl ?? null,
  };
}

async function catalogProducts(): Promise<Product[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return PRODUCTS.map(normalizeProduct);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("featured", { ascending: false })
    .order("name");

  if (error || !data?.length) return PRODUCTS.map(normalizeProduct);
  return (data as ProductRow[]).map(mapProductRow);
}

export async function listStoreProducts(options?: { includeHidden?: boolean }) {
  const store = await readStore();
  let products = mergeProducts(await catalogProducts(), store);
  if (!options?.includeHidden) {
    products = products.filter((product) => product.inStock !== false);
  }
  return products;
}

export async function getStoreProduct(slug: string) {
  const products = await listStoreProducts({ includeHidden: true });
  return products.find((product) => product.slug === slug);
}

export type ProductInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  kind: ProductKind;
  design: DesignKey;
  colors: string[];
  sizes: string[];
  featured: boolean;
  inStock: boolean;
  imageUrl: string | null;
};

const KINDS: ProductKind[] = ["shirt", "hoodie", "mug", "tote", "cap", "print3d"];
const DESIGNS: DesignKey[] = [
  "sakura",
  "koinu",
  "buenos-dias",
  "mercado",
  "studio",
  "pixel",
  "cafe",
  "overprint",
  "ruta",
  "flash",
  "team",
  "blank",
];

export function parseProductInput(body: Record<string, unknown>): ProductInput {
  const name = String(body.name ?? "").trim();
  const slug = slugify(String(body.slug ?? name));
  const description = String(body.description ?? "").trim();
  const price = Number(body.price);
  const category = String(body.category ?? "").trim();
  const kind = body.kind as ProductKind;
  const design = (body.design as DesignKey) || "blank";
  const colors = Array.isArray(body.colors)
    ? body.colors.map((value) => String(value).trim()).filter(Boolean)
    : String(body.colors ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
  const sizes = Array.isArray(body.sizes)
    ? body.sizes.map((value) => String(value).trim()).filter(Boolean)
    : String(body.sizes ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

  if (!name || !slug) throw new Error("Nombre y slug son obligatorios");
  if (!Number.isFinite(price) || price < 0) throw new Error("Precio inválido");
  if (!category) throw new Error("Elige una categoría");
  if (!KINDS.includes(kind)) throw new Error("Tipo de producto inválido");
  if (!DESIGNS.includes(design)) throw new Error("Diseño inválido");

  return {
    name,
    slug,
    description,
    price: Math.round(price),
    category,
    kind,
    design,
    colors: colors.length ? colors : ["#F7F4EF"],
    sizes,
    featured: Boolean(body.featured),
    inStock: body.inStock !== false,
    imageUrl: body.imageUrl ? String(body.imageUrl) : null,
  };
}

export async function createStoreProduct(input: ProductInput) {
  const product: Product = normalizeProduct({
    id: crypto.randomUUID(),
    ...input,
  });
  const service = createServiceSupabase();
  if (service) {
    const { data, error } = await service
      .from("products")
      .insert(toProductRow(product))
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapProductRow(data as ProductRow);
  }

  const store = await readStore();
  if (store.products.some((item) => item.slug === product.slug) || PRODUCTS.some((item) => item.slug === product.slug)) {
    throw new Error("Ya existe un producto con ese slug");
  }
  store.products.push(product);
  await writeStore(store);
  return product;
}

export async function updateStoreProduct(id: string, input: ProductInput) {
  const service = createServiceSupabase();
  if (service) {
    const { data, error } = await service
      .from("products")
      .update(toProductRow({ id, ...input }))
      .eq("id", id)
      .select("*")
      .single();
    if (!error && data) return mapProductRow(data as ProductRow);
  }

  const store = await readStore();
  const current = mergeProducts(await catalogProducts(), store);
  const existing = current.find((item) => item.id === id);
  if (!existing) throw new Error("Producto no encontrado");
  const next = normalizeProduct({ ...existing, ...input, id: existing.id });
  store.products = [
    ...store.products.filter((item) => item.id !== id && item.slug !== existing.slug),
    next,
  ];
  store.deletedProductIds = store.deletedProductIds.filter((value) => value !== id && value !== existing.slug);
  await writeStore(store);
  return next;
}

export async function deleteStoreProduct(id: string) {
  const service = createServiceSupabase();
  if (service) {
    const { error } = await service.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }

  const store = await readStore();
  store.products = store.products.filter((item) => item.id !== id);
  if (!store.deletedProductIds.includes(id)) store.deletedProductIds.push(id);
  await writeStore(store);
}

function mapOrderStatus(value: string | null | undefined): OrderStatus {
  return value && isStatus(value) ? value : "pending";
}

function itemsFromCart(items: CartItem[]): AdminOrderItem[] {
  return items.map((item) => ({
    id: item.id,
    kind: item.kind,
    productName: item.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    details: {
      productSlug: item.productSlug ?? null,
      color: item.color ?? null,
      colorName: item.colorName ?? null,
      size: item.size ?? null,
      design: item.design ?? null,
      productKind: item.productKind,
      custom: item.custom
        ? {
            ...item.custom,
            artworkDataUrl: item.custom.artworkDataUrl ? "[uploaded]" : null,
            stamps: item.custom.stamps?.map((stamp) => ({
              ...stamp,
              artworkDataUrl: stamp.artworkDataUrl ? "[uploaded]" : "",
            })),
          }
        : null,
    },
  }));
}

export function buildLocalOrder(payload: CheckoutPayload, id: string, total: number): AdminOrder {
  return {
    id,
    customerName: payload.customerName.trim(),
    email: payload.email.trim(),
    phone: payload.phone?.trim() || null,
    address: payload.address.trim(),
    city: payload.city?.trim() || null,
    notes: payload.notes?.trim() || null,
    paymentMethod: payload.paymentMethod,
    status: "pending",
    total,
    createdAt: new Date().toISOString(),
    items: itemsFromCart(payload.items),
  };
}

export async function saveLocalOrder(order: AdminOrder) {
  const store = await readStore();
  store.orders = [order, ...store.orders.filter((item) => item.id !== order.id)];
  await writeStore(store);
}

type OrderRow = {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  address: string;
  city: string | null;
  notes: string | null;
  payment_method: string;
  status: string;
  total: number;
  created_at: string;
  order_items?: Array<{
    id: string;
    kind: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    details: Record<string, unknown> | null;
  }>;
};

function mapOrderRow(row: OrderRow, statusOverride?: OrderStatus): AdminOrder {
  return {
    id: row.id,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    notes: row.notes,
    paymentMethod: row.payment_method,
    status: statusOverride ?? mapOrderStatus(row.status),
    total: row.total,
    createdAt: row.created_at,
    items: (row.order_items ?? []).map((item) => ({
      id: item.id,
      kind: item.kind,
      productName: item.product_name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      details: item.details ?? {},
    })),
  };
}

export async function listOrders(): Promise<AdminOrder[]> {
  const store = await readStore();
  const supabase = await createServerSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (!error && data?.length) {
      const remote = (data as OrderRow[]).map((row) =>
        mapOrderRow(row, store.orderStatus[row.id]),
      );
      const remoteIds = new Set(remote.map((order) => order.id));
      const locals = store.orders.filter((order) => !remoteIds.has(order.id));
      return [...remote, ...locals].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
  }

  return store.orders.map((order) => ({
    ...order,
    status: store.orderStatus[order.id] ?? order.status,
  }));
}

export async function getOrder(id: string) {
  const orders = await listOrders();
  return orders.find((order) => order.id === id) ?? null;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const service = createServiceSupabase();
  if (service) {
    const { error } = await service.from("orders").update({ status }).eq("id", id);
    if (!error) {
      const store = await readStore();
      if (store.orderStatus[id]) {
        delete store.orderStatus[id];
        await writeStore(store);
      }
      const order = await getOrder(id);
      if (order) return { ...order, status };
    }
  }

  const store = await readStore();
  store.orderStatus[id] = status;
  store.orders = store.orders.map((order) =>
    order.id === id ? { ...order, status } : order,
  );
  await writeStore(store);
  const order = await getOrder(id);
  if (!order) throw new Error("Pedido no encontrado");
  return { ...order, status };
}

export async function getDashboardStats() {
  const [orders, products] = await Promise.all([
    listOrders(),
    listStoreProducts({ includeHidden: true }),
  ]);
  const active = orders.filter((order) => order.status !== "cancelled");
  const pending = orders.filter((order) => order.status === "pending" || order.status === "paid" || order.status === "in_production");
  const revenue = active.reduce((sum, order) => sum + order.total, 0);
  return {
    orderCount: orders.length,
    pendingCount: pending.length,
    revenue,
    productCount: products.length,
    inStockCount: products.filter((product) => product.inStock !== false).length,
    recentOrders: orders.slice(0, 6),
  };
}
