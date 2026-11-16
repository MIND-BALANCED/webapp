import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { AdmisionForm } from "./AdmisionForm";

export const metadata: Metadata = { title: "Solicitar atención" };

export default function Solicitar() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-serif text-4xl">Solicitar atención</h1>
      <p className="mt-4 text-lg text-muted">
        Este formulario es el primer paso de la admisión. Toma unos 5 minutos. Con tus respuestas,
        un profesional valorará qué tipo de acompañamiento es el más adecuado para ti.
      </p>
      <p className="mt-3 text-sm text-muted">
        Por ahora atendemos personas de {site.minAge} años o más. Si estás en peligro,{" "}
        <Link href="/ayuda-inmediata" className="font-semibold text-danger underline">busca ayuda inmediata</Link>.
      </p>
      <div className="mt-10">
        <AdmisionForm minAge={site.minAge} />
      </div>
    </div>
  );
}
