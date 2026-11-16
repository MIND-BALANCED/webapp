import type { Metadata } from "next";
import { CrisisLines } from "@/components/CrisisLines";

export const metadata: Metadata = { title: "Ayuda inmediata" };

export default function AyudaInmediata() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-serif text-4xl">Ayuda inmediata</h1>
      <p className="mt-4 text-lg">
        Si estás pensando en hacerte daño, si tu vida o la de otra persona está en peligro, o si
        estás viviendo una situación de violencia, <strong>no esperes una cita</strong>. Busca ayuda
        ahora:
      </p>

      <div className="mt-8">
        <CrisisLines />
      </div>

      <div className="mt-10 space-y-3 rounded-2xl bg-surface p-6 ring-1 ring-border">
        <p className="font-semibold">Mientras recibes ayuda</p>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>Busca a una persona de confianza y dile cómo te sientes. No te quedes a solas.</li>
          <li>Aléjate de objetos o sustancias con los que podrías hacerte daño.</li>
          <li>Si puedes, acude al servicio de urgencias más cercano.</li>
        </ul>
      </div>

      <p className="mt-8 text-sm text-muted">
        Nuestro centro brinda atención programada por videollamada y no cuenta con capacidad de
        respuesta a emergencias en tiempo real. Cuando estés a salvo, puedes solicitar
        acompañamiento con nosotros.
      </p>
    </div>
  );
}
