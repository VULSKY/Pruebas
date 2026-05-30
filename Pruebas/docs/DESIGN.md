# 🎨 DESIGN SYSTEM - AETHER / NORDVITAL

Documento de diseño completo que describe todos los estilos, componentes y principios de diseño del sistema.

---

## 1. 🎨 PALETA DE COLORES

### Variables CSS principales

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `--bg-900` | `#071126` | Fondo principal (oscuro profundo) |
| `--bg-800` | `#071a2b` | Fondo secundario (ligeramente más claro) |
| `--card-bg` | `rgba(255,255,255,0.03)` | Fondo de tarjetas (semi-transparente) |
| `--muted` | `rgba(255,255,255,0.65)` | Texto secundario / etiquetas |
| `--text-main` | `#e6f7ff` | Texto principal (blanco azulado) |
| `--color-primary` | `#00e5ff` | Color primario (cian brillante) |
| `--accent` | `#8a7aff` | Color de acento (violeta) |
| `--glass-border` | `rgba(255,255,255,0.06)` | Borde de efecto cristal |

### Colores adicionales

| Color | Valor | Uso |
|-------|-------|-----|
| `--bg-700` | `#0a2438` | Fondo terciario |
| `--bg-600` | `#0d3045` | Fondo cuaternario |
| `--success` | `#00ff88` | Estados positivos |
| `--warning` | `#ffaa00` | Estados de advertencia |
| `--error` | `#ff4444` | Estados de error |

---

## 2. 🔤 TIPOGRAFÍA

### Fuentes utilizadas

| Fuente | Uso |
|--------|-----|
| **Outfit** | Títulos, branding, elementos destacados |
| **Inter** | Cuerpo principal, textos largos |
| **system-ui** | Fallback nativo |
| **Segoe UI** | Fallback Windows |
| **Roboto** | Fallback general |
| **Helvetica Neue** | Fallback estándar |
| **Arial** | Fallback último recurso |

### Jerarquía tipográfica

| Nivel | Tamaño | Peso | Color | Uso |
|-------|--------|------|-------|-----|
| H1 | `1.4rem` | 700 | `var(--text-main)` | Títulos de página |
| H2 | `1.2rem` | 700 | `var(--text-main)` | Títulos de sección |
| H3 | `1.05rem` | 600 | `var(--text-main)` | Títulos de tarjeta |
| Body | `0.95rem` | 400 | `var(--text-main)` | Texto principal |
| Body Large | `1.0rem` | 400 | `var(--text-main)` | Texto destacado |
| Small | `0.85rem` | 500 | `var(--muted)` | Etiquetas, metadatos |
| XSmall | `0.8rem` | 400 | `var(--muted)` | Texto secundario |

### Ejemplos de uso

```css
/* Título principal */
h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

/* Título de sección */
h2 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

/* Texto de cuerpo */
p, .text-body {
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.95rem;
  font-weight: 400;
  color: var(--text-main);
  line-height: 1.6;
}

/* Etiqueta / metadata */
.label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--muted);
}
```

---

## 3. ✨ EFECTOS VISUALES

### Glassmorphism (Efecto cristal)

```css
/* Borde de cristal */
.glass-border {
  border: 1px solid var(--glass-border);
}

/* Fondo con desenfoque */
.glass-bg {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Tarjeta completa con glassmorphism */
.glass-card {
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
}
```

### Gradientes

```css
/* Gradiente principal (cian a violeta) */
.gradient-primary {
  background: linear-gradient(90deg, var(--color-primary), var(--accent));
}

/* Gradiente vertical para fondos */
.gradient-vertical {
  background: linear-gradient(180deg, var(--bg-900), var(--bg-800));
}

/* Gradiente radial para orbs */
.radial-gradient {
  background: radial-gradient(circle at 30% 30%, #00e5ff 0%, rgba(0,229,255,0.08) 40%, transparent 60%);
}
```

### Glow (Brillo)

```css
/* Glow general */
.glow {
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
}

/* Glow específico para elementos seleccionados */
.glow-primary {
  box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.3), 0 6px 18px rgba(0, 0, 0, 0.45);
}

/* Glow para orbs de fondo */
.glow-orb {
  filter: blur(48px);
  opacity: 0.9;
  mix-blend-mode: screen;
}
```

### Blur (Desenfoque)

```css
/* Blur para fondos */
.blur-bg {
  filter: blur(48px);
  opacity: 0.9;
}

/* Blur para elementos de fondo */
.blur-element {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
```

---

## 4. 📐 LAYOUT Y ESTRUCTURA

### Contenedor principal

```css
.app-container {
  position: relative;
  display: flex;
  gap: 24px;
  min-height: 100vh;
  z-index: 1;
}
```

