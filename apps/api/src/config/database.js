import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuración del pool de conexiones a PostgreSQL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Número máximo de clientes en el pool
  idleTimeoutMillis: 30000, // Tiempo de espera antes de cerrar clientes inactivos
  connectionTimeoutMillis: 2000, // Tiempo máximo de espera para obtener conexión
});

// Evento: Conexión exitosa
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

// Evento: Error en el pool
pool.on('error', (err) => {
  console.error('❌ Error inesperado en PostgreSQL pool:', err);
  process.exit(-1);
});

/**
 * Ejecutar una query con manejo de errores
 * @param {string} text - SQL query
 * @param {Array} params - Parámetros de la query
 * @returns {Promise<Object>} Resultado de la query
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Query ejecutada:', { text, duration: `${duration}ms`, rows: res.rowCount });
    }

    return res;
  } catch (error) {
    console.error('❌ Error en query:', error);
    throw error;
  }
};

/**
 * Obtener un cliente del pool para transacciones
 * @returns {Promise<Object>} Cliente de PostgreSQL
 */
export const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);

  // Configurar timeout para liberar cliente automáticamente
  const timeout = setTimeout(() => {
    console.error('⚠️ Cliente no liberado después de 5 segundos!');
    client.release();
  }, 5000);

  // Sobreescribir release para limpiar timeout
  client.release = () => {
    clearTimeout(timeout);
    release();
  };

  return client;
};

/**
 * Inicializar la base de datos (ejecutar schema.sql)
 * @param {string} schemaPath - Path al archivo schema.sql
 * @returns {Promise<void>}
 */
export const initializeDatabase = async (schemaPath) => {
  try {
    const fs = await import('fs/promises');
    const schema = await fs.readFile(schemaPath, 'utf-8');

    console.log('🔄 Inicializando base de datos...');
    await query(schema);
    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    throw error;
  }
};

/**
 * Cerrar todas las conexiones del pool
 * @returns {Promise<void>}
 */
export const closePool = async () => {
  try {
    await pool.end();
    console.log('👋 Pool de conexiones cerrado');
  } catch (error) {
    console.error('❌ Error al cerrar pool:', error);
    throw error;
  }
};

export default { pool, query, getClient, initializeDatabase, closePool };
