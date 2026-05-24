# Aether Analytics / Nordvital Dashboard

> Plataforma premium de ingeniería y pronóstico de datos con capacidades de analítica predictiva y visualización de datos para SaaS y E-commerce.

---

## 📋 Descripción General

**Aether Analytics** es un dashboard analítico de alto rendimiento que combina visualización de datos médica (Nordvital IPS) con métricas SaaS y e-commerce. Esta plataforma permite a los usuarios explorar conjuntos de datos complejos, realizar análisis predictivo con modelos de regresión y generar reportes detallados en tiempo real.

La aplicación está diseñada con un enfoque en la experiencia de usuario, utilizando un diseño moderno con efectos de **glassmorphism**, animaciones suaves y una paleta de colores profesional que facilita la interpretación de datos críticos.

---

## ✨ Características Principales

### Dashboard Analítico Unificado
- **Visualización de datos médicos**: Análisis completo de citas médicas con filtros avanzados
- **Métricas SaaS**: Seguimiento de KPIs como MRR, usuarios activos, tasa de cancelación y LTV
- **Métricas E-commerce**: Análisis de ventas, pedidos, ticket promedio y tasa de conversión
- **Explorador de datos personalizados**: Carga y análisis de archivos CSV con minería de datos

### Análisis Predictivo
- **Regresión múltiple**: Modelos predictivos para estimar probabilidad de selección de estudiantes
- **Simulador en tiempo real**: Ajuste de parámetros (CGPA, habilidades, codificación) para predecir resultados
- **Proyecciones de ventas**: Generación de tendencias futuras con ajustes estacionales

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
|------------|-----------|
| **HTML5** | Estructura semántica del dashboard |
| **CSS3** | Estilos con variables, glassmorphism y animaciones |
| **JavaScript Vanilla** | Lógica de aplicación sin dependencias externas |
| **Chart.js** | Visualización de gráficos interactivos (líneas, barras, donut) |
| **FileReader API** | Procesamiento de archivos CSV en el navegador |

---

## 📁 Estructura de Archivos (Carpeta `Pruebas/`)

| Archivo | Propósito |
|---------|-----------|
| `index.html` | Archivo principal con estructura HTML, carga de librerías y contenedor de la aplicación |
| `styles.css` | Hoja de estilos con variables CSS, glassmorphism, animaciones de fondo y diseño responsivo |
| `app.js` | Controlador principal de la aplicación: gestión de pestañas, eventos, renderizado de gráficos y carga de CSV |
| `nordvital-data.js` | Dataset JSON con datos de citas médicas (Nordvital IPS) |
| `dataset-data.js` | Dataset JSON con datos de selección de estudiantes (Internship Selection) |
| `data-engine.js` | Motor de procesamiento de datos: estadística básica, regresión lineal simple y múltiple |
| `convert-nordvital.js` | Script para conversión de datos (funcionalidad adicional) |
| `metrics-selector.js` | Selector de métricas para dashboard (funcionalidad adicional) |
| `Internship_Selection_Dataset.csv` | Archivo CSV de muestra para el explorador de datos personalizados |
| `reporte001_2025-01-01_2025-01-31_0.csv` | Archivo CSV de muestra para pruebas |
| `roo-agent.agent.md` | Configuración del agente Roo (funcionalidad adicional) |
| `roo-agent.config.json` | Configuración del agente Roo (funcionalidad adicional) |
| `SKILL.md` | Documentación de habilidades (funcionalidad adicional) |

---

## 🚀 Funcionalidades

### 1. Dashboard SaaS: Selección de Internos & Predicciones

**Descripción**: Análisis de datos de estudiantes para predicción de selección en programas de internships.

**Características**:
- **Tarjetas de KPIs**:
  - Ingreso Mensual Recurrente (MRR)
  - Estudiantes Seleccionados
  - Tasa de Selección (Churn Rate)
  - CGPA Promedio (LTV)

- **Gráficos de Comparación**:
  - Comparativa de atributos entre estudiantes seleccionados y rechazados
  - Atributos analizados: CGPA, Habilidades, Proyectos, Comunicación, Prueba Técnica, Currículum

- **Simulador Predictivo**:
  - Control deslizantes para ajustar CGPA, Habilidades y Prueba de Codificación
  - Cálculo de probabilidad de selección en tiempo real mediante regresión lineal múltiple
  - Visualización de gauge de probabilidad con colores dinámicos (rojo/azul/violeta)
  - Mostrar R² del modelo de precisión

**Datos utilizados**:
- `student_id`: Identificador único
- `CGPA`: Calificación académica (1-10)
- `skills_score`: Puntuación de habilidades (1-10)
- `projects_count`: Número de proyectos
- `communication_score`: Puntuación de comunicación (1-10)
- `coding_test_score`: Puntuación de prueba técnica (1-10)
- `resume_score`: Puntuación de currículum (1-10)
- `selected`: Estado de selección (0/1)

