// API para gestionar categorías - Integración con Backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Obtiene todas las categorías (incluye "Todos")
 * @returns {Promise<Array>} Lista de categorías
 */
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

/**
 * Obtiene solo las categorías activas (sin "Todos")
 * @returns {Promise<Array>} Lista de categorías activas
 */
export const getCategoriasActivas = async () => {
  try {
    const categorias = await getCategorias();
    // Filtrar "todos" y solo devolver categorías activas
    return categorias.filter((cat) => cat.id !== 'todos' && cat.activo !== false);
  } catch (error) {
    console.error('Error al obtener categorías activas:', error);
    throw error;
  }
};

/**
 * Obtiene una categoría por su ID
 * @param {string} id - ID de la categoría
 * @returns {Promise<Object>} Categoría encontrada
 */
export const getCategoriaById = async (id) => {
  try {
    const categorias = await getCategorias();
    const categoria = categorias.find((c) => c.id === id);

    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }

    return categoria;
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    throw error;
  }
};

/**
 * Crea una nueva categoría
 * @param {Object} categoria - Datos de la categoría
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createCategoria = async (categoria) => {
  try {
    const response = await fetch(`${API_URL}/api/categorias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoria),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al crear categoría');
    }

    return result;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
};

/**
 * Actualiza una categoría existente
 * @param {string} id - ID de la categoría
 * @param {Object} categoria - Datos actualizados de la categoría
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateCategoria = async (id, categoria) => {
  try {
    const response = await fetch(`${API_URL}/api/categorias/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoria),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al actualizar categoría');
    }

    return result;
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    throw error;
  }
};

/**
 * Elimina una categoría
 * @param {string} id - ID de la categoría
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteCategoria = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/categorias/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al eliminar categoría');
    }

    return result;
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    throw error;
  }
};
