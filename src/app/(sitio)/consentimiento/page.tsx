import type { Metadata } from "next";

export const metadata: Metadata = { title: "Consentimiento informado" };

const secciones: [string, string][] = [
  ["Naturaleza del servicio", "La atención psicológica se presta de forma virtual, por videollamada (Google Meet, Zoom o Microsoft Teams), por profesionales en psicología con tarjeta profesional vigente, en el marco de la Ley 1090 de 2006 y su Código Deontológico y Bioético."],
  ["Objetivos y alcances", "El proceso busca comprender tu situación, fortalecer tus recursos y promover tu bienestar. Los objetivos se acuerdan contigo en el plan de acompañamiento. Los resultados dependen de múltiples factores y no pueden garantizarse."],
  ["Confidencialidad y sus límites", "Lo que compartas es confidencial. Solo se levantará la confidencialidad cuando exista riesgo grave para tu vida o la de terceros, por orden de autoridad competente, o en los demás casos previstos por la ley. En esos casos se compartirá únicamente la información estrictamente necesaria."],
  ["Particularidades de la atención virtual", "La atención virtual implica riesgos propios: fallas de conexión, interrupciones o la posibilidad de que otras personas escuchen. Te comprometes a conectarte desde un espacio privado. Si la llamada se interrumpe, el profesional intentará contactarte por teléfono o correo. Las sesiones no se graban."],
  ["Situaciones de crisis", "Este no es un servicio de urgencias. Si durante el proceso se identifica un riesgo para tu vida o la de otros, el profesional activará la ruta de atención correspondiente, que puede incluir contactar a la persona de apoyo que indiques o a los servicios de emergencia."],
  ["Historia clínica", "Se abrirá y custodiará una historia clínica conforme a la normativa vigente. Tienes derecho a conocer su contenido y a solicitar copia."],
  ["Tus derechos", "Puedes hacer preguntas en cualquier momento, rechazar una intervención, solicitar cambio de profesional o terminar el proceso cuando lo decidas."],
];

export default function Consentimiento() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <p className="rounded-xl bg-warning-soft p-4 text-sm">
        <strong>Borrador.</strong> Este texto debe ser revisado por el equipo profesional y asesoría
        jurídica antes de su uso real.
      </p>
      <h1 className="mt-8 font-serif text-4xl">Consentimiento informado para atención psicológica virtual</h1>
      <div className="mt-8 space-y-6">
        {secciones.map(([t, d]) => (
          <section key={t}>
            <h2 className="text-lg font-semibold">{t}</h2>
            <p className="mt-2 text-muted">{d}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
