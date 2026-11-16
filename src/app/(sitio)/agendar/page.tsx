import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Agendar cita" };

/** Cal.com requiere ?embed=true para mostrarse en iframe; Calendly acepta la URL tal cual. */
function embedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("cal.com")) u.searchParams.set("embed", "true");
    if (u.hostname.endsWith("calendly.com")) u.searchParams.set("hide_gdpr_banner", "1");
    return u.toString();
  } catch {
    return null;
  }
}

export default function Agendar() {
  const src = site.schedulingUrl ? embedUrl(site.schedulingUrl) : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="font-serif text-4xl">Agendar valoración inicial</h1>
      <p className="mt-4 text-lg text-muted">
        Elige el día y la hora que mejor te funcionen. Recibirás por correo la confirmación y el
        enlace a la videollamada (Meet, Zoom o Teams).
      </p>
      <p className="mt-2 text-sm text-muted">
        ¿Aún no has enviado tu solicitud?{" "}
        <Link href="/solicitar" className="underline">Empieza aquí</Link>: la necesitamos para preparar tu primera cita.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
        {src ? (
          <iframe src={src} title="Agenda de citas" className="h-[720px] w-full" loading="lazy" />
        ) : (
          <div className="p-8 text-center text-muted">
            <p className="font-semibold text-foreground">La agenda aún no está conectada.</p>
            <p className="mt-2 text-sm">
              Configura <code>NEXT_PUBLIC_SCHEDULING_URL</code> con tu enlace de Cal.com o Calendly.
            </p>
          </div>
        )}
      </div>
      {src && (
        <p className="mt-3 text-sm text-muted">
          ¿No ves la agenda?{" "}
          <a href={site.schedulingUrl} target="_blank" rel="noopener noreferrer" className="underline">Ábrela en una pestaña nueva</a>.
        </p>
      )}
    </div>
  );
}
