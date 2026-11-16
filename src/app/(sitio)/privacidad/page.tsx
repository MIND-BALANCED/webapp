import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Tratamiento de datos personales" };

export default function Privacidad() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <p className="rounded-xl bg-warning-soft p-4 text-sm">
        <strong>Borrador.</strong> Debe completarse con los datos del responsable del tratamiento y
        revisarse jurídicamente (Ley 1581 de 2012 y Decreto 1377 de 2013).
      </p>
      <h1 className="mt-8 font-serif text-4xl">Política de tratamiento de datos personales</h1>
      <div className="mt-8 space-y-6 text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Responsable</h2>
          <p className="mt-2">{site.name} — [razón social, NIT, dirección y canal de contacto por definir].</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Datos que recolectamos</h2>
          <p className="mt-2">
            Datos de identificación y contacto, y datos sensibles relacionados con tu salud mental
            (motivo de consulta, respuestas de tamizaje e información de las sesiones). El suministro
            de datos sensibles es facultativo.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Finalidades</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Gestionar tu solicitud, admisión y agendamiento.</li>
            <li>Prestar la atención psicológica y llevar la historia clínica.</li>
            <li>Activar rutas de atención en caso de riesgo.</li>
            <li>Evaluar la calidad del servicio con datos anonimizados.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Encargados</h2>
          <p className="mt-2">
            Usamos proveedores tecnológicos para alojamiento de datos, agenda (Cal.com o Calendly) y
            videollamadas (Google Meet, Zoom o Microsoft Teams), que pueden implicar transferencia
            internacional de datos.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Tus derechos</h2>
          <p className="mt-2">
            Conocer, actualizar, rectificar y suprimir tus datos, revocar la autorización y presentar
            quejas ante la Superintendencia de Industria y Comercio
            {site.contactEmail ? `, escribiendo a ${site.contactEmail}` : ""}.
          </p>
        </section>
      </div>
    </article>
  );
}
