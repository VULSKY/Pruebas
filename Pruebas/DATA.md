# DATA.md - Documentación de Fuentes de Datos

## 1. Fuentes de Datos

### 1.1 Internship_Selection_Dataset.csv
**Descripción**: Datos de selección de internos para empresas tecnológicas. Contiene información de estudiantes y sus calificaciones para determinar su idoneidad para programas de prácticas.

**Ubicación**: `Pruebas/Internship_Selection_Dataset.csv`

**Características principales**:
- 10,002 registros de estudiantes
- 19 columnas de datos
- Datos numéricos y categóricos para evaluación de candidatos

### 1.2 Nordvital Data (Citas Médicas)
**Descripción**: Datos de citas médicas para un sistema de gestión de salud.

**Estructura esperada**:
- `fecha`: Fecha de la cita (formato YYYY-MM-DD)
- `médico`: ID o nombre del médico
- `especialidad`: Especialidad médica (cardiología, pediatría, etc.)
- `tipo_cita`: Tipo de cita (primera, seguimiento, urgencia)
- `estado`: Estado de la cita (confirmada, cancelada, completada, pendiente)
- `paciente_id`: ID único del paciente
- `horario`: Hora programada
- `duracion`: Duración de la cita en minutos

### 1.3 CSV Personalizados (Carga de Archivos)
**Descripción**: Estructura flexible basada en CSV para diferentes dominios de negocio.

**Características**:
- Formato estándar CSV con cabeceras
- Soporte para múltiples tipos de datos
- Validación de rangos y formatos
- Transformación automática a objetos JSON

---

## 2. Estructura de Datos

### 2.1 Datos SaaS (Métricas de SaaS)

| Métrica | Descripción | Fórmula | Unidad |
|---------|-------------|---------|--------|
| MRR (Mensual Recurrente) | Ingresos mensuales recurrentes | Suma de suscripciones activas | USD/mes |
| Usuarios Activos | Usuarios con actividad en el periodo | Conteo de usuarios únicos | Usuarios |
| Churn Rate | Tasa de cancelación | (Usuarios perdidos / Usuarios iniciales) × 100 | % |
| LTV (Valor de Vida del Cliente) | Valor total del cliente durante su relación | ARPU × Retención | USD |
| CAC (Costo de Adquisición) | Costo de obtener un nuevo cliente | Marketing/Adquisición / Nuevos clientes | USD |

**Ejemplo de datos SaaS**:
```json
{
  "periodo": "2025-01",
  "mrr": 45000,
  "usuarios_activos": 1250,
  "churn_rate": 2.5,
  "ltv": 850,
  "cac": 120
}
```

### 2.2 Datos Nordvital (Citas Médicas)

**Columnas principales**:
- `fecha`: Formato YYYY-MM-DD
- `médico_id`: ID numérico del médico
- `médico`: Nombre completo
- `especialidad`: String (cardiología, dermatología, etc.)
- `tipo_cita`: Enum (primera, seguimiento, urgencia, consulta)
- `estado`: Enum (confirmada, cancelada, completada, pendiente, retrasada)
- `paciente_id`: ID numérico único
- `paciente`: Nombre del paciente
- `horario`: HH:MM
- `duracion_minutos`: Entero
- `motivo`: String descriptivo

**Ejemplo de datos Nordvital**:
```json
{
  "fecha": "2025-01-15",
  "médico_id": 101,
  "médico": "Dr. Juan Pérez",
  "especialidad": "Cardiología",
  "tipo_cita": "seguimiento",
  "estado": "completada",
  "paciente_id": 5001,
  "paciente": "María González",
  "horario": "10:00",
  "duracion_minutos": 30,
  "motivo": "Control post-tratamiento"
}
```

### 2.3 Datos Personalizados (Estructura Flexible)

**Características**:
- Cabeceras definidas por el archivo
- Tipos de datos: numérico, string, booleano, fecha, enum
- Validación de rangos según dominio
- Soporte para archivos CSV estándar

**Ejemplo de estructura personalizada**:
```csv
id,producto,precio,stock,categoria,disponible
1,Laptop,999.99,15,Electrónica,Sí
2,Mouse,29.99,100,Accesorios,Sí
3,Teclado,79.99,45,Accesorios,Sí
```

---

## 3. Formatos de Archivo

### 3.1 CSV (Comma Separated Values)

