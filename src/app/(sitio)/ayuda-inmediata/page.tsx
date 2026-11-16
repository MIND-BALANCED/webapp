import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import { CrisisLines } from "@/components/CrisisLines";

export const metadata: Metadata = { title: "Ayuda inmediata" };

/*
 * Página de máxima legibilidad: sin formas decorativas, texto grande,
 * contraste alto y líneas que se pueden tocar para llamar.
 */
export default function AyudaInmediata() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-danger">
        <LifeBuoy aria-hidden className="size-5" strokeWidth={1.75} />
        Si necesitas ayuda ahora
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
        Ayuda inmediata
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-foreground sm:text-xl">
        Si estás pensando en hacerte daño, si tu vida o la de otra persona está en peligro, o si
        estás viviendo una situación de violencia, <strong>no esperes una cita</strong>. Busca ayuda
        ahora:
      </p>

      <section aria-labelledby="lineas-titulo" className="mt-8">
        <h2 id="lineas-titulo" className="sr-only">
          Líneas de ayuda
        </h2>
        <CrisisLines />
      </section>

      <section
        aria-labelledby="mientras-titulo"
        className="mt-10 rounded-3xl bg-surface p-6 ring-1 ring-border-strong sm:p-8"
      >
        <h2 id="mientras-titulo" className="font-display text-xl font-semibold text-foreground">
          Mientras recibes ayuda
        </h2>
        <ul className="mt-4 list-disc space-y-3 pl-6 text-lg leading-relaxed text-foreground marker:text-primary">
          <li>Busca a una persona de confianza y dile cómo te sientes. No te quedes a solas.</li>
          <li>Aléjate de objetos o sustancias con los que podrías hacerte daño.</li>
          <li>Si puedes, acude al servicio de urgencias más cercano.</li>
        </ul>
      </section>

      <p className="mt-8 max-w-prose text-base leading-relaxed text-muted">
        Nuestro centro brinda atención programada por videollamada y no cuenta con capacidad de
        respuesta a emergencias en tiempo real. Cuando estés a salvo, puedes{" "}
        <Link href="/solicitar/" className="font-medium text-primary underline underline-offset-4">
          solicitar acompañamiento
        </Link>{" "}
        con nosotros.
      </p>
    </div>
  );
}
