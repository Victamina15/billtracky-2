# Integración Frontend con Backend API - Billtracky 2.0

Esta guía te ayudará a conectar los módulos frontend (CONFIGURACIÓN y FACTURACIÓN) con el backend API desplegado en EasyPanel.

## 📋 Pre-requisitos

- ✅ Backend API desplegado y funcionando en EasyPanel
- ✅ Endpoint del backend disponible (ej: `https://api.tudominio.com`)
- ✅ Módulos frontend funcionando localmente

## 🎯 Objetivo

Reemplazar los datos mock/Zustand stores locales con llamadas al backend API para persistencia real en PostgreSQL.

---

## 🔧 Paso 1: Configurar Variables de Entorno

### Módulo CONFIGURACIÓN

```bash
# apps/pos/configuracion/.env
VITE_API_URL=https://api.tudominio.com
```

### Módulo FACTURACIÓN

```bash
# apps/pos/facturacion/.env
VITE_API_URL=https://api.tudominio.com
```

**Para desarrollo local (si el backend está en localhost):**
```bash
VITE_API_URL=http://localhost:3001
```

---

## 📝 Paso 2: Actualizar API del Módulo CONFIGURACIÓN

### 2.1 Actualizar `apps/pos/configuracion/src/api/servicios.js`

**Antes (mock data):**
```javascript
export const getServicios = async (categoria = 'todos') => {
  // Retorna datos mock
  return mockServicios.filter(...);
};
```

**Después (API real):**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getServicios = async (categoria = 'todos') => {
  try {
    const url = categoria === 'todos'
      ? `${API_URL}/api/servicios?activo=true`
      : `${API_URL}/api/servicios?categoria=${categoria}&activo=true`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al obtener servicios');
    }

    return result.data;
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    throw error;
  }
};

export const getServicioById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/servicios/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al obtener servicio');
    }

    return result.data;
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    throw error;
  }
};

export const createServicio = async (servicio) => {
  try {
    const response = await fetch(`${API_URL}/api/servicios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(servicio),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al crear servicio');
    }

    return result;
  } catch (error) {
    console.error('Error al crear servicio:', error);
    throw error;
  }
};

export const updateServicio = async (id, servicio) => {
  try {
    const response = await fetch(`${API_URL}/api/servicios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(servicio),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al actualizar servicio');
    }

    return result;
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    throw error;
  }
};

export const deleteServicio = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/servicios/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al eliminar servicio');
    }

    return result;
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    throw error;
  }
};

export const toggleServicio = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/servicios/${id}/toggle`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al cambiar estado del servicio');
    }

    return result;
  } catch (error) {
    console.error('Error al cambiar estado del servicio:', error);
    throw error;
  }
};
```

### 2.2 Actualizar `apps/pos/configuracion/src/api/categorias.js`

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getCategorias = async () => {
  try {
    const response = await fetch(`${API_URL}/api/categorias`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al obtener categorías');
    }

    return result.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};
```

### 2.3 Actualizar `apps/pos/configuracion/src/api/metodosPago.js`

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getMetodosPago = async () => {
  try {
    const response = await fetch(`${API_URL}/api/metodos-pago`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al obtener métodos de pago');
    }

    return result.data;
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    throw error;
  }
};
```

---

## 🛒 Paso 3: Actualizar Módulo FACTURACIÓN

### 3.1 Crear API para Facturas

Crear nuevo archivo `apps/pos/facturacion/src/api/facturas.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const createFactura = async (facturaData) => {
  try {
    const response = await fetch(`${API_URL}/api/facturas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(facturaData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al crear factura');
    }

    return result;
  } catch (error) {
    console.error('Error al crear factura:', error);
    throw error;
  }
};

export const getFacturas = async () => {
  try {
    const response = await fetch(`${API_URL}/api/facturas`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al obtener facturas');
    }

    return result.data;
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    throw error;
  }
};
```

### 3.2 Actualizar Hook de Facturación

Actualizar `apps/pos/facturacion/src/hooks/useFacturacion.js`:

```javascript
import { useState } from 'react';
import { createFactura } from '../api/facturas';
import { toast } from 'sonner';

