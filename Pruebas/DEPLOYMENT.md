# Guía de Despliegue - Anigravity

## 1. Requisitos del Sistema

### Entorno Mínimo Requerido
- **Navegador moderno**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Servidor local recomendado**: Python 3.8+ o Node.js 16+
- **RAM**: Mínimo 4GB para procesamiento de datasets grandes
- **Almacenamiento**: 2GB libres para datasets y logs

### Compatibilidad de Navegadores
| Navegador | Versión Mínima | Estado |
|-----------|----------------|--------|
| Google Chrome | 90+ | ✅ Soportado |
| Mozilla Firefox | 88+ | ✅ Soportado |
| Microsoft Edge | 90+ | ✅ Soportado |
| Safari | 14+ | ✅ Soportado |
| Opera | 76+ | ✅ Soportado |

---

## 2. Configuración Inicial

### Levantar Servidor Local

#### Opción A: Python (Recomendado)
```bash
# Instalar Python 3.8+
# Windows: Descargar desde python.org o usar winget
# macOS: brew install python
# Linux: sudo apt install python3.8

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
python app.py
```

#### Opción B: Node.js
```bash
# Instalar Node.js 16+
# Windows: winget install OpenJS.NodeJS.LTS
# macOS: brew install node
# Linux: curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt-get install -y nodejs

# Instalar dependencias
npm install

# Iniciar servidor
npm start
```

### Comandos para Diferentes Entornos

| Entorno | Comando Python | Comando Node.js |
|---------|---------------|-----------------|
| Desarrollo | `python app.py --dev` | `npm run dev` |
| Producción | `python app.py --prod` | `npm run build && npm start` |
| Pruebas | `python app.py --test` | `npm run test` |
| Background | `nohup python app.py > logs/app.log 2>&1 &` | `pm2 start app.js` |

---

## 3. Despliegue en Producción

### Hosting Estático

#### GitHub Pages
```bash
# 1. Crear archivo _config.yml en raíz del repositorio
# 2. Agregar en GitHub Settings > Pages > Source: main/master
# 3. Activar en Settings > Pages > Build and deployment

# Verificar configuración
cat _config.yml
```

#### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod

# O con Git
git add .
git commit -m "Prepare for deployment"
git push origin main

# Vercel detectará automáticamente el framework
```

#### Netlify
```bash
# 1. Arrancar proyecto en Netlify Drop
# 2. Configurar en Netlify:
#    - Build command: npm run build (o python para Python)
#    - Publish directory: dist (o output de build)
#    - Build settings: Configurar en Netlify UI
```

### Configuración de CDN

```bash
# Configurar CDN con Cloudflare
# 1. Crear cuenta en cloudflare.com
# 2. Agregar dominio
# 3. Configurar SSL (Free SSL/TLS)
# 4. Activar caching para assets

# Headers recomendados
# - X-Content-Type-Options: nosniff
# - X-Frame-Options: DENY
# - X-XSS-Protection: 1; mode=block
# - Referrer-Policy: strict-origin-when-cross-origin
```

---

## 4. Configuración de Entorno

### Variables de Entorno

```bash
# .env.example (NO COMMITAR)
# Copiar a .env con valores reales

# Servidor
PORT=3000
HOST=0.0.0.0
DEBUG=false

# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/anigravity
DATABASE_POOL_SIZE=10

# API Keys
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here

# Datos de ejemplo
USE_SAMPLE_DATA=true
SAMPLE_DATA_PATH=./data/sample_dataset.csv

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
CORS_ALLOW_CREDENTIALS=true
```

### Datos de Ejemplo

```bash
# Generar datos de prueba
python scripts/generate_sample_data.py

# O cargar desde archivo
cp data/sample_dataset.csv ./data/
```

---

## 5. Pruebas y Validación

### Verificación Pre-Despliegue

```bash
# 1. Pruebas unitarias
npm test

# 2. Pruebas de integración
npm run test:integration

# 3. Validación de datos
python scripts/validate_data.py

