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
