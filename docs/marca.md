# Sistema de marca: Mind Balanced

**Nombre:** Mind Balanced
**Descriptor:** Centro Virtual de Atención Psicológica
**Lema:** Tu bienestar también es una prioridad
**Principio rector (MACPI):** Comprender a la persona en su contexto, intervenir con rigor científico y acompañar con sensibilidad humana.
**Síntesis del método:** Comprender · Intervenir · Acompañar

## Dirección

- **Propuesta 1 → base del sistema de marca:** paleta, tipografía, símbolo, iconografía en círculos suaves, el diagrama del modelo (Clínico, Psicosocial y Persona) y la lista de valores.
- **Propuesta 2 → inspiración para la plataforma de atención:** navegación lateral violeta, tarjetas blancas sobre fondo lavanda, formas orgánicas, pasos numerados y mensajes de acompañamiento.
- **Carácter:** adulto, inclusivo y sereno. Nada infantil ni saturado. Contraste suficiente para un uso real, también con baja visión o pantallas de baja calidad.

## Color

Los tokens están en `src/app/globals.css`. Úsalos siempre a través de las clases de Tailwind (`bg-primary`, `text-muted`…), nunca con valores hexadecimales sueltos.

| Rol | Token | Claro | Oscuro | Uso |
|---|---|---|---|---|
| Principal | `primary` | `#4C3A99` | `#BBA9F2` | Botones, enlaces, títulos de marca, foco. Transmite confianza y profesionalismo. |
| Principal suave | `primary-soft` | `#ECE7FA` | `#2E2758` | Fondos de íconos, estados seleccionados, tarjetas destacadas. |
| Secundario (lavanda) | `secondary` | `#B7A6E6` | `#6F5FB8` | **Solo decorativo**: formas, ilustración y símbolo. Transmite calma. |
| Acento (verde) | `accent` | `#4FA88B` | `#4FA88B` | **Solo decorativo**: hojas, detalles y símbolo. Transmite esperanza y bienestar. |
| Acento para texto | `accent-ink` | `#23705A` | `#82D3B7` | Texto o íconos verdes que deben leerse. |
| Neutro | `surface-muted` / `secondary-soft` | `#F3F0FB` | `#262249` | Secciones y paneles. Transmite claridad y espacio. |
| Texto | `foreground` | `#1F1B3D` | `#EEECF8` | Texto principal. |
| Texto secundario | `muted` | `#57537A` | `#B3AED0` | Descripciones y metadatos. |
| Borde de control | `border-strong` | `#8A83B0` | `#756F9C` | Bordes de inputs, selects y checkboxes (≥ 3:1). |
| Borde decorativo | `border` | `#DDD7F0` | `#39345E` | Separadores y contornos de tarjetas (no cumple 3:1; no usar para controles). |
| Peligro | `danger` / `danger-soft` | `#B3261E` / `#FCEBEA` | `#F2A49C` / `#3B1F25` | Riesgo, crisis y errores. **Reservado**: no se usa como decoración. |

### Contraste verificado (WCAG 2.1)

| Par | Claro | Oscuro |
|---|---|---|
| Texto sobre fondo | 15.9 | 15.7 |
| Texto secundario sobre fondo | 7.0 | 8.6 |
| Texto secundario sobre neutro | 6.4 | 7.0 |
| Principal sobre fondo | 8.6 | 8.8 |
| Texto de botón sobre principal | 8.9 | 8.4 |
| Acento para texto sobre blanco | 5.9 | 9.5 |
| Peligro sobre peligro suave | 5.7 | 7.5 |
| Borde de control sobre blanco | 3.5 | 3.6 |

El verde (`#4FA88B`, 2.9:1) y el lavanda (`#B7A6E6`, 2.2:1) **no** llegan a 3:1 sobre blanco: nunca deben llevar texto ni marcar límites de controles.

## Tipografía

