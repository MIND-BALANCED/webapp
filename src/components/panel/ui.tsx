import type { LucideIcon } from "lucide-react";
import { Archive, CalendarCheck, CircleDashed, Flag, Hourglass, Send, TriangleAlert } from "lucide-react";
import type { Prioridad } from "@/lib/admision";
import { estadoLabel, type EstadoSolicitud } from "@/lib/panel/tipos";
import { lineas } from "@/lib/servicios";

/** Tarjeta de marca: blanca, muy redondeada y con sombra sutil. */
export const tarjeta =
  "rounded-3xl bg-surface ring-1 ring-border shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(76_58_153/0.18)]";

/** Bordes de controles de formulario (≥3:1 en claro y oscuro). */
export const control =
  "w-full rounded-xl border border-border-strong bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted";

/** Botón principal en píldora. */
export const botonPrimario =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60";

/** Botón secundario en píldora. */
export const botonSecundario =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-surface px-5 py-2 text-sm font-medium text-foreground ring-1 ring-inset ring-border-strong hover:bg-surface-muted";

// La prioridad y el estado siempre se comunican con texto; el color y el ícono solo refuerzan.
const prioridadEstilos: Record<Prioridad, { clase: string; texto: string; icono?: LucideIcon }> = {
  urgente: { clase: "bg-danger-soft text-danger ring-1 ring-inset ring-danger", texto: "Urgente", icono: TriangleAlert },
  prioritaria: { clase: "bg-warning-soft text-foreground ring-1 ring-inset ring-border-strong", texto: "Prioritaria", icono: Flag },
  regular: { clase: "bg-surface-muted text-muted", texto: "Regular" },
};

export function PrioridadBadge({ p }: { p: Prioridad }) {
  const { clase, texto, icono: Icono } = prioridadEstilos[p];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${clase}`}>
      {Icono && <Icono aria-hidden className="size-3.5" strokeWidth={2} />}
      {texto}
    </span>
  );
}

const estadoEstilos: Record<EstadoSolicitud, { clase: string; icono: LucideIcon }> = {
  nueva: { clase: "bg-primary-soft text-primary", icono: CircleDashed },
  en_valoracion: { clase: "bg-accent-soft text-accent-ink", icono: Hourglass },
  agendada: { clase: "bg-accent-soft text-accent-ink ring-1 ring-inset ring-accent-ink", icono: CalendarCheck },
  remitida: { clase: "bg-surface-muted text-foreground", icono: Send },
  cerrada: { clase: "bg-surface-muted text-muted", icono: Archive },
};

export function EstadoBadge({ e }: { e: EstadoSolicitud }) {
  const { clase, icono: Icono } = estadoEstilos[e];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${clase}`}>
      <Icono aria-hidden className="size-3.5" strokeWidth={2} />
      {estadoLabel(e)}
    </span>
  );
}

/** Sección en tarjeta con título (h2) y un ícono decorativo opcional. */
export function Tarjeta({
  titulo,
  icono: Icono,
  children,
  className = "",
}: {
  titulo: string;
  icono?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`${tarjeta} p-5 sm:p-6 ${className}`}>
      <h2 className="mb-4 flex items-center gap-3 font-display text-lg font-semibold text-foreground">
        {Icono && (
          <span aria-hidden className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Icono className="size-[1.125rem]" strokeWidth={1.75} />
          </span>
        )}
        {titulo}
      </h2>
      {children}
    </section>
  );
}

export const iniciales = (nombre: string) =>
  nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

export const lineaLabel = (id: string) =>
  id === "no_se" ? "Por definir" : lineas.find((l) => l.id === id)?.titulo ?? id;

const fmt = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" });
export const fecha = (iso: string) => fmt.format(new Date(iso));

const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
export function hace(iso: string) {
  const min = Math.round((new Date(iso).getTime() - Date.now()) / 60000);
  if (Math.abs(min) < 60) return rtf.format(min, "minute");
  const h = Math.round(min / 60);
  if (Math.abs(h) < 24) return rtf.format(h, "hour");
  return rtf.format(Math.round(h / 24), "day");
}

export function Cargando() {
  return (
    <p role="status" className="px-4 py-16 text-center text-muted">
      Cargando…
    </p>
  );
}
