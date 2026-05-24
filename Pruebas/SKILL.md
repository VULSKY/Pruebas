# Skill: Dashboard Nordvital IPS - Filtros Interactivos de Reportes Médicos

## 📋 Descripción General

Este skill documenta la arquitectura, componentes y procedimientos para mantener, extender y debuggear el dashboard interactivo de reportes médicos de Nordvital IPS implementado en Aether Analytics.

**Objetivo**: Proporcionar filtros interactivos y visualización de datos en tiempo real para reportes de citas médicas, tipos de atención y desempeño de médicos.

**Tecnología**: Vanilla JavaScript, Chart.js 3.x, HTML5, CSS3 (Glassmorphism)

---

## 🏗️ Arquitectura del Sistema

### Flujo de Datos
```
CSV (reporte001_*.csv) 
  ↓ [Node.js Script]
nordvital-data.js (window.nordvitalData)
  ↓ [JavaScript Loader]
app.js (initEcomSection)
  ↓ [Estado Global]
state.nordvitalFilters {dateFrom, dateTo, tipoCita, medico, filteredData, currentPage}
  ↓ [Funciones Filtrado]
applyNordvitalFilters() → updateMetrics/Charts/Table
```

### Componentes Principales

| Archivo | Responsabilidad | Línea Aproximada |
|---------|-----------------|------------------|
| `index.html` | Estructura UI, formularios, canvases | Tab E-commerce (400-600) |
| `app.js` | Lógica de filtros, eventos, charts | initEcomSection() (250-650) |
| `styles.css` | Estilos Glassmorphism, tablas, filtros | Sección .nordvital-* (1200+) |
| `nordvital-data.js` | Datos cargados (6095 registros) | Auto-generado |
| `convert-nordvital.js` | Conversión CSV → JS | Utilidad Node.js |
| `data-engine.js` | Motor estadístico | No usado actualmente |

---

## 🔧 Componentes Clave

### 1. Estado Global (`state.nordvitalFilters`)
```javascript
state.nordvitalFilters = {
  dateFrom: 'YYYY-MM-DD',           // Input fecha-desde
  dateTo: 'YYYY-MM-DD',             // Input fecha-hasta
  tipoCita: 'Control|Primer vez',   // Select dropdown
  medico: 'NOMBRE COMPLETO',        // Select dropdown
  filteredData: [],                 // Copia filtrada de datos
  currentPage: 1,                   // Página actual (paginación)
  rowsPerPage: 10                   // Registros por página
}
```

### 2. Estructura de Datos (`nordvitalData`)
Cada registro contiene:
```javascript
{
  fechacita: "2025-01-10",
  nombrecompleto: "NOMBRE PACIENTE",
  sexopaciente: "M|F",
  edadanios: 45,
  mediconombre: "DR. JUAN PÉREZ",
  medicoespecialidad: "DERMATOLOGÍA",
  estado_cita: "COMPLETADA|INCUMPLIDO",
  regimen: "Contributivo|Subsidiado",
  nombresede: "SEDE BOGOTÁ",
  tipocita: "Control|Primer vez",
  oportunidad: 36
}
```

### 3. Funciones Críticas

#### `applyNordvitalFilters()`
**Propósito**: Aplica filtros múltiples de forma combinada
**Lógica**:
1. Copia `nordvitalData` original
2. Filtra por rango de fechas (dateFrom ≤ fechacita ≤ dateTo)
3. Filtra por tipo de cita (coincidencia exacta)
4. Filtra por médico (coincidencia exacta)
5. Resetea paginación (currentPage = 1)
6. Actualiza: métricas → gráficos → tabla

```javascript
// Patrón de filtrado
const filtered = nordvitalData.filter(record => {
  if (dateFrom && record.fechacita < dateFrom) return false;
  if (dateTo && record.fechacita > dateTo) return false;
  if (tipoCita && record.tipocita !== tipoCita) return false;
  if (medico && record.mediconombre !== medico) return false;
  return true;
});
```

