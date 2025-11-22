import { create } from 'zustand';
import { z } from 'zod';

/**
 * Schema de validación con Zod para clientes
 */
export const ClienteSchema = z.object({
  id: z.union([z.string(), z.number()]),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  telefono: z.string().min(1, 'El teléfono es obligatorio'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional(),
  notas: z.string().optional(),
  createdAt: z.date().optional(),
});

/**
 * Mock data de clientes
 */
const CLIENTES_INICIALES = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    telefono: '809-555-1234',
    email: 'juan.perez@email.com',
    direccion: 'Av. 27 de Febrero, Santo Domingo',
    notas: 'Cliente frecuente',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    nombre: 'María García',
    telefono: '829-555-5678',
    email: 'maria.garcia@email.com',
    direccion: 'Calle El Conde #45, Zona Colonial',
    notas: 'Prefiere entrega a domicilio',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 3,
    nombre: 'Carlos Rodríguez',
    telefono: '849-555-9012',
    email: 'carlos.rodriguez@email.com',
    direccion: 'Piantini, Santo Domingo',
    notas: '',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 4,
    nombre: 'Ana Martínez',
    telefono: '809-555-3456',
    email: 'ana.martinez@email.com',
    direccion: 'Bella Vista, Santo Domingo',
    notas: 'Cliente VIP',
    createdAt: new Date('2024-04-05'),
  },
  {
    id: 5,
    nombre: 'Pedro Sánchez',
    telefono: '829-555-7890',
    email: 'pedro.sanchez@email.com',
    direccion: 'Naco, Santo Domingo',
    notas: '',
    createdAt: new Date('2024-05-12'),
  },
];

/**
 * Store global de Clientes con Zustand
 */
export const useClientesStore = create((set, get) => ({
  // Estado
  clientes: CLIENTES_INICIALES,
  clienteSeleccionado: null,
  busqueda: '',

  // Acciones
  setClientes: (clientes) => set({ clientes }),

  addCliente: (clienteData) => {
    try {
      const nuevoCliente = {
        ...clienteData,
        id: Date.now(),
        createdAt: new Date(),
      };

      // Validar con Zod
      ClienteSchema.parse(nuevoCliente);

      set((state) => ({
        clientes: [...state.clientes, nuevoCliente],
      }));

      return { success: true, cliente: nuevoCliente };
    } catch (error) {
      console.error('Error validando cliente:', error);
      return { success: false, error: error.errors };
    }
  },

  updateCliente: (id, clienteData) => {
    try {
      const clienteActualizado = {
        ...clienteData,
        id,
      };

      // Validar con Zod
      ClienteSchema.parse(clienteActualizado);

      set((state) => ({
        clientes: state.clientes.map((c) =>
          c.id === id ? clienteActualizado : c
        ),
      }));

      return { success: true, cliente: clienteActualizado };
    } catch (error) {
      console.error('Error validando cliente:', error);
      return { success: false, error: error.errors };
    }
  },

  deleteCliente: (id) => {
    set((state) => ({
      clientes: state.clientes.filter((c) => c.id !== id),
      clienteSeleccionado:
        state.clienteSeleccionado?.id === id ? null : state.clienteSeleccionado,
    }));
  },

  setClienteSeleccionado: (cliente) => {
    set({ clienteSeleccionado: cliente });
  },

  limpiarSeleccion: () => {
    set({ clienteSeleccionado: null });
  },

  setBusqueda: (busqueda) => {
    set({ busqueda });
  },

  // Getters
  getClientesFiltrados: () => {
    const { clientes, busqueda } = get();
    if (!busqueda.trim()) return clientes;

    const searchTerm = busqueda.toLowerCase();
    return clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(searchTerm) ||
        cliente.telefono.toLowerCase().includes(searchTerm) ||
        (cliente.email && cliente.email.toLowerCase().includes(searchTerm)) ||
        (cliente.direccion && cliente.direccion.toLowerCase().includes(searchTerm))
    );
  },

  getClienteById: (id) => {
    const { clientes } = get();
    return clientes.find((c) => c.id === id);
  },
}));
