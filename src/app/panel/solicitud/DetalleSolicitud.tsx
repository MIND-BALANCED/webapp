"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { EstadoBadge, fecha, lineaLabel, PrioridadBadge } from "@/components/panel/ui";
import { agregarNota, asignar, cambiarEstado, registrarCita, useDemoDB, usuarioActual } from "@/lib/demo/store";
import { puedeVer } from "@/lib/panel/permisos";
import { estadoLabel, estados, type EstadoSolicitud, type Evento } from "@/lib/panel/tipos";

const plataformaLabel: Record<string, string> = { meet: "Google Meet", zoom: "Zoom", teams: "Microsoft Teams", indiferente: "Indiferente" };
const espacioLabel: Record<string, string> = { si: "Sí", no: "No", a_veces: "A veces" };
const riesgoLabel: Record<string, string> = { si: "Sí", no: "No", prefiero_no_responder: "Prefirió no responder" };

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
      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="rounded-2xl bg-surface p-8 text-center ring-1 ring-border">
          La solicitud no existe o no tienes acceso a ella.
        </p>
        <Link href="/panel/" className="mt-4 inline-block underline">← Volver a la bandeja</Link>
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/panel/" className="text-sm text-muted underline">← Bandeja</Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-3xl">{s.nombre}</h1>
        <PrioridadBadge p={s.prioridad} />
        <EstadoBadge e={s.estado} />
      </div>
      <p className="mt-1 text-sm text-muted">Recibida el {fecha(s.createdAt)}</p>

      {urgentePendiente && (
        <div role="alert" className="mt-6 rounded-2xl bg-danger-soft p-5 text-danger">
          <p className="font-semibold">Solicitud urgente: activar protocolo de crisis</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            <li>Asígnate el caso y contacta a la persona de inmediato (teléfono o correo).</li>
            <li>Valora el riesgo y, si es necesario, activa la ruta de emergencia (123 / 192 opción 4).</li>
            <li>Documenta cada gestión en la bitácora.</li>
          </ol>
        </div>
      )}

      {error && <p role="alert" className="mt-4 rounded-xl bg-danger-soft p-3 text-sm text-danger">{error}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Tarjeta titulo="Motivo de consulta">
            <p className="whitespace-pre-line">{s.motivo}</p>
          </Tarjeta>

          <Tarjeta titulo="Tamizaje de seguridad">
            <dl className="space-y-3 text-sm">
              {[
                ["Pensamientos de hacerse daño (últimas 2 semanas)", s.riesgoPensamientos],
                ["Intención o plan actual", s.riesgoPlan],
                ["Violencia o peligro actual", s.riesgoViolencia],
              ].map(([q, r]) => (
                <div key={q} className="flex items-start justify-between gap-4">
                  <dt className="text-muted">{q}</dt>
                  <dd className={`shrink-0 font-semibold ${r === "si" ? "text-danger" : r === "prefiero_no_responder" ? "text-foreground" : ""}`}>
                    {riesgoLabel[r]}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-muted">
              El tamizaje solo clasifica la solicitud. La valoración del riesgo la hace un profesional.
            </p>
          </Tarjeta>

          <Tarjeta titulo="Datos de contacto y condiciones">
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <Dato k="Correo" v={<a href={`mailto:${s.email}`} className="underline">{s.email}</a>} />
              <Dato k="Teléfono" v={s.telefono ? <a href={`tel:${s.telefono}`} className="underline">{s.telefono}</a> : "—"} />
              <Dato k="Edad" v={`${s.edad} años`} />
              <Dato k="Ciudad" v={s.ciudad} />
              <Dato k="Línea solicitada" v={lineaLabel(s.linea)} />
              <Dato k="Plataforma preferida" v={plataformaLabel[s.plataforma]} />
              <Dato k="Espacio privado" v={espacioLabel[s.espacioPrivado]} />
              <Dato k="Consentimiento" v={`Aceptado · versión ${s.versionConsentimiento}`} />
            </dl>
          </Tarjeta>

          <Tarjeta titulo="Bitácora">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                intentar(() => agregarNota(s.id, nota));
                setNota("");
              }}
              className="mb-6"
            >
              <label className="block text-sm font-medium" htmlFor="nota">Agregar nota de seguimiento</label>
              <textarea
                id="nota"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows={3}
                maxLength={4000}
                placeholder="Ej.: Llamada de acogida realizada…"
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"
              />
              <button type="submit" disabled={!nota.trim()} className="mt-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
                Guardar nota
              </button>
              <p className="mt-2 text-xs text-muted">Las notas no se pueden editar ni borrar.</p>
            </form>
            <ol className="space-y-4">
              {eventos.map((e) => (
                <li key={e.id} className="border-l-2 border-border pl-4">
                  <p className="text-xs text-muted">{fecha(e.createdAt)} · {nombre(e.autor)}</p>
                  <p className={`mt-0.5 text-sm ${e.tipo === "nota" ? "whitespace-pre-line" : "text-muted"}`}>{describir(e)}</p>
                </li>
              ))}
            </ol>
          </Tarjeta>
        </div>

        <aside className="space-y-6">
          <Tarjeta titulo="Gestión">
            <div className="space-y-5 text-sm">
              <div>
                <p className="font-medium">Profesional asignado</p>
                {yo.rol === "admin" ? (
                  <select
                    value={s.profesionalAsignado ?? ""}
                    onChange={(e) => intentar(() => asignar(s.id, e.target.value || null))}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2"
                  >
                    <option value="">Sin asignar</option>
                    {db.profesionales.filter((p) => p.activo).map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <span>{s.profesionalAsignado ? nombre(s.profesionalAsignado) : "Sin asignar"}</span>
                    {s.profesionalAsignado === null ? (
                      <button onClick={() => intentar(() => asignar(s.id, yo.id))} className="rounded-full bg-primary px-3 py-1.5 font-medium text-primary-foreground">
                        Tomar caso
                      </button>
                    ) : (
                      <button onClick={() => intentar(() => asignar(s.id, null))} className="rounded-full border border-border px-3 py-1.5">
                        Liberar
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="font-medium" htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  value={s.estado}
                  onChange={(e) => intentar(() => cambiarEstado(s.id, e.target.value as EstadoSolicitud))}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2"
                >
                  {estados.map((x) => (
                    <option key={x.id} value={x.id}>{x.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Tarjeta>

          <Tarjeta titulo="Citas">
            {citas.length === 0 ? (
              <p className="text-sm text-muted">Sin citas registradas.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {citas.map((c) => (
                  <li key={c.id} className="rounded-xl bg-background p-3 ring-1 ring-border">
                    <p className="font-medium">{fecha(c.inicio)}</p>
                    <p className="text-xs text-muted">
                      {c.proveedor === "manual" ? "Registro manual" : c.proveedor === "cal" ? "Cal.com" : "Calendly"} · {c.estado}
                    </p>
                    {c.enlace && (
                      <a href={c.enlace} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-primary underline">
                        Enlace de videollamada
                      </a>
                    )}
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
  if (!abierto) {
    return (
      <button onClick={() => setAbierto(true)} className="mt-4 text-sm text-primary underline">
        + Registrar cita
      </button>
    );
  }
  return (
    <form
      className="mt-4 space-y-3 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const local = String(f.get("inicio"));
        if (!local) return;
        onRegistrar(new Date(local).toISOString(), String(f.get("enlace") ?? ""));
        setAbierto(false);
      }}
    >
      <p className="text-xs text-muted">En producción las citas llegan solas desde Cal.com o Calendly.</p>
      <label className="block">
        Fecha y hora
        <input name="inicio" type="datetime-local" required className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" />
      </label>
      <label className="block">
        Enlace de videollamada (opcional)
        <input name="enlace" type="url" placeholder="https://meet.google.com/…" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" />
      </label>
      <div className="flex gap-2">
        <button type="submit" className="rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground">Guardar</button>
        <button type="button" onClick={() => setAbierto(false)} className="rounded-full border border-border px-4 py-2">Cancelar</button>
      </div>
    </form>
  );
}

function Tarjeta({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-surface p-5 ring-1 ring-border sm:p-6">
      <h2 className="mb-4 font-semibold">{titulo}</h2>
      {children}
    </section>
  );
}

function Dato({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <dt className="text-muted">{k}</dt>
      <dd className="mt-0.5">{v}</dd>
    </div>
  );
}
