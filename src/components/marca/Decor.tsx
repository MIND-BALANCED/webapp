import type { LucideIcon } from "lucide-react";

/** Formas orgánicas de fondo. Puramente decorativas. */
export function Blob({ className = "", tone = "secondary" }: { className?: string; tone?: "secondary" | "accent" | "primary" }) {
  const fill = tone === "accent" ? "var(--accent-soft)" : tone === "primary" ? "var(--primary-soft)" : "var(--secondary-soft)";
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={`pointer-events-none absolute ${className}`}>
      <path
        fill={fill}
        d="M43.7-58.6C55.3-49.6 62.1-34.6 66-18.6 69.9-2.6 70.9 14.4 64.2 27.6 57.5 40.8 43.1 50.2 27.4 57.9 11.7 65.6-5.3 71.6-21.5 68.3-37.7 65-53.1 52.4-62.5 36.6-71.9 20.8-75.3 1.8-70.4-14.6-65.5-31-52.3-44.8-37.6-53.4-22.9-62-6.7-65.4 9.4-66.4 25.5-67.4 32.1-67.6 43.7-58.6Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

/** Rama con hojas, eco del símbolo. Decorativa. */
export function Rama({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 160" aria-hidden className={`pointer-events-none ${className}`}>
      <path d="M40 158C40 120 42 80 52 20" stroke="var(--accent-ink)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {[
        [44, 130, -35, "var(--accent)"],
        [46, 100, 35, "var(--secondary)"],
        [48, 72, -30, "var(--accent)"],
        [50, 46, 30, "var(--secondary)"],
        [52, 22, -20, "var(--accent)"],
      ].map(([x, y, r, c], i) => (
        <ellipse key={i} cx={x as number} cy={y as number} rx="9" ry="20" fill={c as string} transform={`rotate(${r} ${x} ${y}) translate(${(r as number) > 0 ? 12 : -12} 0)`} />
      ))}
    </svg>
  );
}

/** Ícono dentro de un círculo suave, como en el sistema de marca. */
export function IconoCirculo({
  icon: Icon,
  tone = "primary",
  size = "md",
}: {
  icon: LucideIcon;
  tone?: "primary" | "accent";
  size?: "sm" | "md" | "lg";
}) {
  const box = size === "lg" ? "size-16" : size === "sm" ? "size-10" : "size-12";
  const ico = size === "lg" ? "size-8" : size === "sm" ? "size-5" : "size-6";
  const color = tone === "accent" ? "bg-accent-soft text-accent-ink" : "bg-primary-soft text-primary";
  return (
    <span aria-hidden className={`inline-flex shrink-0 items-center justify-center rounded-full ${box} ${color}`}>
      <Icon className={ico} strokeWidth={1.75} />
    </span>
  );
}
