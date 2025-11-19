// API pública para exportar categorías al módulo de Facturación
import { useCategoriasStore } from '../hooks/useCategoriasStore';

/**
 * Obtiene todas las categorías activas (incluye "Todos")
 * @returns {Promise<Array>} Lista de categorías
 */
export const getCategorias = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const store = useCategoriasStore.getState();
  return store.exportCategorias();
};

/**
 * Obtiene solo las categorías activas (sin "Todos")
 * @returns {Promise<Array>} Lista de categorías activas
 */
export const getCategoriasActivas = async () => {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const store = useCategoriasStore.getState();
  return store.getCategoriasActivas();
};

/**
 * Obtiene una categoría por su ID
 * @param {string} id - ID de la categoría
 * @returns {Promise<Object|null>} Categoría encontrada o null
 */
export const getCategoriaById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const store = useCategoriasStore.getState();
  const categoria = store.categorias.find((c) => c.id === id && c.activo);

  return categoria || null;
};
