import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Printer, Sparkles } from "lucide-react";
import { WelcomeMascot } from "@/components/welcome-mascot";
import { InstagramStrip } from "@/components/instagram-strip";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { KitsOffers } from "@/components/kits-offers";
import { HomeBases } from "@/components/home-bases";
import { HomeFeatured, HomeFeaturedFallback } from "@/components/home-featured";

export const revalidate = 60;

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-magenta/20 blur-3xl" />
          <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-teal/15 blur-3xl" />
          <div className="halftone absolute inset-0" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-3 py-10 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              <Printer className="h-3.5 w-3.5 text-magenta" />
              Taller de sublimación
            </p>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
              Estampa
              <br />
              tu idea.
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink/70">
              Camisetas, polerones, tazas y merch. Sube tu diseño o escribe un texto y
              nosotros lo sublimamos.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/personalizar"
                className="btn-personaliza inline-flex items-center gap-3 rounded-full px-6 py-4 font-display text-xl font-extrabold text-white sm:px-8 sm:py-5 sm:text-2xl"
              >
                <Sparkles className="h-6 w-6" />
                Personaliza
              </Link>
              <Link
                href="/galeria"
                className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface/70 px-5 py-3 font-semibold transition hover:border-ink"
              >
                Ver galería <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <WelcomeMascot />
          </div>
        </div>
      </section>

      <div className="pt-2 sm:pt-4">
        <WhatsAppCta />
      </div>

      <KitsOffers />

      <HomeBases />

      <Suspense fallback={<HomeFeaturedFallback />}>
        <HomeFeatured />
      </Suspense>

      <InstagramStrip />
    </div>
  );
}
