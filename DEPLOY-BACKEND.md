# Guía de Despliegue del Backend API - Billtracky 2.0

Esta guía te ayudará a desplegar el backend API en EasyPanel para que pueda conectarse a PostgreSQL vía la red interna de Docker.

## 📋 Pre-requisitos

- ✅ PostgreSQL ya desplegado y funcionando en EasyPanel
- ✅ Acceso a EasyPanel
- ✅ Código del backend en `apps/api/`
- ✅ Dockerfile creado

## 🚀 Opción 1: Despliegue desde GitHub (Recomendado)

### Paso 1: Subir Código a GitHub

```bash
# Desde el directorio raíz del proyecto
cd /Users/robinsonsilverio/Desktop/billtracky-2

# Verificar que estamos en el repositorio correcto
git remote -v

# Agregar todos los archivos nuevos
git add apps/api/

# Crear commit
git commit -m "feat: Add backend API with Dockerfile

- Node.js 20 + Express 5 backend
- PostgreSQL integration with connection pooling
- Complete CRUD for servicios, categorias, metodos_pago
- Transactional invoice creation
- Zod validation
- CORS configuration
- Health check endpoint
- Docker deployment ready

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Subir a GitHub
git push origin main
```

### Paso 2: Crear Servicio en EasyPanel

1. **Acceder a EasyPanel** → Tu proyecto

2. **Crear nuevo servicio:**
   - Click en "Create Service"
   - Seleccionar "From Source" → "GitHub"

3. **Configurar repositorio:**
   - Repositorio: `tu-usuario/billtracky-2`
   - Branch: `main`
   - Build Path: `apps/api` ⚠️ **Importante**

4. **Configurar Build:**
   - Build Method: `Dockerfile`
   - Dockerfile Path: `apps/api/Dockerfile`

5. **Configurar Variables de Entorno:**

   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=production

   # Database Configuration (red interna Docker)
   DATABASE_URL=postgresql://postgres:1976@app-pos-2_postgres-db:5432/app-pos-2

   # Database Initialization
   INIT_DB=false

   # CORS Configuration (actualizar con tus dominios)
   CORS_ORIGIN=https://facturacion.tudominio.com,https://config.tudominio.com
   ```

6. **Configurar Puerto:**
   - Port: `3001`

7. **Configurar Dominio (opcional pero recomendado):**
   - Agregar dominio: `api.tudominio.com`
   - O usar el dominio de EasyPanel: `billtracky-api.easypanel.host`

8. **Configurar Resources (opcional):**
   - CPU: 0.5 cores
   - Memory: 512 MB
   - Sufficient para este API

9. **Desplegar:**
   - Click en "Deploy"
   - Esperar que el build termine (1-2 minutos)

### Paso 3: Verificar Despliegue

Una vez desplegado, verifica que funciona:

```bash
# Test health endpoint
curl https://api.tudominio.com/health

# Deberías ver:
# {
#   "status": "ok",
#   "timestamp": "2025-11-19T...",
#   "uptime": 123.456,
#   "environment": "production"
# }

# Test servicios endpoint
curl https://api.tudominio.com/api/servicios

# Deberías ver:
# {
#   "success": true,
#   "data": [...],
#   "count": 5
# }
```

---

## 🔧 Opción 2: Despliegue Manual (Sin GitHub)

Si prefieres no usar GitHub, puedes usar Docker Registry:

### Paso 1: Build Local de la Imagen

```bash
# Desde el directorio del API
cd apps/api

# Build de la imagen
docker build -t billtracky-api:latest .

# Tag para tu registry
docker tag billtracky-api:latest tu-registry/billtracky-api:latest

