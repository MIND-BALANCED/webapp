import Link from "next/link";
import { ArrowRight, CalendarDays, Heart, Laptop, Lock, Mic, ShieldCheck, Sprout, Video } from "lucide-react";
import { LogoMark } from "@/components/marca/Logo";
import { Blob, IconoCirculo, Rama } from "@/components/marca/Decor";
import { lineas, miradasModelo, valores } from "@/lib/servicios";
import { site } from "@/lib/site";

const tarjeta =
  "rounded-3xl bg-surface ring-1 ring-border shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(76_58_153/0.18)]";

const botonPrincipal =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-display font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover";

const botonSecundario =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-surface px-6 py-3 font-display font-semibold text-primary ring-1 ring-border-strong transition-colors hover:bg-primary-soft";

const enlaceTexto =
  "inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline";

const pasos = [
  {
    titulo: "Cuéntanos tu necesidad",
    texto: "Llenas un formulario en línea breve y confidencial sobre lo que te trae a consulta.",
  },
  {
    titulo: "Valoramos tu solicitud",
    texto: "Un profesional revisa tu solicitud y te orienta sobre el servicio más pertinente.",
  },
  {
    titulo: "Acordamos un plan",
    texto: "Definimos contigo objetivos y frecuencia, y nos encontramos por videollamada.",
  },
];

/** Composición decorativa del hero: formas orgánicas, rama y una videollamada abstracta (sin personas). */
function ComposicionHero() {
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full sm:aspect-[5/4] max-w-md lg:max-w-none">
      <Blob tone="secondary" className="-right-6 -top-8 size-[85%]" />
      <Blob tone="accent" className="-bottom-10 -left-8 size-[55%] rotate-45" />
      <Rama className="absolute -right-2 bottom-0 h-40 w-20 sm:h-52 sm:w-24" />

      <div className={`${tarjeta} absolute inset-x-[6%] top-[10%] p-3 sm:p-4`}>
        <div className="flex items-center gap-1.5 px-1 pb-3">
          <span className="size-2.5 rounded-full bg-secondary" />
          <span className="size-2.5 rounded-full bg-accent" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="ml-auto flex items-center gap-1 text-xs font-medium text-muted">
            <Lock className="size-3.5" strokeWidth={1.75} />
            Conexión privada
          </span>
        </div>
        <div className="grid grid-cols-[2fr_1fr] gap-2.5">
          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-primary-soft">
            <LogoMark className="size-16 sm:size-20" />
          </div>
          <div className="grid gap-2.5">
            <div className="flex items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
              <Sprout className="size-7" strokeWidth={1.75} />
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-surface-muted text-primary">
              <Heart className="size-7" strokeWidth={1.75} />
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-surface-muted text-primary">
            <Mic className="size-4" strokeWidth={1.75} />
          </span>
          <span className="flex size-9 items-center justify-center rounded-full bg-surface-muted text-primary">
            <Video className="size-4" strokeWidth={1.75} />
          </span>
          <span className="h-9 w-16 rounded-full bg-primary" />
        </div>
      </div>

      <div className={`${tarjeta} absolute -left-1 bottom-[6%] flex items-center gap-2.5 px-4 py-3 sm:left-0`}>
        <span className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
          <ShieldCheck className="size-4" strokeWidth={1.75} />
        </span>
        <span className="text-sm font-medium text-foreground">Confidencial</span>
      </div>
      <div className={`${tarjeta} absolute right-[12%] top-0 flex items-center gap-2.5 px-4 py-2.5`}>
        <span className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-primary">
          <CalendarDays className="size-4" strokeWidth={1.75} />
        </span>
        <span className="text-sm font-medium text-foreground">A tu ritmo</span>
      </div>
    </div>
  );
}

