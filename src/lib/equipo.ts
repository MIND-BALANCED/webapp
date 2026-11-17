/**
 * Equipo profesional del centro.
 *
 * REGLA: aquí solo va información CONFIRMADA por la propia profesional o por
 * la coordinación del centro. Los campos opcionales que no tengan dato se
 * omiten en la página (no se muestran vacíos ni con texto inventado).
 * La lista de lo que falta por confirmar está en `pendientes`.
 */

export type Formacion = {
  titulo: string;
  institucion?: string;
  anio?: string;
};

export type Integrante = {
  slug: string;
  nombre: string;
  /** Profesión y máximo título, tal como se presenta públicamente. */
  titulo: string;
  /** Rol dentro del centro (p. ej. "Directora", "Psicóloga"). */
  rol?: string;
  /** Tarjeta profesional del Colegio Colombiano de Psicólogos (Ley 1090 de 2006). */
  tarjetaProfesional?: string;
  /** Presentación en primera persona o tercera persona, por párrafos. */
  presentacion?: string[];
  formacion: Formacion[];
  /** Temas o situaciones que acompaña. */
  areas?: string[];
  /** Enfoques o métodos de trabajo. */
  enfoques?: string[];
  /** Experiencia relevante (cargo, organización, periodo). */
  experiencia?: { cargo: string; organizacion?: string; periodo?: string }[];
  idiomas?: string[];
  /** Ruta de la foto dentro de /public (p. ej. "/equipo/viviana-zabala.jpg"). */
  foto?: string;
  linkedin?: string;
  /** Datos que faltan por confirmar antes de publicar el perfil completo. */
  pendientes: string[];
};

export const equipo: Integrante[] = [
  {
    slug: "viviana-zabala",
    nombre: "Viviana Zabala",
    titulo: "Psicóloga · Magíster en Intervención Psicosocial",
    formacion: [{ titulo: "Psicología" }, { titulo: "Maestría en Intervención Psicosocial" }],
    linkedin: "https://www.linkedin.com/in/vzabalav/",
    pendientes: [
      "Rol en el centro",
      "Número de tarjeta profesional",
      "Universidades y años de grado",
      "Presentación (2 o 3 párrafos)",
      "Áreas de atención",
      "Enfoques de trabajo",
      "Experiencia relevante",
      "Idiomas",
      "Foto profesional",
    ],
  },
];

export const integrantePorSlug = (slug: string) => equipo.find((p) => p.slug === slug);

export const iniciales = (nombre: string) =>
  nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
