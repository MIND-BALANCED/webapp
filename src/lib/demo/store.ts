import { useSyncExternalStore } from "react";
import type { Admision, Prioridad } from "@/lib/admision";
import { puedeAsignarA, puedeEditar } from "@/lib/panel/permisos";
import type { DemoDB, EstadoSolicitud, Evento, Profesional, Solicitud } from "@/lib/panel/tipos";
import { crearSemilla } from "./semilla";

/**
 * Almacén de demostración: vive solo en el navegador (localStorage).
 * Nada sale del dispositivo. Imita las reglas y la bitácora automática
 * que tendrá la base de datos real (ver supabase/migrations).
 */
const KEY = "mind-balanced-demo-v1";
const listeners = new Set<() => void>();
let cache: DemoDB | null = null;

function leer(): DemoDB {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoDB;
      if (parsed.version === 1) return (cache = parsed);
    }
  } catch {
    /* almacenamiento no disponible: se usa la semilla en memoria */
  }
  cache = crearSemilla();
  guardar();
  return cache;
}

function guardar() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* sin persistencia: la demo funciona hasta recargar */
  }
}

function confirmar(next: DemoDB) {
  cache = next;
  guardar();
  listeners.forEach((l) => l());
}

function suscribir(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

/** Devuelve null durante el prerender (no hay navegador). */
export function useDemoDB(): DemoDB | null {
  return useSyncExternalStore(suscribir, leer, () => null);
}

/**
 * Una solicitud urgente sigue "sin atender" mientras nadie haya registrado el
 * contacto de crisis en la bitácora, sin importar su estado ni su asignación.
 */
export function tieneContactoCrisis(db: DemoDB, solicitudId: string): boolean {
  return db.eventos.some((e) => e.solicitudId === solicitudId && e.tipo === "contacto");
}

export function urgenteSinAtender(db: DemoDB, s: Solicitud): boolean {
  return s.prioridad === "urgente" && !tieneContactoCrisis(db, s.id);
}

export function usuarioActual(db: DemoDB): Profesional | null {
  return db.profesionales.find((p) => p.id === db.sesion && p.activo) ?? null;
}

const ahora = () => new Date().toISOString();
const uid = () => crypto.randomUUID();

function nuevoEvento(db: DemoDB, e: Omit<Evento, "id" | "createdAt">): Evento {
  return { ...e, id: uid(), createdAt: ahora() };
}

function conSolicitud(id: string, fn: (db: DemoDB, s: Solicitud, yo: Profesional) => DemoDB) {
  const db = leer();
  const yo = usuarioActual(db);
  const s = db.solicitudes.find((x) => x.id === id);
  if (!s || !puedeEditar(yo, s)) throw new Error("No tienes permiso para modificar esta solicitud.");
  confirmar(fn(db, s, yo!));
}

function reemplazar(db: DemoDB, s: Solicitud, cambios: Partial<Solicitud>, eventos: Evento[]): DemoDB {
  return {
    ...db,
    solicitudes: db.solicitudes.map((x) => (x.id === s.id ? { ...x, ...cambios } : x)),
    eventos: [...db.eventos, ...eventos],
  };
}

// ── Acciones ─────────────────────────────────────────────────────────

export function crearSolicitud(a: Admision, prioridad: Prioridad): string {
  const db = leer();
  const id = uid();
  const s: Solicitud = {
    nombre: a.nombre, email: a.email, telefono: a.telefono, edad: a.edad, ciudad: a.ciudad,
    linea: a.linea, motivo: a.motivo, plataforma: a.plataforma, espacioPrivado: a.espacioPrivado,
    riesgoPensamientos: a.riesgoPensamientos, riesgoPlan: a.riesgoPlan, riesgoViolencia: a.riesgoViolencia,
    id,
    createdAt: ahora(),
    prioridad,
    estado: "nueva",
    profesionalAsignado: null,
    versionConsentimiento: "2026-11-borrador",
  };
  confirmar({
    ...db,
    solicitudes: [...db.solicitudes, s],
    eventos: [...db.eventos, nuevoEvento(db, { solicitudId: id, autor: null, tipo: "creada", detalle: `Prioridad: ${prioridad}` })],
  });
  return id;
}

export function cambiarEstado(id: string, estado: EstadoSolicitud) {
  conSolicitud(id, (db, s, yo) =>
    s.estado === estado
      ? db
      : reemplazar(db, s, { estado }, [nuevoEvento(db, { solicitudId: id, autor: yo.id, tipo: "estado", detalle: `${s.estado} → ${estado}` })]),
  );
}

export function asignar(id: string, profesionalId: string | null) {
  conSolicitud(id, (db, s, yo) => {
    if (!puedeAsignarA(yo, s, profesionalId)) throw new Error("No puedes asignar este caso a otra persona.");
    if (s.profesionalAsignado === profesionalId) return db;
    const nombre = db.profesionales.find((p) => p.id === profesionalId)?.nombre ?? "Sin asignar";
    const eventos = [nuevoEvento(db, { solicitudId: id, autor: yo.id, tipo: "asignacion", detalle: nombre })];
    const cambios: Partial<Solicitud> = { profesionalAsignado: profesionalId };
    if (profesionalId && s.estado === "nueva") {
      cambios.estado = "en_valoracion";
      eventos.push(nuevoEvento(db, { solicitudId: id, autor: yo.id, tipo: "estado", detalle: "nueva → en_valoracion" }));
    }
    return reemplazar(db, s, cambios, eventos);
  });
}

export function agregarNota(id: string, texto: string) {
  const detalle = texto.trim().slice(0, 4000);
  if (!detalle) return;
  conSolicitud(id, (db, s, yo) => reemplazar(db, s, {}, [nuevoEvento(db, { solicitudId: id, autor: yo.id, tipo: "nota", detalle })]));
}

/**
 * Registra el contacto con la persona según el protocolo de crisis.
 * Mismos permisos que una nota; el detalle (resultado del contacto y
 * valoración del riesgo) es obligatorio.
 */
export function registrarContactoCrisis(id: string, detalle: string) {
  const texto = detalle.trim().slice(0, 4000);
  if (!texto) throw new Error("Describe el resultado del contacto y la valoración del riesgo.");
  conSolicitud(id, (db, s, yo) =>
    reemplazar(db, s, {}, [nuevoEvento(db, { solicitudId: id, autor: yo.id, tipo: "contacto", detalle: texto })]),
  );
}

/**
 * En producción las citas llegan solas por el webhook de Cal.com/Calendly.
 * En la demo se registran a mano para ver el flujo completo.
 */
export function registrarCita(id: string, inicio: string, enlace: string) {
  conSolicitud(id, (db, s) => {
    const eventos = [nuevoEvento(db, { solicitudId: id, autor: null, tipo: "cita", detalle: `Cita agendada para ${inicio}` })];
    const cambios: Partial<Solicitud> = {};
    if (s.estado === "nueva" || s.estado === "en_valoracion") {
      cambios.estado = "agendada";
      eventos.push(nuevoEvento(db, { solicitudId: id, autor: null, tipo: "estado", detalle: `${s.estado} → agendada` }));
    }
    const next = reemplazar(db, s, cambios, eventos);
    return {
      ...next,
      citas: [...next.citas, { id: uid(), solicitudId: id, proveedor: "manual", inicio, estado: "programada", enlace: enlace || null }],
    };
  });
}

export function iniciarSesion(profesionalId: string) {
  confirmar({ ...leer(), sesion: profesionalId });
}

export function cerrarSesion() {
  confirmar({ ...leer(), sesion: null });
}

export function restablecerDemo() {
  const sesion = leer().sesion;
  confirmar({ ...crearSemilla(), sesion });
}
