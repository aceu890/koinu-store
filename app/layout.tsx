import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Syne } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HideOnAdmin } from "@/components/hide-on-admin";
import { BackToTop } from "@/components/back-to-top";
import { PwaRegister } from "@/components/pwa-register";
import { CartHydration, Toaster } from "@/components/toaster";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const themeScript = `(function(){try{var t=localStorage.getItem("koinu-theme");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`;

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Koinu Store · Sublimación y estampados",
    template: "%s · Koinu Store",
  },
  description:
    "Ecommerce de sublimación y estampados. Personaliza camisetas, polerones, tazas y más, o elige diseños de la galería.",
  applicationName: "Koinu Store",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Koinu Store",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport = {
  themeColor: "#ff3d7f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CL"
      suppressHydrationWarning
      className={`${dmSans.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="noise flex min-h-full flex-col">
        <Script id="koinu-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <ThemeProvider>
          <CartHydration />
          <PwaRegister />
          <HideOnAdmin>
            <Header />
          </HideOnAdmin>
          <main className="flex-1">{children}</main>
          <Footer />
          <HideOnAdmin>
            <BackToTop />
          </HideOnAdmin>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