/** Diagrama de Venn de las tres miradas del modelo (Clínico, Psicosocial y Persona). */
function DiagramaModelo() {
  const [clinico, psicosocial, persona] = miradasModelo;
  const descripcion = `Diagrama de tres círculos que se superponen: ${miradasModelo
    .map((m) => `${m.titulo} (${m.texto.replace(/\.$/, "").toLowerCase()})`)
    .join(", ")}. En la intersección de los tres está la persona que consulta.`;
  return (
    <svg viewBox="0 0 320 300" role="img" aria-label={descripcion} className="mx-auto w-full max-w-sm">
      <circle cx="118" cy="112" r="88" fill="var(--secondary)" fillOpacity="0.32" stroke="var(--primary)" strokeOpacity="0.45" strokeWidth="1.5" />
      <circle cx="202" cy="112" r="88" fill="var(--accent)" fillOpacity="0.26" stroke="var(--accent-ink)" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="160" cy="186" r="88" fill="var(--primary)" fillOpacity="0.14" stroke="var(--primary)" strokeOpacity="0.45" strokeWidth="1.5" />
      <g className="fill-foreground font-display" fontWeight="700" fontSize="15" textAnchor="middle">
        <text x="88" y="92">{clinico.titulo}</text>
        <text x="234" y="92">{psicosocial.titulo}</text>
        <text x="160" y="250">{persona.titulo}</text>
      </g>
      {/* Persona en el centro */}
      <circle cx="160" cy="138" r="24" className="fill-surface" stroke="var(--primary)" strokeWidth="1.5" />
      <circle cx="160" cy="131" r="6" fill="var(--primary)" />
      <path d="M148 150c0-7 5.4-11 12-11s12 4 12 11" fill="var(--primary)" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Blob tone="primary" className="-left-40 -top-40 size-[28rem] opacity-70" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent-ink">{site.descriptor}</p>
            <h1 className="mt-4 text-balance font-display text-[1.75rem] font-medium leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Comprender a <strong className="font-bold text-primary">la persona</strong> en su contexto,{" "}
              <strong className="font-bold text-primary">intervenir</strong> con{" "}
              <strong className="font-bold text-primary">rigor</strong> científico y acompañar con{" "}
              <strong className="font-bold text-primary">sensibilidad humana</strong>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Orientación y atención psicológica virtual para jóvenes y adultos, con un modelo clínico-psicosocial
              integrado que tiene en cuenta lo que vives, tu historia y tu contexto.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/solicitar/" className={botonPrincipal}>
                Solicitar atención
                <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
              </Link>
              <Link href="/servicios/" className={botonSecundario}>
                Conoce nuestros servicios
                <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
          <ComposicionHero />
        </div>
      </section>

      {/* Servicios */}
      <section aria-labelledby="servicios-titulo" className="bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent-ink">Servicios</p>
            <h2 id="servicios-titulo" className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
              Cuatro líneas de atención
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              Encuentros virtuales con objetivos claros, desde una orientación breve hasta un proceso de acompañamiento.
            </p>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {lineas.map((l, i) => (
              <li key={l.id} className={`${tarjeta} flex flex-col p-6`}>
                <IconoCirculo icon={l.icono} tone={i % 2 === 0 ? "primary" : "accent"} />
                <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-foreground">{l.titulo}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{l.resumen}</p>
                <Link href={`/servicios/#${l.id}`} className={`${enlaceTexto} mt-4 self-start`}>
                  Ver más<span className="sr-only"> sobre {l.titulo.toLowerCase()}</span>
                  <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Nuestro modelo */}
      <section aria-labelledby="modelo-titulo" className="relative overflow-hidden">
        <Blob tone="secondary" className="-right-32 top-10 size-96" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent-ink">Nuestro modelo</p>
            <h2 id="modelo-titulo" className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
              Modelo clínico-psicosocial integrado
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-muted">
              Lo que te pasa no se entiende solo desde los síntomas. Integramos tres miradas para comprender tu
              situación y acordar contigo un plan pertinente. Es un modelo de trabajo en construcción, que
              revisamos y evaluamos de forma continua.
            </p>
            <ul className="mt-6 grid gap-4">
              {miradasModelo.map((m, i) => (
                <li key={m.id} className="flex items-start gap-4">
                  <IconoCirculo icon={m.icono} tone={i === 1 ? "accent" : "primary"} size="sm" />
                  <div>
                    <p className="font-display font-semibold text-foreground">{m.titulo}</p>
                    <p className="text-sm leading-relaxed text-muted">{m.texto}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/modelo/" className={`${enlaceTexto} mt-4`}>
              Conoce el modelo
              <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
            </Link>
          </div>
          <figure className={`${tarjeta} p-6 sm:p-8`}>
            <DiagramaModelo />
            <figcaption className="mt-4 text-center text-sm leading-relaxed text-muted">
              En el centro, la persona: su historia, sus relaciones y su contexto.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Cómo funciona + Atención virtual */}
      <section aria-labelledby="como-titulo" className="bg-surface-muted">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 lg:grid-cols-[1.3fr_1fr]">
          <div className={`${tarjeta} p-6 sm:p-8`}>
            <h2 id="como-titulo" className="font-display text-2xl font-bold tracking-tight text-foreground">
              ¿Cómo funciona?
            </h2>
            <ol className="mt-6 grid gap-6">
              {pasos.map((p, i) => (
                <li key={p.titulo} className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-display font-bold text-primary-foreground"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">
                      <span className="sr-only">Paso {i + 1}: </span>
                      {p.titulo}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/como-funciona/" className={`${enlaceTexto} mt-4`}>
              Ver el recorrido completo
              <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-primary-soft p-6 sm:p-8">
            <Blob tone="accent" className="-bottom-16 -right-16 size-56" />
            <div className="relative">
              <IconoCirculo icon={Laptop} size="lg" />
              <p className="mt-5 font-display text-sm font-semibold uppercase tracking-wider text-primary">
                Atención virtual
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug tracking-tight text-foreground">
                Tu espacio seguro, tu proceso, a tu ritmo.
              </h2>
              <p className="mt-3 leading-relaxed text-muted">
                Nos encontramos por videollamada, desde un lugar donde te sientas con tranquilidad. Tu información se
                trata con confidencialidad y con tu consentimiento informado.
              </p>
              <Link href="/solicitar/" className={`${botonPrincipal} mt-6`}>
                Solicitar atención
                <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section aria-labelledby="valores-titulo">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent-ink">Lo que nos guía</p>
          <h2 id="valores-titulo" className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
            Nuestros valores
          </h2>
          <ul className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {valores.map((v, i) => (
              <li key={v.titulo} className="flex items-start gap-4 lg:flex-col lg:items-center lg:text-center">
                <IconoCirculo icon={v.icono} tone={i % 2 === 0 ? "primary" : "accent"} size="lg" />
                <div>
                  <h3 className="font-display font-semibold text-foreground lg:mt-1">{v.titulo}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{v.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recuerda */}
      <section aria-labelledby="recuerda-titulo" className="px-4 pb-16">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-accent-soft px-6 py-8 sm:px-10">
          <Rama className="absolute -right-2 -top-4 hidden h-44 w-24 opacity-80 sm:block" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:pr-24">
            <IconoCirculo icon={Heart} tone="accent" size="lg" />
            <div>
              <h2 id="recuerda-titulo" className="font-display text-sm font-semibold uppercase tracking-wider text-accent-ink">
                Recuerda
              </h2>
              <p className="mt-1 font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                Buscar ayuda es un acto de autocuidado y valentía.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Si necesitas apoyo ahora mismo, no esperes una cita:{" "}
                <Link href="/ayuda-inmediata/" className="font-semibold text-danger underline underline-offset-2">
                  consulta las líneas de ayuda inmediata
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