# 4. Pruebas de carga (opcional)
npm run load-test
```

### Comandos de Validación

| Prueba | Comando |
|--------|---------|
| Salud del servidor | `curl -f http://localhost:3000/health` |
| API endpoints | `curl http://localhost:3000/api/validate` |
| Procesamiento CSV | `python scripts/test_csv_processing.py` |
| Autenticación | `curl -X POST http://localhost:3000/auth/login -d "user=test"` |

### Scripts de Validación

```bash
# Validar estructura de datos
python scripts/validate_data.py

# Verificar integridad de CSV
python scripts/check_csv_integrity.py

# Test de rendimiento
python scripts/benchmark.py
```

---

## 6. Monitoreo y Logs

### Consideraciones para Producción

#### Logs Estructurados
```python
# Ejemplo de logging estructurado
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)
```

#### Monitoreo de Aplicación

| Herramienta | Uso |
|-------------|-----|
| Prometheus + Grafana | Métricas y dashboards |
| ELK Stack | Logs centralizados |
| Sentry | Error tracking |
| New Relic | APM completo |

#### Métricas Clave

```bash
# Métricas a monitorear
# - Tiempo de respuesta (p95, p99)
# - Tasa de errores (4xx, 5xx)
# - Uso de CPU/RAM
# - Conexiones activas
# - Tasa de procesamiento de CSV
# - Latencia de API
```

---

## 7. Seguridad

### CORS

```python
# Configuración de CORS en Flask/FastAPI
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": allowed_origins}})

# Headers requeridos
# Access-Control-Allow-Origin
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE
# Access-Control-Allow-Headers: Content-Type, Authorization
```

### Sanitización de Datos

```python
# Sanitización básica
from flask import request

# Validar y sanitizar inputs
def sanitize_input(data):
    if isinstance(data, str):
        return data.strip().replace('\n', ' ').replace('\r', ' ')
    return data

# Validar tipos de datos
def validate_csv_columns(df):
    required_columns = ['id', 'name', 'score']
    missing = [col for col in required_columns if col not in df.columns]
    if missing:
        raise ValueError(f"Faltan columnas: {missing}")
```

### Validación de Archivos CSV

```python
# Validar archivos CSV antes de procesar
def validate_csv_file(file_path):
    import pandas as pd
    
    try:
        # Verificar extensión
        if not file_path.lower().endswith('.csv'):
            raise ValueError("Solo se aceptan archivos CSV")
        
        # Leer y validar estructura
        df = pd.read_csv(file_path)
        
        # Verificar columnas requeridas
        required = ['id', 'name', 'score']
        if not all(col in df.columns for col in required):
            raise ValueError(f"Faltan columnas: {set(required) - set(df.columns)}")
        
        # Verificar tipos de datos
        if not pd.api.types.is_numeric_dtype(df['score']):
            raise ValueError("La columna 'score' debe ser numérica")
        
        # Verificar valores nulos
        if df.isnull().sum().sum() > 0:
            raise ValueError(f"Existen {df.isnull().sum().sum()} valores nulos")
            
        return True
        
    except Exception as e:
        raise ValueError(f"Error al validar CSV: {str(e)}")
```

---

## 8. Escalabilidad

### Consideraciones para Grandes Datasets

#### Optimización de Procesamiento

```python
# Procesamiento en chunks para grandes datasets
def process_large_csv(file_path, chunk_size=10000):
    import pandas as pd
    
    chunks = []
    for chunk in pd.read_csv(file_path, chunksize=chunk_size):
        processed = process_chunk(chunk)
        chunks.append(processed)
    
    result = pd.concat(chunks, ignore_index=True)
    return result
```

#### Escalabilidad Horizontal

| Estrategia | Descripción |
|------------|-------------|
| Load Balancing | Distribuir tráfico entre instancias |
| Caching | Redis/Memcached para datos frecuentes |
| Database Sharding | Particionar datos por región |
| Message Queue | RabbitMQ/Kafka para procesamiento asíncrono |

#### Configuración de Escalado

```bash
# Auto-scaling con Kubernetes
# HPA (Horizontal Pod Autoscaler)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: anigravity-hpa
spec:
  scaleTargetRef:
    apiVersion: v1
    kind: Pod
    name: anigravity-app
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## 9. Backup y Recuperación

### Estrategias de Respaldo

#### Backup de Base de Datos

```bash
# PostgreSQL Backup
pg_dump -h localhost -U anigravity_user -d anigravity > backup_$(date +%Y%m%d).sql

