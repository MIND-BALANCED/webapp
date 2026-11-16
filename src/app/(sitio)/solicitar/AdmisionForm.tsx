"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  CircleCheck,
  Heart,
  Info,
  LifeBuoy,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { admisionSchema, clasificarPrioridad, type AdmisionState } from "@/lib/admision";
import { crearSolicitud } from "@/lib/demo/store";
import { lineas } from "@/lib/servicios";
import { CrisisLines } from "@/components/CrisisLines";
import { IconoCirculo } from "@/components/marca/Decor";
import { botonPrimario, control, tarjeta } from "@/components/marca/estilos";

const initial: AdmisionState = { status: "idle" };

const inputCls = `mt-2 ${control}`;

/** Nombre visible de cada campo y el control al que lleva el resumen de errores. */
const CAMPOS: { name: string; label: string; target: string }[] = [
  { name: "nombre", label: "Nombre completo", target: "campo-nombre" },
  { name: "email", label: "Correo electrónico", target: "campo-email" },
  { name: "telefono", label: "Teléfono", target: "campo-telefono" },
  { name: "edad", label: "Edad", target: "campo-edad" },
  { name: "ciudad", label: "Ciudad y país", target: "campo-ciudad" },
  { name: "linea", label: "Tipo de atención", target: "campo-linea" },
  { name: "motivo", label: "Qué está pasando", target: "campo-motivo" },
  { name: "plataforma", label: "Plataforma de videollamada", target: "campo-plataforma" },
  { name: "espacioPrivado", label: "Espacio privado para las sesiones", target: "campo-espacioPrivado-si" },
  { name: "riesgoPensamientos", label: "Pregunta de seguridad 1", target: "campo-riesgoPensamientos-no" },
  { name: "riesgoPlan", label: "Pregunta de seguridad 2", target: "campo-riesgoPlan-no" },
  { name: "riesgoViolencia", label: "Pregunta de seguridad 3", target: "campo-riesgoViolencia-no" },
  { name: "aceptaDatos", label: "Autorización de datos personales", target: "campo-aceptaDatos" },
  { name: "aceptaConsentimiento", label: "Consentimiento informado", target: "campo-aceptaConsentimiento" },
];

const RADIOS = new Set(["espacioPrivado", "riesgoPensamientos", "riesgoPlan", "riesgoViolencia"]);
const MSG_RADIO = "Selecciona una opción.";

