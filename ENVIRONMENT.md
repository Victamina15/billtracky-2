# Configuración de Entorno - Billtracky 2.0

## Estado del Despliegue

✅ **TODOS LOS SERVICIOS CONFIGURADOS Y CORRIENDO**

### Servicios Desplegados en EasyPanel

#### 1. PostgreSQL Database
- **Servicio**: `app-pos-2_postgres-db`
- **Imagen**: `postgres:17`
- **Estado**: ✅ Corriendo
- **Puerto**: 5432 (interno)
- **Credenciales**:
  - Usuario: `postgres`
  - Contraseña: `1976`
  - Base de datos: `app-pos-2`
- **Conexión interna**: `postgresql://postgres:1976@app-pos-2_postgres-db:5432/app-pos-2`

#### 2. Metabase (Análisis de Datos)
- **Servicio**: `app-pos-2_metabase`
- **Imagen**: `metabase/metabase:v0.55.8.6`
- **Estado**: ✅ Corriendo
- **Puerto**: 80 (interno)
- **Acceso interno**: `http://app-pos-2_metabase:80`

#### 3. Billtracky-2 Frontend (POS)
- **Servicio**: `app-pos-2_billtracky-2`
- **Imagen**: `easypanel/app-pos-2/billtracky-2:latest`
- **Estado**: ✅ Corriendo
- **Puerto**: 80 (interno)
- **Repositorio**: `https://github.com/Victamina15/billtracky-2`
- **Rama**: `main`

## Variables de Entorno Configuradas

### Billtracky-2 Application

```env
# Base de datos PostgreSQL
DATABASE_URL=postgresql://postgres:1976@app-pos-2_postgres-db:5432/app-pos-2
POSTGRES_HOST=app-pos-2_postgres-db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1976
POSTGRES_DB=app-pos-2

# Entorno
NODE_ENV=production
PORT=80

# Servicios integrados
METABASE_URL=http://app-pos-2_metabase:80

# Git Info (auto-generado por EasyPanel)
GIT_SHA=9e29691a35cbd9f30812955a440509241a4788e9
DEPLOY_TIMESTAMP=1763515033009
```

## Arquitectura de Red

```
Internet
    │
    ├─→ Traefik (Reverse Proxy)
    │       │
    │       ├─→ billtracky-2 (Frontend React/Vite)
    │       │         │
    │       │         └─→ PostgreSQL (Base de datos)
    │       │
    │       └─→ Metabase (Análisis de datos)
    │                 │
    │                 └─→ PostgreSQL (misma base de datos)
```

## Redes Docker

- **easypanel**: Red principal de EasyPanel
- **easypanel-app-pos-2**: Red dedicada del proyecto

Todos los servicios están en la misma red Docker Swarm y pueden comunicarse entre sí usando los nombres de servicio.

## Acceso a Servicios

### Para configurar dominios públicos:
1. Ve a EasyPanel dashboard: http://82.197.65.255:3000
2. Selecciona el proyecto "app-pos-2"
3. Para cada servicio, configura un dominio:
   - `billtracky-2`: Tu aplicación principal POS
   - `metabase`: Panel de análisis de datos

## Comandos Útiles

### Ver logs de servicios
```bash
# Logs de billtracky-2
docker service logs app-pos-2_billtracky-2 -f

# Logs de PostgreSQL
docker service logs app-pos-2_postgres-db -f

# Logs de Metabase
docker service logs app-pos-2_metabase -f
```

### Ver estado de servicios
```bash
docker service ls | grep app-pos-2
```

### Conectar a la base de datos
```bash
docker exec -it $(docker ps -q -f name=app-pos-2_postgres-db) psql -U postgres -d app-pos-2
```

## Próximos Pasos

1. ✅ Configurar dominios públicos en EasyPanel
2. ⏳ Desarrollar funcionalidad del módulo POS
3. ⏳ Integrar con la base de datos PostgreSQL
4. ⏳ Configurar dashboards en Metabase
5. ⏳ Implementar autenticación y sesiones
6. ⏳ Migrar funcionalidad de Billtracky-1

## Notas Importantes

- La aplicación actual es un frontend estático servido por Nginx
- Las variables de base de datos están configuradas pero la app aún no las usa
- Metabase puede conectarse a la misma base de datos para análisis
- Todos los servicios están en la misma red privada de Docker
- La comunicación entre servicios usa nombres DNS internos de Docker Swarm
