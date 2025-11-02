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
      SELECT s.*, 
             p.first_name || ' ' || p.last_name AS producer_name,
             f.name AS fair_name
      FROM sales s
      JOIN registrations r ON s.registration_id = r.registration_id
      JOIN producers p ON r.producer_id = p.producer_id
      JOIN fairs f ON r.fair_id = f.fair_id
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
      unit, unitPrice, totalAmount, paymentMethod
    } = req.body;

    const result = await query(`
      INSERT INTO sales 
      (registration_id, sale_date, product_name, quantity, unit, unit_price, total_amount, payment_method)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [registrationId, saleDate, productName, quantity, unit, unitPrice, totalAmount, paymentMethod]);

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
