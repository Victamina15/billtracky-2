import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeDatabase, closePool } from './config/database.js';

// Importar rutas
import serviciosRoutes from './routes/servicios.js';
import categoriasRoutes from './routes/categorias.js';
import metodosPagoRoutes from './routes/metodosPago.js';
import facturasRoutes from './routes/facturas.js';

// Configuración
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// =====================================================
// MIDDLEWARES
// =====================================================

// CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Parser de JSON
app.use(express.json());

// Parser de URL-encoded
app.use(express.urlencoded({ extended: true }));

// Logger simple
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// =====================================================
// RUTAS
// =====================================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/servicios', serviciosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/metodos-pago', metodosPagoRoutes);
app.use('/api/facturas', facturasRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);

  // Error de validación Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.errors,
    });
  }

  // Error de PostgreSQL
  if (err.code && err.code.startsWith('23')) {
    return res.status(400).json({
      error: 'Error de base de datos',
      message: err.message,
      code: err.code,
    });
  }

  // Error genérico
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error',
  });
});

// =====================================================
// INICIALIZACIÓN
// =====================================================

async function startServer() {
  try {
    // Inicializar base de datos (opcional)
    if (process.env.INIT_DB === 'true') {
      const schemaPath = join(__dirname, 'db', 'schema.sql');
      await initializeDatabase(schemaPath);
    } else {
      console.log('⏭️  Omitiendo inicialización de BD (INIT_DB no está en true)');
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('\n🚀 Servidor iniciado correctamente');
      console.log(`📡 API disponible en: http://localhost:${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n📋 Endpoints disponibles:`);
      console.log(`   GET  /health`);
      console.log(`   GET  /api/servicios`);
      console.log(`   GET  /api/categorias`);
      console.log(`   GET  /api/metodos-pago`);
      console.log(`   POST /api/facturas`);
      console.log('\n✨ Listo para recibir peticiones\n');
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('\n👋 Recibida señal SIGTERM. Cerrando servidor...');
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n👋 Recibida señal SIGINT. Cerrando servidor...');
  await closePool();
  process.exit(0);
});

// Iniciar servidor
startServer();

export default app;
