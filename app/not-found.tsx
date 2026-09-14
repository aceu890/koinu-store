import Link from "next/link";
import { Mascot } from "@/components/mascot";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="mx-auto w-56">
        <Mascot name="error" alt="Error: algo salió mal" size={340} />
      </div>
      <p className="mt-4 font-display text-6xl font-bold">404</p>
      <p className="mt-3 text-ink/70">Esa página no está en el taller.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-ink px-5 py-3 text-paper">
        Volver al inicio
      </Link>
    </div>
  );
}
