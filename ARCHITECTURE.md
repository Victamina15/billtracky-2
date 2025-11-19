Estructura del monorepo Billtracky-2.0

## Aplicaciones

### apps/pos/

#### 1. configuracion/ → **Módulo de CONFIGURACIÓN**
Gestión de datos maestros del sistema POS:
- **CRUD completo** de servicios, categorías y métodos de pago
- **3 Zustand stores** independientes con validación Zod
- **API pública** para integración con otros módulos
- **Navegación por tabs** (Servicios, Categorías, Métodos de Pago)
- **React Query** para caché de datos
- **Sonner** para notificaciones
- Ver `apps/pos/configuracion/README.md` para detalles completos

**Tecnologías**: React 19, Vite 7, Zustand 5.0, Zod 4, TailwindCSS 3.4

**Datos Precargados**:
- 5 servicios
- 6 categorías con colores
- 4 métodos de pago con comisiones

---

#### 2. facturacion/ → **Módulo de FACTURACIÓN POS**
Sistema completo de punto de venta integrado con CONFIGURACIÓN:
- **✅ Integrado con módulo CONFIGURACIÓN** (servicios, categorías, métodos de pago)
- **Grid virtualizado** de servicios con búsqueda en tiempo real
- **Carrito interactivo** con gestión de cantidades
- **Cálculo automático** de ITBIS (18%)
- **React Query** para caché y sincronización
- **Diseño responsive** estilo Shopify POS
- Ver `apps/pos/facturacion/README.md` para detalles completos

**Tecnologías**: React 19, Vite 7, Zustand 5.0, React Query, TailwindCSS 3.4

**Importaciones desde CONFIGURACIÓN**:
```javascript
import { getServicios } from '@configuracion/api/servicios';
import { getCategorias } from '@configuracion/api/categorias';
import { getMetodosPago } from '@configuracion/api/metodosPago';
```

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

## 🔗 Integración de Módulos

### Arquitectura de Integración

```
┌────────────────────────────────────────┐
│     MÓDULO CONFIGURACIÓN               │
│  (Datos Maestros - Backoffice)         │
│                                        │
│  • useServiciosStore (Zustand)         │
│  • useCategoriasStore (Zustand)        │
│  • useMetodosPagoStore (Zustand)       │
│                                        │
│  API Pública:                          │
│  └─→ src/api/servicios.js              │
│  └─→ src/api/categorias.js             │
│  └─→ src/api/metodosPago.js            │
└────────────────┬───────────────────────┘
                 │ @configuracion alias
                 │ (Vite resolve.alias)
                 ▼
┌────────────────────────────────────────┐
│     MÓDULO FACTURACIÓN                 │
│  (Punto de Venta - Cajeros)            │
│                                        │
│  Importa desde @configuracion:         │
│  • getServicios()                      │
│  • getCategorias()                     │
│  • getMetodosPago()                    │
│                                        │
│  useFacturaStore (Zustand local)       │
│  └─→ Gestiona carrito y factura       │
└────────────────────────────────────────┘
```

### Beneficios de la Integración

1. **Fuente Única de Verdad**: Los datos maestros se definen solo en CONFIGURACIÓN
2. **Validación Centralizada**: Zod valida en CONFIGURACIÓN
3. **Sin Duplicación**: FACTURACIÓN consume, no replica
4. **Sincronización**: React Query cachea y actualiza automáticamente
5. **Escalable**: Nuevos módulos pueden consumir la misma API

Ver `INTEGRACION.md` para documentación completa de la integración.