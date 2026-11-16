<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Contexto del proyecto

Plataforma de un centro virtual de atención psicológica (Colombia). Antes de cambiar contenidos o flujos, lee:

- `docs/macpi.md`: modelo clínico del centro (MACPI). Es la referencia conceptual de cualquier contenido clínico.
- `docs/modelo-de-servicio.md`: decisiones de producto, recorrido, tamizaje, normativa y hoja de ruta.

Reglas que no se negocian:

- La prioridad automática del formulario es un filtro de enrutamiento, nunca una valoración clínica.
- El sitio no es un servicio de urgencias: las rutas de ayuda inmediata deben estar siempre a la vista.
- La demo usa solo datos ficticios en el navegador. No se conecta a ninguna base de datos sin una decisión explícita.
