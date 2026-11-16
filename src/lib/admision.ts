import { z } from "zod";
import { site } from "./site";

export const respuestaRiesgo = z.enum(["si", "no", "prefiero_no_responder"]);

export const admisionSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre.").max(120),
  email: z.email("Escribe un correo válido.").max(200),
  telefono: z.string().trim().max(30).optional().default(""),
  edad: z.coerce
    .number({ error: "Escribe tu edad." })
    .int()
    .min(site.minAge, `Por ahora atendemos personas de ${site.minAge} años o más.`)
    .max(110),
  ciudad: z.string().trim().min(2, "Escribe tu ciudad.").max(120),
  linea: z.enum(["orientacion", "psicoterapia", "prevencion", "psicosocial", "no_se"]),
  motivo: z
    .string()
    .trim()
    .min(20, "Cuéntanos un poco más (mínimo 20 caracteres).")
    .max(2000, "Máximo 2000 caracteres."),
  plataforma: z.enum(["meet", "zoom", "teams", "indiferente"]),
  espacioPrivado: z.enum(["si", "no", "a_veces"]),
  riesgoPensamientos: respuestaRiesgo,
  riesgoPlan: respuestaRiesgo,
  riesgoViolencia: respuestaRiesgo,
  aceptaDatos: z.literal("on", { error: "Necesitamos tu autorización para tratar tus datos." }),
  aceptaConsentimiento: z.literal("on", { error: "Debes leer y aceptar el consentimiento informado." }),
});

export type Admision = z.infer<typeof admisionSchema>;

/**
 * - urgente: indica riesgo actual → se muestran rutas de emergencia de inmediato
 *   y el caso queda marcado para contacto prioritario.
 * - prioritaria: hay señales que requieren valoración pronta por un profesional.
 * - regular: flujo normal de admisión.
 *
 * Esto es un filtro de enrutamiento, NO una valoración clínica del riesgo.
 * La valoración la hace siempre un profesional (ver protocolo de crisis).
 */
export type Prioridad = "urgente" | "prioritaria" | "regular";

export function clasificarPrioridad(a: Pick<Admision, "riesgoPensamientos" | "riesgoPlan" | "riesgoViolencia">): Prioridad {
  if (a.riesgoPlan === "si" || a.riesgoViolencia === "si") return "urgente";
  if (
    a.riesgoPensamientos === "si" ||
    a.riesgoPensamientos === "prefiero_no_responder" ||
    a.riesgoPlan === "prefiero_no_responder" ||
    a.riesgoViolencia === "prefiero_no_responder"
  ) {
    return "prioritaria";
  }
  return "regular";
}

export type AdmisionState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors: Partial<Record<keyof Admision, string[]>>; values: Record<string, string> }
  | { status: "ok"; prioridad: Prioridad; nombre: string; guardada: boolean };
