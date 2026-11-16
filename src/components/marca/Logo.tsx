import { site } from "@/lib/site";

/**
 * Símbolo: un corazón formado por dos hojas (verde = crecimiento,
 * lavanda = calma) que una figura humana (violeta) rodea y sostiene.
 * Es decorativo cuando va junto al nombre (aria-hidden).
 */
export function LogoMark({ className = "size-10", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path d="M31 59C19 50 5 39 5 25.5 5 15.8 13.6 10.6 21.5 14.6 26.2 17 29 21.4 31 27Z" fill="var(--accent)" />
      <path d="M33 59C41 50 49 40 49 28.5 49 21 45 17.5 40.5 17 37 17.5 34.5 21.5 33 27Z" fill="var(--secondary)" />
      <path
        d="M33 59C45 50 59 39 59 25.5 59 16.5 51.5 11.4 44 13.6 40.6 14.6 38 16.4 36 19 39.8 16.8 44.2 17 47.3 20 50.6 23.3 51.3 29 49.2 35.8 46.4 44.6 40 52.6 33 59Z"
        fill="var(--primary)"
      />
      <circle cx="33" cy="8.5" r="6" fill="var(--primary)" />
    </svg>
  );
}

/** Logotipo: símbolo + nombre + descriptor. */
export function Logo({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className={compact ? "size-9" : "size-11"} />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-lg font-bold tracking-tight ${inverse ? "text-white" : "text-primary"}`}>
          {site.name}
        </span>
        {!compact && (
          <span className={`mt-1 text-[0.7rem] font-medium ${inverse ? "text-white/85" : "text-muted"}`}>
            {site.descriptor}
          </span>
        )}
      </span>
    </span>
  );
}
