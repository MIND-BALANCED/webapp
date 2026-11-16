"use client";

import type { LucideIcon } from "lucide-react";
import { CalendarCheck, ChevronRight, CircleDashed, Clock, Hourglass, Inbox, Info, TriangleAlert, UserRound } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { EstadoBadge, hace, lineaLabel, PrioridadBadge, tarjeta } from "@/components/panel/ui";
import { useDemoDB, usuarioActual } from "@/lib/demo/store";
import { ordenarBandeja, puedeVer } from "@/lib/panel/permisos";
import type { Solicitud } from "@/lib/panel/tipos";

type Vista = "activas" | "mias" | "sin_asignar" | "finalizadas" | "todas";

const activa = (s: Solicitud) => s.estado !== "cerrada" && s.estado !== "remitida";

export default function Bandeja() {
  const db = useDemoDB();
  const [vista, setVista] = useState<Vista>("activas");
  const pestanas = useRef<Partial<Record<Vista, HTMLButtonElement | null>>>({});
  if (!db) return null;
  const yo = usuarioActual(db);
  if (!yo) return null;

  const visibles = db.solicitudes.filter((s) => puedeVer(yo, s));
  const filtros: Record<Vista, { label: string; fn: (s: Solicitud) => boolean }> = {
    activas: { label: "Activas", fn: activa },
    mias: { label: "Mis casos", fn: (s) => s.profesionalAsignado === yo.id && activa(s) },
    sin_asignar: { label: "Sin asignar", fn: (s) => s.profesionalAsignado === null && activa(s) },
    finalizadas: { label: "Cerradas o remitidas", fn: (s) => !activa(s) },
    todas: { label: "Todas", fn: () => true },
  };
  const vistas = Object.keys(filtros) as Vista[];
  const lista = visibles.filter(filtros[vista].fn).sort(ordenarBandeja);
  const nombre = (id: string | null) => db.profesionales.find((p) => p.id === id)?.nombre ?? null;

  const urgentesPendientes = visibles.filter((s) => s.prioridad === "urgente" && s.estado === "nueva");
  const resumen: { label: string; valor: number; icono: LucideIcon; destacar?: boolean; tono?: "accent" }[] = [
    { label: "Urgentes sin atender", valor: urgentesPendientes.length, icono: TriangleAlert, destacar: urgentesPendientes.length > 0 },
    { label: "Nuevas", valor: visibles.filter((s) => s.estado === "nueva").length, icono: CircleDashed },
    { label: "En valoración", valor: visibles.filter((s) => s.estado === "en_valoracion").length, icono: Hourglass, tono: "accent" },
    { label: "Agendadas", valor: visibles.filter((s) => s.estado === "agendada").length, icono: CalendarCheck, tono: "accent" },
  ];

  const moverFoco = (e: React.KeyboardEvent) => {
    const i = vistas.indexOf(vista);
    const destino =
      e.key === "ArrowRight" ? vistas[(i + 1) % vistas.length]
      : e.key === "ArrowLeft" ? vistas[(i - 1 + vistas.length) % vistas.length]
      : e.key === "Home" ? vistas[0]
      : e.key === "End" ? vistas[vistas.length - 1]
      : null;
    if (!destino) return;
    e.preventDefault();
    setVista(destino);
    pestanas.current[destino]?.focus();
  };

  const primerNombre = yo.nombre.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
      <p className="font-display text-sm font-semibold text-accent-ink">Hola, {primerNombre}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Bandeja de solicitudes
      </h1>
      <p className="mt-2 max-w-2xl leading-relaxed text-muted">
        {yo.rol === "admin" ? "Todas las solicitudes del centro." : "Tus casos y la cola sin asignar."} Ordenadas por
        prioridad y antigüedad.
      </p>

      {urgentesPendientes.length > 0 && (
        <div role="alert" className="mt-6 flex gap-4 rounded-3xl bg-danger-soft p-5 text-danger ring-1 ring-inset ring-danger">
          <TriangleAlert aria-hidden className="mt-0.5 size-6 shrink-0" strokeWidth={1.75} />
          <div>
            <p className="font-semibold">
              {urgentesPendientes.length === 1
                ? "Hay 1 solicitud urgente sin atender."
                : `Hay ${urgentesPendientes.length} solicitudes urgentes sin atender.`}
            </p>
            <p className="mt-1 text-sm leading-relaxed">
              Según el protocolo de crisis, contacta a la persona lo antes posible y documenta la gestión.
            </p>
          </div>
        </div>
      )}

      <ul aria-label="Resumen de solicitudes" className="mt-6 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 lg:grid-cols-4">
        {resumen.map(({ label, valor, icono: Icono, destacar, tono }) => (
          <li
            key={label}
            className={`flex items-center gap-4 p-4 sm:p-5 ${
              destacar ? "rounded-3xl bg-danger-soft text-danger ring-1 ring-inset ring-danger" : tarjeta
            }`}
          >
            <span
              aria-hidden
              className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full ${
                destacar ? "bg-surface text-danger" : tono === "accent" ? "bg-accent-soft text-accent-ink" : "bg-primary-soft text-primary"
              }`}
            >
              <Icono className="size-5" strokeWidth={1.75} />
            </span>
            <div className="flex min-w-0 flex-col-reverse">
              <p className={`text-sm ${destacar ? "font-medium" : "text-muted"}`}>{label}</p>
              <p className="font-display text-3xl font-semibold leading-tight">{valor}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.75} />
        <span>
          <strong className="font-semibold text-foreground">Recuerda:</strong> la prioridad automática es un filtro de
          enrutamiento, no una valoración clínica.
        </span>
      </p>

      <div
        role="tablist"
        aria-label="Filtrar solicitudes"
        onKeyDown={moverFoco}
        className="mt-8 flex flex-wrap gap-2"
      >
        {vistas.map((v) => {
          const sel = vista === v;
          return (
            <button
              key={v}
              ref={(el) => {
                pestanas.current[v] = el;
              }}
              type="button"
              role="tab"
              id={`pestana-${v}`}
              aria-selected={sel}
              aria-controls="panel-bandeja"
              tabIndex={sel ? 0 : -1}
              onClick={() => setVista(v)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium ${
                sel
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-foreground ring-1 ring-inset ring-border-strong hover:bg-primary-soft"
              }`}
            >
              {filtros[v].label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  sel ? "bg-primary-foreground/20" : "bg-surface-muted text-muted"
                }`}
              >
                ({visibles.filter(filtros[v].fn).length})
              </span>
            </button>
          );
        })}
      </div>

      <div id="panel-bandeja" role="tabpanel" aria-labelledby={`pestana-${vista}`} className="mt-6">
        {lista.length === 0 ? (
          <div className={`${tarjeta} flex flex-col items-center gap-3 p-10 text-center`}>
            <span aria-hidden className="inline-flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Inbox className="size-6" strokeWidth={1.75} />
            </span>
            <p className="text-muted">No hay solicitudes en esta vista.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {lista.map((s) => {
              const urgentePendiente = s.prioridad === "urgente" && s.estado === "nueva";
              const asignado = nombre(s.profesionalAsignado);
              return (
                <li key={s.id}>
                  <Link
                    href={`/panel/solicitud/?id=${s.id}`}
                    className={`group grid gap-3 p-4 hover:bg-primary-soft sm:p-5 md:grid-cols-[7.5rem_1fr_10rem_9rem_auto] md:items-center rounded-3xl bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(76_58_153/0.18)] ${
                      urgentePendiente ? "ring-2 ring-danger" : "ring-1 ring-border hover:ring-border-strong"
                    }`}
                  >
                    <span>
                      <PrioridadBadge p={s.prioridad} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-foreground">{s.nombre}</span>
                      <span className="mt-0.5 block text-sm text-muted">
                        {lineaLabel(s.linea)} · {s.edad} años · {s.ciudad}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-muted">
                      <UserRound aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
                      {asignado ?? "Sin asignar"}
                    </span>
                    <span>
                      <EstadoBadge e={s.estado} />
                    </span>
                    <span className="flex items-center justify-between gap-2 text-sm text-muted md:justify-end">
                      <span className="flex items-center gap-1.5">
                        <Clock aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
                        {hace(s.createdAt)}
                      </span>
                      <ChevronRight aria-hidden className="size-5 shrink-0 text-primary" strokeWidth={1.75} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
