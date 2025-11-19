# Módulo de Configuración - Billtracky 2.0

## 🎯 Descripción

Módulo profesional de configuración para gestionar servicios, categorías y métodos de pago del sistema POS. Desarrollado desde cero con arquitectura moderna y escalable, proporciona una interfaz completa de CRUD para administrar toda la configuración del negocio.

## ✨ Características Implementadas

### Gestión de Servicios
- ✅ **CRUD completo** de servicios
- ✅ **Tabla profesional** con búsqueda y filtros
- ✅ **Formulario modal** con validación Zod
- ✅ **Activar/Desactivar** servicios
- ✅ **Categorización** por tipo de servicio
- ✅ **Múltiples unidades** (kg, unidad, metro, servicio)
- ✅ **Tiempo estimado** de servicio
- ✅ **Descripciones** detalladas

### Gestión de Categorías
- ✅ **CRUD completo** de categorías
- ✅ **Selector de color** visual
- ✅ **Cards interactivos** con preview de color
- ✅ **Activar/Desactivar** categorías
- ✅ **Validación hexadecimal** de colores
- ✅ **12 colores predefinidos** para selección rápida

### Gestión de Métodos de Pago
- ✅ **CRUD completo** de métodos de pago
- ✅ **Tipos predefinidos** (efectivo, tarjeta, transferencia, crédito)
- ✅ **Configuración de comisiones** por método
- ✅ **Requerimiento de referencia** configurable
- ✅ **Iconos personalizables** (4 opciones)
- ✅ **Cards visuales** con información completa

### Tecnología y Arquitectura
- ✅ Estado global con **Zustand 5.0** (3 stores independientes)
- ✅ Carga de datos con **React Query**
- ✅ Validación con **Zod** (3 esquemas)
- ✅ Toasts con **Sonner**
- ✅ Iconos con **Lucide React**
- ✅ Clases dinámicas con **clsx**
- ✅ Navegación por **tabs**
- ✅ Modales para formularios
- ✅ Diseño responsive completo

## 📁 Estructura del Proyecto

```
configuracion/
├── src/
│   ├── pages/
│   │   └── ConfiguracionPage.jsx      # Página principal con tabs
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx              # Header del módulo
│   │   │   └── Navigation.jsx          # Navegación por tabs
│   │   ├── servicios/
│   │   │   ├── ListaServicios.jsx      # Tabla con búsqueda/filtros
│   │   │   ├── ServicioRow.jsx         # Fila de tabla
│   │   │   └── FormServicio.jsx        # Modal crear/editar
│   │   ├── categorias/
│   │   │   ├── ListaCategorias.jsx     # Grid de categorías
│   │   │   ├── CategoriaCard.jsx       # Card de categoría
│   │   │   └── FormCategoria.jsx       # Modal crear/editar
│   │   └── metodosPago/
│   │       ├── ListaMetodosPago.jsx    # Grid de métodos
│   │       ├── MetodoPagoCard.jsx      # Card de método
│   │       └── FormMetodoPago.jsx      # Modal crear/editar
│   ├── hooks/
│   │   ├── useServiciosStore.js        # Zustand - Servicios
│   │   ├── useCategoriasStore.js       # Zustand - Categorías
│   │   └── useMetodosPagoStore.js      # Zustand - Métodos de Pago
│   ├── api/
│   │   ├── servicios.js                # API pública para Facturación
│   │   ├── categorias.js               # API pública para Facturación
│   │   └── metodosPago.js              # API pública para Facturación
│   └── utils/
│       └── validations.js              # Esquemas Zod
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

### Librerías Profesionales
- **Zustand 5.0** - Estado global ligero y moderno (3 stores)
- **@tanstack/react-query** - Manejo profesional de datos asincrónicos
- **Zod 4** - Validación y esquemas de datos (3 schemas)
- **Lucide React** - Iconos SVG modernos y profesionales
- **Sonner 2** - Sistema de notificaciones toast elegante
- **clsx 2** - Manejo limpio de clases CSS condicionales
- **date-fns 4** - Librería moderna para fechas

## 🎨 Diseño y UX

### Colores Oficiales
- Fondo principal: `#F4F4F5` (Gris claro)
- Contenedores: `#FFFFFF` (Blanco)
- Primario: Azul (`blue-500`, `blue-600`)
- Estados: Verde (activo), Gris (inactivo), Rojo (eliminar)

