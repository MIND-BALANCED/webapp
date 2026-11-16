import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Headphones, Heart, Laptop, Lock, Phone, type LucideIcon } from "lucide-react";
import { Blob, IconoCirculo, Rama } from "@/components/marca/Decor";
import { recorrido } from "@/lib/servicios";
import { botonPrimario, tarjeta } from "@/components/marca/estilos";

export const metadata: Metadata = { title: "Cómo funciona" };

const requisitos: { titulo: string; texto: string; icono: LucideIcon; tono: "primary" | "accent" }[] = [
  { titulo: "Un espacio privado", texto: "Donde puedas hablar con tranquilidad y sin interrupciones.", icono: Lock, tono: "primary" },
  { titulo: "Conexión estable", texto: "Computador, tableta o celular con cámara, micrófono e internet.", icono: Laptop, tono: "accent" },
  { titulo: "Audífonos", texto: "Recomendados para cuidar la confidencialidad de la conversación.", icono: Headphones, tono: "primary" },
  { titulo: "Un plan B", texto: "Si se corta la llamada, te contactaremos por teléfono o correo.", icono: Phone, tono: "accent" },
];

export default function ComoFunciona() {
  return (
    <>
      <header className="relative overflow-hidden bg-surface-muted">
        <Blob tone="primary" className="-right-28 -top-28 size-80 sm:size-[28rem]" />
        <Blob tone="accent" className="-bottom-28 -left-20 size-56 opacity-80" />
        <Rama className="absolute bottom-0 right-6 hidden h-40 w-20 opacity-80 md:block" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent-ink">
            Tu recorrido
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Cómo funciona
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Desde tu primer contacto hasta el cierre del proceso, sabrás siempre en qué momento estás
            y qué sigue.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <section aria-labelledby="pasos-titulo">
          <h2 id="pasos-titulo" className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Paso a paso
          </h2>
          <ol className="mt-8 max-w-3xl">
            {recorrido.map((r, i) => {
              const ultimo = i === recorrido.length - 1;
              return (
                <li key={r.paso} className="relative flex gap-4 pb-6 last:pb-0 sm:gap-6">
                  {!ultimo && (
                    <span aria-hidden className="absolute left-6 top-12 -ml-px h-[calc(100%-3rem)] w-0.5 bg-border" />
                  )}
                  <span
                    aria-hidden
                    className="relative inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground"
                  >
                    {Number(r.paso)}
                  </span>
                  <div className={`min-w-0 flex-1 p-5 sm:p-6 ${tarjeta}`}>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      <span className="sr-only">Paso {Number(r.paso)}: </span>
                      {r.titulo}
                    </h3>
                    <p className="mt-1 leading-relaxed text-muted">{r.texto}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="sesiones-titulo" className="mt-16">
          <h2 id="sesiones-titulo" className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Las sesiones
          </h2>
          <p className="mt-3 max-w-prose text-lg leading-relaxed text-muted">
            Las sesiones se realizan por Google Meet, Zoom o Microsoft Teams, según tu preferencia.
            Recibirás el enlace por correo al confirmar tu cita. Las sesiones no se graban.
          </p>

          <h3 className="mt-8 font-display text-lg font-semibold text-foreground">Qué necesitas para tu sesión</h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {requisitos.map((r) => (
              <li key={r.titulo} className={`flex items-start gap-4 p-5 sm:p-6 ${tarjeta}`}>
                <IconoCirculo icon={r.icono} tone={r.tono} />
                <div>
                  <p className="font-display font-semibold text-foreground">{r.titulo}</p>
                  <p className="mt-1 leading-relaxed text-muted">{r.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex items-start gap-4 rounded-3xl bg-primary-soft p-6 sm:p-8">
          <IconoCirculo icon={Heart} tone="accent" />
          <p className="max-w-prose leading-relaxed text-foreground">
            <span className="font-display font-semibold text-primary">Recuerda: </span>
            buscar ayuda es un acto de autocuidado y valentía. Si estás en peligro ahora, no esperes
            una cita y visita{" "}
            <Link href="/ayuda-inmediata/" className="font-semibold text-danger underline underline-offset-4">
              ayuda inmediata
            </Link>
            .
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/solicitar/"
            className={botonPrimario}
          >
            Empezar mi solicitud
            <ArrowRight aria-hidden className="size-5" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </>
  );
}