### Sidebar

```css
.sidebar {
  width: 260px;
  padding: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
  border-right: 1px solid var(--glass-border);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
```

### Main Content

```css
.main-content {
  flex: 1;
  padding: 28px;
  overflow: auto;
}
```

### Grids

```css
/* Grid KPIs */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

/* Grid Charts */
.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

/* Grid responsivo */
.charts-grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
```

### Spacing (Espaciado)

| Elemento | Valor |
|----------|-------|
| Gap general | `16px` |
| Padding tarjeta | `14px` |
| Padding sidebar | `20px` |
| Margin sección | `18px` |
| Border-radius | `8px` - `12px` |

---

## 5. 🧩 COMPONENTES UI

### Botones

#### Botón Primario

```css
.btn-primary {
  background: linear-gradient(90deg, var(--color-primary), var(--accent));
  color: #001219;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
}
```

#### Botón Secundario

```css
.btn-secondary {
  background: transparent;
  border: 1px solid var(--glass-border);
  color: var(--text-main);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-secondary:hover {
  transform: translateY(-1px);
}
```

### Tarjetas

#### Tarjeta KPI

```css
.kpi-card {
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-title {
  color: var(--muted);
  font-weight: 600;
  font-size: 0.9rem;
}

.kpi-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-main);
}

.kpi-change {
  color: var(--muted);
  font-size: 0.85rem;
}
```

#### Tarjeta de Gráfico

```css
.chart-card {
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 14px;
}

.chart-card.large {
  grid-column: 1 / 2;
}

.chart-card.medium {
  grid-column: 2 / 3;
}
```

### Tablas de Datos

```css
.table-scroll-container {
  background: transparent;
  border-radius: 8px;
  overflow: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.data-table thead th {
  text-align: left;
  padding: 10px;
  font-weight: 600;
  color: var(--muted);
  border-bottom: 1px solid var(--glass-border);
}

.data-table tbody td {
  padding: 10px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.03);
  color: var(--text-main);
}

.data-table tr:nth-child(even) td {
  background: rgba(255, 255, 255, 0.01);
}
```

### Paginación

```css
.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.btn-pagination {
  background: transparent;
  border: 1px solid var(--glass-border);
  color: var(--text-main);
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
}
```

### Filtros y Selectores

#### Chip de métrica (Power BI-like)

```css
.metrics-toolbar {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.metrics-list {
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  max-width: 780px;
}

.metric-chip {
  padding: 8px 10px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--muted);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: border-color 0.3s, color 0.3s;
}

.metric-chip:hover {
  border-color: rgba(255, 255, 255, 0.04);
  color: var(--text-main);
}

.metric-chip.selected {
  background: linear-gradient(90deg, var(--color-primary), var(--accent));
  color: #001219;
  border-color: transparent;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
}
```

#### Input y Select personalizados

```css
.filter-group input[type="date"],
.filter-group select {
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  color: var(--text-main);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
  width: 100%;
  box-sizing: border-box;
}

.filter-group input[type="date"]:focus,
.filter-group select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.3);
  outline: none;
}
```

### Pestañas (Tabs)

```css
/* Solo la pestaña activa se muestra */
.tab-pane {
  display: none;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 180ms ease, transform 180ms ease;
}

.tab-pane.active {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

/* Mostrar solo elementos de la pestaña activa */
.kpi-grid, .charts-grid, .charts-grid-ecom {
  display: none;
}

.tab-pane.active .kpi-grid {
  display: grid;
}

.tab-pane.active .charts-grid {
  display: grid;
}

.tab-pane.active .charts-grid-ecom {
  display: grid;
}
```

---

## 6. 📱 RESPONSIVE DESIGN

### Breakpoints

| Breakpoint | Valor | Adaptación |
|------------|-------|------------|
| Desktop | `> 980px` | Layout completo con sidebar |
| Tablet | `768px - 980px` | Sidebar oculta, grids en 1 columna |
| Móvil | `< 768px` | Layout simplificado, navegación móvil |

### Media Queries

```css
/* Tablet y móvil */
@media (max-width: 980px) {
  .sidebar {
    display: none;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}

/* Móvil muy pequeño */
@media (max-width: 480px) {
  .main-content {
    padding: 16px;
  }
  
  .metric-chip {
    font-size: 0.8rem;
    padding: 6px 8px;
  }
  
  .kpi-value {
    font-size: 1.3rem;
  }
}
```

---

## 7. ♿ ACCESIBILIDAD

### Contraste de colores

| Combinación | Ratio | Estado |
|-------------|-------|--------|
| `--text-main` sobre `--bg-900` | 12.5:1 | ✅ AAA |
| `--muted` sobre `--bg-900` | 4.5:1 | ✅ AA |
| `var(--color-primary)` sobre `#001219` | 16:1 | ✅ AAA |

