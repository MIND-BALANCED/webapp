"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  Inbox,
  RefreshCw,
  ShieldCheck,
  StickyNote,
  TriangleAlert,
  UserCheck,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import {
  botonPrimario,
  botonSecundario,
  control,
  EstadoBadge,
  fecha,
  lineaLabel,
  PrioridadBadge,
  Tarjeta,
  tarjeta,
} from "@/components/panel/ui";
import { agregarNota, asignar, cambiarEstado, registrarCita, useDemoDB, usuarioActual } from "@/lib/demo/store";
import { puedeVer } from "@/lib/panel/permisos";
import { estadoLabel, estados, type EstadoSolicitud, type Evento, type TipoEvento } from "@/lib/panel/tipos";

const plataformaLabel: Record<string, string> = { meet: "Google Meet", zoom: "Zoom", teams: "Microsoft Teams", indiferente: "Indiferente" };
const espacioLabel: Record<string, string> = { si: "Sí", no: "No", a_veces: "A veces" };
const riesgoLabel: Record<string, string> = { si: "Sí", no: "No", prefiero_no_responder: "Prefirió no responder" };

const tipoEvento: Record<TipoEvento, { label: string; icono: LucideIcon; clase: string }> = {
  creada: { label: "Solicitud", icono: Inbox, clase: "bg-primary-soft text-primary" },
  estado: { label: "Estado", icono: RefreshCw, clase: "bg-surface-muted text-muted" },
  asignacion: { label: "Asignación", icono: UserCheck, clase: "bg-primary-soft text-primary" },
  nota: { label: "Nota", icono: StickyNote, clase: "bg-accent-soft text-accent-ink" },
  cita: { label: "Cita", icono: CalendarDays, clase: "bg-accent-soft text-accent-ink" },
};

