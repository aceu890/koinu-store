import type { ProductKind } from "@/lib/types";

export type StoreKit = {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  badge: "Kit" | "Oferta";
  imageUrl: string;
  contents: string;
  originalPrice?: number;
  price: number;
  size?: string | null;
  productKind: ProductKind;
  color: string;
  action: "cart" | "personalizar";
};

export const STORE_KITS: StoreKit[] = [
  {
    id: "kit-fucsia",
    slug: "kit-fucsia",
    name: "Kit fucsia",
    blurb: "Polerón, cartera orgánica 3D, porta lata y un detalle de regalo. Todo en el mismo color.",
    badge: "Kit",
    imageUrl: "/kits-ofertas/kit-fucsia.webp",
    contents: "Polerón fucsia + cartera 3D + porta lata Monster",
    originalPrice: 72970,
    price: 54990,
    size: "M",
    productKind: "hoodie",
    color: "#FF4D8A",
    action: "cart",
  },
  {
    id: "oferta-bandana",
    slug: "oferta-bandana-mascota",
    name: "Bandana de mascota",
    blurb: "Personaliza la bandana de tu perro o gato con el nombre y el mensaje que quieras.",
    badge: "Oferta",
    imageUrl: "/kits-ofertas/oferta-bandana.webp",
    contents: "Bandana personalizada para mascota",
    price: 7000,
    productKind: "tote",
    color: "#7DD3FC",
    action: "cart",
  },
  {
    id: "oferta-taza",
    slug: "oferta-taza-personalizada",
    name: "Taza a tu diseño",
    blurb: "Sube tu imagen, la adaptamos para sublimar y te queda la taza lista. Del diseño al resultado.",
    badge: "Oferta",
    imageUrl: "/kits-ofertas/oferta-taza.webp",
    contents: "Taza personalizada con tu arte",
    price: 8990,
    productKind: "mug",
    color: "#FFFFFF",
    action: "personalizar",
  },
];
