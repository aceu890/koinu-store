import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Syne } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { BackToTop } from "@/components/back-to-top";
import { CartHydration, Toaster } from "@/components/toaster";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const themeScript = `(function(){try{var t=localStorage.getItem("koinu-theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`;

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Koinu Store · Sublimación y estampados",
    template: "%s · Koinu Store",
  },
  description:
    "Ecommerce de sublimación y estampados. Personalizá camisetas, buzos, tazas y más, o elegí diseños de la galería.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${dmSans.variable} ${syne.variable} h-full antialiased`}
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
