import { query } from '../config/database.js';
import { z } from 'zod';

// Schema de validación (igual que en el frontend)
const ServicioSchema = z.object({
  nombre: z.string().min(1).max(100),
  categoria_id: z.string().min(1),
  precio: z.number().positive().min(0.01),
  unidad: z.enum(['kg', 'unidad', 'metro', 'servicio']),
  descripcion: z.string().max(300).optional(),
  tiempo_estimado: z.number().int().positive().optional(),
});

// GET /api/servicios - Obtener todos los servicios
export const getServicios = async (req, res, next) => {
  try {
    const { categoria, activo } = req.query;

    let sql = 'SELECT * FROM servicios_completos WHERE 1=1';
    const params = [];

    if (categoria && categoria !== 'todos') {
      params.push(categoria);
      sql += ` AND categoria_id = $${params.length}`;
    }

    if (activo !== undefined) {
      params.push(activo === 'true');
      sql += ` AND activo = $${params.length}`;
    }

    sql += ' ORDER BY nombre ASC';

    const result = await query(sql, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/servicios/:id - Obtener servicio por ID
export const getServicioById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM servicios_completos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Servicio no encontrado',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/servicios - Crear nuevo servicio
export const createServicio = async (req, res, next) => {
  try {
    // Validar datos con Zod
    const validatedData = ServicioSchema.parse(req.body);

    const result = await query(
      `INSERT INTO servicios (nombre, categoria_id, precio, unidad, descripcion, tiempo_estimado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        validatedData.nombre,
        validatedData.categoria_id,
        validatedData.precio,
        validatedData.unidad,
        validatedData.descripcion || null,
        validatedData.tiempo_estimado || null,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Servicio creado exitosamente',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Error de validación',
        details: error.errors,
      });
    }
    next(error);
  }
};

// PUT /api/servicios/:id - Actualizar servicio
export const updateServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = ServicioSchema.partial().parse(req.body);

    // Construir query dinámica
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(validatedData).forEach(([key, value]) => {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    });

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No se proporcionaron campos para actualizar',
      });
    }

    values.push(id);
    const sql = `UPDATE servicios SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Servicio no encontrado',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Servicio actualizado exitosamente',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Error de validación',
        details: error.errors,
      });
    }
    next(error);
  }
};

// DELETE /api/servicios/:id - Eliminar servicio
export const deleteServicio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM servicios WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Servicio no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Servicio eliminado exitosamente',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/servicios/:id/toggle - Activar/desactivar servicio
export const toggleServicio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE servicios SET activo = NOT activo WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Servicio no encontrado',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: `Servicio ${result.rows[0].activo ? 'activado' : 'desactivado'} exitosamente`,
    });
  } catch (error) {
    next(error);
  }
};
