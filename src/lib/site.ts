/**
 * Configuración central del centro. Los valores públicos se leen de
 * variables NEXT_PUBLIC_* (ver .env.example) para poder cambiar de
 * proveedor de agenda o de canal de contacto sin tocar código.
 */
export const site = {
  name: "Mind Balanced",
  descriptor: "Centro Virtual de Atención Psicológica",
  tagline: "Centro virtual de atención psicológica",
  lema: "Tu bienestar también es una prioridad",
  principio: "Comprender a la persona en su contexto, intervenir con rigor científico y acompañar con sensibilidad humana.",
  description:
    "Orientación, atención psicológica y acompañamiento psicosocial virtual para jóvenes y adultos. Un espacio profesional, confidencial y cercano.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  /**
   * URL pública de agenda (Cal.com, Calendly o similar).
   * Ej: https://cal.com/mind-balanced/primera-cita
   *     https://calendly.com/mind-balanced/primera-cita
   */
  schedulingUrl: process.env.NEXT_PUBLIC_SCHEDULING_URL ?? "",
  /** Edad mínima atendida en esta versión (ver docs/modelo-de-servicio.md §3). */
  minAge: 18,
};

export type CrisisLine = {
  name: string;
  contact: string;
  href: string;
  detail: string;
};

/**
 * Rutas de ayuda inmediata en Colombia.
 * IMPORTANTE: verificar vigencia de cada línea antes de publicar
 * y ajustar según la ciudad desde donde se atienda.
 */
export const crisisLines: CrisisLine[] = [
  {
    name: "Línea de emergencias",
    contact: "123",
    href: "tel:123",
    detail: "Si tu vida o la de otra persona está en peligro ahora.",
  },
  {
    name: "Línea nacional de salud mental",
    contact: "192, opción 4",
    href: "tel:192",
    detail: "Orientación en salud mental del Ministerio de Salud.",
  },
  {
    name: "Línea 106 (Bogotá)",
    contact: "106",
    href: "tel:106",
    detail: "Escucha y apoyo emocional, 24 horas.",
  },
  {
    name: "Línea 155",
    contact: "155",
    href: "tel:155",
    detail: "Orientación para mujeres víctimas de violencias.",
  },
];
