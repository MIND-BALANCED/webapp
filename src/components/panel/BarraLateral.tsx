"use client";

import type { LucideIcon } from "lucide-react";
import { Globe, Heart, Inbox, LifeBuoy, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { LogoMark } from "@/components/marca/Logo";
import type { Profesional } from "@/lib/panel/tipos";
import { site } from "@/lib/site";
import { iniciales } from "./ui";

/*
 * Navegación del panel sobre fondo violeta (bg-sidebar).
 * El contorno de foco global usa var(--primary), que sobre este fondo no se
 * vería; dentro de la barra se cambia solo el COLOR DEL CONTORNO (no el token
 * --primary, que también colorea el símbolo y otros elementos de marca).
 */
const focoInverso = "[&_:focus-visible]:outline-sidebar-foreground";

type Item = { href: string; label: string; icono: LucideIcon; activo: boolean; actual: boolean };

function itemsDe(pathname: string): Item[] {
  const ruta = pathname.replace(/\/+$/, "") || "/";
  return [
    {
      href: "/panel/",
      label: "Bandeja",
      icono: Inbox,
      activo: ruta === "/panel" || ruta.startsWith("/panel/solicitud"),
      actual: ruta === "/panel",
    },
    { href: "/", label: "Sitio público", icono: Globe, activo: false, actual: false },
    { href: "/ayuda-inmediata/", label: "Ayuda inmediata", icono: LifeBuoy, activo: false, actual: false },
  ];
}

function Marca() {
  return (
    <span className="flex items-center gap-3">
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-surface">
        <LogoMark className="size-8" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-lg font-bold tracking-tight text-sidebar-foreground">{site.name}</span>
        <span className="text-sm text-sidebar-foreground/90">Panel profesional</span>
      </span>
    </span>
  );
}

function Navegacion({ pathname, alNavegar }: { pathname: string; alNavegar?: () => void }) {
  return (
    <nav aria-label="Panel">
      <ul className="space-y-1">
        {itemsDe(pathname).map(({ href, label, icono: Icono, activo, actual }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={alNavegar}
              aria-current={actual ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-2xl px-4 py-2.5 text-[0.95rem] font-medium text-sidebar-foreground ${
                activo ? "bg-sidebar-foreground/15 font-semibold" : "hover:bg-sidebar-foreground/10"
              }`}
            >
              <Icono aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Usuario({ yo, onSalir }: { yo: Profesional; onSalir: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-sidebar-foreground/10 p-3">
      <span
        aria-hidden
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-foreground font-display text-sm font-semibold text-sidebar"
      >
        {iniciales(yo.nombre)}
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block text-sm font-semibold break-words text-sidebar-foreground">{yo.nombre}</span>
        <span className="block text-sm text-sidebar-foreground/90">{yo.rol === "admin" ? "Coordinación" : "Profesional"}</span>
      </span>
      <button
        type="button"
        onClick={onSalir}
        className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium text-sidebar-foreground ring-1 ring-inset ring-sidebar-foreground/60 hover:bg-sidebar-foreground/15"
      >
        <LogOut aria-hidden className="size-4" strokeWidth={1.75} />
        Salir
      </button>
    </div>
  );
}

function Autocuidado() {
  return (
    <div className="rounded-3xl bg-sidebar-foreground/10 p-4 text-sidebar-foreground">
      <p className="flex items-center gap-2 font-display text-sm font-semibold">
        <Heart aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
        Tu bienestar también importa
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-sidebar-foreground/90">
        Acompañar también cansa. Haz pausas entre casos y apóyate en el equipo cuando lo necesites.
      </p>
    </div>
  );
}

const lema = "Comprender • Intervenir • Acompañar";

/** Barra lateral en escritorio; encabezado con menú desplegable en móvil. */
export function BarraLateral({ yo, pathname, onSalir }: { yo: Profesional; pathname: string; onSalir: () => void }) {
  // El menú queda abierto solo en la ruta donde se abrió: al navegar (por
  // cualquier enlace, también los de fuera del menú) se cierra solo.
  const [abiertoEn, setAbiertoEn] = useState<string | null>(null);
  const abierto = abiertoEn === pathname;
  const cerrar = () => setAbiertoEn(null);
  const idMenu = useId();
  const botonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAbiertoEn(null);
        botonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abierto]);

  return (
    <>
      {/* Escritorio */}
      <aside className="hidden w-72 shrink-0 bg-sidebar lg:block">
        <div className="sticky top-0 flex max-h-screen min-h-screen flex-col gap-8 overflow-y-auto px-5 py-7">
          <div>
            <Marca />
            <p className="mt-4 text-sm font-medium text-sidebar-foreground/90">{lema}</p>
          </div>
          <div className={`flex flex-1 flex-col gap-6 ${focoInverso}`}>
            <Navegacion pathname={pathname} />
            <div className="mt-auto space-y-4">
              <Autocuidado />
              <Usuario yo={yo} onSalir={onSalir} />
            </div>
          </div>
        </div>
      </aside>

      {/* Móvil */}
      <header className="bg-sidebar lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Marca />
          <span className={focoInverso}>
            <button
              ref={botonRef}
              type="button"
              aria-expanded={abierto}
              aria-controls={idMenu}
              onClick={() => setAbiertoEn(abierto ? null : pathname)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-sidebar-foreground ring-1 ring-inset ring-sidebar-foreground/60 hover:bg-sidebar-foreground/15"
            >
              {abierto ? (
                <X aria-hidden className="size-5" strokeWidth={1.75} />
              ) : (
                <Menu aria-hidden className="size-5" strokeWidth={1.75} />
              )}
              Menú
            </button>
          </span>
        </div>
        <div id={idMenu} hidden={!abierto} className={`space-y-5 px-4 pb-5 ${focoInverso}`}>
          <p className="text-sm font-medium text-sidebar-foreground/90">{lema}</p>
          <Navegacion pathname={pathname} alNavegar={cerrar} />
          <Usuario yo={yo} onSalir={onSalir} />
          <Autocuidado />
        </div>
      </header>
    </>
  );
}
