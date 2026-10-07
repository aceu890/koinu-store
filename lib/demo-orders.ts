import type { AdminOrderItem, OrderStatus, PaymentMethod } from "@/lib/types";

export const DEMO_NOTE_PREFIX = "[DEMO]";

export function isDemoOrderNotes(notes: string | null | undefined) {
  return Boolean(notes?.startsWith(DEMO_NOTE_PREFIX));
}

type DemoItem = Pick<AdminOrderItem, "kind" | "productName" | "quantity" | "unitPrice" | "details">;

export type DemoOrderTemplate = {
  daysAgo: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note: string;
  items: DemoItem[];
};

export function demoOrderTemplates(): DemoOrderTemplate[] {
  return [
    {
      daysAgo: 0,
      status: "in_production",
      paymentMethod: "transferencia",
      customerName: "Fernanda Lagos",
      email: "fernanda.lagos@correo.cl",
      phone: "+56 9 8765 4321",
      address: "Av. Pajaritos 2340, depto 12",
      city: "Maipú",
      note: "Retiro en taller el viernes.",
      items: [
        {
          kind: "custom",
          productName: "Camiseta personalizada",
          quantity: 2,
          unitPrice: 18990,
          details: {
            productKind: "shirt",
            size: "M",
            color: "#F7F4EF",
            colorName: "Blanco",
            custom: {
              kind: "shirt",
              color: "#F7F4EF",
              colorName: "Blanco",
              size: "M",
              text: "TEAM KOINU",
              textColor: "#16120F",
              textFont: "syne",
              position: "chest",
              artworkDataUrl: null,
            },
          },
        },
      ],
    },
    {
      daysAgo: 1,
      status: "paid",
      paymentMethod: "webpay",
      customerName: "Matías Reyes",
      email: "matias.reyes@correo.cl",
      phone: "+56 9 7123 8890",
      address: "Errázuriz 802",
      city: "Valparaíso",
      note: "Despacho a sucursal Starken.",
      items: [
        {
          kind: "catalog",
          productName: "Polerón Koinu Club",
          quantity: 1,
          unitPrice: 34990,
          details: {
            productSlug: "poleron-koinu-club",
            productKind: "hoodie",
            size: "L",
            color: "#1F2937",
            design: "koinu",
          },
        },
        {
          kind: "catalog",
          productName: "Taza Buenos días, jefe",
          quantity: 1,
          unitPrice: 8990,
          details: {
            productSlug: "taza-buenos-dias",
            productKind: "mug",
            color: "#FFFFFF",
            design: "buenos-dias",
          },
        },
      ],
    },
    {
      daysAgo: 2,
      status: "pending",
      paymentMethod: "transferencia",
      customerName: "Camila Soto",
      email: "camila.soto@correo.cl",
      phone: "+56 9 6543 2109",
      address: "Irarrázaval 1450",
      city: "Ñuñoa",
      note: "Espera comprobante de transferencia.",
      items: [
        {
          kind: "catalog",
          productName: "Camiseta Pixel Pup",
          quantity: 1,
          unitPrice: 17990,
          details: {
            productSlug: "camiseta-pixel-pup",
            productKind: "shirt",
            size: "S",
            color: "#F4E1C1",
            design: "pixel",
          },
        },
      ],
    },
    {
      daysAgo: 4,
      status: "cancelled",
      paymentMethod: "webpay",
      customerName: "Pedro Muñoz",
      email: "pedro.munoz@correo.cl",
      phone: "+56 9 9988 1122",
      address: "Balmaceda 320",
      city: "La Serena",
      note: "Cliente anuló: se equivocó de talla.",
      items: [
        {
          kind: "catalog",
          productName: "Polerón Overprint",
          quantity: 1,
          unitPrice: 32990,
          details: {
            productSlug: "poleron-overprint",
            productKind: "hoodie",
            size: "XL",
            color: "#7F1D1D",
            design: "overprint",
          },
        },
      ],
    },
    {
      daysAgo: 8,
      status: "shipped",
      paymentMethod: "transferencia",
      customerName: "Diego Campos",
      email: "diego.campos@correo.cl",
      phone: "+56 9 8456 7788",
      address: "Barros Arana 560",
      city: "Concepción",
      note: "Enviado por Blue Express.",
      items: [
        {
          kind: "catalog",
          productName: "Tote Mercado Vintage",
          quantity: 1,
          unitPrice: 12990,
          details: {
            productSlug: "tote-mercado-vintage",
            productKind: "tote",
            color: "#F5E6C8",
            design: "mercado",
          },
        },
        {
          kind: "catalog",
          productName: "Gorra Studio Print",
          quantity: 2,
          unitPrice: 11990,
          details: {
            productSlug: "gorra-studio-print",
            productKind: "cap",
            size: "Única",
            color: "#0F766E",
            design: "studio",
          },
        },
      ],
    },
    {
      daysAgo: 18,
      status: "completed",
      paymentMethod: "efectivo",
      customerName: "Antonia Vidal",
      email: "antonia.vidal@correo.cl",
      phone: "+56 9 6234 5566",
      address: "Providencia 2120, oficina 4",
      city: "Providencia",
      note: "Retiro en taller, ya entregado.",
      items: [
        {
          kind: "catalog",
          productName: "Taza Team Koinu",
          quantity: 4,
          unitPrice: 7990,
          details: {
            productSlug: "taza-team-koinu",
            productKind: "mug",
            color: "#FFFFFF",
            design: "team",
          },
        },
      ],
    },
  ];
}
