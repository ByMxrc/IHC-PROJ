/**
 * Rutas de Transporte
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET - Obtener rutas de transporte
router.get('/routes', async (req, res) => {
  try {
    const result = await query(`
      SELECT tr.*, f.name AS fair_name
      FROM transport_routes tr
      JOIN fairs f ON tr.fair_id = f.fair_id
      ORDER BY tr.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error obteniendo rutas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener rutas' });
  }
});

// POST - Crear ruta de transporte
router.post('/routes', async (req, res) => {
  try {
    const {
      fairId, routeName, driverName, driverPhone,
      vehicleType, maxCapacity
    } = req.body;

    const result = await query(`
      INSERT INTO transport_routes 
      (fair_id, route_name, driver_name, driver_phone, vehicle_type, max_capacity)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [fairId, routeName, driverName, driverPhone, vehicleType, maxCapacity]);

    res.status(201).json({ 
      success: true, 
      message: 'Ruta creada exitosamente',
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creando ruta:', error);
    res.status(500).json({ success: false, message: 'Error al crear ruta' });
  }
});

module.exports = router;
