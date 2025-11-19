# Guía de Despliegue en EasyPanel - Billtracky 2.0

## Configuración completada

Este proyecto está listo para desplegarse en EasyPanel con las siguientes configuraciones:

### Archivos de configuración:
- ✅ `Dockerfile` - Configuración de Docker multi-stage para producción
- ✅ `nginx.conf` - Servidor web optimizado para SPA
- ✅ `.dockerignore` - Exclusión de archivos innecesarios

## Pasos para desplegar en EasyPanel:

### 1. Conectar repositorio
- Ir a EasyPanel dashboard
- Crear nueva aplicación
- Conectar con GitHub: `https://github.com/Victamina15/Billtracky-2.0.git`
- Seleccionar rama: `main`

### 2. Configuración del servicio
- **Tipo de servicio**: App
- **Builder**: Dockerfile
- **Puerto interno**: 80
- **Ruta del Dockerfile**: `./Dockerfile` (raíz del proyecto)

### 3. Variables de entorno (opcionales por ahora)
```
NODE_ENV=production
```

### 4. Dominio
- Configurar dominio personalizado o usar el dominio automático de EasyPanel

### 5. Deploy
- Hacer clic en "Deploy"
- EasyPanel construirá automáticamente la imagen Docker
- La aplicación estará disponible en el dominio configurado

## Estructura del build:

```
1. Build Stage (Node 20 Alpine)
   - Instala dependencias
   - Compila Vite (npm run build)
   - Genera archivos estáticos en /dist

2. Production Stage (Nginx Alpine)
   - Copia archivos build a Nginx
   - Sirve la aplicación en puerto 80
   - Optimizado con gzip y caching
```

## Comandos útiles:

### Build local de Docker (opcional para probar):
```bash
docker build -t billtracky-2.0 .
docker run -p 3000:80 billtracky-2.0
```

### Acceder localmente:
```
http://localhost:3000
```

## Notas importantes:

- El proyecto usa Vite + React + TailwindCSS
- Los colores oficiales están configurados (#F4F4F5 y #FFFFFF)
- El build de producción está optimizado para rendimiento
- Nginx sirve los archivos con compresión gzip
- Soporte completo para rutas SPA (Single Page Application)
