// API pública para exportar servicios al módulo de Facturación
import { useServiciosStore } from '../hooks/useServiciosStore';

/**
 * Obtiene todos los servicios activos filtrados por categoría
 * @param {string} categoria - ID de la categoría o 'todos'
 * @returns {Promise<Array>} Lista de servicios
 */
export const getServicios = async (categoria = 'todos') => {
  // Simular latencia de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  const store = useServiciosStore.getState();
  const servicios = store.getServiciosActivos();

  if (categoria === 'todos') {
    return servicios;
  }

  return servicios.filter((servicio) => servicio.categoria === categoria);
};

/**
 * Obtiene un servicio por su ID
 * @param {number} id - ID del servicio
 * @returns {Promise<Object|null>} Servicio encontrado o null
 */
export const getServicioById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const store = useServiciosStore.getState();
  const servicio = store.servicios.find((s) => s.id === id && s.activo);

  return servicio || null;
};

/**
 * Busca servicios por nombre
 * @param {string} query - Texto de búsqueda
 * @returns {Promise<Array>} Lista de servicios que coinciden
 */
export const buscarServicios = async (query) => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const store = useServiciosStore.getState();
  const servicios = store.getServiciosActivos();

  if (!query || query.trim() === '') {
    return servicios;
  }

  const queryLower = query.toLowerCase();
  return servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(queryLower) ||
    servicio.descripcion?.toLowerCase().includes(queryLower)
  );
};

/**
 * Obtiene estadísticas de servicios
 * @returns {Promise<Object>} Estadísticas
 */
export const getEstadisticasServicios = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const store = useServiciosStore.getState();
  const servicios = store.servicios;

  return {
    total: servicios.length,
    activos: servicios.filter((s) => s.activo).length,
    inactivos: servicios.filter((s) => !s.activo).length,
    porCategoria: servicios.reduce((acc, servicio) => {
      acc[servicio.categoria] = (acc[servicio.categoria] || 0) + 1;
      return acc;
    }, {}),
  };
};
