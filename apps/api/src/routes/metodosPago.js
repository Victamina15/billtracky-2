import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// GET /api/metodos-pago - Listar métodos de pago activos
router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM metodos_pago WHERE activo = true ORDER BY nombre'
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// Demás endpoints siguiendo el patrón de servicios.controller.js
// TODO: Implementar POST, PUT, DELETE, PATCH

export default router;