export function DetalleSolicitud() {
  const id = useSearchParams().get("id");
  const db = useDemoDB();
  const [error, setError] = useState<string | null>(null);
  const [nota, setNota] = useState("");

  if (!db) return null;
  const yo = usuarioActual(db);
  const s = db.solicitudes.find((x) => x.id === id);

  if (!yo) return null;
  if (!s || !puedeVer(yo, s)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-8">
        <p className={`${tarjeta} p-8 text-center text-foreground`}>La solicitud no existe o no tienes acceso a ella.</p>
        <Link href="/panel/" className="mt-4 inline-flex min-h-11 items-center gap-2 font-medium text-primary underline underline-offset-2">
          <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
          Volver a la bandeja
        </Link>
      </div>
    );
  }

  const intentar = (fn: () => void) => {
    try {
      setError(null);
      fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo completar la acción.");
    }
  };

  const nombre = (pid: string | null) => (pid ? db.profesionales.find((p) => p.id === pid)?.nombre ?? "—" : "Sistema");
  const eventos = db.eventos.filter((e) => e.solicitudId === s.id).reverse().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const citas = db.citas.filter((c) => c.solicitudId === s.id).sort((a, b) => a.inicio.localeCompare(b.inicio));
  const urgentePendiente = s.prioridad === "urgente" && s.estado === "nueva";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
      <Link href="/panel/" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline underline-offset-2">
        <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
        Bandeja
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{s.nombre}</h1>
        <PrioridadBadge p={s.prioridad} />
        <EstadoBadge e={s.estado} />
      </div>
      <p className="mt-2 text-sm text-muted">Recibida el {fecha(s.createdAt)}</p>

      {urgentePendiente && (
        <div role="alert" className="mt-6 flex gap-4 rounded-3xl bg-danger-soft p-5 text-danger ring-1 ring-inset ring-danger">
          <TriangleAlert aria-hidden className="mt-0.5 size-6 shrink-0" strokeWidth={1.75} />
          <div>
            <p className="font-semibold">Solicitud urgente: activar protocolo de crisis</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed">
              <li>Asígnate el caso y contacta a la persona de inmediato (teléfono o correo).</li>
              <li>Valora el riesgo y, si es necesario, activa la ruta de emergencia (123 / 192 opción 4).</li>
              <li>Documenta cada gestión en la bitácora.</li>
            </ol>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-4 flex items-center gap-2 rounded-2xl bg-danger-soft p-4 text-sm text-danger ring-1 ring-inset ring-danger">
          <TriangleAlert aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-6">
          <Tarjeta titulo="Motivo de consulta" icono={FileText}>
            <p className="leading-relaxed whitespace-pre-line text-foreground">{s.motivo}</p>
          </Tarjeta>

          <Tarjeta titulo="Tamizaje de seguridad" icono={ShieldCheck}>
            <dl className="divide-y divide-border text-sm">
              {[
                ["Pensamientos de hacerse daño (últimas 2 semanas)", s.riesgoPensamientos],
                ["Intención o plan actual", s.riesgoPlan],
                ["Violencia o peligro actual", s.riesgoViolencia],
              ].map(([q, r]) => (
                <div key={q} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <dt className="text-muted">{q}</dt>
                  <dd
                    className={`inline-flex shrink-0 items-center gap-1.5 font-semibold ${
                      r === "si" ? "text-danger" : "text-foreground"
                    }`}
                  >
                    {r === "si" && <TriangleAlert aria-hidden className="size-4" strokeWidth={1.75} />}
                    {riesgoLabel[r]}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 rounded-2xl bg-surface-muted p-3 text-sm leading-relaxed text-muted">
              El tamizaje solo clasifica la solicitud. La valoración del riesgo la hace un profesional.
            </p>
          </Tarjeta>

          <Tarjeta titulo="Datos de contacto y condiciones" icono={ClipboardList}>
            <dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
              <Dato k="Correo" v={<a href={`mailto:${s.email}`} className="break-all text-primary underline underline-offset-2">{s.email}</a>} />
              <Dato k="Teléfono" v={s.telefono ? <a href={`tel:${s.telefono}`} className="text-primary underline underline-offset-2">{s.telefono}</a> : "—"} />
              <Dato k="Edad" v={`${s.edad} años`} />
              <Dato k="Ciudad" v={s.ciudad} />
              <Dato k="Línea solicitada" v={lineaLabel(s.linea)} />
              <Dato k="Plataforma preferida" v={plataformaLabel[s.plataforma]} />
              <Dato k="Espacio privado" v={espacioLabel[s.espacioPrivado]} />
              <Dato k="Consentimiento" v={`Aceptado · versión ${s.versionConsentimiento}`} />
            </dl>
          </Tarjeta>

          <Tarjeta titulo="Bitácora" icono={StickyNote}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                intentar(() => agregarNota(s.id, nota));
                setNota("");
              }}
              className="mb-8"
            >
              <label className="block text-sm font-medium text-foreground" htmlFor="nota">
                Agregar nota de seguimiento
              </label>
              <textarea
                id="nota"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows={3}
                maxLength={4000}
                aria-describedby="nota-ayuda"
                placeholder="Ej.: Llamada de acogida realizada…"
                className={`mt-1.5 ${control}`}
              />
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <button type="submit" disabled={!nota.trim()} className={botonPrimario}>
                  Guardar nota
                </button>
                <p id="nota-ayuda" className="text-sm text-muted">
                  Las notas no se pueden editar ni borrar.
                </p>
              </div>
            </form>
            <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[1.125rem] before:w-px before:bg-border">
              {eventos.map((e) => (
                <EventoBitacora key={e.id} e={e} autor={nombre(e.autor)} />
              ))}
            </ol>
          </Tarjeta>
        </div>

        <aside className="min-w-0 space-y-6" aria-label="Gestión del caso">
          <Tarjeta titulo="Gestión" icono={UserCheck}>
            <div className="space-y-5 text-sm">
              <div>
                {yo.rol === "admin" ? (
                  <>
                    <label className="font-medium text-foreground" htmlFor="asignado">
                      Profesional asignado
                    </label>
                    <select
                      id="asignado"
                      value={s.profesionalAsignado ?? ""}
                      onChange={(e) => intentar(() => asignar(s.id, e.target.value || null))}
                      className={`mt-1.5 min-h-11 ${control}`}
                    >
                      <option value="">Sin asignar</option>
                      {db.profesionales.filter((p) => p.activo).map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-foreground">Profesional asignado</p>
                    <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-foreground">{s.profesionalAsignado ? nombre(s.profesionalAsignado) : "Sin asignar"}</span>
                      {s.profesionalAsignado === null ? (
                        <button type="button" onClick={() => intentar(() => asignar(s.id, yo.id))} className={botonPrimario}>
                          Tomar caso
                        </button>
                      ) : (
                        <button type="button" onClick={() => intentar(() => asignar(s.id, null))} className={botonSecundario}>
                          Liberar
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="font-medium text-foreground" htmlFor="estado">
                  Estado
                </label>
                <select
                  id="estado"
                  value={s.estado}
                  onChange={(e) => intentar(() => cambiarEstado(s.id, e.target.value as EstadoSolicitud))}
                  className={`mt-1.5 min-h-11 ${control}`}
                >
                  {estados.map((x) => (
                    <option key={x.id} value={x.id}>{x.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Tarjeta>

          <Tarjeta titulo="Citas" icono={CalendarDays}>
            {citas.length === 0 ? (
              <p className="text-sm text-muted">Sin citas registradas.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {citas.map((c) => (
                  <li key={c.id} className="flex gap-3 rounded-2xl bg-surface-muted p-3">
                    <span aria-hidden className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                      <CalendarDays className="size-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{fecha(c.inicio)}</p>
                      <p className="text-sm text-muted">
                        {c.proveedor === "manual" ? "Registro manual" : c.proveedor === "cal" ? "Cal.com" : "Calendly"} · {c.estado}
                      </p>
                      {c.enlace && (
                        <a
                          href={c.enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline underline-offset-2 sm:min-h-0"
                        >
                          <Video aria-hidden className="size-4" strokeWidth={1.75} />
                          Enlace de videollamada
                          <span className="sr-only"> (se abre en una pestaña nueva)</span>
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <RegistrarCita onRegistrar={(inicio, enlace) => intentar(() => registrarCita(s.id, inicio, enlace))} />
          </Tarjeta>
        </aside>
      </div>
    </div>
  );
}

function EventoBitacora({ e, autor }: { e: Evento; autor: string }) {
  const { label, icono: Icono, clase } = tipoEvento[e.tipo];
  return (
    <li className="relative flex gap-4">
      <span aria-hidden className={`relative z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full ring-4 ring-surface ${clase}`}>
        <Icono className="size-4" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 pt-1">
        <p className="text-xs text-muted">
          <span className="font-semibold text-foreground">{label}</span> · {fecha(e.createdAt)} · {autor}
        </p>
        <p className={`mt-1 text-sm leading-relaxed ${e.tipo === "nota" ? "whitespace-pre-line text-foreground" : "text-muted"}`}>
          {describir(e)}
        </p>
      </div>
    </li>
  );
}

function describir(e: Evento) {
  switch (e.tipo) {
    case "creada":
      return `Solicitud recibida (${e.detalle.toLowerCase()}).`;
    case "estado": {
      const [a, b] = e.detalle.split(" → ") as EstadoSolicitud[];
      return `Estado: ${estadoLabel(a)} → ${estadoLabel(b)}`;
    }
    case "asignacion":
      return `Asignada a: ${e.detalle}`;
    case "cita": {
      const iso = e.detalle.replace("Cita agendada para ", "");
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? e.detalle : `Cita agendada para el ${fecha(iso)}`;
    }
    default:
      return e.detalle;
  }
}

function RegistrarCita({ onRegistrar }: { onRegistrar: (inicio: string, enlace: string) => void }) {
  const [abierto, setAbierto] = useState(false);
  const [errorInicio, setErrorInicio] = useState<string | null>(null);
  const [errorEnlace, setErrorEnlace] = useState<string | null>(null);
  const uid = useId();
  if (!abierto) {
    return (
      <button type="button" onClick={() => setAbierto(true)} className={`mt-4 w-full ${botonSecundario}`}>
        + Registrar cita
      </button>
    );
  }
  const idInicio = `${uid}-inicio`;
  const idEnlace = `${uid}-enlace`;
  const idError = `${uid}-error`;
  const idErrorEnlace = `${uid}-error-enlace`;
  return (
    <form
      noValidate
      className="mt-4 space-y-4 rounded-2xl bg-surface-muted p-4 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const local = String(f.get("inicio") ?? "");
        const enlace = String(f.get("enlace") ?? "").trim();
        const eInicio = local && !Number.isNaN(new Date(local).getTime()) ? null : "Indica la fecha y la hora de la cita.";
        const eEnlace = !enlace || /^https?:\/\/\S+$/i.test(enlace) ? null : "Escribe un enlace completo que empiece por https://";
        setErrorInicio(eInicio);
        setErrorEnlace(eEnlace);
        if (eInicio || eEnlace) return;
        onRegistrar(new Date(local).toISOString(), enlace);
        setAbierto(false);
      }}
    >
      <p className="text-sm text-muted">En producción las citas llegan solas desde Cal.com o Calendly.</p>
      <div>
        <label htmlFor={idInicio} className="block font-medium text-foreground">
          Fecha y hora
        </label>
        <input
          id={idInicio}
          name="inicio"
          type="datetime-local"
          required
          aria-invalid={errorInicio ? true : undefined}
          aria-describedby={errorInicio ? idError : undefined}
          className={`mt-1.5 min-h-11 ${control}`}
        />
        {errorInicio && (
          <p id={idError} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
            <TriangleAlert aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
            {errorInicio}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={idEnlace} className="block font-medium text-foreground">
          Enlace de videollamada (opcional)
        </label>
        <input
          id={idEnlace}
          name="enlace"
          type="url"
          placeholder="https://meet.google.com/…"
          aria-invalid={errorEnlace ? true : undefined}
          aria-describedby={errorEnlace ? idErrorEnlace : undefined}
          className={`mt-1.5 min-h-11 ${control}`}
        />
        {errorEnlace && (
          <p id={idErrorEnlace} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
            <TriangleAlert aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
            {errorEnlace}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className={botonPrimario}>Guardar</button>
        <button type="button" onClick={() => setAbierto(false)} className={botonSecundario}>Cancelar</button>
      </div>
    </form>
  );
}

function Dato({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <dt className="text-muted">{k}</dt>
      <dd className="mt-0.5 text-foreground">{v}</dd>
    </div>
  );
}
