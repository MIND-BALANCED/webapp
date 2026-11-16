# Modelo de servicio — Mind Balanced

Centro virtual de atención psicológica para jóvenes y adultos. Este documento recoge las decisiones de diseño y lo que falta por definir. Es la guía para construir la plataforma.

El modelo clínico del centro está en [`macpi.md`](macpi.md): **Modelo de Atención Clínico-Psicosocial Integrado (MACPI)**. Su principio rector es *comprender a la persona en su contexto, intervenir con rigor científico y acompañar con sensibilidad humana*.

## 1. Decisiones tomadas

| Decisión | Elección |
|---|---|
| Tipo de dispositivo | **Centro virtual de atención psicológica**: varias líneas de atención y posibilidad de sumar profesionales. |
| Videollamadas | Proveedor externo: Google Meet, Zoom o Microsoft Teams. La plataforma no transmite video. |
| Agenda | Proveedor externo: Cal.com, Calendly o similar, integrado por enlace o iframe (`NEXT_PUBLIC_SCHEDULING_URL`). |
| Alcance de la plataforma | Recorrido de la persona usuaria, admisión, tamizaje de riesgo, consentimientos, gestión de casos y (más adelante) historia clínica. |
| Modelo clínico | **MACPI** (borrador v1.0): contextual, pluralista y orientado por evidencia. Seis fases y tres niveles de intervención. Ver [`macpi.md`](macpi.md). |
| Publicación actual | Demostración estática en GitHub Pages, con datos ficticios en el navegador. Sin base de datos conectada. |

## 2. Líneas de atención

1. **Orientación psicológica**: intervención breve, de 1 a 3 encuentros.
2. **Atención psicológica individual**: proceso estructurado con objetivos y seguimiento.
3. **Promoción y prevención**: talleres y recursos psicoeducativos.
4. **Acompañamiento psicosocial**: integra el contexto familiar, educativo, laboral y social.

## 3. Población

- **MVP: 18 años o más.** La validación está en `src/lib/site.ts` (`minAge`) y en la base de datos.
- **Pendiente:** decidir si se atienden personas de 14 a 17 años. Implicaría el consentimiento del representante legal, el asentimiento del menor, una ruta de protección (ICBF, línea 141) y un formulario diferenciado.

## 4. Recorrido y su soporte en la plataforma

| Paso | En la plataforma |
|---|---|
| 01 Descubrimiento | `/`, `/servicios`, `/como-funciona` |
| 02 Contacto y acogida | `/solicitar`: formulario de admisión |
| 03 Admisión y valoración inicial | Tamizaje de seguridad → prioridad (`urgente` / `prioritaria` / `regular`) → `/agendar` |
| 04 Plan de acompañamiento | Panel: asignación de profesional, estados y notas en la bitácora |
| 05 Atención y seguimiento | Videollamada externa y citas en la ficha. *Fase 3: notas de sesión e instrumentos de seguimiento* |
| 06 Cierre o remisión | Panel: estados `remitida` y `cerrada` |

### Correspondencia con las fases del MACPI

| Fase MACPI | Soporte actual | Pendiente en la plataforma |
|---|---|---|
| 01 Acogida y admisión | Formulario, tamizaje, consentimientos y prioridad | Verificar la **ubicación** durante la atención y registrar un **contacto de emergencia** (MACPI §8) |
| 02 Evaluación clínica y psicosocial | Notas en la bitácora | Entrevista inicial estructurada e instrumentos (PHQ-9, GAD-7, WHODAS 2.0) |
| 03 Formulación compartida | — | **Ficha de formulación MACPI** de 8 campos, que separe hechos, observaciones, hipótesis y decisiones (MACPI §6) |
| 04 Intervención individualizada | Asignación de profesional | Plan de intervención: nivel (I, II o III), ruta según la matriz de decisión (MACPI §5) y estrategias |
| 05 Seguimiento y ajuste | Citas y bitácora | Medidas de resultados, logro de objetivos y alianza terapéutica (MACPI §9) |
| 06 Cierre y continuidad | Estados `cerrada` y `remitida` | Plan de mantenimiento, señales de alerta y remisión documentada |

> La matriz de decisión del MACPI orienta las rutas, pero **la decisión nunca depende solo del formulario**: la prioridad automática es un filtro de enrutamiento y siempre la revisa un profesional.

## 5. Tamizaje de seguridad (en la admisión)

