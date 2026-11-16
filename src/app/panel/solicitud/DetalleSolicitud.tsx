"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  Inbox,
  PhoneCall,
  RefreshCw,
  ShieldCheck,
  StickyNote,
  TriangleAlert,
  UserCheck,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
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
import {
  agregarNota,
  asignar,
  cambiarEstado,
  registrarCita,
  registrarContactoCrisis,
  useDemoDB,
  usuarioActual,
} from "@/lib/demo/store";
import { puedeVer } from "@/lib/panel/permisos";
import {
  estadoLabel,
  estados,
  type DemoDB,
  type EstadoSolicitud,
  type Evento,
  type Profesional,
  type Solicitud,
  type TipoEvento,
} from "@/lib/panel/tipos";

const plataformaLabel: Record<string, string> = { meet: "Google Meet", zoom: "Zoom", teams: "Microsoft Teams", indiferente: "Indiferente" };
const espacioLabel: Record<string, string> = { si: "Sí", no: "No", a_veces: "A veces" };
const riesgoLabel: Record<string, string> = { si: "Sí", no: "No", prefiero_no_responder: "Prefirió no responder" };

const tipoEvento: Record<TipoEvento, { label: string; icono: LucideIcon; clase: string }> = {
  creada: { label: "Solicitud", icono: Inbox, clase: "bg-primary-soft text-primary" },
  estado: { label: "Estado", icono: RefreshCw, clase: "bg-surface-muted text-muted" },
  asignacion: { label: "Asignación", icono: UserCheck, clase: "bg-primary-soft text-primary" },
  nota: { label: "Nota", icono: StickyNote, clase: "bg-accent-soft text-accent-ink" },
  cita: { label: "Cita", icono: CalendarDays, clase: "bg-accent-soft text-accent-ink" },
  contacto: { label: "Contacto de crisis", icono: PhoneCall, clase: "bg-danger-soft text-danger" },
};

const mensajeError = "mt-1.5 flex items-center gap-1.5 text-sm text-danger";

