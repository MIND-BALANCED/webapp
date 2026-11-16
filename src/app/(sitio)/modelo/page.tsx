import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  Brain,
  Building2,
  Check,
  ClipboardCheck,
  ClipboardList,
  Compass,
  HeartHandshake,
  Info,
  LifeBuoy,
  Lock,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sprout,
  Target,
  User,
  Users,
} from "lucide-react";
import { Blob, IconoCirculo, Rama } from "@/components/marca/Decor";
import { botonPrimario, tarjeta } from "@/components/marca/estilos";
import { DiagramaModelo } from "@/components/modelo/DiagramaModelo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nuestro modelo",
  description:
    "Cómo entendemos el bienestar y cómo te acompañamos: el modelo clínico-psicosocial integrado del centro, explicado en lenguaje claro.",
};

const dimensiones = [
  {
    titulo: "Tú y tu experiencia",
    texto: "Tu historia, lo que sientes, lo que piensas, lo que haces y el sentido que le das a lo que vives.",
    icono: User,
  },
  {
    titulo: "Salud mental",
    texto: "Cómo te sientes en el día a día, cómo duermes, cómo te va en tus actividades y si hay algún riesgo que atender.",
    icono: Brain,
  },
  {
    titulo: "Relaciones",
    texto: "Tu familia, tu pareja, tus amistades y el apoyo con el que cuentas.",
    icono: HeartHandshake,
  },
  {
    titulo: "Contexto",
    texto: "Tu trabajo o estudio, tu situación económica y tu cultura: las condiciones en las que vives.",
    icono: Building2,
  },
  {
    titulo: "Recursos",
    texto: "Tus fortalezas, habilidades, valores y las oportunidades que tienes a mano.",
    icono: Sprout,
  },
] as const;

const fases = [
  {
    n: "01",
    titulo: "Acogida",
    texto: "Escuchamos lo que buscas, te contamos con claridad qué ofrecemos y revisamos si la atención virtual es adecuada y segura para ti.",
  },
  {
    n: "02",
    titulo: "Conocer tu situación",
    texto: "Conversamos sobre lo que te pasa, desde cuándo, cómo te afecta y con qué recursos cuentas.",
  },
  {
    n: "03",
    titulo: "Entenderlo juntos",
    texto: "Construimos contigo una explicación comprensible de lo que ocurre, sin reducirte a una etiqueta, y acordamos los objetivos.",
  },
  {
    n: "04",
    titulo: "Un plan a tu medida",
    texto: "Elegimos las estrategias que mejor se ajustan a tu situación, a tus preferencias y a lo que la evidencia muestra que ayuda.",
  },
  {
    n: "05",
    titulo: "Revisar y ajustar",
    texto: "Miramos juntos cómo vas. Si algo no está funcionando, lo cambiamos.",
  },
  {
    n: "06",
    titulo: "Cierre y continuidad",
    texto: "Repasamos lo aprendido, acordamos señales de alerta y, si hace falta, te orientamos hacia otro servicio.",
  },
] as const;

const niveles = [
  {
    nivel: "Nivel 1",
    titulo: "Orientación y apoyo breve",
    icono: Compass,
    texto:
      "Para situaciones puntuales: una decisión difícil, un cambio o un conflicto. No toda dificultad necesita psicoterapia.",
    puntos: [
      "Escucha y clarificación de lo que te preocupa",
      "Explorar alternativas y armar un plan de acción",
      "Información sobre el estrés y las emociones",
      "Identificar tus apoyos cercanos",
    ],
  },
  {
    nivel: "Nivel 2",
    titulo: "Atención clínica y psicoterapéutica",
    icono: Brain,
    texto:
      "Para un malestar que persiste y afecta tu vida diaria. Es un proceso estructurado, con objetivos y seguimiento.",
    puntos: [
      "Terapia cognitivo-conductual (TCC)",
      "Terapia de aceptación y compromiso (ACT)",
      "Intervenciones centradas en las relaciones (interpersonales)",
      "Estrategias de regulación emocional",
    ],
    nota: "Son alternativas, no un paquete: se elige lo que tenga sentido para tu caso, según la valoración y la evidencia disponible.",
  },
  {
    nivel: "Nivel 3",
    titulo: "Acompañamiento psicosocial",
    icono: Users,
    texto:
      "Para cuando lo que vives está muy ligado a tu entorno. No te cargamos toda la responsabilidad de lo que depende del contexto.",
    puntos: [
      "Reconocer tus redes de apoyo",
      "Fortalecer habilidades: comunicación, límites, decisiones",
      "Acompañamiento en transiciones de vida",
      "Orientación hacia otros servicios sociales, educativos, jurídicos o de salud",
    ],
  },
] as const;

