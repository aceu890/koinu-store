import { PRODUCTS } from "@/lib/catalog";
import { createServerSupabase } from "@/lib/supabase/server";
import type { DesignKey, Product, ProductKind } from "@/lib/types";

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
};

function mapRow(row: ProductRow): Product {
  return {
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
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return PRODUCTS;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("featured", { ascending: false })
    .order("name");

  if (error || !data?.length) return PRODUCTS;
  return (data as ProductRow[]).map(mapRow);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const supabase = await createServerSupabase();
  if (!supabase) return PRODUCTS.find((product) => product.slug === slug);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return PRODUCTS.find((product) => product.slug === slug);
  return mapRow(data as ProductRow);
}

export async function getFeaturedProducts() {
  const products = await getProducts();
  return products.filter((product) => product.featured).slice(0, 6);
}
