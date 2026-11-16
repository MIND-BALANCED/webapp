"use client";

import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/marca/Logo";
import { iniciales, tarjeta } from "@/components/panel/ui";
import { iniciarSesion, useDemoDB } from "@/lib/demo/store";

export default function Ingresar() {
  const db = useDemoDB();
  const router = useRouter();
  if (!db) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <div className={`${tarjeta} p-6 sm:p-10`}>
        <LogoMark className="size-12" />
        <p className="mt-5 text-sm font-medium text-muted">Comprender • Intervenir • Acompañar</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">Ingresar al panel</h1>
        <p className="mt-3 leading-relaxed text-muted">
          En esta demostración elige con qué perfil entrar. Todos los datos son ficticios.
        </p>
        <p className="mt-4 flex items-start gap-3 rounded-2xl bg-surface-muted p-4 text-sm leading-relaxed text-muted">
          <Lock aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.75} />
          <span>
            En la versión real el ingreso será con correo, contraseña y verificación en dos pasos (código de una app
            autenticadora).
          </span>
        </p>

        <ul className="mt-8 space-y-3">
          {db.profesionales.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  iniciarSesion(p.id);
                  router.replace("/panel/");
                }}
                className="group flex min-h-11 w-full items-center gap-4 rounded-2xl bg-surface p-4 text-left ring-1 ring-inset ring-border-strong hover:bg-primary-soft hover:ring-primary sm:p-5"
              >
                <span
                  aria-hidden
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display text-sm font-semibold text-primary group-hover:bg-surface"
                >
                  {iniciales(p.nombre)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">{p.nombre}</span>
                    <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-muted">
                      {p.rol === "admin" ? "Coordinación" : "Profesional"}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {p.rol === "admin"
                      ? "Ve todas las solicitudes y asigna casos al equipo."
                      : "Ve sus casos asignados y la cola sin asignar."}
                  </span>
                </span>
                <ArrowRight aria-hidden className="size-5 shrink-0 text-primary" strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-sm">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 font-medium text-primary underline underline-offset-2">
          <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
          Volver al sitio
        </Link>
      </p>
    </div>
  );
}