---

### 2. Dashboard Nordvital IPS: Análisis de Citas Médicas

**Descripción**: Reporte completo de citas médicas con filtros interactivos y exploración de datos.

**Características**:
- **Filtros Interactivos**:
  - Fecha desde/hasta
  - Tipo de cita (Control, Laboratorio, etc.)
  - Médico (por nombre o especialidad)
  - Reset de filtros

- **Tarjetas de KPIs**:
  - Total de Citas
  - Citas Completadas
  - Citas Incumplidas
  - Tasa de Cumplimiento

- **Gráficos**:
  - Tendencia de citas por día (línea con gradiente)
  - Distribución por tipo de atención (donut)
  - Top 10 médicos por cantidad de citas (barras horizontales)

- **Tabla Interactiva**:
  - Búsqueda en tiempo real
  - Paginación
  - Columnas: Fecha, Paciente, Edad, Médico, Especialidad, Tipo de Cita, Estado, Régimen

**Datos utilizados**:
- `fechacita`: Fecha de la cita
- `nombrecompleto`: Nombre del paciente
- `sexopaciente`: Género del paciente
- `edadanios`: Edad del paciente
- `medicoespecialidad`: Especialidad del médico
- `estado_cita`: Estado (Completada/INCUMPLIDO)
- `regimen`: Régimen (Subsidiado/Contributivo)
- `tipocita`: Tipo de cita
- `mediconombre`: Nombre del médico

---

### 3. Explorador CSV: Carga y Análisis de Datos Personalizados

**Descripción**: Subida y análisis de archivos CSV personalizados con minería de datos básica.

**Características**:
- **Subida de archivos**:
  - Arrastrar y soltar (drag & drop)
  - Selección de archivo mediante botón
  - Soporte para archivos .CSV

- **Análisis Estadístico Automático**:
  - Tamaño del dataset (filas × columnas)
  - Promedio y desviación estándar de columnas numéricas
  - Análisis de hasta 3 columnas principales

- **Tabla de Exploración**:
  - Visualización de datos paginada
  - Búsqueda por valor en cualquier columna
  - Formato de números con separadores de miles

**Muestras disponibles**:
- Datos SaaS (Métricas mensuales)
- Datos E-commerce (Ventas mensuales)

---

## 🎨 Estilos y Diseño

### Variables CSS

```css
--bg-900: #071126;        /* Fondo principal */
--bg-800: #071a2b;        /* Fondo secundario */
--card-bg: rgba(255,255,255,0.03);  /* Fondo de tarjetas */
--muted: rgba(255,255,255,0.65);    /* Texto secundario */
--text-main: #e6f7ff;     /* Texto principal */
--color-primary: #00e5ff; /* Cian brillante */
--accent: #8a7aff;        /* Violeta */
--glass-border: rgba(255,255,255,0.06); /* Bordes de cristal */
```

### Paleta de Colores para Gráficos

| Color | Código | Uso |
|-------|--------|-----|
| Cian | `#00e5ff` | Gráficos principales, líneas, donuts |
| Violeta | `#8a7aff` | Gráficos secundarios, barras |
| Verde | `#22c55e` | Estados positivos, completadas |
| Naranja | `#f59e0b` | Advertencias, medios |
| Rojo | `#ef4444` | Estados negativos, incumplidos |

### Fuentes

- **Outfit** (Google Fonts): Títulos y encabezados (pesos: 400, 500, 600, 700, 800)
- **Inter** (Google Fonts): Texto corrido (pesos: 300, 400, 500, 600, 700)

### Efectos de Diseño

- **Glassmorphism**: Fondos semitransparentes con bordes sutiles
- **Fondo animado**: Orbs de gradientes desenfocados (glows)
- **Sombras suaves**: Profundidad en tarjetas y componentes
- **Transiciones**: Animaciones suaves en pestañas y hover states

---

## 🔍 Filtros Disponibles

### Dashboard SaaS
- **CGPA**: Control deslizante (4.0 - 10.0)
- **Habilidades**: Control deslizante (1 - 10)
- **Prueba de Codificación**: Control deslizante (1 - 10)

### Dashboard Nordvital IPS
- **Fecha Desde**: Selector de fecha
- **Fecha Hasta**: Selector de fecha
- **Tipo de Cita**: Selector desplegable
- **Médico**: Selector desplegable (por nombre)
- **Especialidad**: Selector desplegable

### Explorador CSV
- **Búsqueda**: Input de texto para filtrar por valor en cualquier columna

---

## 📊 Gráficos (Chart.js)

