import { create } from 'zustand';
import { MetodoPagoSchema } from '../utils/validations';

// Métodos de pago iniciales (sincronizados con Facturación)
const metodosPagoIniciales = [
  {
    id: 'efectivo',
    nombre: 'Efectivo',
    tipo: 'efectivo',
    requiereReferencia: false,
    icono: 'Banknote',
    activo: true,
    comision: 0,
  },
  {
    id: 'tarjeta',
    nombre: 'Tarjeta',
    tipo: 'tarjeta',
    requiereReferencia: true,
    icono: 'CreditCard',
    activo: true,
    comision: 2.5,
  },
  {
    id: 'transferencia',
    nombre: 'Transferencia',
    tipo: 'transferencia',
    requiereReferencia: true,
    icono: 'ArrowRightLeft',
    activo: true,
    comision: 0,
  },
  {
    id: 'credito',
    nombre: 'Crédito',
    tipo: 'credito',
    requiereReferencia: false,
    icono: 'Clock',
    activo: true,
    comision: 0,
  },
];

export const useMetodosPagoStore = create((set, get) => ({
  // Estado
  metodosPago: metodosPagoIniciales,
  metodoPagoEditando: null,

  // Acciones - CRUD
  agregarMetodoPago: (nuevoMetodoPago) => {
    try {
      // Validar con Zod
      const metodoPagoValidado = MetodoPagoSchema.parse({
        ...nuevoMetodoPago,
        id: nuevoMetodoPago.nombre.toLowerCase().replace(/\s+/g, '-'),
      });

      set((state) => ({
        metodosPago: [...state.metodosPago, metodoPagoValidado],
      }));

      return { success: true, metodoPago: metodoPagoValidado };
    } catch (error) {
      return { success: false, error: error.errors };
    }
  },

  actualizarMetodoPago: (id, datosActualizados) => {
    try {
      const metodoPagoActual = get().metodosPago.find((m) => m.id === id);
      if (!metodoPagoActual) {
        return { success: false, error: 'Método de pago no encontrado' };
      }

      // Validar con Zod
      const metodoPagoValidado = MetodoPagoSchema.parse({
        ...metodoPagoActual,
        ...datosActualizados,
      });

      set((state) => ({
        metodosPago: state.metodosPago.map((m) =>
          m.id === id ? metodoPagoValidado : m
        ),
        metodoPagoEditando: null,
      }));

      return { success: true, metodoPago: metodoPagoValidado };
    } catch (error) {
      return { success: false, error: error.errors };
    }
  },

  eliminarMetodoPago: (id) => {
    set((state) => ({
      metodosPago: state.metodosPago.filter((m) => m.id !== id),
    }));
  },

  toggleActivoMetodoPago: (id) => {
    set((state) => ({
      metodosPago: state.metodosPago.map((m) =>
        m.id === id ? { ...m, activo: !m.activo } : m
      ),
    }));
  },

  // Edición
  setMetodoPagoEditando: (metodoPago) => {
    set({ metodoPagoEditando: metodoPago });
  },

  cancelarEdicion: () => {
    set({ metodoPagoEditando: null });
  },

  // Getters
  getMetodosPagoActivos: () => {
    return get().metodosPago.filter((m) => m.activo);
  },

  // Para exportar a Facturación
  exportMetodosPago: () => {
    return get().metodosPago.filter((m) => m.activo);
  },
}));
