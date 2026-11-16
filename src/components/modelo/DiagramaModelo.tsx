import { User } from "lucide-react";
import { IconoCirculo } from "@/components/marca/Decor";
import { tarjeta } from "@/components/marca/estilos";
import { miradasModelo } from "@/lib/servicios";

/**
 * Diagrama de Venn de las tres miradas del modelo (Clínico, Psicosocial y
 * Persona) con una figura humana en la intersección. El SVG tiene título y
 * descripción, y además se acompaña de una lista visible con el mismo
 * contenido (alternativa textual que no depende del dibujo).
 */
export function DiagramaModelo() {
  const circulos = [
    { id: "clinico", cx: 118, cy: 136, fill: "var(--primary)", opacity: 0.16, label: { x: 88, y: 32 } },
    { id: "psicosocial", cx: 202, cy: 136, fill: "var(--accent)", opacity: 0.26, label: { x: 232, y: 32 } },
    { id: "persona", cx: 160, cy: 208, fill: "var(--secondary)", opacity: 0.4, label: { x: 160, y: 314 } },
  ] as const;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <figure className="mx-auto w-full max-w-sm">
        <svg
          viewBox="0 0 320 320"
          role="img"
          aria-labelledby="venn-titulo venn-desc"
          className="h-auto w-full"
        >
          <title id="venn-titulo">Las tres miradas del modelo</title>
          <desc id="venn-desc">
            Tres círculos que se superponen: Clínico, Psicosocial y Persona. En el centro, donde los
            tres se encuentran, está la figura de una persona.
          </desc>
          {circulos.map((c) => (
            <circle
              key={c.id}
              cx={c.cx}
              cy={c.cy}
              r="88"
              fill={c.fill}
              fillOpacity={c.opacity}
              stroke="var(--primary)"
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />
          ))}
          {circulos.map((c) => {
            const m = miradasModelo.find((x) => x.id === c.id);
            return (
              <text
                key={`t-${c.id}`}
                x={c.label.x}
                y={c.label.y}
                textAnchor="middle"
                fill="var(--foreground)"
                className="font-display"
                fontSize="15"
                fontWeight="600"
              >
                {m?.titulo}
              </text>
            );
          })}
          <circle cx="160" cy="160" r="24" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2" />
          <User x={146} y={146} width={28} height={28} color="var(--primary)" strokeWidth={1.75} aria-hidden />
        </svg>
        <figcaption className="mt-3 text-center text-sm text-muted">
          La persona está en el centro: las tres miradas se encuentran en ella.
        </figcaption>
      </figure>

      <ul className="space-y-4">
        {miradasModelo.map((m) => (
          <li key={m.id} className={`${tarjeta} flex items-start gap-4 p-5`}>
            <IconoCirculo icon={m.icono} tone={m.id === "psicosocial" ? "accent" : "primary"} />
            <div>
              <h3 className="font-display text-lg font-semibold">{m.titulo}</h3>
              <p className="mt-1 text-muted">{m.texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