### Navegación
- **3 Tabs principales**: Servicios, Categorías, Métodos de Pago
- Cambio de tab sin recarga
- Indicador visual de tab activo

### Responsive Design
```
Desktop (>= 1024px):  Grid de 3 columnas
Tablet (768-1023px):  Grid de 2 columnas
Móvil (< 768px):      Stack vertical (1 columna)
```

## 🔄 Flujo de Trabajo

### 1. Gestión de Servicios
```
Tab Servicios → [Búsqueda/Filtro] → Tabla → [Nuevo/Editar/Eliminar/Toggle] → FormServicio → Validación Zod → Zustand Store → Toast confirmación
```

### 2. Gestión de Categorías
```
Tab Categorías → Grid Cards → [Nuevo/Editar/Eliminar/Toggle] → FormCategoria → Selector Color → Validación Zod → Zustand Store → Toast confirmación
```

### 3. Gestión de Métodos de Pago
```
Tab Métodos de Pago → Grid Cards → [Nuevo/Editar/Eliminar/Toggle] → FormMetodoPago → Configuración → Validación Zod → Zustand Store → Toast confirmación
```

## 📊 Lógica de Negocio

### Validación con Zod

#### Servicios
```javascript
const ServicioSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1).max(100),
  categoria: z.string().min(1),
  precio: z.number().positive().min(0.01),
  unidad: z.enum(['kg', 'unidad', 'metro', 'servicio']),
  descripcion: z.string().max(300).optional(),
  activo: z.boolean().default(true),
  tiempoEstimado: z.number().int().positive().optional(),
});
```

#### Categorías
```javascript
const CategoriaSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  descripcion: z.string().max(200).optional(),
  activo: z.boolean().default(true),
});
```

#### Métodos de Pago
```javascript
const MetodoPagoSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1).max(50),
  tipo: z.enum(['efectivo', 'tarjeta', 'transferencia', 'credito', 'otro']),
  requiereReferencia: z.boolean().default(false),
  icono: z.string(),
  activo: z.boolean().default(true),
  comision: z.number().min(0).max(100).optional(),
});
```

## 🔌 Integración con Módulo FACTURACIÓN

El módulo CONFIGURACIÓN proporciona una capa de API pública para el módulo FACTURACIÓN:

### Funciones Exportadas

#### Servicios (`src/api/servicios.js`)
```javascript
// Obtener servicios activos por categoría
export const getServicios = async (categoria = 'todos') => {...}

// Obtener servicio por ID
export const getServicioById = async (id) => {...}

// Buscar servicios por nombre
export const buscarServicios = async (query) => {...}

// Estadísticas de servicios
export const getEstadisticasServicios = async () => {...}
```

#### Categorías (`src/api/categorias.js`)
```javascript
// Obtener todas las categorías (incluye "Todos")
export const getCategorias = async () => {...}

// Obtener solo categorías activas
export const getCategoriasActivas = async () => {...}

// Obtener categoría por ID
export const getCategoriaById = async (id) => {...}
```

#### Métodos de Pago (`src/api/metodosPago.js`)
```javascript
// Obtener todos los métodos de pago activos
export const getMetodosPago = async () => {...}

// Obtener método de pago por ID
export const getMetodoPagoById = async (id) => {...}

// Verificar si requiere referencia
export const requiereReferencia = async (id) => {...}

// Calcular comisión
export const calcularComision = async (id, monto) => {...}
```

### Ejemplo de Integración en Facturación

```javascript
// En el módulo de Facturación
import { getServicios } from '../configuracion/src/api/servicios';
import { getCategorias } from '../configuracion/src/api/categorias';
import { getMetodosPago } from '../configuracion/src/api/metodosPago';

// Reemplazar datos mock
const { data: servicios } = useQuery({
  queryKey: ['servicios', categoria],
  queryFn: () => getServicios(categoria),
});

const { data: categorias } = useQuery({
  queryKey: ['categorias'],
  queryFn: getCategorias,
});

const { data: metodosPago } = useQuery({
  queryKey: ['metodosPago'],
  queryFn: getMetodosPago,
});
```

## 📊 Datos Iniciales

