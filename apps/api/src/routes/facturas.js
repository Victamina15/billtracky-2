import express from 'express';
import { query, getClient } from '../config/database.js';

const router = express.Router();

// POST /api/facturas - Crear nueva factura
router.post('/', async (req, res, next) => {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    const { cliente, items, subtotal, itbis, total, metodoPago, referencia, fechaEntrega } = req.body;

    // Generar número de factura
    const fecha = new Date();
    const numeroFactura = `F-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}-${Date.now()}`;

    // Insertar factura
    const facturaResult = await client.query(
      `INSERT INTO facturas (numero_factura, cliente_id, fecha_entrega, subtotal, itbis, total, metodo_pago_id, referencia_pago, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pendiente')
       RETURNING *`,
      [numeroFactura, cliente?.id || null, fechaEntrega, subtotal, itbis, total, metodoPago, referencia || null]
    );

    const facturaId = facturaResult.rows[0].id;

    // Insertar items
    for (const item of items) {
      await client.query(
        `INSERT INTO facturas_items (factura_id, servicio_id, nombre_servicio, precio_unitario, cantidad, unidad, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [facturaId, item.servicioId, item.nombre, item.precio, item.cantidad, item.unidad, item.subtotal]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      data: facturaResult.rows[0],
      message: 'Factura creada exitosamente',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

// GET /api/facturas - Listar facturas
router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM facturas_completas ORDER BY fecha_creacion DESC LIMIT 100'
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

export default router;
