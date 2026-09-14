"use client";

import { Sparkles } from "lucide-react";
import { Mascot } from "@/components/mascot";

export function WelcomeMascot() {
  return (
    <div className="group relative mx-auto w-48 cursor-pointer sm:w-80">
      <span className="mascot-sparkle pointer-events-none absolute left-2 top-8 h-2.5 w-2.5 rounded-full bg-amber" />
      <span className="mascot-sparkle-delay pointer-events-none absolute right-6 top-4 h-2 w-2 rounded-full bg-magenta" />
      <span className="mascot-sparkle pointer-events-none absolute bottom-10 left-0 h-1.5 w-1.5 rounded-full bg-teal" />
      <Sparkles className="pointer-events-none absolute -right-1 top-10 h-5 w-5 text-magenta opacity-0 transition duration-300 group-hover:rotate-12 group-hover:opacity-100 sm:h-7 sm:w-7" />
      <Sparkles className="pointer-events-none absolute -left-2 top-24 h-4 w-4 text-amber opacity-0 transition delay-75 duration-300 group-hover:-rotate-12 group-hover:opacity-100" />
      <div className="mascot-welcome">
        <Mascot name="welcome" alt="¡Bienvenido a Koinu Store!" size={420} priority />
      </div>
    </div>
  );
}
