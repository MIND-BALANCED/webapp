import { crisisLines } from "@/lib/site";

export function CrisisLines() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {crisisLines.map((l) => (
        <li key={l.name}>
          <a
            href={l.href}
            className="block rounded-2xl border border-danger/30 bg-surface p-5 hover:border-danger"
          >
            <p className="text-sm text-muted">{l.name}</p>
            <p className="mt-1 text-2xl font-semibold text-danger">{l.contact}</p>
            <p className="mt-1 text-sm">{l.detail}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}