### Foco (Focus)

```css
/* Foco visible para todos los elementos interactivos */
a, button, input, select, [tabindex]:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Foco personalizado para inputs */
.filter-group input:focus,
.filter-group select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.3);
  outline: none;
}
```

### Semántica HTML

```html
<!-- Estructura semántica recomendada -->
<nav class="sidebar" aria-label="Menú principal">
  <div class="sidebar-brand">
    <span class="brand-name">Nordvital</span>
  </div>
  <ul class="sidebar-nav">
    <li><a href="#" class="nav-item active">Dashboard</a></li>
    <li><a href="#" class="nav-item">Reportes</a></li>
  </ul>
</nav>

<main class="main-content">
  <header class="main-header">
    <h1>Dashboard de Métricas</h1>
    <button class="btn-primary" aria-label="Ver reporte completo">
      Ver reporte
    </button>
  </header>
  
  <section class="dashboard-section">
    <h2>Métricas Principales</h2>
    <div class="kpi-grid">
      <article class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Ingresos</span>
          <span class="kpi-change">▲ 12.5%</span>
        </div>
        <span class="kpi-value">¥ 2,450,000</span>
      </article>
    </div>
  </section>
</main>
```

---

## 8. 🎯 ESTILOS GLOBALES

### Reset CSS

```css
* {
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: radial-gradient(ellipse at 10% 20%, rgba(0,229,255,0.06), transparent 15%),
               linear-gradient(180deg, var(--bg-900), var(--bg-800));
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Variables CSS (CSS Custom Properties)

```css
:root {
  /* Colores */
  --bg-900: #071126;
  --bg-800: #071a2b;
  --card-bg: rgba(255, 255, 255, 0.03);
  --muted: rgba(255, 255, 255, 0.65);
  --text-main: #e6f7ff;
  --color-primary: #00e5ff;
  --accent: #8a7aff;
  --glass-border: rgba(255, 255, 255, 0.06);
  
  /* Espaciado */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 20px;
  --spacing-2xl: 24px;
  
  /* Bordes */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 999px;
  
  /* Sombras */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 6px 18px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.4);
}
```

### Utilidades CSS

```css
/* Utilidad de flex */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }

/* Utilidad de grid */
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Utilidad de texto */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.text-sm { font-size: 0.85rem; }
.text-lg { font-size: 1.0rem; }
.text-xl { font-size: 1.2rem; }
.text-2xl { font-size: 1.4rem; }

/* Utilidad de espaciado */
.m-0 { margin: 0; }
.m-1 { margin: 4px; }
.m-2 { margin: 8px; }
.m-3 { margin: 12px; }
.m-4 { margin: 16px; }
.p-0 { padding: 0; }
.p-1 { padding: 4px; }
.p-2 { padding: 8px; }
.p-3 { padding: 12px; }
.p-4 { padding: 16px; }
```

---

## 9. 💡 EJEMPLOS DE USO

### Ejemplo 1: Dashboard completo

```html
<div class="app-container">
  <!-- Sidebar -->
  <nav class="sidebar">
    <div class="sidebar-brand">
      <span class="brand-name">Nordvital</span>
    </div>
    <div class="sidebar-nav">
      <button class="nav-item active">
        <span class="nav-icon">📊</span>
        <span>Dashboard</span>
      </button>
      <button class="nav-item">
        <span class="nav-icon">📈</span>
        <span>Reportes</span>
      </button>
    </div>
  </nav>
  
  <!-- Main Content -->
  <main class="main-content">
    <header class="main-header">
      <h1>Dashboard de Métricas</h1>
      <div class="header-actions">
        <button class="btn-primary">Exportar</button>
      </div>
    </header>
    
    <!-- Filtros -->
    <section class="nordvital-filters-section">
      <div class="filter-group">
        <label for="date-range">Rango de fechas</label>
        <input type="date" id="date-range">
      </div>
      <div class="filter-group">
        <label for="region">Región</label>
        <select id="region">
          <option>Seleccionar...</option>
          <option>América</option>
          <option>Europa</option>
        </select>
      </div>
    </section>
    
    <!-- KPIs -->
    <section class="dashboard-section">
      <h2>Métricas Principales</h2>
      <div class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Ingresos</span>
            <span class="kpi-change" style="color: var(--success)">▲ 12.5%</span>
          </div>
          <span class="kpi-value">¥ 2,450,000</span>
        </article>
        <article class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Usuarios</span>
            <span class="kpi-change" style="color: var(--success)">▲ 8.2%</span>
          </div>
          <span class="kpi-value">12,450</span>
        </article>
      </div>
    </section>
    
    <!-- Gráficos -->
    <section class="charts-grid">
      <article class="chart-card large">
        <!-- Gráfico principal -->
      </article>
      <article class="chart-card medium">
        <!-- Gráfico secundario -->
      </article>
    </section>
    
    <!-- Tabla de datos -->
    <section class="dashboard-section">
      <h2>Últimas Transacciones</h2>
      <div class="table-scroll-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#001</td>
              <td>Empresa ABC</td>
              <td>¥ 150,000</td>
              <td>2025-01-15</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-pagination">
        <button class="btn-pagination">Anterior</button>
        <span>1-10 de 150</span>
        <button class="btn-pagination">Siguiente</button>
      </div>
    </section>
  </main>
