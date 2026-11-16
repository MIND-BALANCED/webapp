import { Phone } from "lucide-react";
import { crisisLines } from "@/lib/site";

/**
 * Líneas de ayuda inmediata. Cada tarjeta es un enlace `tel:` grande y
 * fácil de tocar. Sin decoración: la prioridad es leerlas y llamar rápido.
 */
export function CrisisLines() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {crisisLines.map((l) => {
        return (
          <li key={l.name}>
            <a
              href={l.href}
              className="flex h-full min-h-11 items-start gap-4 rounded-3xl border-2 border-danger bg-surface p-5 text-foreground transition-colors hover:bg-danger-soft sm:p-6"
            >
              <span
                aria-hidden
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger"
              >
                <Phone className="size-6" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-3xl font-bold leading-tight text-danger sm:text-4xl">
                  {l.contact}
                </span>
                <span className="mt-1 block text-base font-semibold">{l.name}</span>
                <span className="mt-1 block text-base leading-relaxed">
                  {l.detail}
                </span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-danger underline underline-offset-4">
                  Llamar ahora<span className="sr-only"> al {l.contact}</span>
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