**Características**:
- Separador de columnas: coma (`,`)
- Separador de registros: salto de línea (`\n`)
- Encabezados en primera fila
- Soporte para valores vacíos

**Ejemplo**:
```csv
id,nombre,edad,activo
1,Alice,25,Sí
2,Bob,30,No
3,Carol,28,Sí
```

### 3.2 Estructura de Cabeceras

**Formato estándar**:
```csv
columna1,columna2,columna3,...,columnaN
```

**Reglas**:
- Cabeceras en minúsculas
- Sin espacios en blanco
- Separadas por coma
- Primera fila del archivo

### 3.3 Tipos de Datos

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| Numérico | Entero o decimal | 123, 45.67 |
| String | Texto | "Juan Pérez" |
| Booleano | Sí/No, Verdadero/Falso | Sí, No, True |
| Fecha | YYYY-MM-DD | 2025-01-15 |
| Enum | Valor de lista | "cardiología", "urgencia" |

---

## 4. Validación de Datos

### 4.1 Tipos de Datos

**Validación numérica**:
- Rango mínimo y máximo
- Precisión decimal
- Valores no nulos

**Validación de string**:
- Longitud mínima/máxima
- Caracteres permitidos
- Formato específico (email, teléfono)

**Validación de booleano**:
- Valores aceptados: `Sí`, `No`, `True`, `False`, `1`, `0`
- Caso insensible

### 4.2 Rangos

**Ejemplos de rangos válidos**:

| Campo | Mínimo | Máximo | Tipo |
|-------|--------|--------|------|
| edad | 18 | 100 | Entero |
| precio | 0 | 999999 | Decimal |
| stock | 0 | 10000 | Entero |
| churn_rate | 0 | 100 | Decimal |

### 4.3 Formatos de Fecha

**Formato estándar**: YYYY-MM-DD

**Validación**:
- Año: 1900-2100
- Mes: 01-12
- Día: 01-31 (dependiendo del mes)

**Ejemplos válidos**:
- `2025-01-15`
- `2025-12-31`
- `2020-06-15`

**Ejemplos inválidos**:
- `2025-13-01` (mes inválido)
- `2025-01-32` (día inválido)
- `2025-00-15` (mes inválido)

---

## 5. Transformación de Datos

### 5.1 Limpieza

**Procesos de limpieza**:
1. **Remoción de filas vacías**: Filas sin datos en todas las columnas
2. **Manejo de valores nulos**: Reemplazo con valor por defecto o eliminación
3. **Normalización de texto**: Minúsculas, eliminación de espacios extra
4. **Corrección de formatos**: Estándarización de fechas, números, etc.

**Ejemplo de limpieza**:
```csv
// Antes
id,nombre,edad,activo
1, Juan , 25 , Sí
2,Bob,30,No
3,Carol,28,Sí

// Después
id,nombre,edad,activo
1,juan,25,sí
2,bob,30,no
3,carol,28,sí
```

### 5.2 Normalización

**Normalización de texto**:
- Convertir a minúsculas
- Eliminar espacios en blanco
- Estándarizar nombres de columnas

**Normalización de números**:
- Formato decimal consistente
- Eliminar ceros innecesarios
- Formato estándar de moneda

**Normalización de fechas**:
- Formato YYYY-MM-DD
- Hora en formato HH:MM
- Zona horaria UTC

### 5.3 Conversión a Objetos

**Estructura de objeto JSON**:
```json
[
  {
    "id": 1,
    "nombre": "juan",
    "edad": 25,
    "activo": "sí"
  },
  {
    "id": 2,
    "nombre": "bob",
    "edad": 30,
    "activo": "no"
  }
]
```

**Proceso de conversión**:
1. Leer archivo CSV
2. Parsear cabeceras
3. Parsear cada fila a objeto
4. Aplicar transformaciones
5. Devolver array de objetos

---

## 6. Cálculos Estadísticos

### 6.1 Promedio y Desviación Estándar

**Promedio (Mean)**:
```
Promedio = Σ(x) / n
```

**Desviación Estándar**:
```
σ = √(Σ(x - μ)² / n)
```

