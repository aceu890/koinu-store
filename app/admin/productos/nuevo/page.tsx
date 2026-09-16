import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/productos" className="text-sm text-ink/50 hover:text-ink">
        ← Productos
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold">Subir producto</h1>
      <p className="mt-2 text-sm text-ink/60">
        Carga foto, precio y detalles. Aparece en la galería si lo dejas visible.
      </p>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