#### `updateNordvitalMetrics()`
**Propósito**: Calcular KPIs dinámicamente
**Métricas**:
- `totalCitas`: Count de filteredData
- `completadas`: Count donde estado_cita === "COMPLETADA"
- `incumplidas`: Count donde estado_cita === "INCUMPLIDO"
- `tasaCumplimiento`: (completadas / totalCitas) * 100

#### `updateNordvitalCharts()`
**Propósito**: Actualizar 3 gráficos Chart.js en tiempo real
- **Línea**: Citas por fecha (últimos 30 días)
- **Donut**: Distribución por tipo de atención
- **Barras**: Top 10 médicos

**Lógica de actualización**:
```javascript
if (state.charts.ecomForecast) {
  state.charts.ecomForecast.data.labels = newLabels;
  state.charts.ecomForecast.data.datasets[0].data = newData;
  state.charts.ecomForecast.update();
} else {
  // Crear nueva instancia Chart.js
}
```

#### `renderNordvitalTable()`
**Propósito**: Renderizar tabla paginada (10 registros/página)
**Columnas**: Fecha, Paciente, Edad, Médico, Especialidad, Tipo Cita, Estado, Régimen
**Mapeo de datos**:
```javascript
{
  'Fecha Cita': record.fechacita,
  'Paciente': record.nombrecompleto,
  'Edad': record.edadanios,
  'Médico': record.mediconombre,
  'Especialidad': record.medicoespecialidad,
  'Tipo de Cita': record.tipocita,
  'Estado': record.estado_cita,
  'Régimen': record.regimen
}
```

---

## 🎯 Tareas Comunes

### Agregar un Nuevo Filtro
1. **HTML**: Agregar `<select id="filter-nuevo">` en `.nordvital-filters-section`
2. **CSS**: Agregar estilos en sección `.nordvital-filters-section`
3. **JS**: En `initEcomSection()`:
   - Extraer valores únicos: `[...new Set(nordvitalData.map(d => d.campo))]`
   - Poblar dropdown dinámicamente
   - Agregar listener: `document.getElementById('filter-nuevo').addEventListener('change', ...)`
   - Actualizar `state.nordvitalFilters.nuevoFiltro`
   - Agregar lógica en `applyNordvitalFilters()`

### Cambiar Métricas KPI
Localizar en `updateNordvitalMetrics()` y modificar:
```javascript
const miMetrica = state.nordvitalFilters.filteredData
  .filter(record => /* condición */)
  .length;
document.getElementById('val-ecom-metric').textContent = miMetrica;
```

### Agregar un Nuevo Gráfico
1. Agregar canvas en HTML: `<canvas id="chart-nuevo"></canvas>`
2. En `updateNordvitalCharts()`:
```javascript
if (state.charts.chartNuevo) {
  // Actualizar datos existentes
} else {
  state.charts.chartNuevo = new Chart(
    document.getElementById('chart-nuevo'),
    { type: 'pie', data: {...}, options: {...} }
  );
}
```

### Exportar Datos Filtrados
```javascript
const csv = filteredData.map(record => 
  `${record.fechacita},${record.nombrecompleto},...`
).join('\n');
// Descargar como CSV
```

---

## 📊 Conversión de Datos CSV

### Usar el Script Conversor
```bash
node convert-nordvital.js
```

**Precondiciones**:
- Archivo CSV: `reporte001_2025-01-01_2025-01-31_0.csv`
- Formato: TAB-separado (no comas)
- Encoding: UTF-8

**Campos Extraídos** (ver indices en convert-nordvital.js):
- Columna 1: fechacita
- Columna 10: nombrecompleto
- Columna 21: mediconombre
- ... (11 campos totales)

**Output**:
- Genera: `nordvital-data.js`
- Format: `window.nordvitalData = [...]`
- Registros: ~6095 citas

---

## 🎨 Diseño y Styling

### Variables CSS Usadas
```css
--bg-card: rgba(255,255,255,0.04)
--border-color: rgba(255,255,255,0.1)
--color-primary: #00e5ff (Cyan)
--color-accent: #994cff (Violet)
--text-main: #f0f0f0
--text-muted: #888
```

### Componentes Styled

