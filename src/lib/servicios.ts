export type LineaId = "orientacion" | "psicoterapia" | "prevencion" | "psicosocial";

export type Linea = {
  id: LineaId;
  numero: string;
  titulo: string;
  resumen: string;
  paraQuien: string;
  formato: string;
  incluye: string[];
};

export const lineas: Linea[] = [
  {
    id: "orientacion",
    numero: "01",
    titulo: "Orientación psicológica",
    resumen:
      "Intervención breve para comprender una situación, reconocer tus recursos, tomar decisiones y definir estrategias iniciales de afrontamiento.",
    paraQuien:
      "Personas que atraviesan una situación puntual (una decisión, un cambio, un conflicto) y quieren claridad.",
    formato: "1 a 3 encuentros virtuales de 50 minutos.",
    incluye: [
      "Escucha y comprensión de la situación",
      "Identificación de recursos personales y redes de apoyo",
      "Estrategias concretas de afrontamiento",
      "Recomendación de próximos pasos o remisión si se requiere",
    ],
  },
  {
    id: "psicoterapia",
    numero: "02",
    titulo: "Atención psicológica individual",
    resumen:
      "Proceso estructurado de evaluación e intervención con objetivos terapéuticos acordados, seguimiento y evaluación de avances.",
    paraQuien:
      "Personas con malestar emocional persistente: ansiedad, tristeza, duelo, dificultades en las relaciones, estrés, entre otros.",
    formato: "Sesiones semanales o quincenales de 50 minutos.",
    incluye: [
      "Valoración inicial y formulación del caso",
      "Plan de acompañamiento con objetivos acordados",
      "Intervenciones basadas en evidencia",
      "Medición periódica de avances y cierre planificado",
    ],
  },
  {
    id: "prevencion",
    numero: "03",
    titulo: "Promoción y prevención",
    resumen:
      "Talleres, encuentros psicoeducativos y recursos sobre bienestar emocional, relaciones, autocuidado y habilidades para la vida.",
    paraQuien:
      "Grupos, instituciones educativas, organizaciones y personas que quieren fortalecer su bienestar.",
    formato: "Talleres grupales virtuales y recursos digitales.",
    incluye: [
      "Talleres temáticos en vivo",
      "Guías y materiales de autocuidado",
      "Programas para instituciones y empresas",
    ],
  },
  {
    id: "psicosocial",
    numero: "04",
    titulo: "Acompañamiento psicosocial",
    resumen:
      "Intervenciones que integran las dimensiones personal, familiar, educativa, laboral y social de la situación consultada.",
    paraQuien:
      "Personas cuyas dificultades están ligadas a su contexto: cambios de vida, migración, conflictos familiares o laborales.",
    formato: "Encuentros virtuales y articulación con redes de apoyo.",
    incluye: [
      "Lectura del contexto y de las redes de apoyo",
      "Articulación con servicios e instituciones",
      "Seguimiento del proceso",
    ],
  },
];

export const recorrido = [
  { paso: "01", titulo: "Descubrimiento", texto: "Conoces el centro, sus servicios y sus alcances." },
  { paso: "02", titulo: "Contacto y acogida", texto: "Envías tu solicitud y recibes información clara sobre el proceso." },
  { paso: "03", titulo: "Admisión y valoración inicial", texto: "Un profesional revisa tu solicitud, tus necesidades y la pertinencia del servicio." },
  { paso: "04", titulo: "Plan de acompañamiento", texto: "Acordamos contigo objetivos, modalidad y frecuencia." },
  { paso: "05", titulo: "Atención y seguimiento", texto: "Te reúnes por videollamada y evaluamos juntos los avances." },
  { paso: "06", titulo: "Cierre o remisión", texto: "Valoramos los resultados y definimos próximos pasos." },
];
