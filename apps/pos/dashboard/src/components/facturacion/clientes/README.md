# Módulo de Clientes - Billtracky-2

Sistema profesional de gestión de clientes integrado en el módulo de facturación, siguiendo los patrones de diseño de Shopify POS con la paleta oficial Billtracky-2.

## Componentes

### `ClienteModal.jsx`
Modal unificado para búsqueda y creación de clientes con dos modos de operación:

#### Modo Búsqueda
- **Command Palette** para búsqueda en tiempo real
- Filtrado por nombre, teléfono o dirección
- Lista de resultados con información completa del cliente
- Selección con un clic
- Botón para crear nuevo cliente (solo cuando hay resultados)

#### Modo Creación
- Formulario con validación Zod
- Campos obligatorios: nombre, teléfono
- Campos opcionales: dirección, notas
- Validación en tiempo real con mensajes de error
- Navegación con botón "Volver" (ArrowLeft)

### `ClienteSelector.jsx`
Selector de cliente integrado en la pantalla de facturación:
- Muestra el cliente seleccionado con información completa
- Botón para cambiar cliente
- Sincronización con `useFacturaStore` y `useClientesStore`

## Flujo de Usuario

### 1. Búsqueda de Cliente
1. Usuario hace clic en "Buscar o agregar cliente"
2. Se abre el modal en modo búsqueda
3. Usuario escribe en el campo de búsqueda
4. Resultados se filtran en tiempo real
5. Usuario selecciona un cliente de la lista
6. Modal se cierra y cliente se asigna a la factura

### 2. Creación de Cliente
1. Usuario hace clic en "Crear Nuevo Cliente" (dentro del modal o en estado vacío)
2. Modal cambia a modo creación
3. Usuario completa el formulario:
   - **Nombre** (obligatorio)
   - **Teléfono** (obligatorio)
   - **Dirección** (opcional)
   - **Notas** (opcional)
4. Sistema valida campos con Zod
5. Si validación es exitosa:
   - Cliente se agrega al store (`addCliente`)
   - Cliente se selecciona automáticamente (`setClienteSeleccionado`)
   - Toast de confirmación
   - Modal se cierra
   - Cliente se asigna a la factura
6. Si hay errores:
   - Mensajes de error se muestran bajo cada campo
   - Usuario corrige y reintenta

### 3. Selección y Sincronización
El flujo completo de selección:
```javascript
// 1. Usuario selecciona/crea cliente en modal
handleSelectCliente(cliente)
  ↓
// 2. Se actualiza el store de clientes
setClienteSeleccionado(cliente)
  ↓
// 3. Se ejecuta callback del padre
onSelectCliente(cliente)
  ↓
// 4. ClienteSelector sincroniza con factura
setCliente({ id, nombre, telefono, email })
  ↓
// 5. Modal se cierra
handleClose()
```

## Store de Zustand

### `useClientesStore`
Estado global de gestión de clientes:

```javascript
{
  // Estado
  clientes: Cliente[],              // Lista de todos los clientes
  clienteSeleccionado: Cliente|null, // Cliente actualmente seleccionado
  busqueda: string,                  // Término de búsqueda actual

  // Acciones
  addCliente(data) → { success, cliente, error },
  updateCliente(id, data) → { success, cliente, error },
  deleteCliente(id),
  setClienteSeleccionado(cliente),
  limpiarSeleccion(),
  setBusqueda(termino),

  // Getters
  getClientesFiltrados() → Cliente[],
  getClienteById(id) → Cliente|undefined
}
```

### Validación con Zod

```javascript
const ClienteSchema = z.object({
  id: z.union([z.string(), z.number()]),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  telefono: z.string().min(1, 'El teléfono es obligatorio'),
  direccion: z.string().optional(),
  notas: z.string().optional(),
  createdAt: z.date().optional(),
});
```

## Paleta de Colores Billtracky-2

El módulo utiliza exclusivamente la paleta oficial:

- **#F4F4F5** - Background/fondos secundarios
- **#FFFFFF** - Contenedores/modales
- **#E5E7EB** - Líneas/bordes
- **#111827** - Texto primario
- **#6B7280** - Texto secundario
- **#9CA3AF** - Placeholders
- **#2563EB** - Botones primarios
- **#1E40AF** - Hover/Focus
- **#4B5563** - Iconos
- **#EFF6FF** - Background iconos (blue-50)

## Dependencias

- **React 19** - Framework principal
- **Zustand 5** - Gestión de estado global
- **Zod 4** - Validación de esquemas
- **Radix UI** - Primitivos accesibles (Dialog)
- **shadcn/ui** - Componentes (Command, Input, Label, Button)
- **lucide-react** - Iconografía
- **sonner** - Notificaciones toast

## Integración con Facturación

El módulo se integra con `useFacturaStore` para sincronizar el cliente seleccionado:

```javascript
// En ClienteSelector.jsx
const handleSelectCliente = (clienteData) => {
  setCliente({
    id: clienteData.id,
    nombre: clienteData.nombre,
    telefono: clienteData.telefono,
    email: clienteData.email,
  });
};
```

## Características de UX

- ✅ Búsqueda en tiempo real sin latencia
- ✅ Validación inline con mensajes claros
- ✅ Toast notifications para feedback inmediato
- ✅ Navegación intuitiva entre modos (búsqueda ↔ creación)
- ✅ Estado vacío con CTA claro ("Crear Cliente")
- ✅ Iconografía consistente (User, Phone, MapPin, Search, Plus, ArrowLeft)
- ✅ Transiciones suaves entre estados
- ✅ Responsive design
- ✅ Accesibilidad con Radix UI primitivos

## Mock Data

El sistema incluye 5 clientes de ejemplo para desarrollo:
- Juan Pérez
- María García
- Carlos Rodríguez
- Ana Martínez
- Pedro Sánchez

Los IDs se generan con `Date.now()` para nuevos clientes.