**Ejemplo de cálculo**:
```csv
edad
25
30
28
35
22

// Promedio
(25 + 30 + 28 + 35 + 22) / 5 = 140 / 5 = 28

// Desviación estándar
μ = 28
(25-28)² = 9
(30-28)² = 4
(28-28)² = 0
(35-28)² = 49
(22-28)² = 36
σ = √(9+4+0+49+36)/5 = √98/5 = √19.6 ≈ 4.43
```

### 6.2 Regresión Múltiple Lineal

**Fórmula**: y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ

**Variables**:
- y: Variable dependiente (objetivo)
- x₁, x₂, ..., xₙ: Variables independientes
- β₀: Intercepto
- β₁, β₂, ..., βₙ: Coeficientes

**Ejemplo**: Predecir salario basado en experiencia y educación
```
Salario = 30000 + 500 × Experiencia + 2000 × Educación
```

### 6.3 Métricas SaaS

**Tasa de Cancelación (Churn Rate)**:
```
Churn Rate = (Usuarios Perdidos / Usuarios Iniciales) × 100
```

**Ejemplo**:
```
Usuarios iniciales: 1000
Usuarios perdidos: 25
Churn Rate = (25 / 1000) × 100 = 2.5%
```

**LTV (Valor de Vida del Cliente)**:
```
LTV = ARPU × Retención
```

**Ejemplo**:
```
ARPU (Ingreso promedio por usuario): $50/mes
Retención anual: 80%
LTV = $50 × 12 meses × 0.8 = $480
```

**CAC (Costo de Adquisición)**:
```
CAC = Marketing/Adquisición / Nuevos Clientes
```

**Ejemplo**:
```
Gasto en marketing: $12000
Nuevos clientes: 100
CAC = $12000 / 100 = $120
```

### 6.4 Métricas Nordvital

**Tasa de Conversión**:
```
Conversión = (Citas Completadas / Citas Programadas) × 100
```

**Ejemplo**:
```
Citas programadas: 500
Citas completadas: 400
Conversión = (400 / 500) × 100 = 80%
```

**Tasa de Completadas**:
```
Completadas = (Citas completadas / Citas programadas) × 100
```

**Tasa de Incumplidas**:
```
Incumplidas = (Citas canceladas / Citas programadas) × 100
```

**Ejemplo**:
```
Citas programadas: 500
Citas completadas: 400
Citas canceladas: 50
Tasa completadas = (400 / 500) × 100 = 80%
Tasa incumplidas = (50 / 500) × 100 = 10%
```

---

## 7. Ejemplos de Datos

### 7.1 Muestra de Internship_Selection_Dataset.csv

```csv
student_id,CGPA,skills_score,projects_count,internships_done,communication_score,aptitude_score,coding_test_score,resume_score,extracurricular,college_tier,hackathons_participated,certifications_count,linkedin_activity_score,github_score,soft_skills_score,interview_score,consistency_score,backlogs,placement_training,selected
1,6.87,7,0,0,4,3,2,7,Yes,Tier 2,0,7,5,9,3,1,4,4,Yes,1
2,9.75,4,4,2,3,3,6,1,Yes,Tier 2,3,2,8,8,3,9,8,5,Yes,1
3,8.66,2,1,1,2,1,4,6,Yes,Tier 2,4,1,5,2,2,1,3,2,Yes,1
4,7.99,5,4,2,8,8,10,8,No,Tier 2,1,5,5,9,2,7,10,1,Yes,1
5,5.78,3,2,2,4,9,1,7,Yes,Tier 3,4,7,3,8,7,8,6,5,Yes,1
```

**Explicación de columnas**:
- `student_id`: ID único del estudiante
- `CGPA`: Promedio de calificaciones (0-10)
- `skills_score`: Puntuación de habilidades (1-10)
- `projects_count`: Número de proyectos
- `internships_done`: Número de prácticas previas
- `communication_score`: Puntuación de comunicación (1-10)
- `college_tier`: Nivel de universidad (Tier 1, 2, 3)
- `selected`: ¿Fue seleccionado? (Sí/No, 1/0)

### 7.2 Muestra de Datos Nordvital

```json
{
  "fecha": "2025-01-15",
  "médico_id": 101,
  "médico": "Dr. Juan Pérez",
  "especialidad": "Cardiología",
  "tipo_cita": "seguimiento",
  "estado": "completada",
  "paciente_id": 5001,
  "paciente": "María González",
  "horario": "10:00",
  "duracion_minutos": 30,
  "motivo": "Control post-tratamiento"
}
```

