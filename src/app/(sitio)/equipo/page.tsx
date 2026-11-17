import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Blob } from "@/components/marca/Decor";
import { tarjeta } from "@/components/marca/estilos";
import { equipo, iniciales } from "@/lib/equipo";

export const metadata: Metadata = { title: "Equipo" };

export default function Equipo() {
  return (
    <>
      <header className="relative overflow-hidden bg-surface-muted">
        <Blob tone="primary" className="-right-28 -top-28 size-80 sm:size-[28rem]" />
        <Blob tone="accent" className="-bottom-28 -left-20 size-56 opacity-80" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent-ink">
            Quiénes te acompañan
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Equipo
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Profesionales en psicología que trabajan desde el modelo clínico-psicosocial del centro.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-14">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {equipo.map((p) => (
            <li key={p.slug}>
              <Link href={`/equipo/${p.slug}/`} className={`${tarjeta} group flex h-full flex-col items-start gap-4 p-6 hover:ring-primary`}>
                <span
                  aria-hidden
                  className="inline-flex size-20 items-center justify-center rounded-full bg-primary-soft font-display text-2xl font-bold text-primary"
                >
                  {iniciales(p.nombre)}
                </span>
                <span>
                  <span className="block font-display text-xl font-semibold text-foreground">{p.nombre}</span>
                  <span className="mt-1 block text-muted">{p.titulo}</span>
                </span>
                <span className="mt-auto inline-flex items-center gap-1.5 font-semibold text-primary group-hover:underline">
                  Ver perfil
                  <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
