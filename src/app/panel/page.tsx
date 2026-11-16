"use client";

import Link from "next/link";
import { useState } from "react";
import { EstadoBadge, hace, lineaLabel, PrioridadBadge } from "@/components/panel/ui";
import { useDemoDB, usuarioActual } from "@/lib/demo/store";
import { ordenarBandeja, puedeVer } from "@/lib/panel/permisos";
import type { Solicitud } from "@/lib/panel/tipos";

type Vista = "activas" | "mias" | "sin_asignar" | "finalizadas" | "todas";

const activa = (s: Solicitud) => s.estado !== "cerrada" && s.estado !== "remitida";

export default function Bandeja() {
  const db = useDemoDB();
  const [vista, setVista] = useState<Vista>("activas");
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
  const lista = visibles.filter(filtros[vista].fn).sort(ordenarBandeja);
  const nombre = (id: string | null) => db.profesionales.find((p) => p.id === id)?.nombre ?? "—";

  const urgentesPendientes = visibles.filter((s) => s.prioridad === "urgente" && s.estado === "nueva");
  const resumen = [
    { label: "Urgentes sin atender", valor: urgentesPendientes.length, destacar: urgentesPendientes.length > 0 },
    { label: "Nuevas", valor: visibles.filter((s) => s.estado === "nueva").length },
    { label: "En valoración", valor: visibles.filter((s) => s.estado === "en_valoracion").length },
    { label: "Agendadas", valor: visibles.filter((s) => s.estado === "agendada").length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-3xl">Bandeja de solicitudes</h1>
      <p className="mt-1 text-muted">
        {yo.rol === "admin" ? "Todas las solicitudes del centro." : "Tus casos y la cola sin asignar."} Ordenadas por
        prioridad y antigüedad.
      </p>

      {urgentesPendientes.length > 0 && (
        <div role="alert" className="mt-6 rounded-2xl bg-danger-soft p-5 text-danger">
          <p className="font-semibold">
            {urgentesPendientes.length === 1
              ? "Hay 1 solicitud urgente sin atender."
              : `Hay ${urgentesPendientes.length} solicitudes urgentes sin atender.`}
          </p>
          <p className="mt-1 text-sm">
            Según el protocolo de crisis, contacta a la persona lo antes posible y documenta la gestión.
          </p>
        </div>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {resumen.map((r) => (
          <div key={r.label} className={`rounded-2xl p-4 ${r.destacar ? "bg-danger text-white" : "bg-surface ring-1 ring-border"}`}>
            <dt className={`text-sm ${r.destacar ? "" : "text-muted"}`}>{r.label}</dt>
            <dd className="mt-1 text-3xl font-semibold">{r.valor}</dd>
          </div>
        ))}
      </dl>

      <div role="tablist" aria-label="Filtrar solicitudes" className="mt-8 flex flex-wrap gap-2">
        {(Object.keys(filtros) as Vista[]).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={vista === v}
            onClick={() => setVista(v)}
            className={`rounded-full px-4 py-1.5 text-sm ${vista === v ? "bg-primary text-primary-foreground" : "bg-surface ring-1 ring-border hover:bg-surface-muted"}`}
          >
            {filtros[v].label} <span className="opacity-70">({visibles.filter(filtros[v].fn).length})</span>
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-surface p-8 text-center text-muted ring-1 ring-border">
          No hay solicitudes en esta vista.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl bg-surface ring-1 ring-border">
          {lista.map((s) => (
            <li key={s.id}>
              <Link
                href={`/panel/solicitud/?id=${s.id}`}
                className={`grid gap-2 p-4 hover:bg-surface-muted sm:grid-cols-[7rem_1fr_10rem_8rem_9rem] sm:items-center ${s.prioridad === "urgente" && s.estado === "nueva" ? "border-l-4 border-danger" : ""}`}
              >
                <span><PrioridadBadge p={s.prioridad} /></span>
                <span>
                  <span className="block font-semibold">{s.nombre}</span>
                  <span className="block text-sm text-muted">{lineaLabel(s.linea)} · {s.edad} años · {s.ciudad}</span>
                </span>
                <span className="text-sm text-muted">{nombre(s.profesionalAsignado) === "—" ? "Sin asignar" : nombre(s.profesionalAsignado)}</span>
                <span><EstadoBadge e={s.estado} /></span>
                <span className="text-sm text-muted sm:text-right">{hace(s.createdAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