### Configuraciones Específicas

| Tipo de Gráfico | Uso | Configuración |
|-----------------|-----|---------------|
| **Barra** | Comparación de atributos, top médicos | `borderRadius: 6`, gradientes |
| **Línea** | Tendencia temporal | `tension: 0.35`, `fill: true` |
| **Donut** | Distribución por tipo | `cutout: '70%'` |
| **Barra Horizontal** | Top 10 médicos | `indexAxis: 'y'` |

### Personalización de Tooltip

- **Fuentes**: Outfit (títulos), Inter (texto)
- **Fondo**: `#0f172a` (oscuro)
- **Bordes**: `rgba(255, 255, 255, 0.1)`

---

## 📁 Estructura de Datos

### Dataset SaaS (Internship Selection)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `student_id` | number | Identificador único |
| `CGPA` | number | Calificación académica (1-10) |
| `skills_score` | number | Puntuación de habilidades (1-10) |
| `projects_count` | number | Número de proyectos |
| `internships_done` | number | Número de internships |
| `communication_score` | number | Puntuación de comunicación (1-10) |
| `aptitude_score` | number | Puntuación de aptitud |
| `coding_test_score` | number | Puntuación de prueba técnica (1-10) |
| `resume_score` | number | Puntuación de currículum (1-10) |
| `extracurricular` | string | Sí/No |
| `college_tier` | string | Tier 2/Tier 3 |
| `hackathons_participated` | number | Hackathons participados |
| `certifications_count` | number | Certificaciones |
| `linkedin_activity_score` | number | Actividad LinkedIn (1-10) |
| `github_score` | number | Puntuación GitHub |
| `soft_skills_score` | number | Puntuación de soft skills (1-10) |
| `interview_score` | number | Puntuación de entrevista (1-10) |
| `consistency_score` | number | Puntuación de consistencia (1-10) |
| `backlogs` | number | Backlogs pendientes |
| `placement_training` | string | Sí/No |
| `selected` | number | 0/1 (seleccionado) |

### Dataset Nordvital IPS (Citas Médicas)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `fechacita` | string | Fecha de la cita (DD/MM/AAAA) |
| `nombrecompleto` | string | Nombre del paciente |
| `sexopaciente` | string | Género (M/F) |
| `edadanios` | number | Edad del paciente |
| `medicoespecialidad` | string | Especialidad del médico |
| `estado_cita` | string | Estado (Completada/INCUMPLIDO) |
| `regimen` | string | Régimen (Subsidiado/Contributivo) |
| `tipocita` | string | Tipo de cita |
| `rotulo` | string | Rotulo/Nota adicional |
| `oportunidad` | number | Oportunidad de atención |
| `mediconombre` | string | Nombre del médico |
| `nombresede` | string | Nombre de la sede |

---

## 🛠️ Comandos Útiles

### Levantar Servidor Local

```bash
# Opción 1: Usando Python (si está instalado)
python -m http.server 8000

# Opción 2: Usando Node.js (si está instalado)
npx serve

# Opción 3: Usando PHP (si está instalado)
php -S localhost:8000
```

### Abrir en Navegador

Una vez el servidor esté corriendo, abre en tu navegador:
```
http://localhost:8000
```

---

## 📝 Notas de Desarrollo

### Dependencias Externas

- **Chart.js**: CDN `https://cdn.jsdelivr.net/npm/chart.js`
- **Google Fonts**: Outfit e Inter desde Google Fonts API

### Estructura del Proyecto

```
Pruebas/
├── index.html              # Archivo principal
├── styles.css              # Hoja de estilos
├── app.js                  # Controlador principal
├── nordvital-data.js      # Datos médicos
├── dataset-data.js        # Datos SaaS
├── data-engine.js         # Motor de análisis
├── Internship_Selection_Dataset.csv
├── reporte001_2025-01-01_2025-01-31_0.csv
└── [Archivos adicionales]
```

---

## 📄 Licencia y Créditos

**Autor**: Igor Vulfers  
**Fecha**: 2026  
**Versión**: 1.0.0

### Atribuciones

- **Chart.js** - Librería de gráficos de JavaScript
- **Google Fonts** - Fuentes Outfit e Inter
- **Nordvital IPS** - Datos de citas médicas (datos de muestra)
- **Internship Selection Dataset** - Datos de selección de estudiantes (datos de muestra)

### Disclaimer

Los datos mostrados en este dashboard son de naturaleza demostrativa y pueden no reflejar datos reales. Se recomienda verificar la fuente original para cualquier uso en producción.

---

## 📞 Contacto

Para consultas o soporte técnico, por favor contacte al desarrollador principal.

---

*Este documento ha sido generado automáticamente por el sistema de documentación.*