# Restaurar
psql -h localhost -U anigravity_user -d anigravity < backup_20250101.sql
```

#### Backup de Archivos

```bash
# Backup de datasets
rsync -avz /data/datasets/ backup-server:/backups/anigravity/datasets/

# Backup con cron
# /etc/cron.daily/backup.sh
0 2 * * * /usr/bin/rsync -avz /data/datasets/ backup-server:/backups/anigravity/
```

### Recuperación de Despliegue

```bash
# Restaurar desde backup
# 1. Descargar backup
wget https://backup-server/backup_20250101.tar.gz

# 2. Restaurar base de datos
psql -h localhost -U anigravity_user -d anigravity < backup_20250101.sql

# 3. Restaurar archivos
tar -xzf backup_20250101.tar.gz -C /data/
```

---

## 10. Documentación de Despliegue Paso a Paso

### Despliegue Completo - Guía Paso a Paso

#### Paso 1: Preparación del Entorno

```bash
# 1.1 Clonar repositorio
git clone https://github.com/yourorg/anigravity.git
cd anigravity

# 1.2 Instalar dependencias
pip install -r requirements.txt
npm install

# 1.3 Configurar variables de entorno
cp .env.example .env
nano .env  # Editar con valores reales
```

#### Paso 2: Configuración de Base de Datos

```bash
# 2.1 Crear base de datos
createdb anigravity

# 2.2 Ejecutar migrations
python scripts/migrate.py

# 2.3 Cargar datos de ejemplo (opcional)
python scripts/load_sample_data.py
```

#### Paso 3: Construcción y Despliegue

```bash
# 3.1 Construir proyecto
npm run build

# 3.2 Iniciar servidor en producción
python app.py --prod

# 3.3 Verificar despliegue
curl http://localhost:3000/health
```

#### Paso 4: Configuración de Hosting

```bash
# 4.1 Subir código al repositorio
git add .
git commit -m "Prepare for production deployment"
git push origin main

# 4.2 Desplegar en Vercel/Netlify
vercel --prod
# O arrastrar proyecto a Netlify

# 4.3 Configurar dominio
# - Agregar DNS records
# - Configurar SSL/HTTPS
# - Redirección HTTP a HTTPS
```

#### Paso 5: Validación Post-Despliegue

```bash
# 5.1 Verificar endpoints críticos
curl http://yourdomain.com/health
curl http://yourdomain.com/api/validate

# 5.2 Verificar logs
tail -f /var/log/anigravity/app.log

# 5.3 Monitoreo inicial
# - Verificar métricas en dashboard
# - Revisar errores en Sentry
# - Monitorizar tiempo de respuesta
```

#### Paso 6: Monitoreo Continuo

```bash
# Configurar monitoreo
# - Prometheus scrape configs
# - Grafana dashboards
# - Alert rules en PagerDuty/Opsgenie

# Monitoreo diario
# - Revisar logs de errores
# - Verificar integridad de datos
# - Actualizar backups
```

---

## Apéndices

### Comandos Útiles

```bash
# Gestión de procesos
# Windows: taskkill /F /IM python.exe /FI "IMAGENAME eq app.py"
# macOS/Linux: killall -9 python

# Logs
# Windows: Get-Content logs\app.log -Tail 100
# macOS/Linux: tail -f logs/app.log

# Backup rápido
# Windows: robocopy data backup-server:\anigracity /E /R:3 /W:5
# macOS/Linux: rsync -avz data/ backup-server:/anigravity/
```

### Troubleshooting

| Problema | Solución |
|----------|----------|
| Servidor no inicia | Verificar puerto 3000 libre: `netstat -ano | findstr :3000` |
| Error de CORS | Verificar `ALLOWED_ORIGINS` en `.env` |
| CSV no se procesa | Validar estructura con `python scripts/validate_data.py` |
| Base de datos inaccesible | Verificar `DATABASE_URL` y credenciales |
| Alta latencia | Verificar métricas de CPU/RAM en dashboard |

---

*Última actualización: 2025-01-24*