export function AdmisionForm({ minAge }: { minAge: number }) {
  const [state, setState] = useState<AdmisionState>(initial);
  const resumenRef = useRef<HTMLDivElement>(null);
  const urgenteRef = useRef<HTMLDivElement>(null);
  const menorRef = useRef<HTMLDivElement>(null);

  // Al fallar el envío, lleva el foco a lo más importante: primero la ayuda inmediata (si la persona
  // indicó riesgo), luego el aviso de edad y, si no, el resumen de errores.
  useEffect(() => {
    if (state.status !== "error") return;
    (urgenteRef.current ?? menorRef.current ?? resumenRef.current)?.focus();
  }, [state]);

  /** Lleva al campo con error mostrando su etiqueta o pregunta, y luego enfoca el control. */
  function irAlCampo(e: React.MouseEvent<HTMLAnchorElement>, target: string) {
    const control = document.getElementById(target);
    if (!control) return;
    e.preventDefault();
    const contenedor = control.closest<HTMLElement>("[data-campo]") ?? control;
    contenedor.scrollIntoView({ block: "start" });
    control.focus({ preventScroll: true });
  }

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
  const err = (k: string) => {
    if (state.status !== "error") return undefined;
    const e = state.fieldErrors[k as keyof typeof state.fieldErrors]?.[0];
    if (!e) return undefined;
    return RADIOS.has(k) ? MSG_RADIO : e;
  };
  const conError = CAMPOS.filter((c) => err(c.name));

  // Señales de seguridad: se revisan con lo que la persona marcó, aunque el formulario tenga errores.
  const hayError = state.status === "error";
  const riesgoInmediato = hayError && (v.riesgoPlan === "si" || v.riesgoViolencia === "si");
  const riesgoPensamientos = hayError && !riesgoInmediato && v.riesgoPensamientos === "si";
  const edadNum = v.edad?.trim() ? Number(v.edad) : NaN;
  const menorDeEdad = hayError && Number.isFinite(edadNum) && edadNum < minAge;

  return (
    <form onSubmit={enviar} className="space-y-6" noValidate>
      <div className="flex items-start gap-3 rounded-2xl bg-warning-soft px-4 py-3.5 text-base leading-relaxed text-foreground">
        <Info aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
        <p>
          <strong>Sitio de demostración.</strong> No escribas datos reales: lo que envíes se guarda
          solo en este navegador y aparece en el{" "}
          <Link href="/panel/" className="font-semibold underline underline-offset-2">
            panel de demostración
          </Link>
          .
        </p>
      </div>

      {riesgoInmediato && (
        <div
          ref={urgenteRef}
          role="alert"
          tabIndex={-1}
          aria-labelledby="ayuda-inmediata-titulo"
          className="space-y-5 rounded-3xl border-2 border-danger bg-danger-soft p-5 sm:p-6"
        >
          <div>
            <p id="ayuda-inmediata-titulo" className="flex items-center gap-2 font-display text-xl font-bold text-danger">
              <LifeBuoy aria-hidden className="size-6 shrink-0" strokeWidth={1.75} />
              Antes de seguir: busca ayuda ahora mismo
            </p>
            <p className="mt-2 text-base leading-relaxed text-foreground">
              Nos contaste que podrías estar en peligro. <strong>No esperes a completar el formulario</strong>:
              comunícate ya con alguna de estas líneas o acude al servicio de urgencias más cercano.
            </p>
          </div>
          <CrisisLines />
          <Link
            href="/ayuda-inmediata/"
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-danger underline underline-offset-4"
          >
            Ver todas las rutas de ayuda inmediata
            <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
          </Link>
        </div>
      )}

      {menorDeEdad && (
        <div
          ref={menorRef}
          role="alert"
          tabIndex={-1}
          aria-labelledby="menor-titulo"
          className={`${tarjeta} space-y-5 p-5 sm:p-6`}
        >
          <div>
            <p id="menor-titulo" className="font-display text-xl font-semibold text-foreground">
              Por ahora atendemos personas de {minAge} años o más
            </p>
            <p className="mt-2 text-base leading-relaxed text-foreground">
              Gracias por buscar apoyo: es un paso valioso. Nuestro servicio todavía no puede acompañar a
              menores de {minAge} años, pero no tienes que pasar por esto sin ayuda. Puedes hablar con una
              persona adulta de confianza o con estas líneas, que te orientan de forma gratuita.
            </p>
          </div>
          <a
            href="tel:141"
            className="flex min-h-11 items-start gap-4 rounded-3xl border-2 border-primary bg-surface p-5 text-foreground transition-colors hover:bg-primary-soft sm:p-6"
          >
            <span aria-hidden className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Phone className="size-6" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-3xl font-bold leading-tight text-primary sm:text-4xl">141</span>
              <span className="mt-1 block text-base font-semibold">Línea 141 del ICBF</span>
              <span className="mt-1 block text-base leading-relaxed">
                Orientación gratuita para niñas, niños y adolescentes, las 24 horas.
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-4">
                Llamar ahora<span className="sr-only"> a la Línea 141</span>
              </span>
            </span>
          </a>
          {!riesgoInmediato && (
            <>
              <p className="text-base font-semibold text-foreground">Si estás en peligro ahora mismo:</p>
              <CrisisLines />
            </>
          )}
        </div>
      )}

      {riesgoPensamientos && (
        <div className="flex items-start gap-3 rounded-2xl border-2 border-danger bg-danger-soft px-4 py-3.5 text-base leading-relaxed text-foreground">
          <LifeBuoy aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" strokeWidth={1.75} />
          <p>
            Nos contaste que has tenido pensamientos de hacerte daño. Mientras completas el formulario,
            recuerda que puedes hablar con alguien ahora:{" "}
            <Link href="/ayuda-inmediata/" className="font-semibold text-danger underline underline-offset-2">
              busca ayuda inmediata
            </Link>
            .
          </p>
        </div>
      )}

      {state.status === "error" && (
        <div
          ref={resumenRef}
          role="alert"
          tabIndex={-1}
          aria-labelledby="resumen-errores-titulo"
          className="rounded-3xl border-2 border-danger bg-danger-soft p-5 text-danger sm:p-6"
        >
          <p id="resumen-errores-titulo" className="flex items-center gap-2 font-display text-lg font-semibold">
            <AlertCircle aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
            {state.message}
          </p>
          {conError.length > 0 && (
            <ul className="mt-3 space-y-1 pl-7 text-base">
              {conError.map((c) => (
                <li key={c.name} className="list-disc">
                  <a href={`#${c.target}`} onClick={(e) => irAlCampo(e, c.target)} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-2 sm:min-h-8">
                    {c.label}: {err(c.name)}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Seccion paso={1} titulo="Tus datos">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="campo-nombre" label="Nombre completo" error={err("nombre")}>
            {(a) => <input {...a} name="nombre" autoComplete="name" required defaultValue={v.nombre} className={inputCls} />}
          </Field>
          <Field id="campo-email" label="Correo electrónico" error={err("email")}>
            {(a) => <input {...a} name="email" type="email" autoComplete="email" required defaultValue={v.email} className={inputCls} />}
          </Field>
          <Field id="campo-telefono" label="Teléfono (opcional)" hint="Para contactarte si se corta la videollamada." error={err("telefono")}>
            {(a) => <input {...a} name="telefono" type="tel" autoComplete="tel" defaultValue={v.telefono} className={inputCls} />}
          </Field>
          <Field id="campo-edad" label="Edad" hint={`Atendemos personas de ${minAge} años o más.`} error={err("edad")}>
            {(a) => (
              <input
                {...a}
                name="edad"
                type="number"
                inputMode="numeric"
                min={minAge}
                max={110}
                required
                defaultValue={v.edad}
                className={inputCls}
              />
            )}
          </Field>
          <Field id="campo-ciudad" label="Ciudad y país" error={err("ciudad")}>
            {(a) => <input {...a} name="ciudad" autoComplete="address-level2" required defaultValue={v.ciudad} className={inputCls} />}
          </Field>
        </div>
      </Seccion>

      <Seccion paso={2} titulo="¿Qué te trae por aquí?">
        <Field id="campo-linea" label="¿Qué tipo de atención buscas?" error={err("linea")}>
          {(a) => (
            <Select {...a} name="linea" defaultValue={v.linea ?? "no_se"}>
              <option value="no_se">No estoy seguro/a, quiero orientación</option>
              {lineas.map((l) => (
                <option key={l.id} value={l.id}>{l.titulo}</option>
              ))}
            </Select>
          )}
        </Field>
        <Field
          id="campo-motivo"
          label="Cuéntanos brevemente qué está pasando"
          hint="Lo que quieras compartir, con un mínimo de 20 caracteres. Solo lo leerá el equipo profesional."
          error={err("motivo")}
        >
          {(a) => (
            <textarea
              {...a}
              name="motivo"
              rows={5}
              maxLength={2000}
              required
              defaultValue={v.motivo}
              className={`${inputCls} leading-relaxed`}
            />
          )}
        </Field>
      </Seccion>

      <Seccion paso={3} titulo="Condiciones para la atención virtual">
        <Field id="campo-plataforma" label="Plataforma de videollamada preferida" error={err("plataforma")}>
          {(a) => (
            <Select {...a} name="plataforma" defaultValue={v.plataforma ?? "indiferente"}>
              <option value="indiferente">Me da igual</option>
              <option value="meet">Google Meet</option>
              <option value="zoom">Zoom</option>
              <option value="teams">Microsoft Teams</option>
            </Select>
          )}
        </Field>
        <Radios
          name="espacioPrivado"
          label="¿Cuentas con un espacio privado para las sesiones?"
          options={[["si", "Sí"], ["a_veces", "A veces"], ["no", "No"]]}
          defaultValue={v.espacioPrivado}
          error={err("espacioPrivado")}
        />
      </Seccion>

      <Seccion paso={4} titulo="Tu seguridad">
        <div className="flex items-start gap-4 rounded-2xl bg-primary-soft p-4 sm:p-5">
          <IconoCirculo icon={ShieldCheck} tone="accent" />
          <div className="text-base leading-relaxed text-foreground">
            <p className="font-display font-semibold">¿Por qué te preguntamos esto?</p>
            <p className="mt-1">
              Estas preguntas nos ayudan a darte la respuesta adecuada lo antes posible. Responder con
              honestidad es importante y <strong>no te excluye de recibir atención</strong>. Puedes
              elegir «Prefiero no responder».
            </p>
          </div>
        </div>
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
        <p className="text-base leading-relaxed text-muted">
          Si ahora mismo estás en peligro, no esperes a enviar el formulario:{" "}
          <Link href="/ayuda-inmediata/" className="font-semibold text-danger underline underline-offset-2">
            busca ayuda inmediata
          </Link>
          .
        </p>
      </Seccion>

      <Seccion paso={5} titulo="Autorizaciones">
        <Casilla id="campo-aceptaDatos" name="aceptaDatos" error={err("aceptaDatos")} defaultChecked={v.aceptaDatos === "on"}>
          Autorizo el tratamiento de mis datos personales, incluidos datos sensibles de salud, según la{" "}
          <Link href="/privacidad/" target="_blank" className="font-semibold text-primary underline underline-offset-2">
            política de tratamiento de datos
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </Link>
          .
        </Casilla>
        <Casilla
          id="campo-aceptaConsentimiento"
          name="aceptaConsentimiento"
          error={err("aceptaConsentimiento")}
          defaultChecked={v.aceptaConsentimiento === "on"}
        >
          He leído y acepto el{" "}
          <Link href="/consentimiento/" target="_blank" className="font-semibold text-primary underline underline-offset-2">
            consentimiento informado para atención psicológica virtual
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </Link>
          .
        </Casilla>
      </Seccion>

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
        <button type="submit" className={`${botonPrimario} w-full sm:w-auto`}>
          Enviar solicitud
          <Send aria-hidden className="size-5" strokeWidth={1.75} />
        </button>
        <p className="text-base text-muted">Después de enviarla podrás agendar tu valoración inicial.</p>
      </div>
    </form>
  );
}

const RIESGO: [string, string][] = [
  ["no", "No"],
  ["si", "Sí"],
  ["prefiero_no_responder", "Prefiero no responder"],
];

function Resultado({ state }: { state: Extract<AdmisionState, { status: "ok" }> }) {
  const tituloRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    tituloRef.current?.focus();
  }, []);

  if (state.prioridad === "urgente") {
    return (
      <div role="alert" className="space-y-6">
        <div className="rounded-3xl border-2 border-danger bg-danger-soft p-6 sm:p-8">
          <h2 ref={tituloRef} tabIndex={-1} className="font-display text-2xl font-bold leading-tight text-danger sm:text-3xl">
            {state.nombre}, tu seguridad es lo primero
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-foreground">
            Por lo que nos contaste, es importante que recibas ayuda <strong>ahora mismo</strong>, sin
            esperar una cita. Por favor comunícate con alguna de estas líneas o acude al servicio de
            urgencias más cercano.
          </p>
        </div>
        <CrisisLines />
        <div className={`${tarjeta} p-5 sm:p-6`}>
          <p className="text-base leading-relaxed text-foreground">
            Recibimos tu solicitud y nuestro equipo te contactará con prioridad. Aun así,{" "}
            <strong>no esperes nuestro contacto para buscar ayuda</strong>.
          </p>
          <Link
            href="/ayuda-inmediata/"
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold text-danger underline underline-offset-4"
          >
            Ver todas las rutas de ayuda inmediata
            <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    );
  }

  const pasos = [
    {
      titulo: "Revisamos tu solicitud",
      texto:
        state.prioridad === "prioritaria"
          ? "Un profesional de nuestro equipo la revisará con prioridad y te escribirá en menos de 24 horas hábiles."
          : "Un profesional la revisará y te escribirá en los próximos 2 días hábiles.",
    },
    {
      titulo: "Agenda tu valoración inicial",
      texto: "Mientras tanto, puedes elegir el día y la hora de tu primera cita por videollamada.",
    },
    {
      titulo: "Recibe el enlace por correo",
      texto: "Te enviaremos la confirmación y el enlace a la videollamada. Busca un espacio privado y tranquilo.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className={`${tarjeta} p-6 sm:p-8`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span aria-hidden className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
            <CircleCheck className="size-8" strokeWidth={1.75} />
          </span>
          <div>
            <h2 ref={tituloRef} tabIndex={-1} className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
              Gracias, {state.nombre}. <span className="text-primary">Recibimos tu solicitud.</span>
            </h2>
            <p className="mt-2 text-lg leading-relaxed text-muted">Estos son los próximos pasos:</p>
          </div>
        </div>

        <ol className="mt-6 space-y-5">
          {pasos.map((p, i) => (
            <li key={p.titulo} className="flex gap-4">
              <span
                aria-hidden
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-display font-bold text-primary-foreground"
              >
                {i + 1}
              </span>
              <div className="pt-1.5">
                <p className="font-display font-semibold text-foreground">
                  <span className="sr-only">Paso {i + 1}: </span>
                  {p.titulo}
                </p>
                <p className="mt-1 text-base leading-relaxed text-muted">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href="/agendar/" className={botonPrimario}>
            Agendar valoración inicial
            <ArrowRight aria-hidden className="size-5" strokeWidth={1.75} />
          </Link>
          <p className="text-sm text-muted">
            Demostración: puedes ver esta solicitud en el{" "}
            <Link href="/panel/" className="font-semibold text-primary underline underline-offset-2">
              panel profesional
            </Link>
            .
          </p>
        </div>
      </div>

      {state.prioridad === "prioritaria" && (
        <section aria-labelledby="ayuda-prioritaria" className="space-y-4 pt-2">
          <h3 id="ayuda-prioritaria" className="font-display text-xl font-semibold text-foreground">
            Si en algún momento sientes que estás en peligro, no esperes:
          </h3>
          <CrisisLines />
        </section>
      )}

      <div className="flex items-start gap-4 rounded-3xl bg-primary-soft p-5 sm:p-6">
        <IconoCirculo icon={Heart} tone="accent" size="sm" />
        <p className="text-base leading-relaxed text-foreground">
          <strong className="font-display">Recuerda:</strong> buscar ayuda es un acto de autocuidado y valentía.
        </p>
      </div>
    </div>
  );
}

function Seccion({ paso, titulo, children }: { paso: number; titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className={`${tarjeta} min-w-0 p-5 sm:p-7`}>
      <legend className="float-left mb-5 flex w-full items-center gap-3 font-display text-xl font-semibold text-foreground">
        <span
          aria-hidden
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display text-base font-bold text-primary"
        >
          {paso}
        </span>
        <span>
          <span className="sr-only">Paso {paso} de 5: </span>
          {titulo}
        </span>
      </legend>
      <div className="clear-left space-y-6">{children}</div>
    </fieldset>
  );
}

type AriaCampo = { id: string; "aria-invalid"?: true; "aria-describedby"?: string };

function Field({
  id, label, hint, error, children,
}: { id: string; label: string; hint?: string; error?: string; children: (a: AriaCampo) => React.ReactNode }) {
  const hintId = hint ? `${id}-ayuda` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div data-campo className="scroll-mt-6">
      <label htmlFor={id} className="block text-base font-medium text-foreground">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="mt-0.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {error && errorId && <MensajeError id={errorId}>{error}</MensajeError>}
    </div>
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={`${inputCls} appearance-none pr-11`}>
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 mt-1 size-5 -translate-y-1/2 text-muted"
        strokeWidth={1.75}
      />
    </div>
  );
}

function MensajeError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-danger">
      <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
      <span>{children}</span>
    </p>
  );
}

const opcionCls =
  "group flex min-h-11 cursor-pointer items-center gap-3 rounded-full border border-border-strong bg-surface px-4 py-2.5 text-base text-foreground transition-colors hover:bg-surface-muted has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:checked]:font-semibold has-[:checked]:ring-2 has-[:checked]:ring-primary";

function Radios({
  name, label, options, defaultValue, error,
}: { name: string; label: string; options: [string, string][]; defaultValue?: string; error?: string }) {
  const errorId = `campo-${name}-error`;
  return (
    <fieldset data-campo aria-invalid={error ? true : undefined} className="min-w-0 scroll-mt-6">
      <legend className="text-base font-medium leading-relaxed text-foreground">
        {label}
      </legend>
      <div className="mt-3 flex flex-wrap gap-3">
        {options.map(([value, text]) => (
          <label key={value} htmlFor={`campo-${name}-${value}`} className={opcionCls}>
            <input
              id={`campo-${name}-${value}`}
              type="radio"
              name={name}
              value={value}
              required
              defaultChecked={defaultValue === value}
              aria-describedby={error ? errorId : undefined}
              className="size-5 shrink-0 accent-primary"
            />
            {text}
            <Check aria-hidden className="hidden size-4 text-primary group-has-[:checked]:block" strokeWidth={2.5} />
          </label>
        ))}
      </div>
      {error && <MensajeError id={errorId}>{error}</MensajeError>}
    </fieldset>
  );
}

function Casilla({
  id, name, error, defaultChecked, children,
}: { id: string; name: string; error?: string; defaultChecked?: boolean; children: React.ReactNode }) {
  const errorId = `${id}-error`;
  return (
    <div data-campo className="scroll-mt-6">
      <div className="group flex items-start gap-3 rounded-2xl border border-border-strong bg-surface p-4 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:checked]:ring-2 has-[:checked]:ring-primary">
        <span className="flex size-6 shrink-0 items-center justify-center">
          <input
            id={id}
            type="checkbox"
            name={name}
            required
            defaultChecked={defaultChecked}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="size-5 cursor-pointer accent-primary"
          />
        </span>
        <label htmlFor={id} className="flex-1 cursor-pointer text-base leading-relaxed text-foreground">
          {children}
        </label>
        <Check aria-hidden className="mt-1 hidden size-5 shrink-0 text-primary group-has-[:checked]:block" strokeWidth={2.5} />
      </div>
      {error && <MensajeError id={errorId}>{error}</MensajeError>}
    </div>
  );
}
