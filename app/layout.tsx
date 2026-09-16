import type { Metadata } from "next";
import Script from "next/script";
import {
  Abril_Fatface,
  Anton,
  Archivo_Black,
  Bangers,
  Bebas_Neue,
  Caveat,
  Dancing_Script,
  DM_Sans,
  Lobster,
  Montserrat,
  Oswald,
  Pacifico,
  Permanent_Marker,
  Playfair_Display,
  Righteous,
  Roboto_Slab,
  Syne,
} from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { BackToTop } from "@/components/back-to-top";
import { CartHydration, Toaster } from "@/components/toaster";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const themeScript = `(function(){try{var t=localStorage.getItem("koinu-theme");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`;

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-print-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-print-oswald",
  subsets: ["latin"],
  display: "swap",
});

const pacifico = Pacifico({
  variable: "--font-print-pacifico",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const marker = Permanent_Marker({
  variable: "--font-print-marker",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-print-playfair",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-print-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo_Black({
  variable: "--font-print-archivo",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const bebas = Bebas_Neue({
  variable: "--font-print-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const righteous = Righteous({
  variable: "--font-print-righteous",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const slab = Roboto_Slab({
  variable: "--font-print-slab",
  subsets: ["latin"],
  display: "swap",
});

const abril = Abril_Fatface({
  variable: "--font-print-abril",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const dancing = Dancing_Script({
  variable: "--font-print-dancing",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-print-caveat",
  subsets: ["latin"],
  display: "swap",
});

const lobster = Lobster({
  variable: "--font-print-lobster",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const bangers = Bangers({
  variable: "--font-print-bangers",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Koinu Store · Sublimación y estampados",
    template: "%s · Koinu Store",
  },
  description:
    "Ecommerce de sublimación y estampados. Personaliza camisetas, polerones, tazas y más, o elige diseños de la galería.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CL"
      suppressHydrationWarning
      className={`${dmSans.variable} ${syne.variable} ${anton.variable} ${oswald.variable} ${pacifico.variable} ${marker.variable} ${playfair.variable} ${montserrat.variable} ${archivo.variable} ${bebas.variable} ${righteous.variable} ${slab.variable} ${abril.variable} ${dancing.variable} ${caveat.variable} ${lobster.variable} ${bangers.variable} h-full antialiased`}
    >
      <body className="noise flex min-h-full flex-col">
        <Script id="koinu-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <ThemeProvider>
          <CartHydration />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
