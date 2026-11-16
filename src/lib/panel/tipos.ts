import type { Admision, Prioridad } from "@/lib/admision";

export type Rol = "admin" | "profesional";

export type EstadoSolicitud = "nueva" | "en_valoracion" | "agendada" | "remitida" | "cerrada";

export const estados: { id: EstadoSolicitud; label: string }[] = [
  { id: "nueva", label: "Nueva" },
  { id: "en_valoracion", label: "En valoración" },
  { id: "agendada", label: "Agendada" },
  { id: "remitida", label: "Remitida" },
  { id: "cerrada", label: "Cerrada" },
];

export const estadoLabel = (e: EstadoSolicitud) => estados.find((x) => x.id === e)?.label ?? e;

export type Profesional = {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
};

export type Solicitud = Omit<Admision, "aceptaDatos" | "aceptaConsentimiento"> & {
  id: string;
  createdAt: string;
  prioridad: Prioridad;
  estado: EstadoSolicitud;
  profesionalAsignado: string | null;
  versionConsentimiento: string;
};

export type Cita = {
  id: string;
  solicitudId: string;
  proveedor: "cal" | "calendly" | "manual";
  inicio: string;
  estado: "programada" | "cancelada" | "reprogramada";
  enlace: string | null;
};

export type TipoEvento = "creada" | "estado" | "asignacion" | "nota" | "cita";

export type Evento = {
  id: string;
  createdAt: string;
  solicitudId: string;
  /** null = sistema */
  autor: string | null;
  tipo: TipoEvento;
  detalle: string;
};

export type DemoDB = {
  version: 1;
  profesionales: Profesional[];
  solicitudes: Solicitud[];
  citas: Cita[];
  eventos: Evento[];
  /** Profesional con sesión iniciada en la demostración. */
  sesion: string | null;
};
