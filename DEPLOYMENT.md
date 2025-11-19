# Guía de Despliegue - Billtracky 2.0

Esta guía detalla el proceso completo de despliegue de todos los módulos de Billtracky 2.0 en EasyPanel.

## Arquitectura del Sistema

El sistema consta de 5 aplicaciones principales:

1. **Backend API** (Node.js + Express + PostgreSQL)
2. **Dashboard** (Frontend - Hub principal)
3. **Facturación** (Frontend - Módulo de facturas)
4. **Configuración** (Frontend - Módulo de configuración)
5. **PostgreSQL** (Base de datos)

## Pre-requisitos

- Cuenta de EasyPanel configurada
- Base de datos PostgreSQL desplegada en EasyPanel
- GitHub repository con el código actualizado
- Dominio configurado (opcional)

## Paso 1: Desplegar PostgreSQL

Si aún no tienes PostgreSQL desplegado:

1. En EasyPanel, crea un nuevo servicio "PostgreSQL"
2. Configura el nombre: `postgres-db`
3. Configura la base de datos: `app-pos-2`
4. Guarda las credenciales generadas
5. Ejecuta el schema inicial:

```bash
# Copiar schema a producción
scp apps/api/src/db/schema.sql root@tu-servidor:/tmp/

# Ejecutar schema
ssh root@tu-servidor
docker exec -i $(docker ps --filter name=postgres-db -q | head -1) psql -U postgres -d app-pos-2 < /tmp/schema.sql
```

## Paso 2: Desplegar Backend API

### 2.1 Crear Aplicación en EasyPanel

1. Crear nueva aplicación: "api-backend"
2. Tipo: Docker
3. Build context: `apps/api`
4. Dockerfile path: `Dockerfile`

### 2.2 Crear Dockerfile Backend

Crear `apps/api/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3001/health || exit 1

# Iniciar aplicación
CMD ["node", "src/index.js"]
```

### 2.3 Configurar Variables de Entorno

En EasyPanel, configurar las siguientes variables:

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://postgres:PASSWORD@postgres-db:5432/app-pos-2
INIT_DB=false
CORS_ORIGIN=https://dashboard.tudominio.com,https://facturacion.tudominio.com,https://configuracion.tudominio.com
```

**Importante:**
- Reemplaza `PASSWORD` con la contraseña de PostgreSQL
- Actualiza `CORS_ORIGIN` con tus dominios reales
- Si usas HTTP, ajusta el protocolo a `http://`

### 2.4 Configurar Puerto

- Puerto interno: `3001`
- Puerto externo: Puede ser cualquiera o usar dominio

### 2.5 Deploy

1. Guardar configuración
2. Hacer deploy
3. Verificar logs para confirmar inicio exitoso

## Paso 3: Desplegar Dashboard

### 3.1 Crear Aplicación en EasyPanel

1. Crear nueva aplicación: "dashboard"
2. Tipo: Docker
3. Build context: `apps/pos/dashboard`
4. Dockerfile path: `Dockerfile`

### 3.2 Configurar Variables de Entorno

```env
VITE_API_URL=https://api.tudominio.com
```

O si usas IP directa:

```env
VITE_API_URL=http://IP_SERVIDOR:3001
```

### 3.3 Configurar Puerto

- Puerto interno: `80`
- Puerto externo: `80` o usar dominio

### 3.4 Deploy

1. Guardar configuración
2. Hacer deploy
3. Verificar que la aplicación carga correctamente

## Paso 4: Desplegar Facturación

### 4.1 Crear Aplicación en EasyPanel

1. Crear nueva aplicación: "facturacion"
2. Tipo: Docker
3. Build context: `apps/pos/facturacion`
4. Dockerfile path: `Dockerfile`

### 4.2 Configurar Variables de Entorno

```env
VITE_API_URL=https://api.tudominio.com
```

### 4.3 Configurar Puerto

- Puerto interno: `80`
- Puerto externo: `80` o usar dominio

### 4.4 Deploy

1. Guardar configuración
2. Hacer deploy
3. Verificar funcionalidad

## Paso 5: Desplegar Configuración

### 5.1 Crear Aplicación en EasyPanel

1. Crear nueva aplicación: "configuracion"
2. Tipo: Docker
3. Build context: `apps/pos/configuracion`
4. Dockerfile path: `Dockerfile`

### 5.2 Configurar Variables de Entorno

```env
VITE_API_URL=https://api.tudominio.com
```

### 5.3 Configurar Puerto

- Puerto interno: `80`
- Puerto externo: `80` o usar dominio

### 5.4 Deploy

1. Guardar configuración
2. Hacer deploy
3. Verificar funcionalidad

## Paso 6: Configurar Dominios (Opcional)

Si tienes dominios configurados:

1. **api.tudominio.com** → Backend API
2. **dashboard.tudominio.com** → Dashboard
3. **facturacion.tudominio.com** → Facturación
4. **configuracion.tudominio.com** → Configuración

### 6.1 Actualizar URLs en Dashboard

Actualizar `apps/pos/dashboard/src/components/Sidebar.jsx`:

```javascript
const modules = [
  {
    id: 'facturacion',
    name: 'Facturación',
    icon: Receipt,
    url: 'https://facturacion.tudominio.com', // Actualizar
    external: true
  },
  {
    id: 'configuracion',
    name: 'Configuración',
    icon: Settings,
    url: 'https://configuracion.tudominio.com', // Actualizar
    external: true,
    // ...
  }
]
```

Re-desplegar dashboard después de actualizar las URLs.

## Paso 7: Verificación Post-Despliegue

### 7.1 Verificar Backend API

