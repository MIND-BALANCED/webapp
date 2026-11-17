"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, LifeBuoy, Menu, X } from "lucide-react";
import { botonPrimario } from "@/components/marca/estilos";

const nav = [
  { href: "/servicios/", label: "Servicios" },
  { href: "/modelo/", label: "Nuestro modelo" },
  { href: "/equipo/", label: "Equipo" },
  { href: "/como-funciona/", label: "Cómo funciona" },
  { href: "/ayuda-inmediata/", label: "Ayuda inmediata", crisis: true },
];

const sinBarra = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

function esActual(pathname: string, href: string) {
  const actual = sinBarra(pathname);
  const destino = sinBarra(href);
  return actual === destino || actual.startsWith(`${destino}/`);
}

/**
 * Navegación principal del sitio público.
 * - Escritorio (lg+): enlaces en línea + botón "Solicitar atención".
 * - Móvil: botón que despliega el menú (aria-expanded / aria-controls),
 *   se cierra con Escape, al elegir un enlace y al cambiar de página.
 */
export function NavSitio() {
  const pathname = usePathname() ?? "/";
  const [abierto, setAbierto] = useState(false);
  // Cierra el menú en cada cambio de ruta (estado derivado de la ruta previa, sin efectos).
  const [rutaPrevia, setRutaPrevia] = useState(pathname);
  if (rutaPrevia !== pathname) {
    setRutaPrevia(pathname);
    setAbierto(false);
  }
  const botonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAbierto(false);
        botonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abierto]);

  const cerrar = () => setAbierto(false);
  const solicitarActual = esActual(pathname, "/solicitar/");

  return (
    <>
      <nav aria-label="Principal" className="hidden items-center gap-1 xl:flex">
        <ul className="flex items-center gap-0.5">
          {nav.map((n) => {
            const actual = esActual(pathname, n.href);
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={actual ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[0.95rem] font-medium transition-colors ${
                    actual
                      ? "bg-primary-soft text-primary underline decoration-2 underline-offset-[6px]"
                      : n.crisis
                        ? "text-danger hover:bg-danger-soft"
                        : "text-muted hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  {n.crisis && <LifeBuoy aria-hidden className="size-4" strokeWidth={1.75} />}
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href="/solicitar/"
          aria-current={solicitarActual ? "page" : undefined}
          className="ml-3 inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 font-display text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
        >
          Solicitar atención
          <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
        </Link>
      </nav>

      <button
        ref={botonRef}
        type="button"
        aria-expanded={abierto}
        aria-controls="menu-movil"
        onClick={() => setAbierto((a) => !a)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 font-medium text-primary ring-1 ring-border-strong hover:bg-surface-muted xl:hidden"
      >
        {abierto ? (
          <X aria-hidden className="size-5" strokeWidth={1.75} />
        ) : (
          <Menu aria-hidden className="size-5" strokeWidth={1.75} />
        )}
        <span>Menú</span>
      </button>

      <div
        id="menu-movil"
        hidden={!abierto}
        className="absolute inset-x-0 top-full z-40 border-b border-border bg-surface shadow-card xl:hidden"
      >
        <nav aria-label="Principal (móvil)" className="mx-auto max-w-6xl px-4 py-4">
          <ul className="flex flex-col gap-1">
            {nav.map((n) => {
              const actual = esActual(pathname, n.href);
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={cerrar}
                    aria-current={actual ? "page" : undefined}
                    className={`flex min-h-12 items-center gap-2 rounded-2xl px-4 text-base font-medium ${
                      actual
                        ? "bg-primary-soft text-primary underline decoration-2 underline-offset-[6px]"
                        : n.crisis
                          ? "text-danger hover:bg-danger-soft"
                          : "text-foreground hover:bg-surface-muted"
                    }`}
                  >
                    {n.crisis && <LifeBuoy aria-hidden className="size-5" strokeWidth={1.75} />}
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/solicitar/"
            onClick={cerrar}
            aria-current={solicitarActual ? "page" : undefined}
            className={`${botonPrimario} mt-3 w-full`}
          >
            Solicitar atención
            <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
          </Link>
        </nav>
      </div>
    </>
  );
}
