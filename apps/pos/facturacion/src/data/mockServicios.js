/**
 * Servicios integrados con módulo CONFIGURACIÓN
 * Los servicios ahora se obtienen directamente del módulo de configuración
 */

// Importar desde el módulo CONFIGURACIÓN usando alias
import { getServicios as getServiciosConfig } from '@configuracion/api/servicios';
import { getCategorias as getCategoriasConfig } from '@configuracion/api/categorias';

/**
 * Exportar categorías desde configuración
 * Ahora las categorías vienen del módulo de configuración
 */
export const getCategorias = async () => {
  return await getCategoriasConfig();
};

/**
 * Obtener servicios desde el módulo CONFIGURACIÓN
 * @param {string} categoria - ID de la categoría o 'todos'
 * @returns {Promise<Array>} Lista de servicios
 */
export const getServicios = async (categoria = 'todos') => {
  return await getServiciosConfig(categoria);
};

/**
 * Buscar servicios por nombre
 * @param {string} query - Texto de búsqueda
 * @param {Array} servicios - Lista de servicios (opcional)
 * @returns {Array} Servicios filtrados
 */
export const searchServicios = (query, servicios = []) => {
  if (!query) return servicios;

  const lowerQuery = query.toLowerCase();
  return servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(lowerQuery)
  );
};

// Re-exportar CATEGORIAS para compatibilidad con código existente
// Este array se cargará dinámicamente desde configuración
export let CATEGORIAS = [];

// Cargar categorías al iniciar
getCategorias().then((cats) => {
  CATEGORIAS = cats;
});