const condiciones = [
  {
    titulo: "Encuadre",
    texto: "Antes de empezar confirmamos tu identidad, desde dónde te conectas, que tengas privacidad y tu consentimiento.",
    icono: ClipboardCheck,
  },
  {
    titulo: "Seguridad",
    texto: "Acordamos un contacto de emergencia y una ruta de atención cercana a ti, por si se necesita.",
    icono: ShieldCheck,
  },
  {
    titulo: "Continuidad",
    texto: "Sabes de antemano qué pasa si se corta la conexión o si no puedes asistir a una sesión.",
    icono: RefreshCw,
  },
  {
    titulo: "Confidencialidad",
    texto: "Usamos herramientas adecuadas para cuidar tu información y tus conversaciones.",
    icono: Lock,
  },
  {
    titulo: "Accesibilidad",
    texto: "Tenemos en cuenta las dificultades tecnológicas y las necesidades de cada persona, incluidas las de discapacidad.",
    icono: Accessibility,
  },
] as const;

const medicion = [
  {
    titulo: "Cuestionarios validados, cuando están indicados",
    texto: "Instrumentos breves y reconocidos sobre el ánimo, la ansiedad o el funcionamiento diario (por ejemplo, PHQ-9 o GAD-7). Ninguno reemplaza la conversación con tu profesional.",
    icono: ClipboardList,
  },
  {
    titulo: "Los objetivos que acordamos",
    texto: "Revisamos de forma periódica si te estás acercando a los cambios que definimos juntos.",
    icono: Target,
  },
  {
    titulo: "Tu opinión",
    texto: "Te preguntamos cómo te sientes con el proceso y con la relación de trabajo. Tu retroalimentación cambia lo que hacemos.",
    icono: MessageCircle,
  },
] as const;

const fundamentos = [
  "La mirada biopsicosocial: lo biológico, lo psicológico y lo social se influyen mutuamente.",
  "La perspectiva ecológica: tu familia, tu trabajo y tu comunidad también cuentan.",
  "El enfoque centrado en la persona: empatía, respeto y decisiones compartidas.",
  "La práctica basada en evidencia: investigación, criterio profesional y tus preferencias.",
  "El enfoque de derechos y la sensibilidad al trauma: seguridad, autonomía y trato digno.",
];

