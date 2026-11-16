"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { iniciarSesion, useDemoDB } from "@/lib/demo/store";

export default function Ingresar() {
  const db = useDemoDB();
  const router = useRouter();
  if (!db) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="font-serif text-3xl">Ingresar al panel</h1>
      <p className="mt-3 text-muted">
        En la versión real el ingreso será con correo, contraseña y verificación en dos pasos
        (código de una app autenticadora). En esta demostración elige con qué perfil entrar:
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
              className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 text-left hover:border-primary"
            >
              <span>
                <span className="block font-semibold">{p.nombre}</span>
                <span className="mt-1 block text-sm text-muted">
                  {p.rol === "admin"
                    ? "Coordinación: ve todas las solicitudes y asigna casos al equipo."
                    : "Profesional: ve sus casos asignados y la cola sin asignar."}
                </span>
              </span>
              <span aria-hidden className="text-primary">→</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-muted">
        <Link href="/" className="underline">Volver al sitio</Link>
      </p>
    </div>
  );
}