```bash
# Health check
curl https://api.tudominio.com/health

# Obtener servicios
curl https://api.tudominio.com/api/servicios

# Obtener categorías
curl https://api.tudominio.com/api/categorias
```

Deberías recibir respuestas JSON con `success: true`.

### 7.2 Verificar Frontend

1. **Dashboard:**
   - Abrir `https://dashboard.tudominio.com`
   - Verificar que carga correctamente
   - Verificar que los módulos son clicables
   - Verificar que se abren en nueva pestaña

2. **Facturación:**
   - Abrir `https://facturacion.tudominio.com`
   - Verificar que carga el módulo
   - Verificar que se pueden seleccionar servicios
   - Verificar que el carrito funciona

3. **Configuración:**
   - Abrir `https://configuracion.tudominio.com`
   - Verificar navegación entre pestañas
   - Crear un servicio de prueba
   - Verificar que persiste en la base de datos

### 7.3 Verificar CORS

Abre la consola del navegador en cualquier frontend:

1. Verifica que no hay errores CORS
2. Verifica que las llamadas API funcionan
3. Si hay errores CORS:
   - Revisar variable `CORS_ORIGIN` en backend
   - Asegurar que incluye todos los dominios frontend
   - Re-desplegar backend

## Troubleshooting

### Error: CORS policy

**Síntoma:** Errores en consola del navegador sobre CORS

**Solución:**
1. Verificar `CORS_ORIGIN` en variables de entorno del backend
2. Asegurar que incluye el dominio correcto con protocolo (http:// o https://)
3. Re-desplegar backend

### Error: Cannot connect to database

**Síntoma:** Backend no inicia o logs muestran error de conexión

**Solución:**
1. Verificar que `DATABASE_URL` está correcta
2. Verificar que PostgreSQL está corriendo
3. Verificar que el nombre de la base de datos es correcto
4. Verificar credenciales

### Error: Module not found en build

**Síntoma:** Build falla con error de módulo no encontrado

**Solución:**
1. Verificar que el build context es correcto
2. Verificar que el Dockerfile path es correcto
3. Verificar que package.json existe en el build context
4. Limpiar cache y re-intentar

### Error: 404 en rutas del frontend

**Síntoma:** Rutas directas devuelven 404 en producción

**Solución:**
1. Verificar que nginx.conf está siendo copiado correctamente
2. Verificar la configuración `try_files $uri $uri/ /index.html`
3. Re-desplegar

## Monitoreo

### Logs de Aplicación

En EasyPanel, puedes ver los logs en tiempo real:

1. Ir a la aplicación
2. Click en "Logs"
3. Ver logs en tiempo real

### Health Checks

Todos los servicios tienen health checks configurados:

- **Backend:** `GET /health`
- **Frontends:** `wget http://localhost/`

EasyPanel reiniciará automáticamente servicios que fallen el health check.

## Mantenimiento

### Actualizar Código

1. Push cambios a GitHub
2. En EasyPanel, ir a cada aplicación
3. Click en "Rebuild"
4. Esperar a que termine el build
5. Verificar que funciona correctamente

### Backup de Base de Datos

```bash
# Conectar al servidor
ssh root@tu-servidor

# Hacer backup
docker exec $(docker ps --filter name=postgres-db -q | head -1) \
  pg_dump -U postgres app-pos-2 > backup_$(date +%Y%m%d).sql

# Descargar backup
scp root@tu-servidor:backup_*.sql ./backups/
```

### Restaurar Backup

```bash
# Subir backup
scp backup_YYYYMMDD.sql root@tu-servidor:/tmp/

# Restaurar
ssh root@tu-servidor
docker exec -i $(docker ps --filter name=postgres-db -q | head -1) \
  psql -U postgres app-pos-2 < /tmp/backup_YYYYMMDD.sql
```

## Notas de Seguridad

1. **HTTPS:** Siempre usa HTTPS en producción
2. **Variables de Entorno:** Nunca commitees credenciales al repositorio
3. **CORS:** Configura CORS solo para dominios específicos
4. **Firewall:** PostgreSQL no debe estar expuesto públicamente
5. **Backup:** Haz backups regulares de la base de datos

## Resumen de URLs

Una vez desplegado, tendrás:

| Servicio | URL | Puerto |
|----------|-----|--------|
| Dashboard | https://dashboard.tudominio.com | 80 |
| Facturación | https://facturacion.tudominio.com | 80 |
| Configuración | https://configuracion.tudominio.com | 80 |
| Backend API | https://api.tudominio.com | 3001 |
| PostgreSQL | postgres-db:5432 (interno) | 5432 |

## Archivos de Configuración por Módulo

### Dashboard
- ✅ `apps/pos/dashboard/Dockerfile` - Build multi-stage con Nginx
- ✅ `apps/pos/dashboard/nginx.conf` - Configuración SPA con caching

### Facturación
- ✅ `apps/pos/facturacion/Dockerfile` - Build multi-stage con Nginx
- ✅ `apps/pos/facturacion/nginx.conf` - Configuración SPA con caching

### Configuración
- ✅ `apps/pos/configuracion/Dockerfile` - Build multi-stage con Nginx
- ✅ `apps/pos/configuracion/nginx.conf` - Configuración SPA con caching

### Backend API
- ⏳ `apps/api/Dockerfile` - Pendiente de crear
- ⏳ `apps/api/.env.example` - Variables de entorno de referencia

## Próximos Pasos

1. Crear Dockerfile para el backend API
2. Configurar certificados SSL/TLS (EasyPanel lo hace automáticamente)
3. Configurar backups automáticos
4. Configurar monitoreo y alertas
5. Implementar CI/CD con GitHub Actions
6. Agregar autenticación y autorización
