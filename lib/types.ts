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

export type PrintPlacement = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PrintStamp = {
  id: string;
  side: "front" | "back";
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
  printSides?: Array<"front" | "back">;
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
