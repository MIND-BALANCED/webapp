import Link from "next/link";
import { Compass, Heart, HeartHandshake, LifeBuoy, Phone, Sprout, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/marca/Logo";
import { IconoCirculo } from "@/components/marca/Decor";
import { NavSitio } from "@/components/sitio/NavSitio";
import { site } from "@/lib/site";

const beneficios: { titulo: string; texto: string; icono: LucideIcon; tono: "primary" | "accent" }[] = [
  { titulo: "Bienestar emocional", texto: "Comprender lo que sientes y cuidarlo.", icono: Heart, tono: "primary" },
  { titulo: "Relaciones más sanas", texto: "Vínculos con más cuidado y límites claros.", icono: HeartHandshake, tono: "accent" },
  { titulo: "Mayor claridad y propósito", texto: "Decisiones alineadas con lo que valoras.", icono: Compass, tono: "primary" },
  { titulo: "Herramientas para la vida", texto: "Recursos prácticos para tu día a día.", icono: Sprout, tono: "accent" },
];

const enlacesPie = [
  { href: "/servicios/", label: "Servicios" },
  { href: "/modelo/", label: "Nuestro modelo" },
  { href: "/equipo/", label: "Equipo" },
  { href: "/como-funciona/", label: "Cómo funciona" },
  { href: "/solicitar/", label: "Solicitar atención" },
];

const enlacesLegales = [
  { href: "/consentimiento/", label: "Consentimiento informado" },
  { href: "/privacidad/", label: "Tratamiento de datos personales" },
  { href: "/panel/", label: "Acceso del equipo" },
];

const enlacePie =
  "inline-flex min-h-11 items-center text-muted underline-offset-4 hover:text-foreground hover:underline sm:min-h-9";

export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-surface focus:px-5 focus:py-3 focus:font-medium focus:text-primary focus:shadow-lg"
      >
        Saltar al contenido
      </a>

      {/* Franja de crisis: siempre visible. El sitio no es un servicio de urgencias. */}
      <div className="bg-danger-soft text-danger">
        <p className="mx-auto flex max-w-6xl items-start gap-2 px-4 py-2.5 text-sm leading-snug sm:items-center">
          <LifeBuoy aria-hidden className="mt-0.5 size-4 shrink-0 sm:mt-0" strokeWidth={1.75} />
          <span>
            ¿Estás en peligro o piensas en hacerte daño? No esperes una cita:{" "}
            <Link href="/ayuda-inmediata/" className="font-semibold underline underline-offset-2">
              busca ayuda inmediata
            </Link>{" "}
            o llama al{" "}
            <a href="tel:123" className="font-semibold underline underline-offset-2">
              123
            </a>
            .
          </span>
        </p>
      </div>

      <header className="relative z-30 border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="-m-1 rounded-xl p-1">
            <span className="sm:hidden">
              <Logo compact />
            </span>
            <span className="hidden sm:block">
              <Logo />
            </span>
          </Link>
          <NavSitio />
        </div>
      </header>

      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>

      <section aria-labelledby="beneficios-titulo" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 id="beneficios-titulo" className="font-display text-sm font-semibold uppercase tracking-wider text-accent-ink">
            Lo que buscamos construir contigo
          </h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {beneficios.map((b) => (
              <li key={b.titulo} className="flex items-start gap-4">
                <IconoCirculo icon={b.icono} tone={b.tono} />
                <div>
                  <p className="font-display font-semibold text-foreground">{b.titulo}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{b.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="bg-surface-muted text-sm">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Logo />
            <p className="mt-4 font-display font-semibold text-primary">{site.lema}</p>
            <p className="mt-1 text-muted">Comprender · Intervenir · Acompañar</p>
          </div>

          <nav aria-labelledby="pie-centro">
            <h2 id="pie-centro" className="font-display text-sm font-semibold text-foreground">
              El centro
            </h2>
            <ul className="mt-2">
              {enlacesPie.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className={enlacePie}>
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="pie-legal">
            <h2 id="pie-legal" className="font-display text-sm font-semibold text-foreground">
              Información
            </h2>
            <ul className="mt-2">
              {enlacesLegales.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className={enlacePie}>
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="rounded-3xl bg-danger-soft p-5 text-danger">
            <h2 className="flex items-center gap-2 font-display text-sm font-semibold">
              <Phone aria-hidden className="size-4" strokeWidth={1.75} />
              No es un servicio de urgencias
            </h2>
            <p className="mt-2 leading-relaxed">
              Si tu vida o la de otra persona está en riesgo, llama al{" "}
              <a href="tel:123" className="font-semibold underline underline-offset-2">
                123
              </a>{" "}
              o consulta las{" "}
              <Link href="/ayuda-inmediata/" className="font-semibold underline underline-offset-2">
                líneas de ayuda inmediata
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="border-t border-border">
          <p className="mx-auto max-w-6xl px-4 py-5 text-muted">
            {site.name} · {site.descriptor} · Colombia
          </p>
        </div>
      </footer>
    </>
  );
}
