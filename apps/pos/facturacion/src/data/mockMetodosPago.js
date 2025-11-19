/**
 * Métodos de pago integrados con módulo CONFIGURACIÓN
 * Los métodos de pago ahora se obtienen directamente del módulo de configuración
 */

// Importar desde el módulo CONFIGURACIÓN usando alias
import { getMetodosPago as getMetodosPagoConfig } from '@configuracion/api/metodosPago';

/**
 * Obtener métodos de pago habilitados desde módulo CONFIGURACIÓN
 * Adapta el formato de configuración al formato esperado por facturación
 * @returns {Promise<Array>} Lista de métodos de pago
 */
export const getMetodosPago = async () => {
  const metodosPagoConfig = await getMetodosPagoConfig();

  // Adaptar formato: configuración usa "activo", facturación usa "habilitado"
  return metodosPagoConfig.map((metodo) => ({
    id: metodo.id,
    nombre: metodo.nombre,
    icono: metodo.icono,
    habilitado: metodo.activo, // Mapear activo -> habilitado
    requiereReferencia: metodo.requiereReferencia,
    tipo: metodo.tipo, // Información adicional disponible
    comision: metodo.comision, // Información adicional disponible
  }));
};
