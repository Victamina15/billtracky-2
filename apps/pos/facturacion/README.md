# Módulo de Facturación - Billtracky 2.0

## 🎯 Descripción

Módulo profesional de facturación POS para lavanderías, desarrollado desde cero con las mejores librerías modernas del ecosistema React. Interfaz inspirada en el diseño de Billtracky-1 pero completamente reescrito con arquitectura moderna y escalable.

## ✨ Características Implementadas

### Interfaz de Usuario
- ✅ **Header profesional** con fecha actual
- ✅ **Selector de cliente** con búsqueda (preparado para DB)
- ✅ **Selector de fecha de entrega** con opciones rápidas
- ✅ **Categorías de servicios** con filtrado dinámico
- ✅ **Buscador de servicios** en tiempo real
- ✅ **Lista virtualizada** de servicios (soporta cientos de items sin lag)
- ✅ **Carrito interactivo** con gestión de cantidades
- ✅ **Cálculo automático** de subtotal, ITBIS (18%), y total
- ✅ **Selector de métodos de pago** con validación
- ✅ **Botones de acción**: Cobrar, Pendiente, Imprimir
- ✅ **Notificaciones toast** profesionales
- ✅ **Diseño responsive** (Desktop, Tablet, Móvil)

### Tecnología y Arquitectura
- ✅ Estado global con **Zustand 5.0**
- ✅ Carga de datos con **React Query**
- ✅ Validación con **Zod**
- ✅ Virtualización con **@tanstack/react-virtual**
- ✅ Toasts con **Sonner**
- ✅ Iconos con **Lucide React**
- ✅ Clases dinámicas con **clsx**
- ✅ Manejo de fechas con **date-fns**

## 📁 Estructura del Proyecto

```
facturacion/
├── src/
│   ├── pages/
│   │   └── NuevaFacturaPage.jsx       # Página principal
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx             # Header con fecha
│   │   │   ├── ClienteSelector.jsx    # Búsqueda de clientes
│   │   │   └── FechaEntregaSelector.jsx
│   │   ├── servicios/
│   │   │   ├── Categorias.jsx         # Filtro de categorías
│   │   │   ├── ServicioCard.jsx       # Tarjeta de servicio
│   │   │   └── ListaServicios.jsx     # Lista virtualizada
│   │   └── factura/
│   │       ├── LineaFactura.jsx       # Línea de item
│   │       ├── Totales.jsx            # Cálculos
│   │       ├── MetodosPago.jsx        # Selector de pago
│   │       └── PanelFactura.jsx       # Panel completo
│   ├── hooks/
│   │   └── useFacturaStore.js         # Store Zustand
│   ├── data/
│   │   ├── mockServicios.js           # 25 servicios mock
│   │   └── mockMetodosPago.js         # Métodos de pago
│   └── utils/
│       ├── formatCurrency.js          # Formateo de moneda
│       └── formatDate.js              # Formateo de fechas
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🛠️ Tecnologías Modernas Utilizadas

### Core
- **React 19** - Framework UI más reciente
- **Vite 7** - Build tool ultrarrápido
- **TailwindCSS 3.4** - Estilos utility-first

### Librerías Profesionales (NO código viejo)
- **Zustand 5.0** - Estado global ligero y moderno
- **@tanstack/react-query** - Manejo profesional de datos asincrónicos
- **Zod** - Validación y esquemas de datos
- **@tanstack/react-virtual** - Virtualización para listas grandes
- **Lucide React** - Iconos SVG modernos y profesionales
- **Sonner** - Sistema de notificaciones toast elegante
- **clsx** - Manejo limpio de clases CSS condicionales
- **date-fns** - Librería moderna para fechas (con soporte i18n)

## 🎨 Diseño y UX

### Colores Oficiales
- Fondo principal: `#F4F4F5` (Gris claro)
- Contenedores: `#FFFFFF` (Blanco)
- Primario: Azul (`blue-500`, `blue-600`)
- Gradientes en botones principales