# Push al registry
docker push tu-registry/billtracky-api:latest
```

### Paso 2: Crear Servicio en EasyPanel

1. **Crear nuevo servicio:**
   - Click en "Create Service"
   - Seleccionar "From Image"

2. **Configurar imagen:**
   - Image: `tu-registry/billtracky-api:latest`
   - Port: `3001`

3. **Configurar Variables de Entorno:**
   - (Mismas que en Opción 1)

4. **Desplegar**

---

## 🧪 Pruebas Post-Despliegue

### 1. Health Check

```bash
curl https://api.tudominio.com/health
```

### 2. Listar Servicios

```bash
curl https://api.tudominio.com/api/servicios
```

### 3. Filtrar por Categoría

```bash
curl "https://api.tudominio.com/api/servicios?categoria=lavado&activo=true"
```

### 4. Crear Servicio

```bash
curl -X POST https://api.tudominio.com/api/servicios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Service",
    "categoria_id": "lavado",
    "precio": 100.00,
    "unidad": "kg",
    "descripcion": "Servicio de prueba"
  }'
```

### 5. Listar Categorías

```bash
curl https://api.tudominio.com/api/categorias
```

### 6. Listar Métodos de Pago

```bash
curl https://api.tudominio.com/api/metodos-pago
```

---

## 🔍 Logs y Debugging

### Ver Logs en EasyPanel

1. **Acceder al servicio** en EasyPanel
2. **Click en "Logs"**
3. Verificar que veas:
   ```
   🚀 Servidor iniciado correctamente
   📡 API disponible en: http://localhost:3001
   🌍 Entorno: production
   ```

### Logs de Conexión a BD

Si hay problemas de conexión, verás en los logs:

```
❌ Error en query: Error: Connection refused
```

**Solución:** Verificar que `DATABASE_URL` usa el host interno:
```env
DATABASE_URL=postgresql://postgres:1976@app-pos-2_postgres-db:5432/app-pos-2
```

### Logs de CORS

Si hay errores de CORS en el navegador, actualizar `CORS_ORIGIN`:

```env
CORS_ORIGIN=https://facturacion.tudominio.com,https://config.tudominio.com,http://localhost:5173
```

---

## 📝 Checklist de Verificación

Antes de continuar con la integración frontend, verifica:

- [ ] Backend desplegado en EasyPanel
- [ ] Health endpoint responde correctamente
- [ ] Endpoint `/api/servicios` retorna los 5 servicios iniciales
- [ ] Endpoint `/api/categorias` retorna las 6 categorías
- [ ] Endpoint `/api/metodos-pago` retorna los 4 métodos
- [ ] Logs no muestran errores de conexión a BD
- [ ] Dominio configurado (opcional pero recomendado)

---

## 🔄 Siguiente Paso: Integrar Frontend

Una vez que el backend esté funcionando, continuar con:

**`INTEGRACION-FRONTEND.md`** - Conectar los módulos frontend con el backend API

---

## 🐛 Troubleshooting

### Problema: Build falla en EasyPanel

**Síntoma:** Error `COPY failed: file not found`

**Solución:** Verificar que el Build Path esté configurado como `apps/api`

### Problema: Backend no puede conectar a PostgreSQL

**Síntoma:** Logs muestran `ECONNREFUSED` o `Connection timeout`

**Solución:**
1. Verificar que PostgreSQL esté corriendo en EasyPanel
2. Verificar que `DATABASE_URL` use el host interno Docker:
   ```
   app-pos-2_postgres-db
   ```
   NO usar IP pública o localhost

### Problema: CORS errors en el navegador

**Síntoma:** Console del navegador muestra `CORS policy: No 'Access-Control-Allow-Origin'`

**Solución:** Agregar el dominio del frontend a `CORS_ORIGIN`:
```env
CORS_ORIGIN=https://tu-frontend.com,http://localhost:5173
```

### Problema: Health check falla

**Síntoma:** EasyPanel marca el servicio como "unhealthy"

**Solución:**
1. Verificar que el puerto expuesto sea 3001
2. Verificar que la ruta `/health` responda
3. Revisar logs para errores de inicio

---

## 📚 Referencias

- **RESUMEN-FINAL.md** - Resumen completo del proyecto
- **apps/api/README.md** - Documentación del API
- **INTEGRACION.md** - Arquitectura de integración
- **METABASE-FIX.md** - Configuración de Metabase

---

**¡Backend listo para producción!** 🚀
