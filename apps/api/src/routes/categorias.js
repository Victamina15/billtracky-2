import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// GET /api/categorias - Listar todas las categorías
router.get('/', async (req, res, next) => {
  try {
    // Incluir "Todos" como opción
    const result = await query(
      'SELECT * FROM categorias WHERE activo = true ORDER BY nombre'
    );

    const categorias = [
      { id: 'todos', nombre: 'Todos', color: '#6B7280' },
      ...result.rows,
    ];

    res.json({ success: true, data: categorias });
  } catch (error) {
    next(error);
  }
});

// Demás endpoints siguiendo el patrón de servicios.controller.js
// TODO: Implementar POST, PUT, DELETE, PATCH

export default router;
