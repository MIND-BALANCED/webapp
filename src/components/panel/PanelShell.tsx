"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cerrarSesion, restablecerDemo, useDemoDB, usuarioActual } from "@/lib/demo/store";
import { site } from "@/lib/site";
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

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <div className="bg-warning-soft text-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2">
          <span>
            <strong>Demostración</strong> · Datos ficticios guardados solo en este navegador.
          </span>
          {yo && (
            <button
              type="button"
              onClick={() => confirm("¿Restablecer los datos de demostración?") && restablecerDemo()}
              className="underline"
            >
              Restablecer datos
            </button>
          )}
        </div>
      </div>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/panel/" className="font-serif text-lg font-semibold text-primary">
            {site.name} <span className="font-sans text-sm font-normal text-muted">· Panel profesional</span>
          </Link>
          {yo && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted">
                {yo.nombre} <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs">{yo.rol === "admin" ? "Coordinación" : "Profesional"}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  cerrarSesion();
                  router.replace("/panel/ingresar/");
                }}
                className="rounded-full border border-border px-3 py-1.5 hover:bg-surface-muted"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1">{!db || (!yo && !enIngreso) ? <Cargando /> : children}</main>
    </div>
  );
}
