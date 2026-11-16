import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Admision, Prioridad } from "./admision";

/**
 * Acceso a datos del lado del servidor. Usa la service role key, que
 * NUNCA debe exponerse al navegador. Las tablas tienen RLS activo y sin
 * políticas públicas: solo el servidor puede escribir/leer.
 */
function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isDatabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function guardarSolicitud(data: Admision, prioridad: Prioridad): Promise<boolean> {
  const supabase = getClient();
  if (!supabase) {
    // Modo demostración: no se persiste nada. No se registra contenido sensible en logs.
    console.warn("[admision] Base de datos no configurada: la solicitud no se guardó.");
    return false;
  }

  const { error } = await supabase.from("solicitudes").insert({
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono || null,
    edad: data.edad,
    ciudad: data.ciudad,
    linea: data.linea,
    motivo: data.motivo,
    plataforma: data.plataforma,
    espacio_privado: data.espacioPrivado,
    riesgo_pensamientos: data.riesgoPensamientos,
    riesgo_plan: data.riesgoPlan,
    riesgo_violencia: data.riesgoViolencia,
    prioridad,
    acepta_datos_at: new Date().toISOString(),
    acepta_consentimiento_at: new Date().toISOString(),
    version_consentimiento: CONSENTIMIENTO_VERSION,
  });

  if (error) {
    console.error("[admision] Error al guardar la solicitud:", error.code);
    throw new Error("No pudimos guardar la solicitud.");
  }
  return true;
}

export const CONSENTIMIENTO_VERSION = "2026-11-borrador";
