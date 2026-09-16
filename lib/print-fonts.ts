export const PRINT_FONT_KEYS = [
  "syne",
  "sans",
  "montserrat",
  "archivo",
  "anton",
  "oswald",
  "bebas",
  "righteous",
  "playfair",
  "slab",
  "abril",
  "pacifico",
  "marker",
  "dancing",
  "caveat",
  "lobster",
  "bangers",
] as const;

export type PrintFontKey = (typeof PRINT_FONT_KEYS)[number];

export const PRINT_FONTS: {
  key: PrintFontKey;
  label: string;
  group: string;
  family: string;
  weight: number;
}[] = [
  {
    key: "syne",
    label: "Koinu",
    group: "Sans",
    family: "var(--font-syne), sans-serif",
    weight: 800,
  },
  {
    key: "sans",
    label: "Moderna",
    group: "Sans",
    family: "var(--font-dm-sans), sans-serif",
    weight: 700,
  },
  {
    key: "montserrat",
    label: "Geométrica",
    group: "Sans",
    family: "var(--font-print-montserrat), sans-serif",
    weight: 700,
  },
  {
    key: "archivo",
    label: "Extra negra",
    group: "Sans",
    family: "var(--font-print-archivo), sans-serif",
    weight: 400,
  },
  {
    key: "anton",
    label: "Impacto",
    group: "Titulares",
    family: "var(--font-print-anton), sans-serif",
    weight: 400,
  },
  {
    key: "oswald",
    label: "Deportiva",
    group: "Titulares",
    family: "var(--font-print-oswald), sans-serif",
    weight: 600,
  },
  {
    key: "bebas",
    label: "Merch",
    group: "Titulares",
    family: "var(--font-print-bebas), sans-serif",
    weight: 400,
  },
  {
    key: "righteous",
    label: "Retro",
    group: "Titulares",
    family: "var(--font-print-righteous), sans-serif",
    weight: 400,
  },
  {
    key: "playfair",
    label: "Elegante",
    group: "Serif",
    family: "var(--font-print-playfair), serif",
    weight: 700,
  },
  {
    key: "slab",
    label: "Slab",
    group: "Serif",
    family: "var(--font-print-slab), serif",
    weight: 700,
  },
  {
    key: "abril",
    label: "Glamour",
    group: "Serif",
    family: "var(--font-print-abril), serif",
    weight: 400,
  },
  {
    key: "pacifico",
    label: "Script",
    group: "Manuscritas",
    family: "var(--font-print-pacifico), cursive",
    weight: 400,
  },
  {
    key: "marker",
    label: "Marcador",
    group: "Manuscritas",
    family: "var(--font-print-marker), cursive",
    weight: 400,
  },
  {
    key: "dancing",
    label: "Cursiva",
    group: "Manuscritas",
    family: "var(--font-print-dancing), cursive",
    weight: 700,
  },
  {
    key: "caveat",
    label: "Casual",
    group: "Manuscritas",
    family: "var(--font-print-caveat), cursive",
    weight: 600,
  },
  {
    key: "lobster",
    label: "Divertida",
    group: "Manuscritas",
    family: "var(--font-print-lobster), cursive",
    weight: 400,
  },
  {
    key: "bangers",
    label: "Comic",
    group: "Pop",
    family: "var(--font-print-bangers), cursive",
    weight: 400,
  },
];

export const PRINT_FONT_GROUPS = [...new Set(PRINT_FONTS.map((font) => font.group))];

export function getPrintFont(key?: string | null) {
  return PRINT_FONTS.find((font) => font.key === key) ?? PRINT_FONTS[0];
}

export function printFontLabel(key?: string | null) {
  return getPrintFont(key).label;
}

export function printFontStyle(key?: string | null) {
  const font = getPrintFont(key);
  return {
    fontFamily: font.family,
    fontWeight: font.weight,
  };
}
