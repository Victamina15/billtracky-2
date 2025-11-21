// API para gestionar servicios - Integración con Backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Obtiene todos los servicios filtrados por categoría
 * @param {string} categoria - ID de la categoría o 'todos'
 * @returns {Promise<Array>} Lista de servicios
 */
export const getServicios = async (categoria = 'todos') => {
  try {
    const url = categoria === 'todos'
      ? `${API_URL}/api/servicios`
      : `${API_URL}/api/servicios?categoria=${categoria}`;

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

/**
 * Obtiene un servicio por su ID
 * @param {number} id - ID del servicio
 * @returns {Promise<Object>} Servicio encontrado
 */
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

/**
 * Crea un nuevo servicio
 * @param {Object} servicio - Datos del servicio
 * @returns {Promise<Object>} Resultado de la operación
 */
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

/**
 * Actualiza un servicio existente
 * @param {number} id - ID del servicio
 * @param {Object} servicio - Datos actualizados del servicio
 * @returns {Promise<Object>} Resultado de la operación
 */
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

/**
 * Elimina un servicio
 * @param {number} id - ID del servicio
 * @returns {Promise<Object>} Resultado de la operación
 */
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

/**
 * Activa o desactiva un servicio
 * @param {number} id - ID del servicio
 * @returns {Promise<Object>} Resultado de la operación
 */
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

/**
 * Busca servicios por nombre
 * @param {string} query - Texto de búsqueda
 * @returns {Promise<Array>} Lista de servicios que coinciden
 */
export const buscarServicios = async (query) => {
  try {
    const servicios = await getServicios('todos');

    if (!query || query.trim() === '') {
      return servicios;
    }

    const queryLower = query.toLowerCase();
    return servicios.filter((servicio) =>
      servicio.nombre.toLowerCase().includes(queryLower) ||
      servicio.descripcion?.toLowerCase().includes(queryLower)
    );
  } catch (error) {
    console.error('Error al buscar servicios:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de servicios
 * @returns {Promise<Object>} Estadísticas
 */
export const getEstadisticasServicios = async () => {
  try {
    const servicios = await getServicios('todos');

    return {
      total: servicios.length,
      activos: servicios.filter((s) => s.activo).length,
      inactivos: servicios.filter((s) => !s.activo).length,
      porCategoria: servicios.reduce((acc, servicio) => {
        acc[servicio.categoria_id] = (acc[servicio.categoria_id] || 0) + 1;
        return acc;
      }, {}),
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};
