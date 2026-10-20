import {
  Abril_Fatface,
  Anton,
  Archivo_Black,
  Bangers,
  Bebas_Neue,
  Caveat,
  Dancing_Script,
  Lobster,
  Montserrat,
  Oswald,
  Pacifico,
  Permanent_Marker,
  Playfair_Display,
  Righteous,
  Roboto_Slab,
} from "next/font/google";

const anton = Anton({
  variable: "--font-print-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const oswald = Oswald({
  variable: "--font-print-oswald",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const pacifico = Pacifico({
  variable: "--font-print-pacifico",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const marker = Permanent_Marker({
  variable: "--font-print-marker",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const playfair = Playfair_Display({
  variable: "--font-print-playfair",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const montserrat = Montserrat({
  variable: "--font-print-montserrat",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const archivo = Archivo_Black({
  variable: "--font-print-archivo",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const bebas = Bebas_Neue({
  variable: "--font-print-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const righteous = Righteous({
  variable: "--font-print-righteous",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const slab = Roboto_Slab({
  variable: "--font-print-slab",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const abril = Abril_Fatface({
  variable: "--font-print-abril",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const dancing = Dancing_Script({
  variable: "--font-print-dancing",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const caveat = Caveat({
  variable: "--font-print-caveat",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const lobster = Lobster({
  variable: "--font-print-lobster",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const bangers = Bangers({
  variable: "--font-print-bangers",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

export const PRINT_FONT_CLASSNAME = [
  anton.variable,
  oswald.variable,
  pacifico.variable,
  marker.variable,
  playfair.variable,
  montserrat.variable,
  archivo.variable,
  bebas.variable,
  righteous.variable,
  slab.variable,
  abril.variable,
  dancing.variable,
  caveat.variable,
  lobster.variable,
  bangers.variable,
].join(" ");