export default function ModeloPage() {
  return (
    <>
      {/* 1. Intro */}
      <section className="relative overflow-hidden bg-surface-muted">
        <Blob className="-right-24 -top-24 size-96 opacity-80" tone="primary" />
        <Blob className="-bottom-32 -left-24 size-80" tone="accent" />
        <Rama className="absolute bottom-0 right-6 hidden h-48 w-24 opacity-90 md:block" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-accent-ink">
            Nuestro modelo
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-medium leading-tight sm:text-5xl">
            Modelo clínico-psicosocial integrado
          </h1>
          <p className="mt-6 max-w-3xl font-display text-xl leading-relaxed sm:text-2xl">
            Comprender a <strong className="font-bold text-primary">la persona en su contexto</strong>,{" "}
            <strong className="font-bold text-primary">intervenir</strong> con{" "}
            <strong className="font-bold text-primary">rigor científico</strong> y acompañar con{" "}
            <strong className="font-bold text-primary">sensibilidad humana</strong>.
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Lo que sientes no aparece de la nada: se relaciona con tu historia, tus relaciones y las
            condiciones en las que vives. Por eso no aplicamos una misma receta a todas las personas.
            Primero buscamos entender tu situación completa y luego elegimos, contigo, la forma de
            acompañarte.
          </p>
        </div>
      </section>

      {/* 2. Tres miradas */}
      <section aria-labelledby="miradas" className="mx-auto max-w-6xl px-4 py-16">
        <h2 id="miradas" className="font-display text-2xl font-semibold sm:text-3xl">
          Tres miradas, una sola persona
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Integramos lo clínico y lo psicosocial alrededor de ti. No son dos tratamientos en paralelo:
          es un único plan que tiene en cuenta todo lo que influye en tu bienestar.
        </p>
        <div className="mt-10">
          <DiagramaModelo />
        </div>
      </section>

      {/* 3. Dimensiones */}
      <section aria-labelledby="bienestar" className="bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 id="bienestar" className="font-display text-2xl font-semibold sm:text-3xl">
            Cómo entendemos el bienestar
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            Miramos cinco aspectos de tu vida que se conectan entre sí. Esta comprensión no es fija:
            cambia a medida que te conocemos mejor o cambian tus circunstancias.
          </p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dimensiones.map((d, i) => (
              <li key={d.titulo} className={`${tarjeta} p-6`}>
                <IconoCirculo icon={d.icono} tone={i % 2 === 0 ? "primary" : "accent"} />
                <h3 className="mt-4 font-display text-lg font-semibold">{d.titulo}</h3>
                <p className="mt-2 leading-relaxed text-muted">{d.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Fases */}
      <section aria-labelledby="acompanamos" className="mx-auto max-w-6xl px-4 py-16">
        <h2 id="acompanamos" className="font-display text-2xl font-semibold sm:text-3xl">
          Cómo te acompañamos
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          El proceso tiene seis momentos. No son una secuencia rígida: podemos volver sobre un paso
          cuando haga falta.
        </p>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <ol className="relative space-y-6 before:absolute before:bottom-6 before:left-6 before:top-6 before:w-px before:bg-border">
            {fases.map((f) => (
              <li key={f.n} className="relative flex gap-5">
                <span
                  aria-hidden
                  className="z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-base font-semibold text-primary-foreground"
                >
                  {f.n}
                </span>
                <div className="pt-2">
                  <h3 className="font-display text-lg font-semibold">
                    <span className="sr-only">Paso {f.n}: </span>
                    {f.titulo}
                  </h3>
                  <p className="mt-1 leading-relaxed text-muted">{f.texto}</p>
                </div>
              </li>
            ))}
          </ol>
          <aside className={`${tarjeta} h-fit p-6`} aria-labelledby="seguridad-continua">
            <IconoCirculo icon={ShieldCheck} tone="accent" />
            <h3 id="seguridad-continua" className="mt-4 font-display text-lg font-semibold">
              Tu seguridad se revisa todo el tiempo
            </h3>
            <p className="mt-2 leading-relaxed text-muted">
              La valoración, la seguridad y la revisión de objetivos no ocurren una sola vez: nos
              acompañan durante todo el proceso. Si en algún momento la atención virtual no es la
              más adecuada para ti, te lo diremos y te orientaremos hacia otra opción.
            </p>
          </aside>
        </div>
      </section>

      {/* 5. Niveles */}
      <section aria-labelledby="niveles" className="bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 id="niveles" className="font-display text-2xl font-semibold sm:text-3xl">
            Tres niveles de acompañamiento
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            Según lo que necesites, el acompañamiento puede ser más breve o más profundo, y combinar
            lo clínico con lo psicosocial. La decisión la toma un profesional contigo, nunca un
            formulario automático.
          </p>
          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {niveles.map((n, i) => (
              <li key={n.titulo} className={`${tarjeta} flex flex-col p-6`}>
                <div className="flex items-center gap-3">
                  <IconoCirculo icon={n.icono} tone={i === 2 ? "accent" : "primary"} />
                  <p className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
                    {n.nivel}
                  </p>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{n.titulo}</h3>
                <p className="mt-2 leading-relaxed text-muted">{n.texto}</p>
                <ul className="mt-4 space-y-2">
                  {n.puntos.map((p) => (
                    <li key={p} className="flex gap-2">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent-ink" strokeWidth={2.25} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                {"nota" in n && (
                  <p className="mt-5 rounded-2xl bg-primary-soft p-4 text-sm leading-relaxed">{n.nota}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Virtualidad */}
      <section aria-labelledby="virtual" className="mx-auto max-w-6xl px-4 py-16">
        <h2 id="virtual" className="font-display text-2xl font-semibold sm:text-3xl">
          Atención virtual con cuidado
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Lo virtual no es solo una videollamada. Cuidamos cinco condiciones para que tu espacio sea
          seguro, a tu ritmo.
        </p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {condiciones.map((c) => (
            <li key={c.titulo} className={`${tarjeta} p-5`}>
              <IconoCirculo icon={c.icono} size="sm" />
              <h3 className="mt-3 font-display text-base font-semibold">{c.titulo}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{c.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. Medición */}
      <section aria-labelledby="medimos" className="bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 id="medimos" className="font-display text-2xl font-semibold sm:text-3xl">
            Cómo sabemos si te está ayudando
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            Revisar los resultados es parte del acompañamiento desde el primer encuentro.
          </p>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {medicion.map((m) => (
              <li key={m.titulo} className={`${tarjeta} p-6`}>
                <IconoCirculo icon={m.icono} tone="accent" />
                <h3 className="mt-4 font-display text-lg font-semibold">{m.titulo}</h3>
                <p className="mt-2 leading-relaxed text-muted">{m.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Nota honesta */}
      <section aria-labelledby="construccion" className="mx-auto max-w-6xl px-4 py-16">
        <div className={`${tarjeta} grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]`}>
          <div>
            <IconoCirculo icon={Info} />
            <h2 id="construccion" className="mt-4 font-display text-2xl font-semibold">
              Un modelo en construcción
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              Queremos ser transparentes: este es un modelo propio que todavía estamos desarrollando.
              No es un modelo validado con estudios propios. Se apoya en enfoques con respaldo en la
              psicología y lo evaluaremos de forma continua para mejorarlo.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">En qué se apoya</h3>
            <ul className="mt-4 space-y-3">
              {fundamentos.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent-ink" strokeWidth={2.25} />
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <section aria-labelledby="empezar" className="relative overflow-hidden bg-surface-muted">
        <Blob className="-right-20 -top-20 size-72" tone="primary" />
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <h2 id="empezar" className="font-display text-2xl font-semibold sm:text-3xl">
                Tu espacio seguro, tu proceso, a tu ritmo
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-muted">
                {site.lema}. Cuéntanos qué necesitas y una persona del equipo revisará tu solicitud.
              </p>
              <Link
                href="/solicitar/"
                className={`${botonPrimario} mt-6`}
              >
                Solicitar atención
                <ArrowRight aria-hidden className="size-5" strokeWidth={1.75} />
              </Link>
            </div>
            <div className="rounded-3xl bg-danger-soft p-6 ring-1 ring-border">
              <div className="flex items-start gap-3">
                <LifeBuoy aria-hidden className="mt-0.5 size-6 shrink-0 text-danger" strokeWidth={1.75} />
                <div>
                  <h3 className="font-display text-lg font-semibold text-danger">
                    Esto no es un servicio de urgencias
                  </h3>
                  <p className="mt-2 leading-relaxed">
                    Si estás en peligro o piensas en hacerte daño, no esperes una cita.
                  </p>
                  <Link
                    href="/ayuda-inmediata/"
                    className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-danger underline underline-offset-4"
                  >
                    Busca ayuda inmediata
                    <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
