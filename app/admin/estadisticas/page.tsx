import { BusinessStatsView } from "@/components/admin/business-stats";
import { getBusinessStats } from "@/lib/business-stats";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  const stats = await getBusinessStats();

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Negocio</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Estadísticas</h1>
      <p className="mt-2 max-w-xl text-sm text-ink/60">
        Lo principal para ver cómo viene el taller: ventas del mes, ritmo semanal y qué se pide más.
      </p>
      <div className="mt-6">
        <BusinessStatsView stats={stats} />
      </div>
    </div>
  );
}
