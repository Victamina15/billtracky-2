# Backend API - Billtracky 2.0

API REST para el sistema POS Billtracky 2.0. Gestiona servicios, categorías, métodos de pago y facturas con PostgreSQL.

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de PostgreSQL.

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

## 📁 Estructura del Proyecto

```
api/
├── src/
│   ├── config/
│   │   └── database.js           # Configuración PostgreSQL Pool
│   ├── controllers/
│   │   └── servicios.controller.js  # Lógica de negocio
│   ├── routes/
│   │   ├── servicios.js          # Rutas de servicios
│   │   ├── categorias.js         # Rutas de categorías
│   │   ├── metodosPago.js        # Rutas de métodos de pago
│   │   └── facturas.js           # Rutas de facturas
│   ├── db/
│   │   └── schema.sql            # Esquema PostgreSQL
│   └── index.js                  # Entrada principal
├── .env.example
├── .env
├── package.json
└── README.md
```

## 📡 Endpoints

### Health Check
- `GET /health` - Estado del servidor

### Servicios
- `GET /api/servicios` - Listar servicios
  - Query params: `?categoria=lavado&activo=true`
- `GET /api/servicios/:id` - Obtener servicio específico
- `POST /api/servicios` - Crear servicio
- `PUT /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio
- `PATCH /api/servicios/:id/toggle` - Activar/desactivar

### Categorías
- `GET /api/categorias` - Listar categorías (incluye "Todos")
- `POST /api/categorias` - Crear categoría
- `PUT /api/categorias/:id` - Actualizar categoría
- `DELETE /api/categorias/:id` - Eliminar categoría

### Métodos de Pago
- `GET /api/metodos-pago` - Listar métodos activos
- `POST /api/metodos-pago` - Crear método
- `PUT /api/metodos-pago/:id` - Actualizar método
- `DELETE /api/metodos-pago/:id` - Eliminar método

### Facturas
- `POST /api/facturas` - Crear factura
- `GET /api/facturas` - Listar facturas
- `GET /api/facturas/:id` - Obtener factura específica

## 🗄️ Base de Datos

### Inicialización

El esquema se carga automáticamente al iniciar el servidor por primera vez:

```bash
npm run dev
# Verás: "✅ Base de datos inicializada correctamente"
```

### Tablas Principales

1. **categorias** - Categorías de servicios
2. **servicios** - Catálogo de servicios
3. **metodos_pago** - Métodos de pago aceptados
4. **clientes** - Base de clientes
5. **facturas** - Facturas generadas
6. **facturas_items** - Líneas de cada factura

### Datos Iniciales (Seeds)

El esquema incluye datos precargados:
- 6 categorías con colores
- 5 servicios básicos
- 4 métodos de pago

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Producción
npm start
```

### Ejemplo de Request

**POST /api/servicios**
```json
{
  "nombre": "Lavado Premium",
  "categoria_id": "lavado",
  "precio": 300.00,
  "unidad": "kg",
  "descripcion": "Lavado de alta calidad",
  "tiempo_estimado": 180
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "nombre": "Lavado Premium",
    "categoria_id": "lavado",
    "precio": "300.00",
    "unidad": "kg",
    "descripcion": "Lavado de alta calidad",
    "tiempo_estimado": 180,
    "activo": true,
    "created_at": "2025-11-19T10:30:00.000Z",
    "updated_at": "2025-11-19T10:30:00.000Z"
  },
  "message": "Servicio creado exitosamente"
}
```

## 🛡️ Validación con Zod

Todos los endpoints usan Zod para validar datos:

```javascript
const ServicioSchema = z.object({
  nombre: z.string().min(1).max(100),
  categoria_id: z.string().min(1),
  precio: z.number().positive().min(0.01),
  unidad: z.enum(['kg', 'unidad', 'metro', 'servicio']),
  descripcion: z.string().max(300).optional(),
  tiempo_estimado: z.number().int().positive().optional(),
});
```

## 🌐 CORS

Configurado para aceptar peticiones desde los frontends:
- `http://localhost:5173` (Facturación)
- `http://localhost:5174` (Configuración)

En producción, actualizar `CORS_ORIGIN` en `.env`:

```env
CORS_ORIGIN=https://facturacion.tudominio.com,https://config.tudominio.com
```

## 🔌 Integración con Frontend

### Configuración

Los módulos deben configurar la URL del API:

**Vite (.env)**
```env
VITE_API_URL=http://localhost:3001
```

### Ejemplo de Integración

```javascript
// api/servicios.js
const API_URL = import.meta.env.VITE_API_URL;

export const getServicios = async (categoria = 'todos') => {
  const response = await fetch(
    `${API_URL}/api/servicios?categoria=${categoria}&activo=true`
  );
  const data = await response.json();
  return data.data;
};

export const createServicio = async (servicio) => {
  const response = await fetch(`${API_URL}/api/servicios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(servicio),
  });
  const data = await response.json();
  return data;
};
```

## 📊 Logging

El API incluye logging automático en desarrollo:

```
[2025-11-19T10:30:00.000Z] GET /api/servicios
📊 Query ejecutada: { text: 'SELECT * FROM servicios_completos...', duration: '15ms', rows: 5 }
```

## 🚨 Manejo de Errores

### Errores de Validación (Zod)
```json
{
  "success": false,
  "error": "Error de validación",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "message": "El nombre es requerido",
      "path": ["nombre"]
    }
  ]
}
```

### Errores de Base de Datos
```json
{
  "success": false,
  "error": "Error de base de datos",
  "message": "duplicate key value violates unique constraint",
  "code": "23505"
}
```

## 🐳 Deployment

### Docker

```dockerfile
# En construcción
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Variables de Entorno en Producción

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@app-pos-2_postgres-db:5432/app-pos-2
CORS_ORIGIN=https://yourdomain.com
```

## 🔜 Próximos Pasos

### Completar Endpoints Faltantes

Los endpoints básicos de servicios están implementados. Falta:

1. **Categorías** - Completar CRUD (usar `servicios.controller.js` como template)
2. **Métodos de Pago** - Completar CRUD
3. **Clientes** - Agregar gestión de clientes
4. **Facturas** - Completar endpoints de listado, búsqueda, etc.

### Mejoras Sugeridas

- [ ] Autenticación con JWT
- [ ] Paginación en listados
- [ ] Búsqueda avanzada
- [ ] Webhooks para sincronización en tiempo real
- [ ] Rate limiting
- [ ] Tests unitarios y de integración
- [ ] Documentación con Swagger/OpenAPI

## 📚 Referencias

- PostgreSQL Pool: [node-postgres](https://node-postgres.com/)
- Validación: [Zod](https://zod.dev/)
- Express: [Express.js](https://expressjs.com/)

---

**Desarrollado con Node.js + Express + PostgreSQL**
**Parte del sistema Billtracky 2.0**