export const useFacturacion = () => {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);

  const agregarAlCarrito = (servicio, cantidad) => {
    const itemExistente = carrito.find(item => item.id === servicio.id);

    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.id === servicio.id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...servicio, cantidad }]);
    }

    toast.success('Servicio agregado al carrito');
  };

  const actualizarCantidad = (servicioId, cantidad) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(servicioId);
      return;
    }

    setCarrito(carrito.map(item =>
      item.id === servicioId
        ? { ...item, cantidad }
        : item
    ));
  };

  const eliminarDelCarrito = (servicioId) => {
    setCarrito(carrito.filter(item => item.id !== servicioId));
    toast.info('Servicio eliminado del carrito');
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const finalizarFactura = async (metodoPago, referencia, fechaEntrega) => {
    if (carrito.length === 0) {
      toast.error('El carrito está vacío');
      return { success: false };
    }

    setLoading(true);

    try {
      // Calcular totales
      const subtotal = carrito.reduce((acc, item) =>
        acc + (item.precio * item.cantidad), 0
      );
      const itbis = subtotal * 0.18;
      const total = subtotal + itbis;

      // Preparar datos de la factura
      const facturaData = {
        cliente: null, // Por ahora sin cliente
        items: carrito.map(item => ({
          servicioId: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
          unidad: item.unidad,
          subtotal: item.precio * item.cantidad,
        })),
        subtotal,
        itbis,
        total,
        metodoPago,
        referencia,
        fechaEntrega,
      };

      // Enviar al backend
      const result = await createFactura(facturaData);

      if (result.success) {
        toast.success('Factura creada exitosamente');
        limpiarCarrito();
        setLoading(false);
        return { success: true, data: result.data };
      }

      toast.error('Error al crear factura');
      setLoading(false);
      return { success: false };
    } catch (error) {
      console.error('Error al finalizar factura:', error);
      toast.error('Error al crear factura: ' + error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const calcularSubtotal = () => {
    return carrito.reduce((acc, item) =>
      acc + (item.precio * item.cantidad), 0
    );
  };

  const calcularITBIS = () => {
    return calcularSubtotal() * 0.18;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularITBIS();
  };

  return {
    carrito,
    loading,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    limpiarCarrito,
    finalizarFactura,
    calcularSubtotal,
    calcularITBIS,
    calcularTotal,
  };
};
```

---

## 🔄 Paso 4: Actualizar Stores de Zustand (Opcional)

Si quieres mantener Zustand para estado local + sincronización con backend:

### `apps/pos/configuracion/src/hooks/useServiciosStore.js`

```javascript
import { create } from 'zustand';
import { getServicios, createServicio, updateServicio, deleteServicio, toggleServicio } from '../api/servicios';

export const useServiciosStore = create((set, get) => ({
  servicios: [],
  loading: false,
  error: null,

  // Cargar servicios desde el backend
  fetchServicios: async (categoria = 'todos') => {
    set({ loading: true, error: null });
    try {
      const data = await getServicios(categoria);
      set({ servicios: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Agregar servicio
  agregarServicio: async (nuevoServicio) => {
    try {
      const result = await createServicio(nuevoServicio);

      if (result.success) {
        // Actualizar estado local
        set((state) => ({
          servicios: [...state.servicios, result.data],
        }));
        return { success: true, servicio: result.data };
      }

      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Actualizar servicio
  actualizarServicio: async (id, servicioActualizado) => {
    try {
      const result = await updateServicio(id, servicioActualizado);

      if (result.success) {
        // Actualizar estado local
        set((state) => ({
          servicios: state.servicios.map((s) =>
            s.id === id ? result.data : s
          ),
        }));
        return { success: true, servicio: result.data };
      }

      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Eliminar servicio
  eliminarServicio: async (id) => {
    try {
      const result = await deleteServicio(id);

      if (result.success) {
        // Actualizar estado local
        set((state) => ({
          servicios: state.servicios.filter((s) => s.id !== id),
        }));
        return { success: true };
      }

      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Toggle activo/inactivo
  toggleServicio: async (id) => {
    try {
      const result = await toggleServicio(id);

      if (result.success) {
        // Actualizar estado local
        set((state) => ({
          servicios: state.servicios.map((s) =>
            s.id === id ? result.data : s
          ),
        }));
        return { success: true };
      }

      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
}));
```

---

## 🧪 Paso 5: Probar la Integración

### 5.1 Desarrollo Local

```bash
# Terminal 1 - Backend (si está local)
cd apps/api
npm run dev

# Terminal 2 - Configuración
cd apps/pos/configuracion
npm run dev

# Terminal 3 - Facturación
cd apps/pos/facturacion
npm run dev
```

### 5.2 Verificar en el Navegador

1. **Abrir módulo CONFIGURACIÓN** (`http://localhost:5174`)
   - Verificar que carguen los servicios desde el backend
   - Crear un nuevo servicio
   - Verificar que aparezca en PostgreSQL

2. **Abrir módulo FACTURACIÓN** (`http://localhost:5173`)
   - Verificar que carguen los servicios
   - Agregar servicios al carrito
   - Finalizar factura
   - Verificar que se guarde en PostgreSQL

3. **Verificar en PostgreSQL:**
   ```sql
   -- Ver servicios
   SELECT * FROM servicios_completos;

   -- Ver facturas
   SELECT * FROM facturas_completas;
   ```

---

## 📊 Paso 6: Manejo de Errores en la UI

Agregar manejo de errores en los componentes:

```javascript
// Ejemplo en ListaServicios.jsx
import { useQuery } from '@tanstack/react-query';
import { getServicios } from '@configuracion/api/servicios';

const ListaServicios = ({ categoria }) => {
  const { data: servicios, isLoading, error, refetch } = useQuery({
    queryKey: ['servicios', categoria],
    queryFn: () => getServicios(categoria),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 3,
  });

  if (isLoading) {
    return <div className="text-center py-8">Cargando servicios...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error al cargar servicios: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!servicios || servicios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay servicios disponibles en esta categoría
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {servicios.map((servicio) => (
        <ServicioCard key={servicio.id} servicio={servicio} />
      ))}
    </div>
  );
};
```

---

## ✅ Checklist de Integración

- [ ] Variables de entorno configuradas en ambos módulos
- [ ] API de servicios actualizada con llamadas al backend
- [ ] API de categorías actualizada
- [ ] API de métodos de pago actualizada
- [ ] API de facturas creada
- [ ] Hook de facturación actualizado para usar backend
- [ ] Manejo de errores implementado en componentes
- [ ] React Query configurado con retry y staleTime
- [ ] Tests manuales completados:
  - [ ] Listar servicios
  - [ ] Crear servicio
  - [ ] Actualizar servicio
  - [ ] Eliminar servicio
  - [ ] Toggle activo/inactivo
  - [ ] Crear factura
  - [ ] Listar facturas

---

## 🚀 Despliegue a Producción

### Builds de Producción

```bash
# Build Configuración
cd apps/pos/configuracion
npm run build

# Build Facturación
cd apps/pos/facturacion
npm run build
```

### Configurar en EasyPanel

Actualizar las variables de entorno en los servicios de frontend:

```env
VITE_API_URL=https://api.tudominio.com
```

Luego redesplegar los frontends.

---

## 🔍 Debugging

### Backend no responde

```bash
# Verificar que el backend esté corriendo
curl https://api.tudominio.com/health

# Ver logs del backend en EasyPanel
# Services → billtracky-api → Logs
```

### CORS errors

Verificar en `apps/api/.env`:
```env
CORS_ORIGIN=https://facturacion.tudominio.com,https://config.tudominio.com
```

### Datos no se guardan

Verificar en logs del backend que las queries se ejecuten correctamente:
```
📊 Query ejecutada: { text: 'INSERT INTO servicios...', duration: '15ms', rows: 1 }
```

---

## 📚 Referencias

- **DEPLOY-BACKEND.md** - Guía de despliegue del backend
- **RESUMEN-FINAL.md** - Resumen completo del proyecto
- **apps/api/README.md** - Documentación del API
- **INTEGRACION.md** - Arquitectura de integración

---

**¡Frontend integrado con backend!** 🎉
