import { formatPrice, kindLabel, positionLabel, sideLabel } from "@/lib/format";
import { printFontLabel } from "@/lib/print-fonts";
import type { CartItem, PrintPlacement, PrintStamp, PrintSide } from "@/lib/types";
import { PRINT_SIDES } from "@/lib/types";
import { whatsappHref } from "@/lib/whatsapp";

function placeHint(placement: PrintPlacement) {
  const cx = placement.x + placement.width / 2;
  const cy = placement.y + placement.height / 2;
  const h = cx < 38 ? "izquierda" : cx > 62 ? "derecha" : "centro";
  const v = cy < 38 ? "arriba" : cy > 62 ? "abajo" : "al medio";
  return `${v} ${h}, ${Math.round(placement.width)}% de ancho × ${Math.round(placement.height)}% de alto`;
}

function stampName(stamp: PrintStamp) {
  const name = stamp.printFileName?.trim();
  if (name) return name;
  if (stamp.artworkDataUrl?.startsWith("/")) {
    const file = stamp.artworkDataUrl.split("/").pop();
    if (file) return file.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
  }
  return "imagen subida por el cliente";
}

function stampLines(stamp: PrintStamp, index: number) {
  const rotation = stamp.rotation ? `, rotación ${Math.round(stamp.rotation)}°` : "";
  return `  ${index + 1}) ${sideLabel(stamp.side)} · ${stampName(stamp)} · ${placeHint(stamp.placement)}${rotation}`;
}

function customBlock(item: CartItem) {
  const custom = item.custom;
  if (!custom) return [];

  const lines: string[] = [];
  const stamps = custom.stamps ?? [];
  const sides = PRINT_SIDES.filter(
    (side) =>
      stamps.some((stamp) => stamp.side === side) ||
      Boolean(custom.text?.trim() && custom.textPlacements?.[side]),
  );
  if (sides.length) {
    lines.push(`Caras: ${sides.map((side) => sideLabel(side)).join(", ")}`);
  }
  lines.push(`Zona: ${positionLabel(custom.position)}`);

  if (custom.text?.trim()) {
    lines.push(
      `Texto: "${custom.text.trim()}" · color ${custom.textColor} · fuente ${printFontLabel(custom.textFont)}`,
    );
    (Object.entries(custom.textPlacements ?? {}) as [PrintSide, PrintPlacement][]).forEach(
      ([side, placement]) => {
        if (!placement) return;
        lines.push(`  Texto en ${sideLabel(side)}: ${placeHint(placement)}`);
      },
    );
  }

  if (stamps.length) {
    lines.push("Diseños (enviar las fotos en este chat):");
    stamps.forEach((stamp, index) => lines.push(stampLines(stamp, index)));
  } else if (custom.artworkDataUrl || custom.placement) {
    lines.push("Diseño: enviar la imagen en este chat");
    if (custom.placement) lines.push(`Ubicación: ${placeHint(custom.placement)}`);
  }

  if (custom.printWidthCm && custom.printHeightCm) {
    lines.push(`Medida aprox. de estampa: ${custom.printWidthCm} × ${custom.printHeightCm} cm`);
  }

  return lines;
}

function cartNeedsManualPhotos(items: CartItem[]) {
  return items.some((item) => {
    const custom = item.custom;
    if (!custom) return false;
    return Boolean(custom.stamps?.length || custom.artworkDataUrl);
  });
}

export function cartWhatsAppMessage(items: CartItem[], total: number) {
  const blocks = items.map((item, index) => {
    const lines = [
      `${index + 1}. ${item.name} × ${item.quantity} — ${formatPrice(item.unitPrice * item.quantity)}`,
      `   Tipo: ${item.kind === "custom" ? "Personalizado" : "Galería"} · ${kindLabel(item.productKind)}`,
    ];
    if (item.colorName || item.color) {
      lines.push(`   Color: ${item.colorName ?? item.color}`);
    }
    if (item.size) lines.push(`   Talla: ${item.size}`);
    customBlock(item).forEach((line) => lines.push(`   ${line}`));
    return lines.join("\n");
  });

  const intro = cartNeedsManualPhotos(items)
    ? [
        "Hola Koinu Store, quiero comprar por WhatsApp.",
        "En este chat te envío las fotos de los diseños.",
      ]
    : ["Hola Koinu Store, quiero comprar por WhatsApp."];

  let message = [
    ...intro,
    "",
    "Pedido:",
    ...blocks,
    "",
    `Total: ${formatPrice(total)} (envío a coordinar)`,
  ].join("\n");

  if (message.length > 3500) {
    message = `${message.slice(0, 3450)}\n\n(Pedido largo: revisa el detalle de arriba.)`;
  }

  return message;
}

export function cartWhatsAppHref(items: CartItem[], total: number) {
  return whatsappHref(cartWhatsAppMessage(items, total));
}
