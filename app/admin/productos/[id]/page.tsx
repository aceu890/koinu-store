import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { ProductForm } from "@/components/admin/product-form";
import { listStoreProducts } from "@/lib/admin-data";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const products = await listStoreProducts({ includeHidden: true });
  const product = products.find((item) => item.id === id);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/productos" className="text-sm text-ink/50 hover:text-ink">
        ← Productos
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Editar producto</h1>
        <DeleteProductButton id={product.id} name={product.name} />
      </div>
      <div className="mt-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
