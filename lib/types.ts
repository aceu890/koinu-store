export type ProductKind = "shirt" | "hoodie" | "mug" | "tote" | "cap" | "print3d";

export type DesignKey =
  | "sakura"
  | "koinu"
  | "buenos-dias"
  | "mercado"
  | "studio"
  | "pixel"
  | "cafe"
  | "overprint"
  | "ruta"
  | "flash"
  | "team"
  | "blank";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  kind: ProductKind;
  design: DesignKey;
  colors: string[];
  sizes: string[];
  featured: boolean;
  inStock?: boolean;
  imageUrl?: string | null;
};

export type CustomizableBase = {
  slug: ProductKind;
  name: string;
  description: string;
  basePrice: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
};

export type PrintPosition = "chest" | "center" | "back" | "wrap";

export type PrintSide = "front" | "back" | "left" | "right";

export const PRINT_SIDES: PrintSide[] = ["front", "left", "back", "right"];

export type PrintPlacement = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PrintStamp = {
  id: string;
  side: PrintSide;
  artworkDataUrl: string;
  placement: PrintPlacement;
  widthPx: number;
  heightPx: number;
};

export type CustomDetails = {
  kind: ProductKind;
  color: string;
  colorName: string;
  size: string | null;
  text: string;
  textColor: string;
  position: PrintPosition;
  artworkDataUrl: string | null;
  placement?: PrintPlacement;
  placementFront?: PrintPlacement;
  placementBack?: PrintPlacement;
  placementLeft?: PrintPlacement;
  placementRight?: PrintPlacement;
  printSides?: PrintSide[];
  stamps?: PrintStamp[];
  artworkWidthPx?: number;
  artworkHeightPx?: number;
  printWidthCm?: number;
  printHeightCm?: number;
};

export type CartItemKind = "catalog" | "custom";

export type CartItem = {
  id: string;
  kind: CartItemKind;
  name: string;
  quantity: number;
  unitPrice: number;
  productSlug?: string;
  color?: string;
  colorName?: string;
  size?: string | null;
  design?: DesignKey;
  productKind: ProductKind;
  custom?: CustomDetails;
};

export type CheckoutPayload = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  paymentMethod: "transferencia" | "efectivo";
  items: CartItem[];
};

export type OrderRecord = {
  id: string;
  status: string;
  total: number;
  offline?: boolean;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "in_production"
  | "shipped"
  | "completed"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "in_production",
  "shipped",
  "completed",
  "cancelled",
];

export type AdminOrderItem = {
  id: string;
  kind: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  details: Record<string, unknown>;
};

export type AdminOrder = {
  id: string;
  customerName: string;
  email: string;
  phone: string | null;
  address: string;
  city: string | null;
  notes: string | null;
  paymentMethod: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: AdminOrderItem[];
};
