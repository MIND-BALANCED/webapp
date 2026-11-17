import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Compass,
  ExternalLink,
  GraduationCap,
  Languages,
  LifeBuoy,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Blob, IconoCirculo, Rama } from "@/components/marca/Decor";
import { botonPrimario, botonSecundario, enlaceFlecha, tarjeta } from "@/components/marca/estilos";
import { equipo, iniciales, integrantePorSlug } from "@/lib/equipo";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return equipo.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/equipo/[slug]">): Promise<Metadata> {
  const p = integrantePorSlug((await params).slug);
  if (!p) return {};
  return { title: p.nombre, description: `${p.nombre}, ${p.titulo}. ${site.name}.` };
}

export default async function PerfilProfesional({ params }: PageProps<"/equipo/[slug]">) {
  const p = integrantePorSlug((await params).slug);
  if (!p) notFound();

  return (
    <>
      <header className="relative overflow-hidden bg-surface-muted">
        <Blob tone="primary" className="-right-28 -top-28 size-80 sm:size-[28rem]" />
        <Blob tone="accent" className="-bottom-28 -left-20 size-56 opacity-80" />
        <Rama className="absolute bottom-0 right-6 hidden h-40 w-20 opacity-90 lg:block" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <nav aria-label="Ruta de navegación" className="text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/equipo/" className="underline-offset-4 hover:text-foreground hover:underline">
                  Equipo
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground">
                {p.nombre}
              </li>
            </ol>
          </nav>

          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center">
            <Retrato nombre={p.nombre} foto={p.foto} />
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent-ink">
                {p.rol ?? "Equipo profesional"}
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                {p.nombre}
              </h1>
              <p className="mt-3 text-lg leading-relaxed text-primary sm:text-xl">{p.titulo}</p>
              {p.tarjetaProfesional && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-sm text-muted ring-1 ring-border">
                  <BadgeCheck aria-hidden className="size-4 text-accent-ink" strokeWidth={1.75} />
                  Tarjeta profesional {p.tarjetaProfesional}
                </p>
              )}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/solicitar/" className={botonPrimario}>
                  Solicitar atención
                  <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
                </Link>
                {p.linkedin && (
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className={botonSecundario}>
                    Perfil en LinkedIn
                    <ExternalLink aria-hidden className="size-4" strokeWidth={2} />
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-8">
          {p.presentacion?.length ? (
            <Seccion titulo="Presentación" icono={Sparkles}>
              <div className="space-y-4 text-lg leading-relaxed text-foreground">
                {p.presentacion.map((parrafo, i) => (
                  <p key={i}>{parrafo}</p>
                ))}
              </div>
            </Seccion>
          ) : null}

          <Seccion titulo="Formación" icono={GraduationCap}>
            <ul className="space-y-4">
              {p.formacion.map((f) => (
                <li key={f.titulo} className="flex gap-4">
                  <span aria-hidden className="mt-2 size-2.5 shrink-0 rounded-full bg-accent" />
                  <div>
                    <p className="font-display font-semibold text-foreground">{f.titulo}</p>
                    {(f.institucion || f.anio) && (
                      <p className="text-muted">{[f.institucion, f.anio].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Seccion>

          {p.areas?.length ? (
            <Seccion titulo="Áreas de atención" icono={Compass}>
              <ul className="flex flex-wrap gap-2">
                {p.areas.map((a) => (
                  <li key={a} className="rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-primary">
                    {a}
                  </li>
                ))}
              </ul>
            </Seccion>
          ) : null}

          {p.enfoques?.length ? (
            <Seccion titulo="Enfoques de trabajo" icono={Sparkles}>
              <ul className="grid gap-2 sm:grid-cols-2">
                {p.enfoques.map((e) => (
                  <li key={e} className="rounded-2xl bg-surface-muted px-4 py-3 text-foreground">
                    {e}
                  </li>
                ))}
              </ul>
            </Seccion>
          ) : null}

          {p.experiencia?.length ? (
            <Seccion titulo="Experiencia" icono={Briefcase}>
              <ol className="space-y-5">
                {p.experiencia.map((x) => (
                  <li key={`${x.cargo}-${x.organizacion}`} className="border-l-2 border-border pl-4">
                    <p className="font-display font-semibold text-foreground">{x.cargo}</p>
                    {(x.organizacion || x.periodo) && (
                      <p className="text-muted">{[x.organizacion, x.periodo].filter(Boolean).join(" · ")}</p>
                    )}
                  </li>
                ))}
              </ol>
            </Seccion>
          ) : null}

          {p.idiomas?.length ? (
            <Seccion titulo="Idiomas" icono={Languages}>
              <p className="text-foreground">{p.idiomas.join(" · ")}</p>
            </Seccion>
          ) : null}
        </div>

        <aside className="space-y-6">
          <section className={`${tarjeta} p-6`}>
            <h2 className="font-display text-lg font-semibold text-foreground">Cómo trabajamos</h2>
            <p className="mt-3 leading-relaxed text-muted">
              En {site.name} acompañamos desde un modelo clínico-psicosocial integrado: comprender a la
              persona en su contexto, intervenir con rigor científico y acompañar con sensibilidad humana.
            </p>
            <Link href="/modelo/" className={`${enlaceFlecha} mt-2`}>
              Conoce el modelo
              <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
            </Link>
          </section>

          <section className={`${tarjeta} p-6`}>
            <h2 className="font-display text-lg font-semibold text-foreground">¿Cómo empezar?</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Envía tu solicitud. En la valoración inicial acordamos contigo el tipo de acompañamiento y
              la profesional o el profesional más adecuado para tu proceso.
            </p>
            <Link href="/solicitar/" className={`${enlaceFlecha} mt-2`}>
              Solicitar atención
              <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
            </Link>
          </section>

          <section className="rounded-3xl bg-danger-soft p-6 text-danger">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <LifeBuoy aria-hidden className="size-5" strokeWidth={1.75} />
              ¿Necesitas ayuda ahora?
            </h2>
            <p className="mt-2 leading-relaxed">
              Este no es un servicio de urgencias. Si estás en peligro, llama al{" "}
              <a href="tel:123" className="font-semibold underline underline-offset-2">
                123
              </a>{" "}
              o consulta las{" "}
              <Link href="/ayuda-inmediata/" className="font-semibold underline underline-offset-2">
                líneas de ayuda inmediata
              </Link>
              .
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}

function Retrato({ nombre, foto }: { nombre: string; foto?: string }) {
  const base = "size-32 shrink-0 rounded-full ring-4 ring-surface shadow-card sm:size-40";
  if (foto) {
    // Exportación estática: sin optimización de imágenes; la ruta incluye el basePath.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${foto}`} alt={`Retrato de ${nombre}`} className={`${base} object-cover`} />;
  }
  return (
    <span aria-hidden className={`${base} inline-flex items-center justify-center bg-primary-soft font-display text-5xl font-bold text-primary`}>
      {iniciales(nombre)}
    </span>
  );
}

function Seccion({ titulo, icono, children }: { titulo: string; icono: LucideIcon; children: React.ReactNode }) {
  return (
    <section className={`${tarjeta} p-6 sm:p-8`}>
      <h2 className="mb-5 flex items-center gap-3 font-display text-xl font-semibold text-foreground">
        <IconoCirculo icon={icono} size="sm" />
        {titulo}
      </h2>
      {children}
    </section>
  );
}
