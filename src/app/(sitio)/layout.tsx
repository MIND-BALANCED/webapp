import Link from "next/link";
import { site } from "@/lib/site";

const nav = [
  { href: "/servicios", label: "Servicios" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/ayuda-inmediata", label: "Ayuda inmediata" },
];

export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:p-3">
        Saltar al contenido
      </a>
      <div className="bg-danger-soft text-danger text-sm">
        <div className="mx-auto max-w-6xl px-4 py-2">
          ¿Estás en peligro o piensas en hacerte daño? No esperes una cita:{" "}
          <Link href="/ayuda-inmediata" className="font-semibold underline">
            busca ayuda inmediata
          </Link>
          .
        </div>
      </div>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="font-serif text-xl font-semibold text-primary">
            {site.name}
          </Link>
          <nav aria-label="Principal" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-muted hover:text-foreground">
                {n.label}
              </Link>
            ))}
            <Link
              href="/solicitar"
              className="rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
            >
              Solicitar atención
            </Link>
          </nav>
        </div>
      </header>
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border bg-surface text-sm text-muted">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
          <div>
            <p className="font-serif text-base text-foreground">{site.name}</p>
            <p className="mt-1">{site.tagline}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Link href="/consentimiento" className="hover:text-foreground">Consentimiento informado</Link>
            <Link href="/privacidad" className="hover:text-foreground">Tratamiento de datos personales</Link>
            <Link href="/panel" className="hover:text-foreground">Acceso del equipo</Link>
          </div>
          <p>
            Este no es un servicio de urgencias. Si tu vida está en riesgo, llama al{" "}
            <a href="tel:123" className="font-semibold text-danger">123</a>.
          </p>
        </div>
      </footer>
    </>
  );
}
