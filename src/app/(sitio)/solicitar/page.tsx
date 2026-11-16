import type { Metadata } from "next";
import Link from "next/link";
import { Clock, LifeBuoy, Lock, UserCheck } from "lucide-react";
import { Blob, Rama } from "@/components/marca/Decor";
import { site } from "@/lib/site";
import { AdmisionForm } from "./AdmisionForm";

export const metadata: Metadata = { title: "Solicitar atención" };

const datos = [
  { icono: Clock, texto: "Toma unos 5 minutos." },
  { icono: Lock, texto: "Tus respuestas son confidenciales." },
  { icono: UserCheck, texto: `Atendemos personas de ${site.minAge} años o más.` },
];

export default function Solicitar() {
  return (
    <div className="relative overflow-hidden bg-surface-muted">
      <Blob tone="secondary" className="-right-24 -top-24 size-80 sm:size-[28rem]" />
      <Blob tone="accent" className="-left-32 top-72 size-72 rotate-45 opacity-70" />

      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <header className="relative">
          <Rama className="absolute -top-4 right-0 hidden h-36 w-16 sm:block" />
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
            Admisión · Primer paso
          </p>
          <h1 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Solicitar <span className="font-bold text-primary">atención</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Este formulario es el primer paso de la admisión. Con tus respuestas, un profesional
            valorará qué tipo de acompañamiento es el más adecuado para ti.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-base text-foreground">
            {datos.map(({ icono: Icono, texto }) => (
              <li key={texto} className="flex items-center gap-2">
                <Icono aria-hidden className="size-5 shrink-0 text-accent-ink" strokeWidth={1.75} />
                {texto}
              </li>
            ))}
          </ul>

          <p className="mt-6 flex items-start gap-3 rounded-2xl bg-danger-soft px-4 py-3 text-base text-danger">
            <LifeBuoy aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
            <span>
              Este formulario no es un servicio de urgencias. Si estás en peligro ahora,{" "}
              <Link href="/ayuda-inmediata/" className="font-semibold underline underline-offset-2">
                busca ayuda inmediata
              </Link>
              .
            </span>
          </p>
        </header>

        <div className="mt-10">
          <AdmisionForm minAge={site.minAge} />
        </div>
      </div>
    </div>
  );
}
