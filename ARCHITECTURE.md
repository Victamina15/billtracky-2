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