import { getStoreProduct, listStoreProducts } from "@/lib/admin-data";
import type { Product } from "@/lib/types";

export async function getProducts(): Promise<Product[]> {
  const products = await listStoreProducts();
  return products.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name, "es"));
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getStoreProduct(slug)) ?? undefined;
}

export async function getFeaturedProducts() {
  const products = await getProducts();
  return products.filter((product) => product.featured).slice(0, 6);
}
