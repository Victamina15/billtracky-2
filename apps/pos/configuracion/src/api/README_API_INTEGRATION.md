# Integración con Backend API - CONFIGURACIÓN

## 🔄 Próximos Pasos

El módulo CONFIGURACIÓN actualmente usa Zustand en memoria. Para conectarlo al backend PostgreSQL:

### 1. Actualizar `api/servicios.js`

Reemplazar las llamadas a Zustand con llamadas HTTP:

```javascript
// Antes (Zustand)
import { useServiciosStore } from '../hooks/useServiciosStore';

export const getServicios = async (categoria) => {
  const store = useServiciosStore.getState();
  return store.getServiciosActivos();
};

// Después (Backend API)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getServicios = async (categoria = 'todos') => {
  const response = await fetch(`${API_URL}/api/servicios?categoria=${categoria}&activo=true`);
  const data = await response.json();
  return data.data; // Extraer array de servicios
};
```

### 2. Actualizar React Query

Los hooks de React Query no cambian, solo el origen de los datos:

```javascript
// useQuery seguirá funcionando igual
const { data: servicios } = useQuery({
  queryKey: ['servicios', categoria],
  queryFn: () => getServicios(categoria), // Ahora llama al backend
});
```

### 3. Actualizar Zustand para usar Backend

Modificar los stores para hacer llamadas HTTP en lugar de modificar estado local:

```javascript
// hooks/useServiciosStore.js
agregarServicio: async (nuevoServicio) => {
  const response = await fetch(`${API_URL}/api/servicios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoServicio),
  });

  const result = await response.json();

  if (result.success) {
    // Invalidar cache de React Query
    queryClient.invalidateQueries(['servicios']);
    return { success: true, servicio: result.data };
  }

  return { success: false, error: result.error };
},
```

### 4. Agregar Variable de Entorno

Crear `.env` en el módulo:

```env
VITE_API_URL=http://localhost:3001
```

Producción:
```env
VITE_API_URL=https://api.tudominio.com
```
