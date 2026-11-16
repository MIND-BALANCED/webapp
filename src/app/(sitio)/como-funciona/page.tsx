import type { Metadata } from "next";
import Link from "next/link";
import { recorrido } from "@/lib/servicios";

export const metadata: Metadata = { title: "Cómo funciona" };

const requisitos = [
  ["Un espacio privado", "Donde puedas hablar con tranquilidad y sin interrupciones."],
  ["Conexión estable", "Computador, tableta o celular con cámara, micrófono e internet."],
  ["Audífonos", "Recomendados para cuidar la confidencialidad de la conversación."],
  ["Un plan B", "Si se corta la llamada, te contactaremos por teléfono o correo."],
];

export default function ComoFunciona() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="font-serif text-4xl">Cómo funciona</h1>
      <p className="mt-4 text-lg text-muted">
        Desde tu primer contacto hasta el cierre del proceso, sabrás siempre en qué momento estás y
        qué sigue.
      </p>

      <ol className="mt-10 space-y-4">
        {recorrido.map((r) => (
          <li key={r.paso} className="flex gap-5 rounded-2xl bg-surface p-5 ring-1 ring-border">
            <span className="font-serif text-2xl text-primary">{r.paso}</span>
            <div>
              <p className="font-semibold">{r.titulo}</p>
              <p className="mt-1 text-muted">{r.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-14 font-serif text-2xl">Las sesiones</h2>
      <p className="mt-3 text-muted">
        Las sesiones se realizan por Google Meet, Zoom o Microsoft Teams, según tu preferencia.
        Recibirás el enlace por correo al confirmar tu cita. Las sesiones no se graban.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {requisitos.map(([t, d]) => (
          <div key={t} className="rounded-2xl bg-accent-soft p-5">
            <p className="font-semibold">{t}</p>
            <p className="mt-1 text-sm text-muted">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/solicitar" className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90">
          Empezar mi solicitud
        </Link>
      </div>
    </div>
  );
}