### 5 Servicios Precargados
1. Lavado Normal - $150.00 (kg)
2. Lavado Express - $200.00 (kg)
3. Planchado - $80.00 (unidad)
4. Tintorería - $250.00 (unidad)
5. Edredón Queen - $400.00 (unidad)

### 6 Categorías Precargadas
1. Lavado (#3B82F6)
2. Planchado (#10B981)
3. Tintorería (#8B5CF6)
4. Especiales (#F59E0B)
5. Express (#EF4444)
6. Reparación (#6366F1)

### 4 Métodos de Pago Precargados
1. Efectivo (0% comisión)
2. Tarjeta (2.5% comisión, requiere referencia)
3. Transferencia (0% comisión, requiere referencia)
4. Crédito (0% comisión)

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

## 📦 Dependencias

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.90.10",
    "@tanstack/react-virtual": "^3.13.12",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.554.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "sonner": "^2.0.7",
    "zod": "^4.1.12",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.18",
    "postcss": "^8.5.6",
    "autoprefixer": "^10.4.22",
    "vite": "^7.2.2"
  }
}
```

## 🔜 Próximos Pasos

### Integración con Backend
- [ ] Conectar stores con API REST
- [ ] Guardar configuración en PostgreSQL
- [ ] Sincronización con módulo FACTURACIÓN
- [ ] Autenticación de administradores

### Funcionalidades Avanzadas
- [ ] Importación masiva de servicios (CSV/Excel)
- [ ] Exportación de configuración
- [ ] Historial de cambios
- [ ] Plantillas de servicios
- [ ] Duplicar servicios
- [ ] Búsqueda avanzada con filtros múltiples
- [ ] Ordenamiento de columnas en tabla

### Validaciones Adicionales
- [ ] Evitar categorías duplicadas
- [ ] Validar servicios antes de eliminar categoría
- [ ] Confirmación en operaciones masivas
- [ ] Validación de precios mínimos/máximos

## ⚠️ Notas Importantes

- **Datos en Memoria**: Actualmente usa Zustand sin persistencia
- **Sin Backend**: Las operaciones solo afectan el estado local
- **API Pública**: Lista para ser consumida por módulo FACTURACIÓN
- **Preparado para Producción**: Arquitectura lista para conectarse a APIs reales
- **Validación Robusta**: Todos los formularios usan Zod
- **Best Practices**: Siguiendo las mejores prácticas de React 2025

## 🏗️ Arquitectura Técnica

```
Usuario
  ↓
ConfiguracionPage (Layout + Navegación Tabs)
  ↓
  ├─→ Tab Servicios
  │     ├─→ ListaServicios (Tabla con búsqueda/filtros)
  │     │     └─→ ServicioRow → [Editar/Eliminar/Toggle]
  │     └─→ FormServicio → Validación Zod → useServiciosStore
  │
  ├─→ Tab Categorías
  │     ├─→ ListaCategorias (Grid de cards)
  │     │     └─→ CategoriaCard → [Editar/Eliminar/Toggle]
  │     └─→ FormCategoria → Selector Color → Validación Zod → useCategoriasStore
  │
  └─→ Tab Métodos de Pago
        ├─→ ListaMetodosPago (Grid de cards)
        │     └─→ MetodoPagoCard → [Editar/Eliminar/Toggle]
        └─→ FormMetodoPago → Configuración → Validación Zod → useMetodosPagoStore

API Layer (src/api/)
  ├─→ servicios.js     → Exporta funciones para Facturación
  ├─→ categorias.js    → Exporta funciones para Facturación
  └─→ metodosPago.js   → Exporta funciones para Facturación
```

## 🔗 Relación con Módulo FACTURACIÓN

```
CONFIGURACIÓN (Backend de datos)
       ↓
    API Layer
       ↓
   FACTURACIÓN (Frontend de ventas)
```

El módulo CONFIGURACIÓN actúa como el "backend de configuración" para FACTURACIÓN, proporcionando:
- Servicios disponibles para venta
- Categorías para filtrado
- Métodos de pago aceptados
- Reglas de negocio (comisiones, referencias)

---

**Desarrollado completamente desde cero con Claude Code** 🤖
**Sin código heredado** | **Solo librerías modernas** | **Arquitectura profesional**
**Integración perfecta con módulo FACTURACIÓN**
