# Mind Balanced: plataforma web

Plataforma de un centro virtual de atención psicológica para jóvenes y adultos.
Las videollamadas se hacen por Meet, Zoom o Teams, y la agenda por Cal.com o Calendly. Esta app se encarga del recorrido de la persona usuaria, la admisión, el tamizaje de riesgo, los consentimientos y la gestión de casos del equipo.

El modelo de servicio, las decisiones y la hoja de ruta están en [`docs/modelo-de-servicio.md`](docs/modelo-de-servicio.md).

## Estado actual: demostración estática

La app se publica en **GitHub Pages** como sitio estático y funciona con **datos ficticios**:

- El formulario de admisión y el panel profesional guardan todo en el `localStorage` del navegador. Nada sale del dispositivo.
- El ingreso al panel es simulado: eliges un perfil de demostración (coordinación o profesional).
- Las reglas de acceso del panel (`src/lib/panel/permisos.ts`) replican las políticas de la base de datos real.

Todavía no hay base de datos conectada. El esquema de Supabase está diseñado y probado en `supabase/migrations/`, pero no se ha aplicado en ningún proyecto.

## Stack

- Next.js 16 (App Router, exportación estática), React 19, TypeScript y Tailwind CSS 4
- Zod para validar los formularios

## Desarrollo

```bash
npm install
npm run dev
```

Abre http://localhost:3000. El panel está en http://localhost:3000/panel.

## Despliegue en GitHub Pages

El workflow `.github/workflows/pages.yml` compila y publica el sitio en cada push a la rama por defecto.

Configuración que se hace una sola vez:

1. En el repositorio, ve a **Settings → Pages → Build and deployment → Source** y elige **GitHub Actions**.
2. (Opcional) En **Settings → Secrets and variables → Actions → Variables**, crea `NEXT_PUBLIC_SCHEDULING_URL` con tu enlace de Cal.com o Calendly.

El sitio queda en `https://<organización>.github.io/webapp/`.

> En una organización con plan gratuito, GitHub Pages solo funciona con repositorios **públicos**. Con un plan Team o Enterprise funciona también con repositorios privados, pero el sitio publicado sigue siendo público.

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
| `/panel` | Bandeja de solicitudes del equipo |
| `/panel/solicitud?id=…` | Ficha de la solicitud: gestión, citas y bitácora |

## Panel profesional

- **Coordinación (admin):** ve todas las solicitudes y asigna casos a cualquier profesional.
- **Profesional:** ve sus casos y la cola sin asignar. Puede tomar o liberar casos, pero no asignarlos a otra persona.
- **Bandeja:** ordenada por prioridad (urgente → prioritaria → regular) y antigüedad, con alerta de urgentes sin atender.
- **Bitácora:** registra solos los cambios de estado, las asignaciones y las citas. Las notas no se pueden editar ni borrar.
- **Citas:** en producción llegarán por webhook desde Cal.com o Calendly; en la demo se registran a mano.

## Base de datos (diseño para la siguiente fase)

`supabase/migrations/` contiene el esquema con RLS:

- Toda lectura del equipo exige sesión con **2FA** (`aal2`).
- Las reglas por rol son las mismas que en la demo.
- Los permisos van columna por columna: el equipo solo puede cambiar `estado` y `profesional_asignado`.
- La bitácora se genera con un trigger y es de solo agregar.

Las migraciones se probaron contra un Postgres 16 local con un esquema `auth` simulado.
