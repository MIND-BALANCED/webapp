/*
 * Clases compartidas del sistema de marca (ver docs/marca.md, "Componentes de estilo").
 * Úsalas en lugar de repetir cadenas de Tailwind en cada página. El foco visible
 * lo aporta la regla global :focus-visible de globals.css.
 */

/** Deshabilitado real (`disabled`) o accesible (`aria-disabled`). */
const deshabilitado =
  "disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60";

/** Botón o enlace principal en píldora (acción más importante de la vista). */
export const botonPrimario = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 font-display font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover ${deshabilitado}`;

/** Botón o enlace secundario en píldora, con borde de control (≥3:1). */
export const botonSecundario = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-surface px-6 py-2.5 font-display font-semibold text-primary ring-1 ring-inset ring-border-strong transition-colors hover:bg-primary-soft ${deshabilitado}`;

/** Enlace de texto con flecha ("Ver más →"). */
export const enlaceFlecha =
  "inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline";

/** Tarjeta de marca: superficie blanca, muy redondeada, contorno sutil y sombra `shadow-card`. */
export const tarjeta = "rounded-3xl bg-surface ring-1 ring-border shadow-card";

/** Inputs, selects y textareas: borde de control ≥3:1, foco en `primary` y error en `danger`. */
export const control =
  "block min-h-11 w-full rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 text-base text-foreground placeholder:text-muted focus:border-primary aria-[invalid=true]:border-2 aria-[invalid=true]:border-danger";
