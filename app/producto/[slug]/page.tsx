import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AddToCart } from "@/components/add-to-cart";
import { Mascot } from "@/components/mascot";
import { ProductMock } from "@/components/product-mock";
import { getProduct, getProducts } from "@/lib/products";
import { formatPrice, kindLabel } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product?.name ?? "Producto" };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div className="rounded-[2rem] bg-mock p-8">
        <ProductMock kind={product.kind} color={product.colors[0]} design={product.design} />
      </div>
      <div>
        <Link href="/galeria" className="text-sm text-ink/50 hover:text-ink">
          ← Galería
        </Link>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-ink/50">
          {kindLabel(product.kind)} · {product.category}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold">{product.name}</h1>
        <p className="mt-4 text-ink/70">{product.description}</p>
        <p className="mt-4 font-display text-2xl font-bold">{formatPrice(product.price)}</p>
        <AddToCart product={product} />
        <div className="mt-6 w-36">
          <Mascot name="questions" alt="¿Tienes dudas? Escríbenos" size={200} />
        </div>
        <p className="mt-8 text-sm text-ink/55">
          ¿Querés este mismo producto con otro texto o imagen?{" "}
          <Link href="/personalizar" className="font-semibold text-magenta">
            Personalizalo
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