</div>
```

### Ejemplo 2: Botones con estados

```html
<div class="btn-group">
  <button class="btn-primary">
    Guardar Cambios
  </button>
  <button class="btn-secondary">
    Cancelar
  </button>
  <button class="btn-primary" style="background: linear-gradient(90deg, var(--success), #00cc6a); color: #001219;">
    Confirmar
  </button>
</div>
```

### Ejemplo 3: Tarjetas con estados

```html
<div class="kpi-grid">
  <!-- Tarjeta con estado positivo -->
  <article class="kpi-card">
    <div class="kpi-header">
      <span class="kpi-title">Ingresos</span>
      <span class="kpi-change" style="color: var(--success)">▲ 12.5%</span>
    </div>
    <span class="kpi-value">¥ 2,450,000</span>
  </article>
  
  <!-- Tarjeta con estado neutral -->
  <article class="kpi-card">
    <div class="kpi-header">
      <span class="kpi-title">Usuarios</span>
      <span class="kpi-change">0%</span>
    </div>
    <span class="kpi-value">12,450</span>
  </article>
  
  <!-- Tarjeta con estado negativo -->
  <article class="kpi-card">
    <div class="kpi-header">
      <span class="kpi-title">Costos</span>
      <span class="kpi-change" style="color: var(--error)">▼ 5.3%</span>
    </div>
    <span class="kpi-value">¥ 850,000</span>
  </article>
</div>
```

---

## 10. 🎯 CONSIDERACIONES DE DISEÑO

### Consistencia

- **Espaciado**: Mantener el sistema de espaciado (4px, 8px, 12px, 16px, 20px, 24px)
- **Bordes**: Usar `var(--glass-border)` para bordes sutiles
- **Sombras**: Usar `var(--shadow-md)` para tarjetas principales
- **Radio de borde**: `var(--radius-lg)` (12px) para tarjetas, `var(--radius-md)` (8px) para botones

### Jerarquía Visual

1. **Nivel 1**: Títulos grandes (`1.4rem`, peso 700) - captan atención inmediata
2. **Nivel 2**: Títulos de sección (`1.2rem`, peso 700) - organizan contenido
3. **Nivel 3**: Títulos de tarjeta (`1.05rem`, peso 600) - identifican componentes
4. **Nivel 4**: Texto de cuerpo (`0.95rem`, peso 400) - información principal
5. **Nivel 5**: Texto secundario (`0.85rem`, peso 500) - metadatos y etiquetas

### Espaciado

- **Gap**: 16px entre elementos principales, 12px entre elementos secundarios
- **Padding**: 14px para tarjetas, 20px para contenedores principales
- **Margin**: 18px entre secciones

### Color y Legibilidad

- **Texto principal**: `#e6f7ff` (blanco azulado) sobre fondos oscuros
- **Texto secundario**: `rgba(255,255,255,0.65)` para reducir contraste
- **Acentos**: `#00e5ff` (cian) para acciones principales, `#8a7aff` (violeta) para destacados

### Accesibilidad

- **Contraste mínimo**: 4.5:1 para texto, 3:1 para UI
- **Foco visible**: 2px de borde con offset
- **Tamaño mínimo**: 16px para elementos interactivos
- **Semántica**: Usar etiquetas HTML semánticas (`nav`, `main`, `article`, `section`)

---

## 📋 RESUMEN DE VARIABLES CSS

```css
:root {
  /* Colores de fondo */
  --bg-900: #071126;
  --bg-800: #071a2b;
  --card-bg: rgba(255, 255, 255, 0.03);
  
  /* Colores de texto */
  --muted: rgba(255, 255, 255, 0.65);
  --text-main: #e6f7ff;
  
  /* Colores de acento */
  --color-primary: #00e5ff;
  --accent: #8a7aff;
  
  /* Efectos de cristal */
  --glass-border: rgba(255, 255, 255, 0.06);
}
```

---

*Documento generado para el sistema de diseño AETHER / NORDVITAL*
