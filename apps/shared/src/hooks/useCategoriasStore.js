import { create } from 'zustand';
import { CategoriaSchema } from '../utils/validations';

// Categorías iniciales (sincronizadas con Facturación)
const categoriasIniciales = [
  { id: 'lavado', nombre: 'Lavado', color: '#3B82F6', descripcion: 'Servicios de lavado', activo: true },
  { id: 'planchado', nombre: 'Planchado', color: '#10B981', descripcion: 'Servicios de planchado', activo: true },
  { id: 'tintoreria', nombre: 'Tintorería', color: '#8B5CF6', descripcion: 'Limpieza en seco', activo: true },
  { id: 'especiales', nombre: 'Especiales', color: '#F59E0B', descripcion: 'Servicios especiales', activo: true },
  { id: 'express', nombre: 'Express', color: '#EF4444', descripcion: 'Servicios urgentes', activo: true },
  { id: 'reparacion', nombre: 'Reparación', color: '#6366F1', descripcion: 'Arreglos y reparaciones', activo: true },
];

export const useCategoriasStore = create((set, get) => ({
  // Estado
  categorias: categoriasIniciales,
  categoriaEditando: null,

  // Acciones - CRUD
  agregarCategoria: (nuevaCategoria) => {
    try {
      // Validar con Zod
      const categoriaValidada = CategoriaSchema.parse({
        ...nuevaCategoria,
        id: nuevaCategoria.nombre.toLowerCase().replace(/\s+/g, '-'),
      });

      set((state) => ({
        categorias: [...state.categorias, categoriaValidada],
      }));

      return { success: true, categoria: categoriaValidada };
    } catch (error) {
      return { success: false, error: error.errors };
    }
  },

  actualizarCategoria: (id, datosActualizados) => {
    try {
      const categoriaActual = get().categorias.find((c) => c.id === id);
      if (!categoriaActual) {
        return { success: false, error: 'Categoría no encontrada' };
      }

      // Validar con Zod
      const categoriaValidada = CategoriaSchema.parse({
        ...categoriaActual,
        ...datosActualizados,
      });

      set((state) => ({
        categorias: state.categorias.map((c) =>
          c.id === id ? categoriaValidada : c
        ),
        categoriaEditando: null,
      }));

      return { success: true, categoria: categoriaValidada };
    } catch (error) {
      return { success: false, error: error.errors };
    }
  },

  eliminarCategoria: (id) => {
    set((state) => ({
      categorias: state.categorias.filter((c) => c.id !== id),
    }));
  },

  toggleActivoCategoria: (id) => {
    set((state) => ({
      categorias: state.categorias.map((c) =>
        c.id === id ? { ...c, activo: !c.activo } : c
      ),
    }));
  },

  // Edición
  setCategoriaEditando: (categoria) => {
    set({ categoriaEditando: categoria });
  },

  cancelarEdicion: () => {
    set({ categoriaEditando: null });
  },

  // Getters
  getCategoriasActivas: () => {
    return get().categorias.filter((c) => c.activo);
  },

  // Para exportar a Facturación
  exportCategorias: () => {
    return [
      { id: 'todos', nombre: 'Todos', color: '#6B7280' },
      ...get().categorias.filter((c) => c.activo),
    ];
  },
}));
