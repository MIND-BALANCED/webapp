-- Panel profesional: equipo, citas, bitácora y reglas de acceso (RLS).
--
-- Principios:
--  * Solo personas del equipo (tabla profesionales, activo = true) acceden.
--  * Toda lectura/escritura del equipo exige sesión con 2FA (aal2).
--  * admin ve todo; profesional ve sus casos asignados y la cola sin asignar.
--  * La bitácora es de solo agregar: nadie puede editar ni borrar eventos.
--  * Los cambios de estado y asignación se registran automáticamente (trigger).

create type rol_equipo as enum ('admin', 'profesional');

create table public.profesionales (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  email text not null,
  rol rol_equipo not null default 'profesional',
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.solicitudes
  add constraint solicitudes_profesional_fk
  foreign key (profesional_asignado) references public.profesionales (id) on delete set null;

create index solicitudes_email_idx on public.solicitudes (lower(email));
create index solicitudes_asignado_idx on public.solicitudes (profesional_asignado);

create type estado_cita as enum ('programada', 'cancelada', 'reprogramada');

create table public.citas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  solicitud_id uuid references public.solicitudes (id) on delete set null,
  proveedor text not null check (proveedor in ('cal', 'calendly')),
  external_id text not null,
  email text not null,
  inicio timestamptz not null,
  fin timestamptz,
  estado estado_cita not null default 'programada',
  enlace_videollamada text,
  unique (proveedor, external_id)
);

create index citas_solicitud_idx on public.citas (solicitud_id);

create table public.solicitud_eventos (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  solicitud_id uuid not null references public.solicitudes (id) on delete cascade,
  autor uuid references public.profesionales (id) on delete set null, -- null = sistema
  tipo text not null check (tipo in ('creada', 'estado', 'asignacion', 'nota', 'cita')),
  detalle text check (char_length(detalle) <= 4000)
);

create index solicitud_eventos_solicitud_idx on public.solicitud_eventos (solicitud_id, created_at);

-- ── Funciones auxiliares ──────────────────────────────────────────────

create function public.mi_rol() returns rol_equipo
language sql stable security definer set search_path = ''
as $$
  select rol from public.profesionales where id = auth.uid() and activo
$$;

create function public.sesion_con_2fa() returns boolean
language sql stable set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
$$;

-- ── Bitácora automática ──────────────────────────────────────────────

create function public.registrar_cambios_solicitud() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_autor uuid := (select id from public.profesionales where id = auth.uid());
begin
  if tg_op = 'INSERT' then
    insert into public.solicitud_eventos (solicitud_id, tipo, detalle)
    values (new.id, 'creada', 'Prioridad: ' || new.prioridad);
    return new;
  end if;

  if new.estado is distinct from old.estado then
    insert into public.solicitud_eventos (solicitud_id, autor, tipo, detalle)
    values (new.id, v_autor, 'estado', old.estado || ' → ' || new.estado);
  end if;

  if new.profesional_asignado is distinct from old.profesional_asignado then
    insert into public.solicitud_eventos (solicitud_id, autor, tipo, detalle)
    values (
      new.id, v_autor, 'asignacion',
      coalesce((select nombre from public.profesionales where id = new.profesional_asignado), 'Sin asignar')
    );
  end if;

  return new;
end;
$$;

create trigger solicitudes_bitacora
  after insert or update on public.solicitudes
  for each row execute function public.registrar_cambios_solicitud();

-- ── Permisos base ────────────────────────────────────────────────────
-- Supabase concede todo a anon/authenticated por defecto; lo restringimos
-- y dejamos solo lo que el panel necesita. RLS filtra las filas.

revoke all on public.solicitudes, public.profesionales, public.citas, public.solicitud_eventos from anon, authenticated;

grant select on public.solicitudes, public.profesionales, public.citas, public.solicitud_eventos to authenticated;
grant update (estado, profesional_asignado) on public.solicitudes to authenticated;
grant insert (solicitud_id, autor, tipo, detalle) on public.solicitud_eventos to authenticated;

alter table public.profesionales enable row level security;
alter table public.citas enable row level security;
alter table public.solicitud_eventos enable row level security;

-- ── Políticas ────────────────────────────────────────────────────────

create policy "equipo ve al equipo" on public.profesionales
  for select to authenticated
  using (public.sesion_con_2fa() and public.mi_rol() is not null);

create policy "equipo ve solicitudes según rol" on public.solicitudes
  for select to authenticated
  using (
    public.sesion_con_2fa() and (
      public.mi_rol() = 'admin'
      or (public.mi_rol() = 'profesional' and (profesional_asignado = auth.uid() or profesional_asignado is null))
    )
  );

create policy "equipo actualiza solicitudes según rol" on public.solicitudes
  for update to authenticated
  using (
    public.sesion_con_2fa() and (
      public.mi_rol() = 'admin'
      or (public.mi_rol() = 'profesional' and (profesional_asignado = auth.uid() or profesional_asignado is null))
    )
  )
  with check (
    public.sesion_con_2fa() and (
      public.mi_rol() = 'admin'
      or (public.mi_rol() = 'profesional' and (profesional_asignado = auth.uid() or profesional_asignado is null))
    )
  );

-- Citas y eventos heredan la visibilidad de la solicitud (la subconsulta aplica su RLS).
create policy "equipo ve citas de solicitudes visibles" on public.citas
  for select to authenticated
  using (
    public.sesion_con_2fa() and public.mi_rol() is not null
    and (
      exists (select 1 from public.solicitudes s where s.id = solicitud_id)
      or (solicitud_id is null and public.mi_rol() = 'admin')
    )
  );

create policy "equipo ve eventos de solicitudes visibles" on public.solicitud_eventos
  for select to authenticated
  using (
    public.sesion_con_2fa()
    and exists (select 1 from public.solicitudes s where s.id = solicitud_id)
  );

create policy "equipo agrega notas propias" on public.solicitud_eventos
  for insert to authenticated
  with check (
    public.sesion_con_2fa()
    and public.mi_rol() is not null
    and tipo = 'nota'
    and autor = auth.uid()
    and exists (select 1 from public.solicitudes s where s.id = solicitud_id)
  );
