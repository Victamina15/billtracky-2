import { z } from 'zod';

// Schema para Categorías
export const CategoriaSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color hexadecimal inválido'),
  descripcion: z.string().max(200, 'Máximo 200 caracteres').optional(),
  activo: z.boolean().default(true),
});

// Schema para Servicios
export const ServicioSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  categoria: z.string().min(1, 'La categoría es requerida'),
  precio: z.number().positive('El precio debe ser positivo').min(0.01),
  unidad: z.enum(['kg', 'unidad', 'metro', 'servicio'], {
    errorMap: () => ({ message: 'Unidad inválida' }),
  }),
  descripcion: z.string().max(300, 'Máximo 300 caracteres').optional(),
  activo: z.boolean().default(true),
  tiempoEstimado: z.number().int().positive().optional(), // en minutos
});

// Schema para Métodos de Pago
export const MetodoPagoSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres'),
  tipo: z.enum(['efectivo', 'tarjeta', 'transferencia', 'credito', 'otro'], {
    errorMap: () => ({ message: 'Tipo inválido' }),
  }),
  requiereReferencia: z.boolean().default(false),
  icono: z.string(),
  activo: z.boolean().default(true),
  comision: z.number().min(0).max(100).optional(), // porcentaje
});

// Schema para Configuración General
export const ConfiguracionGeneralSchema = z.object({
  nombreNegocio: z.string().min(1, 'El nombre del negocio es requerido'),
  rnc: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  direccion: z.string().optional(),
  tasaITBIS: z.number().min(0).max(100).default(18),
  moneda: z.string().default('DOP'),
  formatoFecha: z.string().default('dd/MM/yyyy'),
});
