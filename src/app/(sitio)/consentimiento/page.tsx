import type { Metadata } from "next";
import Link from "next/link";
import { FileWarning } from "lucide-react";
import { Blob } from "@/components/marca/Decor";

export const metadata: Metadata = { title: "Consentimiento informado" };

const secciones: { id: string; titulo: string; texto: string }[] = [
  { id: "naturaleza", titulo: "Naturaleza del servicio", texto: "La atención psicológica se presta de forma virtual, por videollamada (Google Meet, Zoom o Microsoft Teams), por profesionales en psicología con tarjeta profesional vigente, en el marco de la Ley 1090 de 2006 y su Código Deontológico y Bioético." },
  { id: "objetivos", titulo: "Objetivos y alcances", texto: "El proceso busca comprender tu situación, fortalecer tus recursos y promover tu bienestar. Los objetivos se acuerdan contigo en el plan de acompañamiento. Los resultados dependen de múltiples factores y no pueden garantizarse." },
  { id: "confidencialidad", titulo: "Confidencialidad y sus límites", texto: "Lo que compartas es confidencial. Solo se levantará la confidencialidad cuando exista riesgo grave para tu vida o la de terceros, por orden de autoridad competente, o en los demás casos previstos por la ley. En esos casos se compartirá únicamente la información estrictamente necesaria." },
  { id: "virtual", titulo: "Particularidades de la atención virtual", texto: "La atención virtual implica riesgos propios: fallas de conexión, interrupciones o la posibilidad de que otras personas escuchen. Te comprometes a conectarte desde un espacio privado. Si la llamada se interrumpe, el profesional intentará contactarte por teléfono o correo. Las sesiones no se graban." },
  { id: "crisis", titulo: "Situaciones de crisis", texto: "Este no es un servicio de urgencias. Si durante el proceso se identifica un riesgo para tu vida o la de otros, el profesional activará la ruta de atención correspondiente, que puede incluir contactar a la persona de apoyo que indiques o a los servicios de emergencia." },
  { id: "historia-clinica", titulo: "Historia clínica", texto: "Se abrirá y custodiará una historia clínica conforme a la normativa vigente. Tienes derecho a conocer su contenido y a solicitar copia." },
  { id: "derechos", titulo: "Tus derechos", texto: "Puedes hacer preguntas en cualquier momento, rechazar una intervención, solicitar cambio de profesional o terminar el proceso cuando lo decidas." },
];

export default function Consentimiento() {
  return (
    <>
      <header className="relative overflow-hidden bg-surface-muted">
        <Blob tone="primary" className="-right-28 -top-28 size-72 sm:size-96" />
        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent-ink">
            Documento legal
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Consentimiento informado para atención psicológica virtual
          </h1>
          <p className="mt-4 max-w-prose text-lg leading-relaxed text-muted">
            Lo que debes saber antes de iniciar tu proceso: cómo funciona la atención, qué protege tu
            confidencialidad y cuáles son tus derechos.
          </p>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:py-14">
        <p role="note" className="flex max-w-prose gap-3 rounded-2xl bg-warning-soft p-5 leading-relaxed text-foreground ring-1 ring-border">
          <FileWarning aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
          <span>
            <strong>Borrador.</strong> Este texto debe ser revisado por el equipo profesional y
            asesoría jurídica antes de su uso real.
          </span>
        </p>

        <nav aria-labelledby="indice-titulo" className="mt-10 max-w-prose rounded-3xl bg-surface p-6 ring-1 ring-border">
          <h2 id="indice-titulo" className="font-display text-base font-semibold text-foreground">
            En este documento
          </h2>
          <ol className="mt-3 list-decimal space-y-1 pl-6 marker:text-muted">
            {secciones.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/consentimiento/#${s.id}`}
                  className="inline-flex min-h-11 items-center text-primary underline-offset-4 hover:underline sm:min-h-8"
                >
                  {s.titulo}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 max-w-prose space-y-10">
          {secciones.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-titulo`} className="scroll-mt-8">
              <h2 id={`${s.id}-titulo`} className="font-display text-xl font-semibold text-foreground">
                <span aria-hidden className="mr-2 text-primary">{i + 1}.</span>
                {s.titulo}
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-foreground">{s.texto}</p>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
