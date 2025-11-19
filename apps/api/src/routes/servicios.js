import express from 'express';
import {
  getServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio,
  toggleServicio,
} from '../controllers/servicios.controller.js';

const router = express.Router();

// GET /api/servicios - Listar todos los servicios
router.get('/', getServicios);

// GET /api/servicios/:id - Obtener servicio específico
router.get('/:id', getServicioById);

// POST /api/servicios - Crear nuevo servicio
router.post('/', createServicio);

// PUT /api/servicios/:id - Actualizar servicio
router.put('/:id', updateServicio);

// DELETE /api/servicios/:id - Eliminar servicio
router.delete('/:id', deleteServicio);

// PATCH /api/servicios/:id/toggle - Activar/desactivar
router.patch('/:id/toggle', toggleServicio);

export default router;
