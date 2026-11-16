import type { Profesional, Solicitud } from "./tipos";

/**
 * Reglas de acceso. Reflejan las políticas RLS de
 * supabase/migrations/0002_panel_profesional.sql para que la demostración
 * se comporte igual que lo hará la versión con base de datos.
 *
 *  - admin: ve y gestiona todas las solicitudes.
 *  - profesional: ve y gestiona sus casos asignados y la cola sin asignar.
 */
export function puedeVer(p: Profesional | null, s: Solicitud): boolean {
  if (!p?.activo) return false;
  if (p.rol === "admin") return true;
  return s.profesionalAsignado === null || s.profesionalAsignado === p.id;
}

export const puedeEditar = puedeVer;

/** Un profesional solo puede asignarse a sí mismo o liberar el caso; admin asigna a cualquiera. */
export function puedeAsignarA(p: Profesional | null, s: Solicitud, destino: string | null): boolean {
  if (!puedeEditar(p, s)) return false;
  if (p!.rol === "admin") return true;
  return destino === p!.id || destino === null;
}

const orden = { urgente: 0, prioritaria: 1, regular: 2 } as const;

/** Urgentes primero; dentro de cada prioridad, la más antigua primero. */
export function ordenarBandeja(a: Solicitud, b: Solicitud) {
  return orden[a.prioridad] - orden[b.prioridad] || a.createdAt.localeCompare(b.createdAt);
}