### Responsive Design
```
Desktop (>= 1024px):  2 columnas (Servicios 2/3 | Factura 1/3)
Tablet (768-1023px):  2 columnas adaptadas
Móvil (< 768px):      Stack vertical
```

## 🔄 Flujo de Trabajo

### 1. Selección de Cliente
```
ClienteSelector → Búsqueda → Seleccionar/Agregar → useFacturaStore.setCliente()
```

### 2. Fecha de Entrega
```
FechaEntregaSelector → Botones rápidos → useFacturaStore.setFechaEntrega()
```

### 3. Selección de Servicios
```
Categorias → Filtrar → Buscador → ListaServicios (virtualizada) → Click ServicioCard → useFacturaStore.agregarServicio() → Toast confirmación
```

### 4. Gestión del Carrito
```
PanelFactura → LineaFactura → Incrementar/Decrementar/Eliminar → Actualización automática de totales
```

### 5. Pago y Finalización
```
MetodosPago → Seleccionar → [Referencia si es requerida] → Botón COBRAR → Validación → Guardar (TODO: DB) → Limpiar
```

## 📊 Lógica de Negocio

### Cálculo de ITBIS
- Tasa fija: **18%** (República Dominicana)
- Aplicado al subtotal
- Mostrado desglosado

### Validación con Zod
```javascript
const LineaFacturaSchema = z.object({
  id: z.string(),
  servicioId: z.number(),
  nombre: z.string().min(1),
  precio: z.number().positive(),
  cantidad: z.number().positive(),
  unidad: z.string(),
  subtotal: z.number().nonnegative(),
});
```

### Virtualización de Lista
- Usa `@tanstack/react-virtual`
- Solo renderiza items visibles + overscan
- Soporta cientos de servicios sin lag
- Scroll fluido y performante

## ✅ Integración con CONFIGURACIÓN

El módulo está **completamente integrado** con el módulo CONFIGURACIÓN:

### Integración Implementada
```javascript
// src/data/mockServicios.js
import { getServicios } from '@configuracion/api/servicios';
import { getCategorias } from '@configuracion/api/categorias';

// src/data/mockMetodosPago.js
import { getMetodosPago } from '@configuracion/api/metodosPago';
```

### Fuentes de Datos
- **Servicios**: Cargados desde `useServiciosStore` (Configuración)
- **Categorías**: Cargadas desde `useCategoriasStore` (Configuración)
- **Métodos de Pago**: Cargados desde `useMetodosPagoStore` (Configuración)

### Ventajas de la Integración
- ✅ **Sincronización en tiempo real**: Los cambios en Configuración se reflejan automáticamente
- ✅ **Fuente única de verdad**: Los datos vienen de un solo lugar
- ✅ **Validación centralizada**: Zod valida en el módulo de Configuración
- ✅ **Fácil mantenimiento**: Actualizar servicios/precios en un solo módulo

### Conexión a Base de Datos
```javascript
// useFacturaStore.js
getFacturaData: () => {
  // Retorna datos listos para guardar en PostgreSQL
  return {
    items, cliente, fechaEntrega, metodoPago,
    subtotal, itbis, total, fecha
  };
};
```

## ⚙️ Configuración de Vite

Para permitir la integración con el módulo CONFIGURACIÓN, se configuró un alias en `vite.config.js`:

