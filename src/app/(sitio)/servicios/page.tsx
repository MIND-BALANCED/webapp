import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";
import { Blob, IconoCirculo } from "@/components/marca/Decor";
import { lineas } from "@/lib/servicios";

export const metadata: Metadata = { title: "Servicios" };

const tarjeta =
  "rounded-3xl bg-surface ring-1 ring-border shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(76_58_153/0.18)]";

export default function Servicios() {
  return (
    <>
      <header className="relative overflow-hidden bg-surface-muted">
        <Blob tone="primary" className="-right-28 -top-28 size-80 sm:size-[28rem]" />
        <Blob tone="accent" className="-bottom-28 -left-20 size-56 opacity-80" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent-ink">
            Lo que ofrecemos
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Servicios
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Cuatro líneas de atención que se articulan entre sí. En la valoración inicial te ayudamos
            a identificar cuál responde mejor a lo que necesitas, y si corresponde, te remitimos a otro
            servicio.
          </p>

          <nav aria-label="Líneas de atención" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {lineas.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/servicios/#${l.id}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-4 text-sm font-medium text-primary ring-1 ring-border hover:bg-primary-soft"
                  >
                    <span className="font-display text-muted">{l.numero}</span>
                    {l.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <div className="space-y-8">
          {lineas.map((l) => (
            <section
              key={l.id}
              id={l.id}
              aria-labelledby={`${l.id}-titulo`}
              className={`scroll-mt-8 p-6 sm:p-10 ${tarjeta}`}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <IconoCirculo icon={l.icono} size="lg" tone={Number(l.numero) % 2 === 0 ? "accent" : "primary"} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold text-primary">
                    <span className="sr-only">Línea </span>
                    {l.numero}
                  </p>
                  <h2 id={`${l.id}-titulo`} className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">
                    {l.titulo}
                  </h2>
                  <p className="mt-3 max-w-prose text-lg leading-relaxed text-foreground">{l.resumen}</p>
                </div>
              </div>

              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-surface-muted p-5">
                  <dt className="font-display text-sm font-semibold text-primary">Para quién</dt>
                  <dd className="mt-2 leading-relaxed text-foreground">{l.paraQuien}</dd>
                </div>
                <div className="rounded-2xl bg-surface-muted p-5">
                  <dt className="font-display text-sm font-semibold text-primary">Formato</dt>
                  <dd className="mt-2 leading-relaxed text-foreground">{l.formato}</dd>
                </div>
              </dl>

              <h3 className="mt-8 font-display text-base font-semibold text-foreground">Incluye</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {l.incluye.map((i) => (
                  <li key={i} className="flex gap-3 leading-relaxed">
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink"
                    >
                      <Check className="size-4" strokeWidth={2.25} />
                    </span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside
          aria-labelledby="alcances-titulo"
          className="mt-12 flex gap-4 rounded-3xl bg-warning-soft p-6 text-foreground ring-1 ring-border sm:p-8"
        >
          <Info aria-hidden className="mt-0.5 size-6 shrink-0" strokeWidth={1.75} />
          <div>
            <h2 id="alcances-titulo" className="font-display text-lg font-semibold">
              Alcances del servicio
            </h2>
            <p className="mt-2 max-w-prose leading-relaxed">
              Somos un servicio de atención programada por videollamada. No atendemos urgencias ni
              crisis en tiempo real. Si estás en peligro, visita{" "}
              <Link href="/ayuda-inmediata/" className="font-semibold text-danger underline underline-offset-4">
                ayuda inmediata
              </Link>
              .
            </p>
          </div>
        </aside>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/solicitar/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Solicitar atención
            <ArrowRight aria-hidden className="size-5" strokeWidth={1.75} />
          </Link>
          <Link
            href="/modelo/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-surface px-6 py-3 font-medium text-primary ring-1 ring-border-strong hover:bg-primary-soft"
          >
            Conoce nuestro modelo
            <ArrowRight aria-hidden className="size-5" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </>
  );
}
