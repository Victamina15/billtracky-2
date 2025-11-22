# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# FORZAR REBUILD
ARG CACHEBUST=20241122021
RUN echo "=== BUILD: $CACHEBUST ==="

# Copiar archivos de dependencias del dashboard
COPY apps/pos/dashboard/package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente del dashboard
COPY apps/pos/dashboard .

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:alpine

# Copiar archivos build a nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