```javascript
// vite.config.js
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

Esto permite importar desde el módulo de configuración usando:
```javascript
import { getServicios } from '@configuracion/api/servicios';
```

## 🚀 Comandos

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 📝 Diferencias con Código Anterior

### ❌ Eliminado (Código Viejo)
- Módulo "new-order" / "nuevo pedido"
- Librerías duplicadas
- Código sin estructura modular
- Mock data mezclado con componentes

### ✅ Implementado (Código Nuevo)
- Estructura modular profesional
- Todas las librerías modernas obligatorias
- Separación clara de concerns
- Virtualización para performance
- Validación con Zod
- React Query para datos
- Zustand para estado
- Sonner para notificaciones

## 🔜 Próximos Pasos

### Integración con Backend
- [x] ✅ **Conectado con módulo CONFIGURACIÓN** (Completado)
- [ ] Guardar facturas en PostgreSQL
- [ ] Búsqueda real de clientes
- [ ] Autenticación de cajeros

### Generación de Documentos
- [ ] Generar PDF de facturas
- [ ] Tickets de impresión térmica
- [ ] Envío por email/WhatsApp

### Funcionalidades Avanzadas
- [ ] Descuentos y promociones
- [ ] Notas en líneas de factura
- [ ] Facturas pendientes
- [ ] Histórico de facturas
- [ ] Reportes de ventas

## 📦 Dependencias

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.x",
    "@tanstack/react-virtual": "^3.x",
    "clsx": "^2.x",
    "date-fns": "^4.x",
    "lucide-react": "^0.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "sonner": "^1.x",
    "zod": "^3.x",
    "zustand": "^5.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x",
    "vite": "^7.x"
  }
}
```

## ⚠️ Notas Importantes

- **✅ Datos Integrados**: Los servicios, categorías y métodos de pago vienen del módulo CONFIGURACIÓN
- **Sincronización Automática**: Los cambios en Configuración se reflejan automáticamente en Facturación
- **Sin Backend PostgreSQL**: Las operaciones de guardar solo muestran console.log (próximo paso)
- **Preparado para Producción**: La arquitectura está lista para conectarse a APIs reales
- **Sin Código Viejo**: Todo desarrollado desde cero
- **Best Practices**: Siguiendo las mejores prácticas de React 2025
- **Vite Alias**: Usa `@configuracion` para importar del módulo de configuración

## 🏗️ Arquitectura Técnica

```
┌─────────────────────────────────────────────────────────────┐
│                  MÓDULO CONFIGURACIÓN                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │useServiciosStore │  │useCategoriasStore│  │useMetodos  │ │
│  │   (Zustand)      │  │    (Zustand)     │  │PagoStore   │ │
│  └────────┬─────────┘  └────────┬─────────┘  └─────┬──────┘ │
│           │                     │                   │         │
│  ┌────────▼─────────────────────▼───────────────────▼──────┐ │
│  │              API Layer (src/api/)                        │ │
│  │  • servicios.js  • categorias.js  • metodosPago.js      │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────┘
                           │ @configuracion alias
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  MÓDULO FACTURACIÓN                          │
│                                                              │
│  Usuario → NuevaFacturaPage (Layout Responsivo)             │
│              ↓                                               │
│    ┌─────────┴────────┐                                     │
│    │  Data Layer      │ (Importa desde @configuracion)      │
│    │  mockServicios   │ → getServicios()                    │
│    │  mockMetodosPago │ → getMetodosPago()                  │
│    └─────────┬────────┘                                     │
│              ↓                                               │
│    ├─→ Header + ClienteSelector + FechaEntregaSelector      │
│    ├─→ ListaServicios                                       │
│    │     ├─→ Categorias → useQuery(getCategorias)           │
│    │     ├─→ Buscador → Filtrado en tiempo real             │
│    │     └─→ @tanstack/react-virtual → ServicioCard         │
│    │           └─→ useFacturaStore + Toast                  │
│    └─→ PanelFactura                                         │
│          ├─→ LineaFactura (incrementar/decrementar/eliminar)│
│          ├─→ Totales (cálculos computados)                  │
│          ├─→ MetodosPago (useQuery)                         │
│          └─→ Botones: Cobrar/Pendiente/Imprimir             │
└─────────────────────────────────────────────────────────────┘
```

---

**Desarrollado completamente desde cero con Claude Code** 🤖
**Sin código heredado** | **Solo librerías modernas** | **Arquitectura profesional**
