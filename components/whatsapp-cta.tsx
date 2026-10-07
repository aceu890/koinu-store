import { Mascot } from "@/components/mascot";
import { WHATSAPP_DISPLAY, whatsappHref } from "@/lib/whatsapp";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2c-5.5 0-9.96 4.45-9.96 9.94 0 1.75.46 3.46 1.33 4.97L2 22l5.24-1.37A9.94 9.94 0 0 0 12.04 22c5.5 0 9.96-4.46 9.96-9.96C22 6.45 17.54 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.61-2.89-1.25-4.77-4.16-4.92-4.35-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.26-.29.57-.36.76-.36h.54c.17 0 .41-.07.64.49.24.58.8 2 .87 2.14.07.14.12.31.02.5-.1.2-.14.31-.28.48-.14.16-.3.37-.42.49-.14.14-.28.29-.12.56.16.28.7 1.16 1.5 1.88 1.04.93 1.91 1.22 2.18 1.36.28.13.43.11.6-.07.16-.17.7-.81.89-1.09.19-.28.37-.23.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

export function WhatsAppCta() {
  return (
    <section className="mx-auto max-w-6xl px-3 pb-12 sm:px-6 sm:pb-16">
      <div className="overflow-hidden rounded-2xl border border-[#25D366]/25 bg-[linear-gradient(135deg,#ecfbf1,#f4efe6)] sm:rounded-[2rem] dark:bg-[linear-gradient(135deg,#14241a,#14110f)]">
        <div className="grid items-center gap-6 px-5 py-7 sm:grid-cols-[1fr_auto] sm:gap-8 sm:px-8 sm:py-10">
          <div className="flex items-start gap-4">
            <div className="hidden w-24 shrink-0 sm:block">
              <Mascot name="here" alt="" size={180} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/45 sm:text-xs">
                Comunícate con nuestros asistentes
              </p>
              <h2 className="mt-1 font-display text-xl font-bold sm:text-3xl">
                Escríbenos por WhatsApp
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/70">
                Si ya armaste tu diseño o quieres coordinar pago y despacho, háblanos al{" "}
                <span className="font-semibold text-ink">{WHATSAPP_DISPLAY}</span>. Te
                respondemos para cerrar el pedido.
              </p>
            </div>
          </div>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 font-display text-base font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1ebe57] sm:h-14 sm:px-7 sm:text-lg"
          >
            <WhatsAppIcon className="h-6 w-6" />
            Chatear ahora
          </a>
        </div>
      </div>
    </section>
  );
}
