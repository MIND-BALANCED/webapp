"use server";

import { admisionSchema, clasificarPrioridad, type AdmisionState } from "@/lib/admision";
import { guardarSolicitud } from "@/lib/db";

export async function enviarSolicitud(_prev: AdmisionState, formData: FormData): Promise<AdmisionState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([k]) => !k.startsWith("$ACTION_")).map(([k, v]) => [k, String(v)]),
  );

  const parsed = admisionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: raw,
    };
  }

  const prioridad = clasificarPrioridad(parsed.data);

  try {
    const guardada = await guardarSolicitud(parsed.data, prioridad);
    return { status: "ok", prioridad, nombre: parsed.data.nombre.split(" ")[0], guardada };
  } catch {
    // Si hay riesgo, mostramos igual las rutas de ayuda aunque falle el guardado.
    if (prioridad === "urgente") {
      return { status: "ok", prioridad, nombre: parsed.data.nombre.split(" ")[0], guardada: false };
    }
    return {
      status: "error",
      message: "No pudimos enviar tu solicitud. Intenta de nuevo en unos minutos.",
      fieldErrors: {},
      values: raw,
    };
  }
}
