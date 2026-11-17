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

**Solo modo claro.** El sitio y la plataforma no tienen modo oscuro (`color-scheme: light`). Los fondos son muy claros (blanco y lavanda casi blanco), y el color de marca vive en botones, íconos, títulos y detalles.

| Rol | Token | Valor | Uso |
|---|---|---|---|
| Fondo | `background` / `surface` | `#FFFFFF` | Fondo general y tarjetas. |
| Neutro | `surface-muted` / `secondary-soft` | `#FAF8FE` | Secciones alternas y paneles. Transmite claridad y espacio. |
| Principal | `primary` | `#4C3A99` | Botones, enlaces, títulos de marca y foco. Transmite confianza y profesionalismo. |
| Principal suave | `primary-soft` | `#F4F1FD` | Fondos de íconos, estados seleccionados y tarjetas destacadas. |
| Secundario (lavanda) | `secondary` | `#B7A6E6` | **Solo decorativo**: formas, ilustración y símbolo. Transmite calma. |
| Acento (verde) | `accent` | `#4FA88B` | **Solo decorativo**: hojas, detalles y símbolo. Transmite esperanza y bienestar. |
| Acento para texto | `accent-ink` / `accent-soft` | `#23705A` / `#F0F9F5` | Texto o íconos verdes que deben leerse, y su fondo suave. |
| Texto | `foreground` | `#1F1B3D` | Texto principal. |
| Texto secundario | `muted` | `#57537A` | Descripciones y metadatos. |
| Borde de control | `border-strong` | `#8A83B0` | Bordes de inputs, selects y checkboxes (≥ 3:1). |
| Borde decorativo | `border` | `#DDD7F0` | Separadores y contornos de tarjetas (no cumple 3:1; no usar para controles). |
| Navegación lateral | `sidebar` / `sidebar-foreground` | `#F8F6FE` / `#4C3A99` | Barra lateral clara de la plataforma, con texto violeta y borde a la derecha. |
| Aviso | `warning-soft` | `#FFF9EB` | Avisos de demostración y prioridad "prioritaria". |
| Peligro | `danger` / `danger-soft` | `#B3261E` / `#FEF4F3` | Riesgo, crisis y errores. **Reservado**: no se usa como decoración. |

### Contraste verificado (WCAG 2.1)

| Par | Contraste |
|---|---|
| Texto sobre fondo | 16.4 |
| Texto secundario sobre fondo | 7.2 |
| Texto secundario sobre neutro | 6.8 |
| Principal sobre fondo | 8.9 |
| Principal sobre principal suave | 7.9 |
| Principal sobre barra lateral | 8.3 |
| Texto de botón sobre principal | 8.9 |
| Acento para texto sobre su fondo suave | 5.5 |
| Peligro sobre peligro suave | 6.1 |
| Borde de control sobre neutro | 3.4 |

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
- Funciona desde 24 px.

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

## Componentes de estilo

Las clases repetidas viven en `src/components/marca/estilos.ts`. Impórtalas en lugar de copiar cadenas de Tailwind (el panel puede seguir importándolas desde `src/components/panel/ui.tsx`, que las reexporta).

| Constante | Uso |
|---|---|
| `botonPrimario` | Acción principal (botón o enlace): píldora `rounded-full`, `min-h-11`, Montserrat semibold, `bg-primary` con `hover:bg-primary-hover`. |
| `botonSecundario` | Acción secundaria: misma forma, fondo `surface`, texto `primary` y contorno `border-strong` (≥ 3:1). |
| `enlaceFlecha` | Enlace de texto con flecha ("Ver más →"), área táctil de 44 px. |
| `tarjeta` | Tarjeta blanca `rounded-3xl` con contorno `border` y sombra `shadow-card`. |
| `control` | Inputs, selects y textareas: borde `border-strong`, foco en `primary` y error (`aria-invalid`) en `danger`. |

- La sombra de tarjeta es el token `--shadow-card` de `globals.css` (clase `shadow-card`): con un tinte violeta muy sutil.
- Los botones no definen su propio foco: heredan el contorno global de 3 px en `primary`.
- Para variar tamaño o ancho, añade utilidades de margen o ancho (`mt-6`, `w-full`); no redefinas color, forma ni tipografía.

## Accesibilidad (obligatorio)

- WCAG 2.1 AA como mínimo (solo modo claro).
- Foco visible en todos los elementos interactivos (contorno de 3 px en `primary`).
- Áreas táctiles de 44 × 44 px como mínimo en móvil.
- Respeta `prefers-reduced-motion`.
- No transmitir información solo con color: la prioridad y el estado siempre llevan texto.
- Formularios con etiquetas visibles y errores asociados al campo.
- Sin desplazamiento horizontal a 320 px de ancho.
