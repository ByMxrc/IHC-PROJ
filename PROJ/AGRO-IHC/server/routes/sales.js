/**
 * Rutas de Ventas
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET - Obtener todas las ventas
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT s.* 
      FROM sales s
      ORDER BY s.sale_date DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error obteniendo ventas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener ventas' });
  }
});

// POST - Registrar venta
router.post('/', async (req, res) => {
  try {
    const {
      registrationId, saleDate, productName, quantity,
      unit, unitPrice, totalAmount, paymentMethod,
      // Formatos alternativos
      fair_id, producer_id, product_name, quantity_sold,
      unit_price, total_amount, sale_date, registration_id
    } = req.body;

    // Usar registration_id directo, no fair_id
    const regId = registration_id || registrationId;
    
    if (!regId) {
      return res.status(400).json({ 
        success: false, 
        message: 'registration_id es requerido' 
      });
    }

    const result = await query(`
      INSERT INTO sales 
      (registration_id, product_name, quantity, unit, unit_price, total_amount, sale_date, payment_method, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `, [
      regId,
      product_name || productName || 'Producto sin especificar',
      quantity_sold || quantity || 1,
      unit || 'kg',
      unit_price || unitPrice || 0,
      total_amount || totalAmount || 0,
      sale_date || saleDate || new Date().toISOString(),
      paymentMethod || 'efectivo'
    ]);

    res.status(201).json({ 
      success: true, 
      message: 'Venta registrada exitosamente',
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error registrando venta:', error);
    res.status(500).json({ success: false, message: 'Error al registrar venta' });
  }
});

module.exports = router;
