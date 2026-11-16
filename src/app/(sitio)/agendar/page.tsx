import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, CircleCheck, ExternalLink, Headphones, LifeBuoy, Lock, Wifi } from "lucide-react";
import { Blob, IconoCirculo, Rama } from "@/components/marca/Decor";
import { site } from "@/lib/site";
import { botonPrimario, tarjeta } from "@/components/marca/estilos";

export const metadata: Metadata = { title: "Agendar cita" };

const preparacion = [
  { icono: Lock, texto: "Un espacio privado donde puedas hablar con tranquilidad." },
  { icono: Wifi, texto: "Una conexión a internet estable y el equipo con batería." },
  { icono: Headphones, texto: "Audífonos, si los tienes, para cuidar tu privacidad." },
];

/** Cal.com requiere ?embed=true para mostrarse en iframe; Calendly acepta la URL tal cual. */
function embedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("cal.com")) u.searchParams.set("embed", "true");
    if (u.hostname.endsWith("calendly.com")) u.searchParams.set("hide_gdpr_banner", "1");
    return u.toString();
  } catch {
    return null;
  }
}

export default function Agendar() {
  const src = site.schedulingUrl ? embedUrl(site.schedulingUrl) : null;

  return (
    <div className="relative overflow-hidden bg-surface-muted">
      <Blob tone="secondary" className="-right-24 -top-24 size-80 sm:size-[28rem]" />
      <Blob tone="accent" className="-bottom-24 -left-28 size-72 rotate-45 opacity-70" />

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <header className="relative max-w-3xl">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
            Admisión · Segundo paso
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Agendar <span className="font-bold text-primary">valoración inicial</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Elige el día y la hora que mejor te funcionen. Recibirás por correo la confirmación y el
            enlace a la videollamada (Meet, Zoom o Teams).
          </p>
          <p className="mt-3 text-base leading-relaxed text-muted">
            ¿Aún no has enviado tu solicitud?{" "}
            <Link href="/solicitar/" className="font-semibold text-primary underline underline-offset-2">
              Empieza aquí
            </Link>
            : la necesitamos para preparar tu primera cita.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section aria-labelledby="agenda-titulo" className="min-w-0">
            <h2 id="agenda-titulo" className="sr-only">
              Agenda de citas
            </h2>
            <div className={`${tarjeta} overflow-hidden`}>
              {src ? (
                <iframe
                  src={src}
                  title="Agenda de citas de Mind Balanced: elige día y hora para tu valoración inicial"
                  className="block h-[720px] w-full bg-surface"
                  loading="lazy"
                />
              ) : (
                <div className="flex flex-col items-center px-6 py-12 text-center sm:px-10 sm:py-16">
                  <IconoCirculo icon={CalendarDays} size="lg" />
                  <p className="mt-5 font-display text-xl font-semibold text-foreground">
                    La agenda en línea estará disponible pronto
                  </p>
                  <p className="mt-2 max-w-md text-base leading-relaxed text-muted">
                    Estamos terminando de conectarla. Si ya enviaste tu solicitud, nuestro equipo te
                    escribirá para acordar contigo el día y la hora de tu valoración inicial.
                  </p>
                  {site.contactEmail && (
                    <p className="mt-3 text-base text-muted">
                      También puedes escribirnos a{" "}
                      <a href={`mailto:${site.contactEmail}`} className="font-semibold text-primary underline underline-offset-2">
                        {site.contactEmail}
                      </a>
                      .
                    </p>
                  )}
                  <Link href="/solicitar/" className={`${botonPrimario} mt-6`}>
                    Solicitar atención
                    <ArrowRight aria-hidden className="size-5" strokeWidth={1.75} />
                  </Link>
                  {process.env.NODE_ENV !== "production" && (
                    <p className="mt-6 text-sm text-muted">
                      Nota para el equipo (solo en desarrollo): configura{" "}
                      <code className="rounded bg-surface-muted px-1.5 py-0.5">NEXT_PUBLIC_SCHEDULING_URL</code>{" "}
                      con el enlace de Cal.com o Calendly.
                    </p>
                  )}
                </div>
              )}
            </div>
            {src && (
              <p className="mt-3 text-base text-muted">
                ¿No ves la agenda?{" "}
                <a
                  href={site.schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 font-semibold text-primary underline underline-offset-2"
                >
                  Ábrela en una pestaña nueva
                  <ExternalLink aria-hidden className="size-4" strokeWidth={1.75} />
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </p>
            )}
          </section>

          <aside aria-labelledby="preparar-titulo" className="space-y-6">
            <div className={`${tarjeta} p-6`}>
              <h2 id="preparar-titulo" className="font-display text-lg font-semibold text-foreground">
                Para tu videollamada
              </h2>
              <ul className="mt-4 space-y-4">
                {preparacion.map(({ icono: Icono, texto }) => (
                  <li key={texto} className="flex items-start gap-3 text-base leading-relaxed text-foreground">
                    <Icono aria-hidden className="mt-1 size-5 shrink-0 text-accent-ink" strokeWidth={1.75} />
                    {texto}
                  </li>
                ))}
              </ul>
              <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-muted">
                <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-ink" strokeWidth={1.75} />
                Conéctate unos minutos antes para probar cámara y micrófono.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-danger-soft p-6 text-danger">
              <p className="flex items-center gap-2 font-display font-semibold">
                <LifeBuoy aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
                No es un servicio de urgencias
              </p>
              <p className="mt-2 text-base leading-relaxed">
                Si estás en peligro ahora, no esperes una cita.
              </p>
              <Link
                href="/ayuda-inmediata/"
                className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-semibold underline underline-offset-4"
              >
                Busca ayuda inmediata
                <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
              </Link>
            </div>

            <Rama className="mx-auto hidden h-32 w-16 lg:block" />
          </aside>
        </div>
      </div>
    </div>
  );
}
