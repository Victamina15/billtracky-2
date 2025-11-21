// API para gestionar métodos de pago - Integración con Backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Obtiene todos los métodos de pago activos
 * @returns {Promise<Array>} Lista de métodos de pago
 */
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

/**
 * Obtiene un método de pago por su ID
 * @param {string} id - ID del método de pago
 * @returns {Promise<Object>} Método de pago encontrado
 */
export const getMetodoPagoById = async (id) => {
  try {
    const metodos = await getMetodosPago();
    const metodo = metodos.find((m) => m.id === id);

    if (!metodo) {
      throw new Error('Método de pago no encontrado');
    }

    return metodo;
  } catch (error) {
    console.error('Error al obtener método de pago:', error);
    throw error;
  }
};

/**
 * Crea un nuevo método de pago
 * @param {Object} metodoPago - Datos del método de pago
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createMetodoPago = async (metodoPago) => {
  try {
    const response = await fetch(`${API_URL}/api/metodos-pago`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metodoPago),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al crear método de pago');
    }

    return result;
  } catch (error) {
    console.error('Error al crear método de pago:', error);
    throw error;
  }
};

/**
 * Actualiza un método de pago existente
 * @param {string} id - ID del método de pago
 * @param {Object} metodoPago - Datos actualizados del método de pago
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateMetodoPago = async (id, metodoPago) => {
  try {
    const response = await fetch(`${API_URL}/api/metodos-pago/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metodoPago),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al actualizar método de pago');
    }

    return result;
  } catch (error) {
    console.error('Error al actualizar método de pago:', error);
    throw error;
  }
};

/**
 * Elimina un método de pago
 * @param {string} id - ID del método de pago
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteMetodoPago = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/metodos-pago/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al eliminar método de pago');
    }

    return result;
  } catch (error) {
    console.error('Error al eliminar método de pago:', error);
    throw error;
  }
};

/**
 * Valida si un método de pago requiere referencia
 * @param {string} id - ID del método de pago
 * @returns {Promise<boolean>} true si requiere referencia
 */
export const requiereReferencia = async (id) => {
  try {
    const metodoPago = await getMetodoPagoById(id);
    return metodoPago?.requiereReferencia || false;
  } catch (error) {
    console.error('Error al validar referencia:', error);
    return false;
  }
};

/**
 * Calcula la comisión de un método de pago
 * @param {string} id - ID del método de pago
 * @param {number} monto - Monto base
 * @returns {Promise<Object>} { comision, total }
 */
export const calcularComision = async (id, monto) => {
  try {
    const metodoPago = await getMetodoPagoById(id);

    if (!metodoPago || !metodoPago.comision) {
      return { comision: 0, total: monto };
    }

    const comision = (monto * metodoPago.comision) / 100;
    const total = monto + comision;

    return { comision, total };
  } catch (error) {
    console.error('Error al calcular comisión:', error);
    return { comision: 0, total: monto };
  }
};