export function DetalleSolicitud() {
  const id = useSearchParams().get("id");
  const db = useDemoDB();
  const [error, setError] = useState<string | null>(null);
  const [nota, setNota] = useState("");
  const [errorNota, setErrorNota] = useState<string | null>(null);
  const [avisoNota, setAvisoNota] = useState("");
  const notaRef = useRef<HTMLTextAreaElement>(null);

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

  /** Ejecuta una acción del almacén; devuelve true si se completó. */
  const intentar = (fn: () => void): boolean => {
    try {
      setError(null);
      fn();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo completar la acción.");
      return false;
    }
  };

  const nombre = (pid: string | null) => (pid ? db.profesionales.find((p) => p.id === pid)?.nombre ?? "—" : "Sistema");
  const eventos = db.eventos.filter((e) => e.solicitudId === s.id).reverse().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const citas = db.citas.filter((c) => c.solicitudId === s.id).sort((a, b) => a.inicio.localeCompare(b.inicio));
  // El aviso de crisis sigue visible hasta que alguien registre el contacto, sin importar el estado.
  const contactos = eventos.filter((e) => e.tipo === "contacto");
  const urgenteSinContacto = s.prioridad === "urgente" && contactos.length === 0;
  const ultimoContacto = contactos[0];
  const idErrorNota = "nota-error";

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

      {s.prioridad === "urgente" && (
        <ContactoCrisis
          key={s.id}
          pendiente={urgenteSinContacto}
          violencia={s.riesgoViolencia === "si"}
          ultimo={ultimoContacto ? { fecha: fecha(ultimoContacto.createdAt), autor: nombre(ultimoContacto.autor) } : null}
          onRegistrar={(detalle) => intentar(() => registrarContactoCrisis(s.id, detalle))}
        />
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
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (!nota.trim()) {
                  setAvisoNota("");
                  setErrorNota("Escribe la nota antes de guardarla.");
                  notaRef.current?.focus();
                  return;
                }
                if (intentar(() => agregarNota(s.id, nota))) {
                  setNota("");
                  setErrorNota(null);
                  setAvisoNota("Nota guardada.");
                  notaRef.current?.focus();
                }
              }}
              className="mb-8"
            >
              <label className="block text-sm font-medium text-foreground" htmlFor="nota">
                Agregar nota de seguimiento
              </label>
              <textarea
                ref={notaRef}
                id="nota"
                value={nota}
                onChange={(e) => {
                  setNota(e.target.value);
                  setAvisoNota("");
                  if (errorNota && e.target.value.trim()) setErrorNota(null);
                }}
                rows={3}
                maxLength={4000}
                aria-invalid={errorNota ? true : undefined}
                aria-describedby={errorNota ? `${idErrorNota} nota-ayuda` : "nota-ayuda"}
                placeholder="Ej.: Llamada de acogida realizada…"
                className={`mt-1.5 ${control}`}
              />
              {errorNota && (
                <p id={idErrorNota} className={mensajeError}>
                  <TriangleAlert aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
                  {errorNota}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <button type="submit" className={botonPrimario}>
                  Guardar nota
                </button>
                <p id="nota-ayuda" className="text-sm text-muted">
                  Las notas no se pueden editar ni borrar.
                </p>
                <p role="status" className="text-sm font-medium text-foreground">
                  {avisoNota}
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
          <Gestion key={s.id} s={s} yo={yo} db={db} nombre={nombre} intentar={intentar} />

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
        <p
          className={`mt-1 text-sm leading-relaxed ${
            e.tipo === "nota" || e.tipo === "contacto" ? "whitespace-pre-line text-foreground" : "text-muted"
          }`}
        >
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
    case "contacto":
      return `Contacto con la persona realizado. ${e.detalle}`;
    case "cita": {
      const iso = e.detalle.replace("Cita agendada para ", "");
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? e.detalle : `Cita agendada para el ${fecha(iso)}`;
    }
    default:
      return e.detalle;
  }
}

type Eleccion<T> = { desde: T; valor: T };

/**
 * Gestión del caso. Elegir en una lista no cambia nada: cada cambio se aplica
 * con su botón (WCAG 3.2.2), así recorrer las opciones con el teclado no deja
 * registros falsos en la bitácora.
 */
function Gestion({
  s,
  yo,
  db,
  nombre,
  intentar,
}: {
  s: Solicitud;
  yo: Profesional;
  db: DemoDB;
  nombre: (pid: string | null) => string;
  intentar: (fn: () => void) => boolean;
}) {
  // La elección local vale mientras el dato guardado sea el mismo desde el que se eligió;
  // si el caso cambia por otra vía (p. ej., al registrar una cita) se muestra el valor nuevo.
  const [eleccionEstado, setEleccionEstado] = useState<Eleccion<EstadoSolicitud> | null>(null);
  const [eleccionAsignado, setEleccionAsignado] = useState<Eleccion<string> | null>(null);
  const [aviso, setAviso] = useState("");

  const asignadoActual = s.profesionalAsignado ?? "";
  const estadoElegido = eleccionEstado?.desde === s.estado ? eleccionEstado.valor : s.estado;
  const asignadoElegido = eleccionAsignado?.desde === asignadoActual ? eleccionAsignado.valor : asignadoActual;
  const estadoCambia = estadoElegido !== s.estado;
  const asignadoCambia = asignadoElegido !== asignadoActual;

  const aplicarEstado = () => {
    if (!estadoCambia) {
      setAviso("El estado no ha cambiado.");
      return;
    }
    if (intentar(() => cambiarEstado(s.id, estadoElegido))) {
      setEleccionEstado(null);
      setAviso(`Estado actualizado: ${estadoLabel(estadoElegido)}.`);
    }
  };

  const aplicarAsignado = () => {
    if (!asignadoCambia) {
      setAviso("La asignación no ha cambiado.");
      return;
    }
    if (intentar(() => asignar(s.id, asignadoElegido || null))) {
      setEleccionAsignado(null);
      setAviso(`Asignación actualizada: ${asignadoElegido ? nombre(asignadoElegido) : "Sin asignar"}.`);
    }
  };

  return (
    <Tarjeta titulo="Gestión" icono={UserCheck}>
      <div className="space-y-5 text-sm">
        <div>
          {yo.rol === "admin" ? (
            <>
              <label className="font-medium text-foreground" htmlFor="asignado">
                Profesional asignado
              </label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                <select
                  id="asignado"
                  value={asignadoElegido}
                  onChange={(e) => setEleccionAsignado({ desde: asignadoActual, valor: e.target.value })}
                  className={`min-h-11 min-w-0 flex-1 basis-40 ${control}`}
                >
                  <option value="">Sin asignar</option>
                  {db.profesionales.filter((p) => p.activo).map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={aplicarAsignado}
                  aria-disabled={!asignadoCambia}
                  className={`${botonSecundario} aria-disabled:cursor-not-allowed aria-disabled:opacity-60`}
                >
                  Aplicar<span className="sr-only"> asignación</span>
                </button>
              </div>
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
          <div className="mt-1.5 flex flex-wrap gap-2">
            <select
              id="estado"
              value={estadoElegido}
              onChange={(e) => setEleccionEstado({ desde: s.estado, valor: e.target.value as EstadoSolicitud })}
              className={`min-h-11 min-w-0 flex-1 basis-40 ${control}`}
            >
              {estados.map((x) => (
                <option key={x.id} value={x.id}>{x.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={aplicarEstado}
              aria-disabled={!estadoCambia}
              className={`${botonSecundario} aria-disabled:cursor-not-allowed aria-disabled:opacity-60`}
            >
              Aplicar<span className="sr-only"> estado</span>
            </button>
          </div>
        </div>

        <p role="status" className="text-sm font-medium text-foreground">
          {aviso}
        </p>
      </div>
    </Tarjeta>
  );
}

/**
 * Protocolo de crisis de una solicitud urgente. El aviso sigue visible hasta que
 * alguien registre el contacto con la persona (no basta con tomar el caso).
 */
function ContactoCrisis({
  pendiente,
  violencia,
  ultimo,
  onRegistrar,
}: {
  pendiente: boolean;
  violencia: boolean;
  ultimo: { fecha: string; autor: string } | null;
  onRegistrar: (detalle: string) => boolean;
}) {
  const [detalle, setDetalle] = useState("");
  const [errorDetalle, setErrorDetalle] = useState<string | null>(null);
  const campoRef = useRef<HTMLTextAreaElement>(null);
  const confirmacionRef = useRef<HTMLParagraphElement>(null);
  const uid = useId();
  const idCampo = `${uid}-contacto`;
  const idAyuda = `${uid}-contacto-ayuda`;
  const idError = `${uid}-contacto-error`;

  if (!pendiente) {
    return (
      <p
        ref={confirmacionRef}
        tabIndex={-1}
        role="status"
        className="mt-6 flex items-start gap-3 rounded-3xl bg-surface-muted p-4 text-sm text-foreground ring-1 ring-inset ring-border-strong"
      >
        <PhoneCall aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.75} />
        <span>
          <strong className="font-semibold">Contacto de crisis registrado</strong>
          {ultimo && ` el ${ultimo.fecha} por ${ultimo.autor}`}. El seguimiento continúa en la bitácora.
        </span>
      </p>
    );
  }

  return (
    <section
      aria-labelledby={`${uid}-titulo`}
      className="mt-6 rounded-3xl bg-danger-soft p-5 text-danger ring-1 ring-inset ring-danger"
    >
      <div role="alert" className="flex gap-4">
        <TriangleAlert aria-hidden className="mt-0.5 size-6 shrink-0" strokeWidth={1.75} />
        <div>
          <h2 id={`${uid}-titulo`} className="font-semibold">
            Solicitud urgente: activar protocolo de crisis
          </h2>
          <p className="mt-1 text-sm leading-relaxed">Aún no hay un contacto de crisis registrado.</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed">
            <li>Asígnate el caso y contacta a la persona de inmediato (teléfono o correo).</li>
            <li>Valora el riesgo y, si es necesario, activa la ruta de emergencia (123 / 192 opción 4).</li>
            {violencia && (
              <li>
                Reportó violencia o peligro actual: orienta también hacia la Línea 155 (orientación a mujeres víctimas
                de violencias) y, si hay peligro inmediato, al 123.
              </li>
            )}
            <li>Registra aquí el contacto y documenta cada gestión en la bitácora.</li>
          </ol>
        </div>
      </div>
      <form
        noValidate
        className="mt-4 sm:pl-10"
        onSubmit={(e) => {
          e.preventDefault();
          if (!detalle.trim()) {
            setErrorDetalle("Describe el resultado del contacto y la valoración del riesgo.");
            campoRef.current?.focus();
            return;
          }
          let ok = false;
          flushSync(() => {
            ok = onRegistrar(detalle);
          });
          if (ok) confirmacionRef.current?.focus();
        }}
      >
        <label htmlFor={idCampo} className="block text-sm font-medium text-foreground">
          Resultado del contacto y valoración del riesgo
        </label>
        <textarea
          ref={campoRef}
          id={idCampo}
          value={detalle}
          onChange={(e) => {
            setDetalle(e.target.value);
            if (errorDetalle && e.target.value.trim()) setErrorDetalle(null);
          }}
          rows={3}
          maxLength={4000}
          aria-invalid={errorDetalle ? true : undefined}
          aria-describedby={errorDetalle ? `${idError} ${idAyuda}` : idAyuda}
          placeholder="Ej.: Llamada a las 3:10 p. m.; la persona está acompañada, sin plan actual; se acuerda valoración mañana."
          className={`mt-1.5 ${control}`}
        />
        {errorDetalle && (
          <p id={idError} className={mensajeError}>
            <TriangleAlert aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
            {errorDetalle}
          </p>
        )}
        <p id={idAyuda} className="mt-1.5 text-sm text-foreground">
          Queda en la bitácora a tu nombre y no se puede editar ni borrar.
        </p>
        <button type="submit" className={`mt-3 ${botonPrimario}`}>
          <PhoneCall aria-hidden className="size-4" strokeWidth={1.75} />
          Registrar contacto de crisis
        </button>
      </form>
    </section>
  );
}

function RegistrarCita({ onRegistrar }: { onRegistrar: (inicio: string, enlace: string) => void }) {
  const [abierto, setAbierto] = useState(false);
  const [errorInicio, setErrorInicio] = useState<string | null>(null);
  const [errorEnlace, setErrorEnlace] = useState<string | null>(null);
  const botonRef = useRef<HTMLButtonElement>(null);
  const inicioRef = useRef<HTMLInputElement>(null);
  const enlaceRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  const abrir = () => {
    flushSync(() => setAbierto(true));
    inicioRef.current?.focus();
  };
  const cerrar = () => {
    flushSync(() => {
      setAbierto(false);
      setErrorInicio(null);
      setErrorEnlace(null);
    });
    botonRef.current?.focus();
  };

  if (!abierto) {
    return (
      <button ref={botonRef} type="button" onClick={abrir} className={`mt-4 w-full ${botonSecundario}`}>
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
        if (eInicio || eEnlace) {
          // Se pinta el error antes de mover el foco para que el lector de pantalla lo lea con el campo.
          flushSync(() => {
            setErrorInicio(eInicio);
            setErrorEnlace(eEnlace);
          });
          (eInicio ? inicioRef : enlaceRef).current?.focus();
          return;
        }
        onRegistrar(new Date(local).toISOString(), enlace);
        cerrar();
      }}
    >
      <p className="text-sm text-muted">En producción las citas llegan solas desde Cal.com o Calendly.</p>
      <div>
        <label htmlFor={idInicio} className="block font-medium text-foreground">
          Fecha y hora
        </label>
        <input
          ref={inicioRef}
          id={idInicio}
          name="inicio"
          type="datetime-local"
          required
          aria-invalid={errorInicio ? true : undefined}
          aria-describedby={errorInicio ? idError : undefined}
          className={`mt-1.5 min-h-11 ${control}`}
        />
        {errorInicio && (
          <p id={idError} className={mensajeError}>
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
          ref={enlaceRef}
          id={idEnlace}
          name="enlace"
          type="url"
          placeholder="https://meet.google.com/…"
          aria-invalid={errorEnlace ? true : undefined}
          aria-describedby={errorEnlace ? idErrorEnlace : undefined}
          className={`mt-1.5 min-h-11 ${control}`}
        />
        {errorEnlace && (
          <p id={idErrorEnlace} className={mensajeError}>
            <TriangleAlert aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
            {errorEnlace}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className={botonPrimario}>Guardar</button>
        <button type="button" onClick={cerrar} className={botonSecundario}>Cancelar</button>
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
