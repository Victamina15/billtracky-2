import { create } from 'zustand';
import { ServicioSchema } from '../utils/validations';

// Datos iniciales de ejemplo
const serviciosIniciales = [
  { id: 1, nombre: 'Lavado Normal', categoria: 'lavado', precio: 150.00, unidad: 'kg', descripcion: 'Lavado estándar de ropa', activo: true, tiempoEstimado: 120 },
  { id: 2, nombre: 'Lavado Express', categoria: 'lavado', precio: 200.00, unidad: 'kg', descripcion: 'Lavado rápido en 24h', activo: true, tiempoEstimado: 60 },
  { id: 3, nombre: 'Planchado', categoria: 'planchado', precio: 80.00, unidad: 'unidad', descripcion: 'Planchado de prendas', activo: true, tiempoEstimado: 30 },
  { id: 4, nombre: 'Tintorería', categoria: 'tintoreria', precio: 250.00, unidad: 'unidad', descripcion: 'Limpieza en seco', activo: true, tiempoEstimado: 180 },
  { id: 5, nombre: 'Edredón Queen', categoria: 'especiales', precio: 400.00, unidad: 'unidad', descripcion: 'Lavado de edredón tamaño Queen', activo: true, tiempoEstimado: 240 },
];

export const useServiciosStore = create((set, get) => ({
  // Estado
  servicios: serviciosIniciales,
  servicioEditando: null,
  filtroCategoria: 'todos',
  filtroBusqueda: '',

  // Acciones - CRUD
  agregarServicio: (nuevoServicio) => {
    try {
      // Validar con Zod
      const servicioValidado = ServicioSchema.parse({
        ...nuevoServicio,
        id: Date.now(), // ID temporal (en producción vendría de la DB)
      });

      set((state) => ({
        servicios: [...state.servicios, servicioValidado],
      }));

      return { success: true, servicio: servicioValidado };
    } catch (error) {
      return { success: false, error: error.errors };
    }
  },

  actualizarServicio: (id, datosActualizados) => {
    try {
      const servicioActual = get().servicios.find((s) => s.id === id);
      if (!servicioActual) {
        return { success: false, error: 'Servicio no encontrado' };
      }

      // Validar con Zod
      const servicioValidado = ServicioSchema.parse({
        ...servicioActual,
        ...datosActualizados,
      });

      set((state) => ({
        servicios: state.servicios.map((s) =>
          s.id === id ? servicioValidado : s
        ),
        servicioEditando: null,
      }));

      return { success: true, servicio: servicioValidado };
    } catch (error) {
      return { success: false, error: error.errors };
    }
  },

  eliminarServicio: (id) => {
    set((state) => ({
      servicios: state.servicios.filter((s) => s.id !== id),
    }));
  },

  toggleActivoServicio: (id) => {
    set((state) => ({
      servicios: state.servicios.map((s) =>
        s.id === id ? { ...s, activo: !s.activo } : s
      ),
    }));
  },

  // Edición
  setServicioEditando: (servicio) => {
    set({ servicioEditando: servicio });
  },

  cancelarEdicion: () => {
    set({ servicioEditando: null });
  },

  // Filtros
  setFiltroCategoria: (categoria) => {
    set({ filtroCategoria: categoria });
  },

  setFiltroBusqueda: (busqueda) => {
    set({ filtroBusqueda: busqueda });
  },

  // Getters
  getServiciosFiltrados: () => {
    const { servicios, filtroCategoria, filtroBusqueda } = get();

    return servicios.filter((servicio) => {
      const matchCategoria = filtroCategoria === 'todos' || servicio.categoria === filtroCategoria;
      const matchBusqueda = filtroBusqueda === '' ||
        servicio.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase());

      return matchCategoria && matchBusqueda;
    });
  },

  getServiciosActivos: () => {
    return get().servicios.filter((s) => s.activo);
  },

  // Para exportar a Facturación
  exportServicios: () => {
    return get().servicios.filter((s) => s.activo);
  },
}));
