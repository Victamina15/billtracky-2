/**
 * Formatea un número a moneda dominicana (DOP)
 * @param {number} amount - Cantidad a formatear
 * @returns {string} - Cantidad formateada como $0,000.00
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

/**
 * Parsea un string de moneda a número
 * @param {string} currencyString - String de moneda
 * @returns {number} - Número parseado
 */
export const parseCurrency = (currencyString) => {
  if (typeof currencyString === 'number') return currencyString;
  const cleaned = currencyString.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned) || 0;
};
