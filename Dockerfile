# Dockerfile para Monorepo Billtracky-2
# Construye la aplicación Dashboard con acceso a código compartido en /apps/shared/

# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar código compartido (necesario para imports @shared)
COPY apps/shared /app/apps/shared

# Copiar package files del dashboard
COPY apps/pos/dashboard/package*.json /app/apps/pos/dashboard/

# Cambiar al directorio de dashboard
WORKDIR /app/apps/pos/dashboard

# Instalar dependencias
RUN npm ci

# Copiar código fuente del dashboard
COPY apps/pos/dashboard /app/apps/pos/dashboard

# Build de producción (con acceso a @shared via alias de Vite)
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:alpine

# Copiar archivos compilados
COPY --from=builder /app/apps/pos/dashboard/dist /usr/share/nginx/html

# Copiar configuración de nginx (si existe)
COPY apps/pos/dashboard/nginx.conf /etc/nginx/conf.d/default.conf 2>/dev/null || echo "server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
