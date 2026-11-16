# Mind Balanced: plataforma web

Plataforma de un centro virtual de atención psicológica para jóvenes y adultos.
Las videollamadas se hacen por Meet, Zoom o Teams, y la agenda por Cal.com o Calendly. Esta app se encarga del recorrido de la persona usuaria, la admisión, el tamizaje de riesgo y los consentimientos.

El modelo de servicio, las decisiones y la hoja de ruta están en [`docs/modelo-de-servicio.md`](docs/modelo-de-servicio.md).

## Stack

- Next.js 16 (App Router), React 19, TypeScript y Tailwind CSS 4
- Zod para validar los formularios
- Supabase (Postgres) para guardar las solicitudes (opcional en desarrollo)

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completa los valores
npm run dev
```

Sin las variables de Supabase, el formulario funciona en **modo demostración** y no guarda nada.

## Base de datos

Aplica `supabase/migrations/0001_solicitudes.sql` en tu proyecto de Supabase. La tabla tiene RLS activo y ninguna política pública. Solo el servidor accede, con la service role key, que nunca se expone al navegador.

## Rutas

| Ruta | Contenido |
|---|---|
| `/` | Inicio |
| `/servicios` | Las cuatro líneas de atención |
| `/como-funciona` | Recorrido y requisitos de la atención virtual |
| `/solicitar` | Formulario de admisión con tamizaje de seguridad |
| `/agendar` | Agenda incrustada (Cal.com o Calendly) |
| `/ayuda-inmediata` | Líneas de emergencia y salud mental |
| `/consentimiento`, `/privacidad` | Borradores legales (requieren revisión) |