| Uso | Fuente | Clase |
|---|---|---|
| Títulos, marca y elementos principales | **Montserrat** 500–700 | `font-display` |
| Texto y contenido | **Inter** | `font-sans` (por defecto) |

- Texto base de 16 px como mínimo; descripciones de 14 px como mínimo. Nada informativo por debajo de 12 px.
- Interlineado generoso (`leading-relaxed`) en párrafos largos. Líneas de 60 a 75 caracteres.
- La tipografía manuscrita de las propuestas ("Aquí estamos para apoyarte") **no** se usa en texto: es difícil de leer y poco accesible. Su calidez se traslada al tono de los mensajes.

## Símbolo y logotipo

`src/components/marca/Logo.tsx`

- **Símbolo:** un corazón formado por dos hojas (verde de crecimiento y lavanda de calma) que una figura humana violeta rodea y sostiene.
- **Logotipo:** el símbolo, el nombre en Montserrat Bold y el descriptor debajo.
- **Versiones:** completa (`<Logo />`), compacta sin descriptor (`<Logo compact />`) e inversa sobre violeta (`<Logo inverse />`).
- Se adapta solo al modo oscuro. Funciona desde 24 px.

## Iconografía

- Librería **Lucide** (`lucide-react`), trazo de 1.75, esquinas redondeadas.
- Van dentro de círculos suaves: `IconoCirculo` en `src/components/marca/Decor.tsx`, con tono `primary` o `accent`.
- Íconos de referencia: `Brain` (salud mental), `Users` (personas), `ShieldCheck` (seguridad), `Sprout` (crecimiento), `MessageCircle` (comunicación), `CalendarDays` (agenda), `Laptop` (virtualidad) y `Heart` (bienestar).
- Los íconos son decorativos (`aria-hidden`) y siempre van con texto visible. Un botón que solo tiene ícono necesita `aria-label`.

## Formas e ilustración

- Formas orgánicas suaves (`Blob`) en lavanda, verde o violeta muy claros, siempre detrás del contenido.
- Ramas con hojas (`Rama`) como eco del símbolo.
- **Fotos o ilustraciones de personas:** no se incluyen todavía. Si se agregan, deben mostrar diversidad real (edad, cuerpo, color de piel, discapacidad), con escenas tranquilas y sin dramatizar el sufrimiento.

## Tono de voz

- Cercano y respetuoso. Tutea, sin infantilizar.
- Claro sobre los alcances: no se promete lo que el servicio no ofrece.
- Valida sin dramatizar: "Buscar ayuda es un acto de autocuidado", no "¡Estás roto/a!".
- Lenguaje inclusivo y sin estigma: "persona que consulta", no "paciente problemático".

### Lo que las propuestas sugerían y el servicio NO ofrece todavía

No usar estos textos hasta que existan los servicios correspondientes:

- Atención "por chat": hoy solo hay formulario y videollamada.
- Sesiones "familiares o de pareja": las líneas actuales son individuales y grupales psicoeducativas.
- "Contamos con profesionales especializados en…": no lo afirmes sin el equipo definido.

## Valores del centro

| Valor | Mensaje |
|---|---|
| Respeto | Valoramos la diversidad y la individualidad. |
| Confidencialidad | Protegemos tu información y tu proceso. |
| Ética | Actuamos con responsabilidad y transparencia. |
| Evidencia | Tomamos decisiones basadas en la mejor evidencia científica. |
| Accesibilidad | Estamos aquí, sin barreras. |

## Accesibilidad (obligatorio)

- WCAG 2.1 AA como mínimo, en modo claro y oscuro.
- Foco visible en todos los elementos interactivos (contorno de 3 px en `primary`).
- Áreas táctiles de 44 × 44 px como mínimo en móvil.
- Respeta `prefers-reduced-motion`.
- No transmitir información solo con color: la prioridad y el estado siempre llevan texto.
- Formularios con etiquetas visibles y errores asociados al campo.
- Sin desplazamiento horizontal a 320 px de ancho.