| Componente | Clase | Características |
|------------|-------|-----------------|
| Filtros | `.nordvital-filters-section` | Grid responsive, backdrop-filter blur(16px) |
| Inputs | `.filter-group input[type="date"]` | Focus glow cyan, rgba(0,0,0,0.2) background |
| Selects | `.filter-group select` | Custom dropdown arrow SVG |
| Tabla | `#nordvital-table` | Hover states, border-collapse |
| Rows | `tbody tr:hover` | background rgba(255,255,255,0.02) |

### Responsive Design
- Filtros: `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`
- Tabla: `.table-scroll-container` con `overflow-x: auto`

---

## 🐛 Debugging & Validación

### Checklist de Implementación
- [ ] `window.nordvitalData` cargado (6095+ registros)
- [ ] `state.nordvitalFilters` inicializado correctamente
- [ ] Event listeners attached a todos los inputs
- [ ] `applyNordvitalFilters()` ejecuta sin errores
- [ ] Gráficos se actualizan al cambiar filtros
- [ ] Tabla renderiza con datos correctos
- [ ] Paginación funciona (prev/next)
- [ ] Reset button limpia todos los filtros
- [ ] Búsqueda funciona combinada con otros filtros

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `initNordvitalSection is not defined` | Función mal nombrada | Usar `initEcomSection()` |
| Datos no cargan | nordvital-data.js no incluido | Verificar `<script>` loading order |
| Gráficos no actualizan | Charts sin referencia en state | Verificar `state.charts.ecomForecast` |
| Tabla vacía | `filteredData` no inicializado | Llamar `applyNordvitalFilters()` en init |
| Filtros sin opciones | `uniqueValues` no extraído | Revisar `.map().filter().sort()` |

### Console Checks
```javascript
// Verificar datos cargados
console.log(window.nordvitalData.length); // Debe ser 6095

// Verificar estado
console.log(state.nordvitalFilters); // Ver estado actual

// Verificar gráficos
console.log(state.charts); // Ver instancias Chart.js

// Test filtro manual
state.nordvitalFilters.dateFrom = '2025-01-10';
applyNordvitalFilters();
console.log(state.nordvitalFilters.filteredData.length);
```

---

## 📈 Extensiones Futuras

### Características Sugeridas
1. **Exportación**: Botón para descargar datos filtrados como CSV
2. **Comparativas**: Selector de periodo para comparar dos rangos
3. **Alertas**: Badges para citas incumplidas > umbral
4. **Detalles**: Modal con información completa del paciente
5. **Analytics**: Gráficos adicionales (edad promedio, regimen distribución)
6. **Caché**: localStorage para guardar filtros de sesión anterior
7. **API**: Endpoint para cargar datos dinámicamente vs archivo estático

### Optimizaciones
- Virtualizar tabla para 10,000+ registros
- Implementar debounce en búsqueda
- Web Workers para filtrado de datos masivos
- IndexedDB para persistencia offline

---

## 📚 Referencias Rápidas

**Archivos Críticos**:
- Filtros lógica: [app.js - applyNordvitalFilters()](app.js#L300-L350)
- UI Inputs: [index.html - .nordvital-filters-section](index.html#L450-L500)
- Estilos: [styles.css - .nordvital-*](styles.css#L1200-L1300)
- Datos: [nordvital-data.js](nordvital-data.js) (auto-generado)

**Dependencias**:
- Chart.js 3.x (CDN en index.html)
- Navegador moderno (ES6+)
- Archivo CSV con estructura específica

**Comandos Útiles**:
```bash
# Regenerar datos desde CSV
node convert-nordvital.js

# Ninguna compilación necesaria - vanilla JS
# Abrir en navegador
start index.html
```

---

## 🔗 Integración con VS Code

Esta skill permite:
- Entender rápidamente la arquitectura del dashboard
- Agregar nuevos filtros sin modificar lógica base
- Debuggear filtros combinados
- Mantener consistencia de datos
- Extender con nuevos gráficos/métricas

**Usar cuando**: Necesites modificar filtros, agregar métricas, cambiar visualizaciones o debuggear comportamiento del dashboard Nordvital.
