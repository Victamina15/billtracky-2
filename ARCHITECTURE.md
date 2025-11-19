Estructura inicial del monorepo Billtracky-2.0

## Aplicaciones
- apps/
   - pos/
      - new-order/ → Módulo de facturación POS (Nuevo Pedido) - Proyecto Vite funcional con React y TailwindCSS

## Paquetes compartidos
- packages/
   - utils/     → Código reutilizable

## Configuración de despliegue
- Dockerfile → Configuración Docker multi-stage (Node + Nginx)
- nginx.conf → Servidor web optimizado para SPA
- .dockerignore → Exclusión de archivos innecesarios
- DEPLOYMENT.md → Guía completa de despliegue en EasyPanel
- ENVIRONMENT.md → Configuración de entorno y variables de producción

## Infraestructura en EasyPanel (Producción)

### Servicios Desplegados
1. **PostgreSQL 17** - Base de datos principal
   - Host: `app-pos-2_postgres-db:5432`
   - Database: `app-pos-2`

2. **Metabase v0.55.8.6** - Análisis de datos
   - URL interna: `http://app-pos-2_metabase:80`

3. **Billtracky-2** - Frontend POS
   - Puerto: 80
   - Build: Vite + React + TailwindCSS
   - Servidor: Nginx Alpine

### Variables de Entorno Configuradas
```
DATABASE_URL=postgresql://postgres:1976@app-pos-2_postgres-db:5432/app-pos-2
NODE_ENV=production
METABASE_URL=http://app-pos-2_metabase:80
```

Ver `ENVIRONMENT.md` para detalles completos.