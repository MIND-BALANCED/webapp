import type { Prioridad } from "@/lib/admision";
import { estadoLabel, type EstadoSolicitud } from "@/lib/panel/tipos";
import { lineas } from "@/lib/servicios";

const prioridadEstilos: Record<Prioridad, string> = {
  urgente: "bg-danger text-white",
  prioritaria: "bg-warning-soft text-foreground ring-1 ring-inset ring-[#d9a43a]",
  regular: "bg-surface-muted text-muted",
};

const prioridadTexto: Record<Prioridad, string> = {
  urgente: "Urgente",
  prioritaria: "Prioritaria",
  regular: "Regular",
};

export function PrioridadBadge({ p }: { p: Prioridad }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${prioridadEstilos[p]}`}>
      {prioridadTexto[p]}
    </span>
  );
}

const estadoEstilos: Record<EstadoSolicitud, string> = {
  nueva: "bg-primary-soft text-primary",
  en_valoracion: "bg-accent-soft text-accent",
  agendada: "bg-accent text-white",
  remitida: "bg-surface-muted text-foreground",
  cerrada: "bg-surface-muted text-muted",
};

export function EstadoBadge({ e }: { e: EstadoSolicitud }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoEstilos[e]}`}>
      {estadoLabel(e)}
    </span>
  );
}

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
  return <p className="px-4 py-16 text-center text-muted">Cargando…</p>;
}
