export function formatPrice(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function kindLabel(kind: string) {
  const labels: Record<string, string> = {
    shirt: "Camiseta",
    hoodie: "Buzo",
    mug: "Taza",
    tote: "Tote",
    cap: "Gorra",
    print3d: "Impresión 3D",
  };
  return labels[kind] ?? kind;
}

export function positionLabel(position: string) {
  const labels: Record<string, string> = {
    chest: "Pecho",
    center: "Centro",
    back: "Espalda",
    wrap: "Envolvente",
  };
  return labels[position] ?? position;
}

export function sideLabel(side: string) {
  const labels: Record<string, string> = {
    front: "Frente",
    back: "Espalda",
    left: "Perfil izq.",
    right: "Perfil der.",
  };
  return labels[side] ?? side;
}

export function orderStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    paid: "Pagado",
    in_production: "En producción",
    shipped: "Enviado",
    completed: "Completado",
    cancelled: "Cancelado",
  };
  return labels[status] ?? status;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function paymentLabel(method: string) {
  const labels: Record<string, string> = {
    transferencia: "Transferencia",
    efectivo: "Efectivo",
  };
  return labels[method] ?? method;
}

export function sideTo(side: string) {
  const labels: Record<string, string> = {
    front: "el frente",
    back: "la espalda",
    left: "el perfil izquierdo",
    right: "el perfil derecho",
  };
  return labels[side] ?? side;
}