Tres preguntas: ideación en las últimas dos semanas, plan o intención actual, y violencia o peligro actual.

- **Urgente** (hay plan o intención, o hay violencia): se muestran de inmediato las líneas de emergencia, no se ofrece la agenda y el caso queda marcado para contacto prioritario.
- **Prioritaria** (hay ideación, o la persona prefirió no responder): contacto en menos de 24 horas hábiles. Se ofrecen la agenda y las líneas de ayuda.
- **Regular**: flujo normal, con contacto en 2 días hábiles.

> Es un filtro de enrutamiento y **no reemplaza la valoración clínica del riesgo**. El protocolo de crisis (pendiente) debe definir quién revisa las solicitudes urgentes, en cuánto tiempo y cómo se documenta.

## 6. Protocolos por redactar

- [ ] Recepción, admisión y valoración inicial
- [ ] Orientación psicológica breve
- [ ] Evaluación e intervención psicológica
- [ ] Atención de crisis, valoración del riesgo suicida y rutas de emergencia
- [x] Consentimiento informado para atención virtual (borrador en `/consentimiento`)
- [x] Política de tratamiento de datos (borrador en `/privacidad`)
- [ ] Historia clínica, custodia y confidencialidad
- [ ] Remisión, seguimiento y cierre

## 7. Marco normativo a revisar (Colombia)

- Ley 1090 de 2006: ejercicio de la psicología y Código Deontológico y Bioético.
- Ley 1419 de 2010 y Resolución 2654 de 2019: telesalud y telemedicina.
- Ley 1581 de 2012 y Decreto 1377 de 2013: protección de datos personales (los datos de salud son sensibles).
- Resolución 1995 de 1999 y Ley 2015 de 2020: historia clínica (y su interoperabilidad).
- Resolución 3100 de 2019: habilitación de servicios de salud, si aplica según cómo se constituya el centro.
- Ley 1616 de 2013: salud mental.

## 8. Hoja de ruta técnica

**Fase 1 (MVP): hecha**
- Sitio institucional, servicios, recorrido y ayuda inmediata.
- Formulario de admisión con validación, tamizaje y consentimientos (con versión y fecha).
- Agenda integrada (Cal.com o Calendly).

**Fase 2: panel profesional (demostración hecha)**
- [x] Bandeja de solicitudes por prioridad, con alerta de urgentes sin atender.
- [x] Roles de coordinación y profesional, con reglas de visibilidad.
- [x] Asignación, cambio de estado, notas y bitácora automática e inmutable.
- [x] Registro de citas en la ficha.
- [x] Esquema de base de datos con RLS, 2FA obligatorio y permisos por columna (diseñado y probado en local).
- [ ] Conectar Supabase: inicio de sesión real con 2FA y reemplazo del almacén de demostración.
- [ ] Webhook de Cal.com o Calendly para vincular citas automáticamente (requiere un servidor: Vercel o Supabase Edge Functions).
- [ ] Notificación al equipo cuando entra una solicitud urgente (correo o WhatsApp).
- [ ] Gestión del equipo (invitar o desactivar profesionales).

**Fase 3: historia clínica y seguimiento**
- Historia clínica con cifrado, auditoría de accesos y retención según la norma.
- Instrumentos de seguimiento de resultados (por ejemplo PHQ-9, GAD-7 o CORE-10, revisando licencias).
- Indicadores del servicio: tiempos de respuesta, adherencia, satisfacción y resultados.

**Fase 4: promoción y prevención**
- Catálogo de talleres e inscripciones.
- Biblioteca de recursos psicoeducativos.

## 9. Decisiones pendientes

1. ¿Se atenderá a menores de 18 años?
2. ~~Enfoque o modelo terapéutico principal~~ → resuelto en principio con el MACPI (borrador v1.0); falta su validación profesional.
3. Tarifas y medios de pago (por ejemplo Wompi, Mercado Pago o el cobro integrado de Cal.com).
4. Forma jurídica del centro (persona natural o jurídica, habilitación como prestador).
5. Horarios y tiempos de respuesta comprometidos.
6. Verificar la vigencia de las líneas de ayuda en `src/lib/site.ts`.
7. Dónde alojar la versión real: GitHub Pages solo sirve archivos estáticos, así que la base de datos, los webhooks y las alertas necesitarán un backend (por ejemplo Supabase con Edge Functions, o Vercel).
