# Agenda - Proyecto Aether Analytics / Nordvital Dashboard

## 📋 Resumen General
Dashboard analítico con tres secciones (SaaS, E-commerce/Nordvital, carga de CSV). Enfoque en visualización y filtrado de datos médicos, métricas y separación clara de dashboards.

---

## 🎨 Estilos y Configuración
- Variables CSS principales: `--bg-900`, `--bg-800`, `--card-bg`, `--muted`, `--text-main`, `--color-primary`, `--accent`, `--glass-border`.
- Fuentes: **Outfit** para títulos y **Inter** para cuerpo.
- Efectos: glassmorphism (`backdrop-filter: blur(16px)`), foco glow en inputs/selects, gradientes y orbs difuminados en fondo.

---

## 🔧 Filtros Nordvital
Filtros implementados en `index.html` dentro de la sección `#tab-ecom`:
- `filter-date-from` (Fecha Desde)
- `filter-date-to` (Fecha Hasta)
- `filter-tipo-cita` (Tipo de Atención)
- `filter-medico` (Médico)
- `filter-medico-nombre` (Nombre del Médico)
- `filter-medico-especialidad` (Especialidad del Médico)
- Botón `btn-reset-filters` para limpiar todos los filtros.

JS (en `app.js`): `state.nordvitalFilters` incluye `medicoNombre` y `medicoEspecialidad`. `applyNordvitalFilters()` aplica todos los criterios y actualiza KPIs y tabla.

---

## 🗂 Estructura de Archivos (resumen)
- `index.html` — Estructura y filtros
- `styles.css` — Variables y estilos globales (glassmorphism, filtros)
- `nordvital-data.js` — Carga de datos (window.nordvitalData)
- `dataset-data.js` — Datos de selección de internos
- `data-engine.js` — Utilidades estadísticas
- `app.js` — Lógica de filtros, tabs y charts

---

## 📊 Columnas CSV claves
- `fechacita` (YYYY-MM-DD)
- `mediconombre` (Nombre del médico)
- `medicoespecialidad` (Especialidad)
- `tipocita` / `rotulo` (Tipo atención)
- `estado_cita` (Estado de la cita)

---

## ✅ Estado Actual & Notas
- Filtros `medicoNombre` y `medicoEspecialidad` añadidos y poblados desde `nordvitalData`.
- Event listeners añadidos en `app.js` y el botón de reset limpia los nuevos campos.
- Se aplicó `Inter` con prioridad a los inputs/selects para mantener la tipografía uniforme.
- Recordar usar servidor local para evitar problemas con `fetch()` (ej. `python -m http.server 8000`).

---

## 🚀 Próximos pasos sugeridos
1. Probar filtros en navegador y validar combinaciones.
2. Añadir validaciones UX (mensaje cuando no hay registros tras filtrar).
3. Separar visibilidad de filtros por dashboard (ocultar filtros Nordvital en tab SaaS).
4. Optimizar renderizado de tabla si dataset es grande (virtualización/paginación más eficiente).

---

## 📌 Comandos útiles
Levantar servidor local desde la carpeta del proyecto:

```bash
python -m http.server 8000
```

---

Fecha de creación: 2026-05-24

---

## 🤖 Agente Roo Code añadido

- Archivo: `roo-agent.agent.md` — copia adaptada del agente del proyecto para integrarse con Roo Code.
- Config: `roo-agent.config.json` — metadatos y triggers (manual, on-demand).

El agente ayuda a mantener estilos, filtros y convenciones; antes de ejecutar cambios importantes crea una lista de TODOs y registra las acciones en este archivo.
