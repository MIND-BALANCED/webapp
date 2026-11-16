"use client";

import Link from "next/link";
import { useState } from "react";
import { admisionSchema, clasificarPrioridad, type AdmisionState } from "@/lib/admision";
import { crearSolicitud } from "@/lib/demo/store";
import { lineas } from "@/lib/servicios";
import { CrisisLines } from "@/components/CrisisLines";

const initial: AdmisionState = { status: "idle" };

const inputCls =
  "mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-base focus:border-primary focus:outline-none";

export function AdmisionForm({ minAge }: { minAge: number }) {
  const [state, setState] = useState<AdmisionState>(initial);

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries([...new FormData(e.currentTarget).entries()].map(([k, v]) => [k, String(v)]));
    const parsed = admisionSchema.safeParse(raw);
    if (!parsed.success) {
      setState({ status: "error", message: "Revisa los campos marcados.", fieldErrors: parsed.error.flatten().fieldErrors, values: raw });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const prioridad = clasificarPrioridad(parsed.data);
    crearSolicitud(parsed.data, prioridad);
    setState({ status: "ok", prioridad, nombre: parsed.data.nombre.split(" ")[0] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (state.status === "ok") return <Resultado state={state} />;

  const v = state.status === "error" ? state.values : {};
  const err = (k: string) =>
    state.status === "error" ? state.fieldErrors[k as keyof typeof state.fieldErrors]?.[0] : undefined;

  return (
    <form onSubmit={enviar} className="space-y-10" noValidate>
      <p className="rounded-xl bg-warning-soft p-4 text-sm">
        <strong>Sitio de demostración.</strong> No escribas datos reales: lo que envíes se guarda
        solo en este navegador y aparece en el <Link href="/panel" className="underline">panel de demostración</Link>.
      </p>
      {state.status === "error" && (
        <p role="alert" className="rounded-xl bg-danger-soft p-4 text-danger">
          {state.message}
        </p>
      )}

      <Fieldset legend="1. Tus datos">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre completo" error={err("nombre")}>
            <input name="nombre" autoComplete="name" required defaultValue={v.nombre} className={inputCls} />
          </Field>
          <Field label="Correo electrónico" error={err("email")}>
            <input name="email" type="email" autoComplete="email" required defaultValue={v.email} className={inputCls} />
          </Field>
          <Field label="Teléfono (opcional)" hint="Para contactarte si se corta la videollamada." error={err("telefono")}>
            <input name="telefono" type="tel" autoComplete="tel" defaultValue={v.telefono} className={inputCls} />
          </Field>
          <Field label="Edad" error={err("edad")}>
            <input name="edad" type="number" inputMode="numeric" min={minAge} max={110} required defaultValue={v.edad} className={inputCls} />
          </Field>
          <Field label="Ciudad y país" error={err("ciudad")}>
            <input name="ciudad" autoComplete="address-level2" required defaultValue={v.ciudad} className={inputCls} />
          </Field>
        </div>
      </Fieldset>

      <Fieldset legend="2. ¿Qué te trae por aquí?">
        <Field label="¿Qué tipo de atención buscas?" error={err("linea")}>
          <select name="linea" defaultValue={v.linea ?? "no_se"} className={inputCls}>
            <option value="no_se">No estoy seguro/a, quiero orientación</option>
            {lineas.map((l) => (
              <option key={l.id} value={l.id}>{l.titulo}</option>
            ))}
          </select>
        </Field>
        <Field
          label="Cuéntanos brevemente qué está pasando"
          hint="Lo que quieras compartir. Solo lo leerá el equipo profesional."
          error={err("motivo")}
        >
          <textarea name="motivo" rows={5} maxLength={2000} required defaultValue={v.motivo} className={inputCls} />
        </Field>
      </Fieldset>

      <Fieldset legend="3. Condiciones para la atención virtual">
        <Field label="Plataforma de videollamada preferida" error={err("plataforma")}>
          <select name="plataforma" defaultValue={v.plataforma ?? "indiferente"} className={inputCls}>
            <option value="indiferente">Me da igual</option>
            <option value="meet">Google Meet</option>
            <option value="zoom">Zoom</option>
            <option value="teams">Microsoft Teams</option>
          </select>
        </Field>
        <Radios
          name="espacioPrivado"
          label="¿Cuentas con un espacio privado para las sesiones?"
          options={[["si", "Sí"], ["a_veces", "A veces"], ["no", "No"]]}
          defaultValue={v.espacioPrivado}
          error={err("espacioPrivado")}
        />
      </Fieldset>

      <Fieldset
        legend="4. Tu seguridad"
        description="Estas preguntas nos ayudan a darte la respuesta adecuada lo antes posible. Responder con honestidad es importante y no te excluye de recibir atención."
      >
        <Radios
          name="riesgoPensamientos"
          label="En las últimas dos semanas, ¿has tenido pensamientos de hacerte daño o de quitarte la vida?"
          options={RIESGO}
          defaultValue={v.riesgoPensamientos}
          error={err("riesgoPensamientos")}
        />
        <Radios
          name="riesgoPlan"
          label="¿Tienes en este momento la intención o un plan para hacerte daño?"
          options={RIESGO}
          defaultValue={v.riesgoPlan}
          error={err("riesgoPlan")}
        />
        <Radios
          name="riesgoViolencia"
          label="¿Estás viviendo actualmente una situación de violencia o peligro?"
          options={RIESGO}
          defaultValue={v.riesgoViolencia}
          error={err("riesgoViolencia")}
        />
      </Fieldset>

      <Fieldset legend="5. Autorizaciones">
        <Check name="aceptaDatos" error={err("aceptaDatos")} defaultChecked={v.aceptaDatos === "on"}>
          Autorizo el tratamiento de mis datos personales, incluidos datos sensibles de salud, según la{" "}
          <Link href="/privacidad" target="_blank" className="underline">política de tratamiento de datos</Link>.
        </Check>
        <Check name="aceptaConsentimiento" error={err("aceptaConsentimiento")} defaultChecked={v.aceptaConsentimiento === "on"}>
          He leído y acepto el{" "}
          <Link href="/consentimiento" target="_blank" className="underline">consentimiento informado para atención psicológica virtual</Link>.
        </Check>
      </Fieldset>

      <button
        type="submit"
        className="w-full rounded-full bg-primary px-6 py-3.5 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        Enviar solicitud
      </button>
    </form>
  );
}

const RIESGO: [string, string][] = [
  ["no", "No"],
  ["si", "Sí"],
  ["prefiero_no_responder", "Prefiero no responder"],
];

function Resultado({ state }: { state: Extract<AdmisionState, { status: "ok" }> }) {
  if (state.prioridad === "urgente") {
    return (
      <div role="alert" className="space-y-6">
        <div className="rounded-2xl bg-danger-soft p-6">
          <h2 className="font-serif text-2xl text-danger">{state.nombre}, tu seguridad es lo primero</h2>
          <p className="mt-3">
            Por lo que nos contaste, es importante que recibas ayuda <strong>ahora mismo</strong>, sin
            esperar una cita. Por favor comunícate con alguna de estas líneas o acude al servicio de
            urgencias más cercano.
          </p>
        </div>
        <CrisisLines />
        <p className="text-muted">
          Recibimos tu solicitud y nuestro equipo te contactará con prioridad. Aun así, no esperes
          nuestro contacto para buscar ayuda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-accent-soft p-6">
        <h2 className="font-serif text-2xl">Gracias, {state.nombre}. Recibimos tu solicitud.</h2>
        <p className="mt-3">
          {state.prioridad === "prioritaria"
            ? "Un profesional de nuestro equipo revisará tu solicitud con prioridad y te escribirá en menos de 24 horas hábiles."
            : "Un profesional revisará tu solicitud y te escribirá en los próximos 2 días hábiles."}{" "}
          Mientras tanto, puedes agendar tu cita de valoración inicial.
        </p>
        <p className="mt-3 text-sm text-muted">
          (Demostración: puedes ver esta solicitud en el{" "}
          <Link href="/panel" className="underline">panel profesional</Link>.)
        </p>
      </div>
      <Link href="/agendar" className="inline-block rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90">
        Agendar valoración inicial
      </Link>
      {state.prioridad === "prioritaria" && (
        <div className="space-y-4 pt-4">
          <p className="font-semibold">Si en algún momento sientes que estás en peligro, no esperes:</p>
          <CrisisLines />
        </div>
      )}
    </div>
  );
}

function Fieldset({ legend, description, children }: { legend: string; description?: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5 rounded-2xl border border-border bg-surface p-5 sm:p-7">
      <legend className="px-1 font-serif text-xl">{legend}</legend>
      {description && <p className="text-sm text-muted">{description}</p>}
      {children}
    </fieldset>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="block text-xs text-muted">{hint}</span>}
      {children}
      {error && <span className="mt-1 block text-sm text-danger">{error}</span>}
    </label>
  );
}

function Radios({
  name, label, options, defaultValue, error,
}: { name: string; label: string; options: [string, string][]; defaultValue?: string; error?: string }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map(([value, text]) => (
          <label key={value} className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary-soft">
            <input type="radio" name={name} value={value} required defaultChecked={defaultValue === value} className="accent-[var(--primary)]" />
            {text}
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-danger">Selecciona una opción.</p>}
    </fieldset>
  );
}

function Check({ name, error, defaultChecked, children }: { name: string; error?: string; defaultChecked?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex gap-3 text-sm">
        <input type="checkbox" name={name} required defaultChecked={defaultChecked} className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]" />
        <span>{children}</span>
      </label>
      {error && <p className="mt-1 pl-7 text-sm text-danger">{error}</p>}
    </div>
  );
}
