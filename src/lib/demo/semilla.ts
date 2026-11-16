import type { Cita, DemoDB, Evento, Profesional, Solicitud } from "@/lib/panel/tipos";

/** Datos ficticios. Ninguna persona ni caso es real. */
export const profesionalesDemo: Profesional[] = [
  { id: "p-admin", nombre: "Laura Gómez", email: "laura@demo.mindbalanced", rol: "admin", activo: true },
  { id: "p-andres", nombre: "Andrés Ruiz", email: "andres@demo.mindbalanced", rol: "profesional", activo: true },
  { id: "p-camila", nombre: "Camila Torres", email: "camila@demo.mindbalanced", rol: "profesional", activo: true },
];

const H = 3600_000;

type Base = Omit<Solicitud, "id" | "createdAt" | "versionConsentimiento"> & { haceHoras: number };

const casos: Base[] = [
  {
    haceHoras: 1, nombre: "Valentina Ríos", email: "valentina@ejemplo.com", telefono: "", edad: 22, ciudad: "Medellín",
    linea: "no_se", motivo: "Últimamente siento que no puedo más, no duermo y he pensado en hacerme daño. Necesito hablar con alguien.",
    plataforma: "meet", espacioPrivado: "a_veces", riesgoPensamientos: "si", riesgoPlan: "si", riesgoViolencia: "no",
    prioridad: "urgente", estado: "nueva", profesionalAsignado: null,
  },
  {
    haceHoras: 5, nombre: "Julián Castaño", email: "julian@ejemplo.com", telefono: "3001234567", edad: 34, ciudad: "Cali",
    linea: "psicoterapia", motivo: "Desde la muerte de mi padre hace tres meses me cuesta concentrarme y a veces pienso que no tiene sentido seguir.",
    plataforma: "zoom", espacioPrivado: "si", riesgoPensamientos: "si", riesgoPlan: "no", riesgoViolencia: "no",
    prioridad: "prioritaria", estado: "nueva", profesionalAsignado: null,
  },
  {
    haceHoras: 20, nombre: "Mariana López", email: "mariana@ejemplo.com", telefono: "", edad: 27, ciudad: "Bogotá",
    linea: "orientacion", motivo: "Tengo que decidir si acepto un trabajo en otra ciudad y me genera mucha ansiedad. Quiero orientación.",
    plataforma: "meet", espacioPrivado: "si", riesgoPensamientos: "no", riesgoPlan: "no", riesgoViolencia: "no",
    prioridad: "regular", estado: "nueva", profesionalAsignado: null,
  },
  {
    haceHoras: 30, nombre: "Santiago Pérez", email: "santiago@ejemplo.com", telefono: "", edad: 19, ciudad: "Pereira",
    linea: "psicoterapia", motivo: "Empecé la universidad y siento ansiedad constante, me cuesta hablar en clase y he dejado de salir.",
    plataforma: "teams", espacioPrivado: "no", riesgoPensamientos: "prefiero_no_responder", riesgoPlan: "no", riesgoViolencia: "no",
    prioridad: "prioritaria", estado: "en_valoracion", profesionalAsignado: "p-andres",
  },
  {
    haceHoras: 52, nombre: "Diana Martínez", email: "diana@ejemplo.com", telefono: "3109876543", edad: 41, ciudad: "Barranquilla",
    linea: "psicosocial", motivo: "Llegué hace un año de otro país con mis hijos y me siento sola, sin red de apoyo y con muchas preocupaciones.",
    plataforma: "indiferente", espacioPrivado: "si", riesgoPensamientos: "no", riesgoPlan: "no", riesgoViolencia: "no",
    prioridad: "regular", estado: "agendada", profesionalAsignado: "p-camila",
  },
  {
    haceHoras: 75, nombre: "Felipe Herrera", email: "felipe@ejemplo.com", telefono: "", edad: 29, ciudad: "Manizales",
    linea: "psicoterapia", motivo: "Discuto mucho con mi pareja y siento que repito los mismos patrones en todas mis relaciones.",
    plataforma: "zoom", espacioPrivado: "si", riesgoPensamientos: "no", riesgoPlan: "no", riesgoViolencia: "no",
    prioridad: "regular", estado: "agendada", profesionalAsignado: "p-andres",
  },
  {
    haceHoras: 200, nombre: "Natalia Ospina", email: "natalia@ejemplo.com", telefono: "", edad: 37, ciudad: "Bucaramanga",
    linea: "orientacion", motivo: "Quería orientación sobre cómo acompañar a mi hija adolescente que está pasando por un momento difícil.",
    plataforma: "meet", espacioPrivado: "si", riesgoPensamientos: "no", riesgoPlan: "no", riesgoViolencia: "no",
    prioridad: "regular", estado: "cerrada", profesionalAsignado: "p-camila",
  },
];

export function crearSemilla(now = Date.now()): DemoDB {
  const iso = (ms: number) => new Date(ms).toISOString();
  const solicitudes: Solicitud[] = [];
  const eventos: Evento[] = [];
  const citas: Cita[] = [];
  let n = 0;
  const ev = (e: Omit<Evento, "id">) => eventos.push({ ...e, id: `e-${++n}` });

  casos.forEach(({ haceHoras, ...c }, i) => {
    const id = `s-${i + 1}`;
    const creada = now - haceHoras * H;
    solicitudes.push({ ...c, id, createdAt: iso(creada), versionConsentimiento: "2026-11-borrador" });
    ev({ solicitudId: id, createdAt: iso(creada), autor: null, tipo: "creada", detalle: `Prioridad: ${c.prioridad}` });

    if (c.profesionalAsignado) {
      const nombre = profesionalesDemo.find((p) => p.id === c.profesionalAsignado)!.nombre;
      ev({ solicitudId: id, createdAt: iso(creada + 2 * H), autor: "p-admin", tipo: "asignacion", detalle: nombre });
      ev({ solicitudId: id, createdAt: iso(creada + 2 * H), autor: "p-admin", tipo: "estado", detalle: "nueva → en_valoracion" });
    }
    if (c.estado === "agendada" || c.estado === "cerrada") {
      const inicio = c.estado === "cerrada" ? creada + 48 * H : now + (24 + i * 6) * H;
      citas.push({
        id: `c-${i + 1}`, solicitudId: id, proveedor: i % 2 ? "cal" : "calendly", inicio: iso(inicio),
        estado: "programada", enlace: "https://meet.google.com/abc-defg-hij",
      });
      ev({ solicitudId: id, createdAt: iso(creada + 4 * H), autor: null, tipo: "cita", detalle: `Cita agendada para ${iso(inicio)}` });
      ev({ solicitudId: id, createdAt: iso(creada + 4 * H), autor: null, tipo: "estado", detalle: "en_valoracion → agendada" });
    }
    if (c.estado === "cerrada") {
      ev({ solicitudId: id, createdAt: iso(creada + 50 * H), autor: c.profesionalAsignado, tipo: "nota", detalle: "Se brindó orientación en una sesión. La consultante refiere sentirse con más herramientas. No requiere seguimiento." });
      ev({ solicitudId: id, createdAt: iso(creada + 50 * H), autor: c.profesionalAsignado, tipo: "estado", detalle: "agendada → cerrada" });
    }
  });

  ev({ solicitudId: "s-4", createdAt: iso(now - 26 * H), autor: "p-andres", tipo: "nota", detalle: "Llamada de acogida realizada. Pendiente explorar ideación en la valoración inicial. Acordamos buscar un espacio privado para las sesiones." });

  return { version: 1, profesionales: profesionalesDemo, solicitudes, citas, eventos, sesion: null };
}
