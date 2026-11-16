"use client";

import { LifeBuoy, RotateCcw } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/marca/Logo";
import { Blob } from "@/components/marca/Decor";
import { cerrarSesion, restablecerDemo, useDemoDB, usuarioActual } from "@/lib/demo/store";
import { BarraLateral } from "./BarraLateral";
import { Cargando } from "./ui";

export function PanelShell({ children }: { children: React.ReactNode }) {
  const db = useDemoDB();
  const pathname = usePathname();
  const router = useRouter();
  const enIngreso = pathname.startsWith("/panel/ingresar");
  const yo = db ? usuarioActual(db) : null;

  useEffect(() => {
    if (db && !yo && !enIngreso) router.replace("/panel/ingresar/");
  }, [db, yo, enIngreso, router]);

  const salir = () => {
    cerrarSesion();
    router.replace("/panel/ingresar/");
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface-muted lg:flex-row">
      <a
        href="#contenido"
        className="sr-only z-50 rounded-full bg-surface px-4 py-2 font-medium text-primary focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>

      {yo && !enIngreso && <BarraLateral yo={yo} pathname={pathname} onSalir={salir} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="bg-warning-soft text-sm text-foreground">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5 sm:px-8">
            <p className="py-1.5">
              <strong className="font-semibold">Demostración · datos ficticios.</strong> Se guardan solo en este navegador.
            </p>
            {yo && (
              <button
                type="button"
                onClick={() => confirm("¿Restablecer los datos de demostración?") && restablecerDemo()}
                className="inline-flex min-h-11 items-center gap-1.5 font-medium underline underline-offset-2 sm:min-h-9"
              >
                <RotateCcw aria-hidden className="size-4" strokeWidth={1.75} />
                Restablecer datos
              </button>
            )}
          </div>
        </div>

        {(!yo || enIngreso) && (
          <div className="border-b border-border bg-surface">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
              <Link href="/" aria-label="Ir al sitio público de Mind Balanced" className="rounded-lg">
                <Logo compact />
              </Link>
              <Link
                href="/ayuda-inmediata/"
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-danger hover:bg-danger-soft"
              >
                <LifeBuoy aria-hidden className="size-4" strokeWidth={1.75} />
                Ayuda inmediata
              </Link>
            </div>
          </div>
        )}

        <main id="contenido" tabIndex={-1} className="relative isolate flex-1 overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <Blob tone="primary" className="-top-24 -right-24 size-80 opacity-70" />
            <Blob tone="accent" className="-bottom-32 -left-28 size-96 opacity-50" />
          </div>
          {!db || (!yo && !enIngreso) ? <Cargando /> : children}
        </main>
      </div>
    </div>
  );
}
