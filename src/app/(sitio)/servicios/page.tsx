import type { Metadata } from "next";
import Link from "next/link";
import { lineas } from "@/lib/servicios";

export const metadata: Metadata = { title: "Servicios" };

export default function Servicios() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="font-serif text-4xl">Servicios</h1>
      <p className="mt-4 text-lg text-muted">
        Cuatro líneas de atención que se articulan entre sí. En la valoración inicial te ayudamos a
        identificar cuál responde mejor a lo que necesitas, y si corresponde, te remitimos a otro
        servicio.
      </p>

      <div className="mt-10 space-y-6">
        {lineas.map((l) => (
          <section key={l.id} id={l.id} className="scroll-mt-6 rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <span className="text-sm font-semibold text-primary">{l.numero}</span>
            <h2 className="mt-1 font-serif text-2xl">{l.titulo}</h2>
            <p className="mt-3">{l.resumen}</p>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-muted">Para quién</dt>
                <dd className="mt-1">{l.paraQuien}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-muted">Formato</dt>
                <dd className="mt-1">{l.formato}</dd>
              </div>
            </dl>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {l.incluye.map((i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span aria-hidden className="text-accent">●</span>
                  {i}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-warning-soft p-6 text-sm">
        <p className="font-semibold">Alcances del servicio</p>
        <p className="mt-2">
          Somos un servicio de atención programada por videollamada. No atendemos urgencias ni
          crisis en tiempo real. Si estás en peligro, visita{" "}
          <Link href="/ayuda-inmediata" className="font-semibold underline">ayuda inmediata</Link>.
        </p>
      </div>

      <div className="mt-8">
        <Link href="/solicitar" className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90">
          Solicitar atención
        </Link>
      </div>
    </div>
  );
}