**Ejemplo de datos en CSV**:
```csv
fecha,médico_id,médico,especialidad,tipo_cita,estado,paciente_id,paciente,horario,duracion_minutos,motivo
2025-01-15,101,Dr. Juan Pérez,Cardiología,seguimiento,completada,5001,María González,10:00,30,Control post-tratamiento
2025-01-16,102,Dra. Ana López,Pediatría,primera,confirmada,5002,Carlos Ruiz,14:00,45,Consulta inicial
2025-01-17,101,Dr. Juan Pérez,Urología,urgencia,cancelada,5003,Ana Martínez,09:00,20,Urgencia renal
```

### 7.3 Muestra de Datos SaaS

```json
{
  "periodo": "2025-01",
  "mrr": 45000,
  "usuarios_activos": 1250,
  "churn_rate": 2.5,
  "ltv": 850,
  "cac": 120
}
```

**Ejemplo de datos en CSV**:
```csv
periodo,mrr,usuarios_activos,churn_rate,ltv,cac
2025-01,45000,1250,2.5,850,120
2025-02,48000,1320,2.3,875,115
2025-03,52000,1400,2.1,900,110
```

---

## 8. Consideraciones de Privacidad

### 8.1 Anonimización

**Principios**:
1. **Eliminación de identificadores directos**: Remover nombres, IDs personales
2. **Pseudonimización**: Reemplazar con identificadores no reveladores
3. **Encriptación**: Proteger datos sensibles
4. **Control de acceso**: Limitar quién puede acceder a los datos

**Ejemplo de anonimización**:
```csv
// Antes (con datos personales)
nombre,edad,email,telefono
Juan Pérez,25,juan@email.com,555-1234
María González,30,maria@email.com,555-5678

// Después (anonimizado)
id,edad,activo
1,25,sí
2,30,no
```

### 8.2 Manejo de Datos Sensibles

**Tipos de datos sensibles**:
- Información de salud (números de seguro, diagnósticos)
- Datos financieros (números de tarjeta, salarios)
- Información biométrica
- Datos de ubicación

**Mejores prácticas**:
1. **Encriptación en reposo**: Datos almacenados encriptados
2. **Encriptación en tránsito**: Uso de HTTPS/TLS
3. **Acceso controlado**: Autenticación y autorización
4. **Retención limitada**: Eliminar datos cuando ya no sean necesarios
5. **Consentimiento**: Obtener permiso explícito del usuario

### 8.3 Cumplimiento Normativo

**Regulaciones aplicables**:
- **GDPR**: Protección de datos en la UE
- **HIPAA**: Datos de salud en EE.UU.
- **LOPD**: Protección de datos personales en España
- **LGPD**: Protección de datos en Brasil

**Requisitos clave**:
- Notificación de brechas de seguridad
- Derecho al olvido (eliminación de datos)
- Transparencia en el uso de datos
- Consentimiento explícito

---

## 9. Backup de Datos

### 9.1 Estrategias de Respaldo

**Frecuencia de backup**:
- **Diario**: Para datos críticos en tiempo real
- **Semanal**: Para datos transaccionales
- **Mensual**: Para datos históricos

**Métodos de backup**:
1. **Full Backup**: Copia completa de todos los datos
2. **Incremental Backup**: Solo cambios desde el último backup
3. **Diferencial Backup**: Cambios desde el último full backup
4. **Cloud Backup**: Almacenamiento en servicios en la nube

### 9.2 Retención de Datos

| Tipo de dato | Retención | Ubicación |
|--------------|-----------|-----------|
| Datos transaccionales | 7 días | Backup diario |
| Datos históricos | 1 año | Backup semanal |
| Datos analíticos | 5 años | Backup mensual |
| Datos de backup | 30 días | Backup incremental |

### 9.3 Restauración

**Proceso de restauración**:
1. Identificar el punto de restauración deseado
2. Seleccionar el backup correspondiente
3. Validar integridad del backup
4. Restaurar datos
5. Verificar funcionalidad post-restauración

**Ejemplo de comando de restauración**:
```bash
# Restaurar backup diario de 2025-01-15
mysqldump --single-transaction --routines --databases nordvital > backup_2025-01-15.sql
```

---

## 10. Documentación de Archivos de Datos Existentes

### 10.1 Internship_Selection_Dataset.csv

