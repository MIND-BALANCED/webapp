import type { Metadata } from "next";
import Link from "next/link";
import { FileWarning } from "lucide-react";
import { Blob } from "@/components/marca/Decor";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Tratamiento de datos personales" };

const indice = [
  { id: "responsable", titulo: "Responsable" },
  { id: "datos", titulo: "Datos que recolectamos" },
  { id: "finalidades", titulo: "Finalidades" },
  { id: "encargados", titulo: "Encargados" },
  { id: "derechos", titulo: "Tus derechos" },
] as const;

const titulo = (id: (typeof indice)[number]["id"]) => {
  const i = indice.findIndex((s) => s.id === id);
  return (
    <h2 id={`${id}-titulo`} className="font-display text-xl font-semibold text-foreground">
      <span aria-hidden className="mr-2 text-primary">{i + 1}.</span>
      {indice[i].titulo}
    </h2>
  );
};

const seccion = "scroll-mt-8";
const parrafo = "mt-3 text-lg leading-relaxed text-foreground";

export default function Privacidad() {
  return (
    <>
      <header className="relative overflow-hidden bg-surface-muted">
        <Blob tone="primary" className="-right-28 -top-28 size-72 sm:size-96" />
        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent-ink">
            Documento legal
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Política de tratamiento de datos personales
          </h1>
          <p className="mt-4 max-w-prose text-lg leading-relaxed text-muted">
            Qué datos recolectamos, para qué los usamos, con quién los compartimos y cómo puedes
            ejercer tus derechos.
          </p>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:py-14">
        <p role="note" className="flex max-w-prose gap-3 rounded-2xl bg-warning-soft p-5 leading-relaxed text-foreground ring-1 ring-border">
          <FileWarning aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
          <span>
            <strong>Borrador.</strong> Debe completarse con los datos del responsable del tratamiento
            y revisarse jurídicamente (Ley 1581 de 2012 y Decreto 1377 de 2013).
          </span>
        </p>

        <nav aria-labelledby="indice-titulo" className="mt-10 max-w-prose rounded-3xl bg-surface p-6 ring-1 ring-border">
          <h2 id="indice-titulo" className="font-display text-base font-semibold text-foreground">
            En este documento
          </h2>
          <ol className="mt-3 list-decimal space-y-1 pl-6 marker:text-muted">
            {indice.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/privacidad/#${s.id}`}
                  className="inline-flex min-h-11 items-center text-primary underline-offset-4 hover:underline sm:min-h-8"
                >
                  {s.titulo}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 max-w-prose space-y-10">
          <section id="responsable" aria-labelledby="responsable-titulo" className={seccion}>
            {titulo("responsable")}
            <p className={parrafo}>
              {site.name} — [razón social, NIT, dirección y canal de contacto por definir].
            </p>
          </section>

          <section id="datos" aria-labelledby="datos-titulo" className={seccion}>
            {titulo("datos")}
            <p className={parrafo}>
              Datos de identificación y contacto, y datos sensibles relacionados con tu salud mental
              (motivo de consulta, respuestas de tamizaje e información de las sesiones). El
              suministro de datos sensibles es facultativo.
            </p>
          </section>

          <section id="finalidades" aria-labelledby="finalidades-titulo" className={seccion}>
            {titulo("finalidades")}
            <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-relaxed text-foreground marker:text-primary">
              <li>Gestionar tu solicitud, admisión y agendamiento.</li>
              <li>Prestar la atención psicológica y llevar la historia clínica.</li>
              <li>Activar rutas de atención en caso de riesgo.</li>
              <li>Evaluar la calidad del servicio con datos anonimizados.</li>
            </ul>
          </section>

          <section id="encargados" aria-labelledby="encargados-titulo" className={seccion}>
            {titulo("encargados")}
            <p className={parrafo}>
              Usamos proveedores tecnológicos para alojamiento de datos, agenda (Cal.com o Calendly)
              y videollamadas (Google Meet, Zoom o Microsoft Teams), que pueden implicar
              transferencia internacional de datos.
            </p>
          </section>

          <section id="derechos" aria-labelledby="derechos-titulo" className={seccion}>
            {titulo("derechos")}
            <p className={parrafo}>
              Conocer, actualizar, rectificar y suprimir tus datos, revocar la autorización y
              presentar quejas ante la Superintendencia de Industria y Comercio
              {site.contactEmail ? (
                <>
                  , escribiendo a{" "}
                  <a href={`mailto:${site.contactEmail}`} className="font-medium text-primary underline underline-offset-4 break-all">
                    {site.contactEmail}
                  </a>
                </>
              ) : null}
              .
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
