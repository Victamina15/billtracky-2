// API pública para exportar métodos de pago al módulo de Facturación
import { useMetodosPagoStore } from '../hooks/useMetodosPagoStore';

/**
 * Obtiene todos los métodos de pago activos
 * @returns {Promise<Array>} Lista de métodos de pago
 */
export const getMetodosPago = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const store = useMetodosPagoStore.getState();
  return store.exportMetodosPago();
};

/**
 * Obtiene un método de pago por su ID
 * @param {string} id - ID del método de pago
 * @returns {Promise<Object|null>} Método de pago encontrado o null
 */
export const getMetodoPagoById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const store = useMetodosPagoStore.getState();
  const metodoPago = store.metodosPago.find((m) => m.id === id && m.activo);

  return metodoPago || null;
};

/**
 * Valida si un método de pago requiere referencia
 * @param {string} id - ID del método de pago
 * @returns {Promise<boolean>} true si requiere referencia
 */
export const requiereReferencia = async (id) => {
  const metodoPago = await getMetodoPagoById(id);
  return metodoPago?.requiereReferencia || false;
};

/**
 * Calcula la comisión de un método de pago
 * @param {string} id - ID del método de pago
 * @param {number} monto - Monto base
 * @returns {Promise<Object>} { comision, total }
 */
export const calcularComision = async (id, monto) => {
  const metodoPago = await getMetodoPagoById(id);

  if (!metodoPago || !metodoPago.comision) {
    return { comision: 0, total: monto };
  }

  const comision = (monto * metodoPago.comision) / 100;
  const total = monto + comision;

  return { comision, total };
};
