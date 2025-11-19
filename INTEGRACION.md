# Integración de Módulos - Billtracky 2.0

## 🔗 Arquitectura de Integración

Billtracky 2.0 utiliza una arquitectura modular donde los módulos se comunican entre sí a través de APIs públicas:

```
┌──────────────────────────────────────────────────────────────┐
│                    CONFIGURACIÓN                              │
│              (Módulo de Datos Maestros)                       │
│                                                               │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────┐     │
│  │  Servicios    │  │  Categorías   │  │  Métodos de  │     │
│  │  (Zustand)    │  │  (Zustand)    │  │  Pago        │     │
│  └───────┬───────┘  └───────┬───────┘  └──────┬───────┘     │
│          │                  │                   │             │
│          └──────────────────┼───────────────────┘             │
│                             │                                 │
│                    ┌────────▼────────┐                        │
│                    │   API Pública   │                        │
│                    │  (src/api/)     │                        │
│                    └────────┬────────┘                        │
└─────────────────────────────┼──────────────────────────────────┘
                              │
                              │ @configuracion alias
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                      FACTURACIÓN                               │
│                 (Módulo de Ventas POS)                         │
│                                                                │
│  ┌─────────────────────────────────────────────────┐          │
│  │  Data Layer (mockServicios, mockMetodosPago)    │          │
│  │  Importa: @configuracion/api/*                  │          │
│  └────────────────────┬────────────────────────────┘          │
│                       │                                        │
│                       ▼                                        │
│            Componentes de Facturación                         │
│         (Carrito, Totales, MetodosPago, etc.)                 │
└────────────────────────────────────────────────────────────────┘
```

## 📦 Módulos Integrados

### 1. CONFIGURACIÓN (Datos Maestros)

**Ubicación**: `apps/pos/configuracion/`

**Responsabilidades**:
- Gestionar servicios (CRUD)
- Gestionar categorías (CRUD)
- Gestionar métodos de pago (CRUD)
- Validar datos con Zod
- Proveer API pública para otros módulos

**API Pública**:
```javascript
// src/api/servicios.js
export const getServicios(categoria)
export const getServicioById(id)
export const buscarServicios(query)
export const getEstadisticasServicios()

// src/api/categorias.js
export const getCategorias()
export const getCategoriasActivas()
export const getCategoriaById(id)

// src/api/metodosPago.js
export const getMetodosPago()
export const getMetodoPagoById(id)
export const requiereReferencia(id)
export const calcularComision(id, monto)
```

### 2. FACTURACIÓN (Ventas POS)

**Ubicación**: `apps/pos/facturacion/`

**Responsabilidades**:
- Interfaz de punto de venta
- Selección de servicios
- Gestión del carrito
- Cálculo de totales e ITBIS
- Procesamiento de pagos

**Dependencias**:
- Importa servicios desde CONFIGURACIÓN
- Importa categorías desde CONFIGURACIÓN
- Importa métodos de pago desde CONFIGURACIÓN

## 🔧 Configuración Técnica

### Vite Alias en Facturación

Para permitir las importaciones entre módulos, se configuró un alias en `apps/pos/facturacion/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@configuracion': path.resolve(__dirname, '../configuracion/src'),
    },
  },
})
```

### Uso del Alias

```javascript
// ✅ Correcto - Usar alias
import { getServicios } from '@configuracion/api/servicios';

// ❌ Incorrecto - Path relativo
import { getServicios } from '../../configuracion/src/api/servicios';
```

## 🔄 Flujo de Datos

### 1. Configurar Servicios

```
Usuario Admin → CONFIGURACIÓN
                └→ Agregar/Editar Servicio
                   └→ Validar con Zod
                      └→ Guardar en useServiciosStore
                         └→ Disponible vía API pública
```

### 2. Usar en Facturación

```
Cajero → FACTURACIÓN
         └→ Cargar servicios con useQuery
            └→ Importa getServicios desde @configuracion
               └→ Lee useServiciosStore
                  └→ Muestra en ListaServicios
```

## 📊 Estado Compartido

