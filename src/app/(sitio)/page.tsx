import Link from "next/link";
import { lineas, recorrido } from "@/lib/servicios";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">{site.tagline}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
          Un espacio virtual para escuchar, orientar y acompañar.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Atención psicológica profesional para jóvenes y adultos que quieren comprender lo que
          viven, afrontar situaciones difíciles y fortalecer su bienestar. Confidencial, cercana y
          basada en evidencia.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/solicitar" className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90">
            Solicitar atención
          </Link>
          <Link href="/como-funciona" className="rounded-full border border-border bg-surface px-6 py-3 font-medium hover:bg-surface-muted">
            Cómo funciona
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-serif text-3xl">Líneas de atención</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {lineas.map((l) => (
              <Link
                key={l.id}
                href={`/servicios#${l.id}`}
                className="rounded-2xl border border-border bg-background p-6 transition hover:border-primary"
              >
                <span className="text-sm font-semibold text-primary">{l.numero}</span>
                <h3 className="mt-1 text-xl font-semibold">{l.titulo}</h3>
                <p className="mt-2 text-muted">{l.resumen}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-serif text-3xl">Tu recorrido</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {recorrido.map((r) => (
            <li key={r.paso} className="rounded-2xl bg-surface p-5 ring-1 ring-border">
              <span className="text-sm font-semibold text-accent">{r.paso}</span>
              <p className="mt-1 font-semibold">{r.titulo}</p>
              <p className="mt-1 text-sm text-muted">{r.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            ["Seguridad", "Confidencialidad, consentimiento informado y protección de tus datos."],
            ["Claridad", "Sabes qué puedes esperar, cuánto dura y cuáles son los alcances del servicio."],
            ["Cercanía", "Un acompañamiento humano, ajustado a tu contexto y a tu momento vital."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl bg-primary-soft p-6">
              <p className="font-serif text-xl">{t}</p>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