**Información del archivo**:
- **Ubicación**: `Pruebas/Internship_Selection_Dataset.csv`
- **Tamaño**: ~10,002 registros
- **Formato**: CSV con cabeceras
- **Codificación**: UTF-8

**Columnas**:
| Columna | Tipo | Descripción | Rango |
|---------|------|-------------|-------|
| student_id | Entero | ID único del estudiante | 1-10000 |
| CGPA | Decimal | Promedio de calificaciones | 0-10 |
| skills_score | Entero | Puntuación de habilidades | 1-10 |
| projects_count | Entero | Número de proyectos | 0-100 |
| internships_done | Entero | Prácticas previas | 0-50 |
| communication_score | Entero | Puntuación comunicación | 1-10 |
| aptitude_score | Entero | Puntuación aptitud | 1-10 |
| coding_test_score | Entero | Puntuación test de código | 1-10 |
| resume_score | Entero | Puntuación CV | 1-10 |
| extracurricular | String | Participación extracurricular | Sí/No |
| college_tier | String | Nivel de universidad | Tier 1/2/3 |
| hackathons_participated | Entero | Hackatones participados | 0-20 |
| certifications_count | Entero | Certificaciones | 0-50 |
| linkedin_activity_score | Entero | Actividad LinkedIn | 1-10 |
| github_score | Entero | Puntuación GitHub | 1-10 |
| soft_skills_score | Entero | Habilidades blandas | 1-10 |
| interview_score | Entero | Puntuación entrevista | 1-10 |
| consistency_score | Entero | Consistencia | 1-10 |
| backlogs | Entero | Backlogs pendientes | 0-100 |
| placement_training | String | Entrenamiento placement | Sí/No |
| selected | Entero | Seleccionado | 0/1 |

**Métricas calculadas**:
- Promedio de calificaciones (CGPA)
- Puntuación total de habilidades
- Índice de selección ponderado
- Tasa de selección por nivel de universidad

### 10.2 Nordvital Data

**Información del archivo**:
- **Ubicación**: `Pruebas/nordvital-data.js` (datos en formato JSON)
- **Formato**: JSON/CSV
- **Codificación**: UTF-8

**Columnas**:
| Columna | Tipo | Descripción |
|---------|------|-------------|
| fecha | Fecha | Fecha de la cita |
| médico_id | Entero | ID del médico |
| médico | String | Nombre del médico |
| especialidad | String | Especialidad médica |
| tipo_cita | Enum | Tipo de cita |
| estado | Enum | Estado de la cita |
| paciente_id | Entero | ID del paciente |
| paciente | String | Nombre del paciente |
| horario | String | Hora de la cita |
| duracion_minutos | Entero | Duración en minutos |
| motivo | String | Motivo de la cita |

**Métricas calculadas**:
- Tasa de conversión de citas
- Tasa de completadas
- Tasa de incumplidas
- Promedio de duración de citas
- Utilización de médicos por especialidad

### 10.3 Datos Personalizados

**Información del archivo**:
- **Ubicación**: Variable según carga de archivos
- **Formato**: CSV flexible
- **Codificación**: UTF-8

**Características**:
- Estructura dinámica según dominio
- Validación de rangos personalizada
- Transformación automática a objetos JSON

**Ejemplo de estructura**:
```csv
id,producto,precio,stock,categoria,disponible
1,Laptop,999.99,15,Electrónica,Sí
2,Mouse,29.99,100,Accesorios,Sí
3,Teclado,79.99,45,Accesorios,Sí
```

---

## Anexos

### A. Referencias Externas

- [CSV Format Specification](https://www.csvkit.com/csv.html)
- [GDPR Data Protection](https://gdpr-info.eu/)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-health-care-providers/privacy-and-security/index.html)

### B. Herramientas Recomendadas

| Herramienta | Uso |
|-------------|-----|
| Python (pandas) | Análisis y transformación de datos |
| Node.js (csv-parse) | Parseo de CSV en JavaScript |
| SQL | Consultas y análisis de datos |
| Excel | Visualización y reportes |
| Tableau | Visualización de datos |

### C. Contactos de Soporte

- **Equipo de Datos**: data-team@anigravity.com
- **Soporte Técnico**: support@anigravity.com
- **Documentación**: docs.anigravity.com

---

*Documento generado: 2026-05-24*
*Versión: 1.0*
*Última actualización: 2026-05-24*
