import { format, addDays, isToday, isTomorrow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha a formato legible en español
 * @param {Date|string} date - Fecha a formatear
 * @param {string} formatString - Formato deseado
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date, formatString = 'PPP') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: es });
};

/**
 * Formatea una fecha con descripción relativa (hoy, mañana, etc)
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Descripción de la fecha
 */
export const formatRelativeDate = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return 'Hoy';
  }

  if (isTomorrow(dateObj)) {
    return 'Mañana';
  }

  return format(dateObj, 'EEEE, d MMM', { locale: es });
};

/**
 * Agrega días a una fecha
 * @param {Date|string} date - Fecha base
 * @param {number} days - Días a agregar
 * @returns {Date} - Nueva fecha
 */
export const addDaysToDate = (date, days) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addDays(dateObj, days);
};