### CONFIGURACIÓN (Zustand Stores)
```javascript
// useServiciosStore
{
  servicios: [...],      // 5 servicios precargados
  servicioEditando: null,
  agregarServicio(),
  actualizarServicio(),
  eliminarServicio(),
  exportServicios()      // Para Facturación
}

// useCategoriasStore
{
  categorias: [...],     // 6 categorías precargadas
  exportCategorias()     // Para Facturación
}

// useMetodosPagoStore
{
  metodosPago: [...],    // 4 métodos precargados
  exportMetodosPago()    // Para Facturación
}
```

### FACTURACIÓN (Zustand Store)
```javascript
// useFacturaStore
{
  items: [],            // Carrito de factura
  cliente: null,
  fechaEntrega: Date,
  metodoPago: null,
  agregarServicio(),
  getSubtotal(),
  getItbis(),          // 18%
  getTotal()
}
```

## 🎯 Ventajas de la Integración

### 1. Fuente Única de Verdad
- Los servicios, categorías y métodos de pago se definen solo en CONFIGURACIÓN
- FACTURACIÓN los consume sin duplicación
- Cambios en CONFIGURACIÓN se reflejan automáticamente

### 2. Validación Centralizada
- Zod valida todos los datos en CONFIGURACIÓN
- FACTURACIÓN recibe datos ya validados
- Menos código de validación duplicado

### 3. Separación de Responsabilidades
- **CONFIGURACIÓN**: Admin/Backoffice
- **FACTURACIÓN**: Operaciones/Cajeros
- Cada módulo tiene su propósito claro

### 4. Escalabilidad
- Fácil agregar nuevos módulos que consuman CONFIGURACIÓN
- API pública bien definida
- React Query cachea los datos para rendimiento

## 🧪 Ejemplo de Uso

### Agregar un Servicio en CONFIGURACIÓN

1. Usuario abre módulo CONFIGURACIÓN
2. Click en "Nuevo Servicio"
3. Llena formulario:
   - Nombre: "Lavado Premium"
   - Categoría: Lavado
   - Precio: 300.00
   - Unidad: kg
4. Zod valida los datos
5. Se guarda en `useServiciosStore`
6. Disponible inmediatamente vía API

### Usar el Servicio en FACTURACIÓN

1. Cajero abre módulo FACTURACIÓN
2. `useQuery` carga servicios con `getServicios()`
3. "Lavado Premium" aparece en la lista
4. Click en el servicio
5. Se agrega al carrito vía `useFacturaStore`

## 📝 Sincronización en Tiempo Real

Actualmente, la sincronización es **manual** (requiere refresh). Los datos se comparten a través de:

1. **Zustand Stores** en memoria (CONFIGURACIÓN)
2. **API Layer** que lee los stores
3. **React Query** que cachea las respuestas (FACTURACIÓN)

### Flujo de Actualización

```
Admin actualiza servicio en CONFIGURACIÓN
  → Zustand actualiza useServiciosStore
    → React Query cache sigue igual en FACTURACIÓN
      → Usuario debe refrescar o esperar invalidación automática
```

### Mejora Futura: WebSockets/SSE
Para sincronización en tiempo real:
```
Admin actualiza → Backend notifica → WebSocket → Invalidar React Query cache → Re-fetch automático
```

## 🔜 Próximos Pasos

### Integración con PostgreSQL
1. Conectar CONFIGURACIÓN a base de datos
2. Reemplazar Zustand en memoria con API REST
3. FACTURACIÓN seguirá usando la misma API pública
4. Sin cambios en los componentes de FACTURACIÓN

### Nuevos Módulos
- **CLIENTES**: Gestión de clientes (consumido por FACTURACIÓN)
- **REPORTES**: Dashboards (consume FACTURACIÓN y CONFIGURACIÓN)
- **INVENTARIO**: Control de stock (consume CONFIGURACIÓN)

## 📚 Referencias

- **Configuración README**: `apps/pos/configuracion/README.md`
- **Facturación README**: `apps/pos/facturacion/README.md`
- **Arquitectura**: `ARCHITECTURE.md`

---

**Integración completada** ✅
**Desarrollado con Claude Code** 🤖
