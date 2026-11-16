-- Solicitudes de admisión.
-- RLS activo y SIN políticas: solo el servidor (service role) puede leer/escribir.
-- El panel profesional (fase 2) añadirá políticas para usuarios autenticados del equipo.

create type prioridad_solicitud as enum ('urgente', 'prioritaria', 'regular');
create type estado_solicitud as enum ('nueva', 'en_valoracion', 'agendada', 'remitida', 'cerrada');

create table public.solicitudes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  nombre text not null,
  email text not null,
  telefono text,
  edad smallint not null check (edad between 18 and 110),
  ciudad text not null,

  linea text not null check (linea in ('orientacion', 'psicoterapia', 'prevencion', 'psicosocial', 'no_se')),
  motivo text not null check (char_length(motivo) <= 2000),
  plataforma text not null check (plataforma in ('meet', 'zoom', 'teams', 'indiferente')),
  espacio_privado text not null check (espacio_privado in ('si', 'no', 'a_veces')),

  riesgo_pensamientos text not null,
  riesgo_plan text not null,
  riesgo_violencia text not null,
  prioridad prioridad_solicitud not null,

  estado estado_solicitud not null default 'nueva',
  profesional_asignado uuid,

  acepta_datos_at timestamptz not null,
  acepta_consentimiento_at timestamptz not null,
  version_consentimiento text not null
);

create index solicitudes_pendientes_idx
  on public.solicitudes (prioridad, created_at)
  where estado = 'nueva';

alter table public.solicitudes enable row level security;
