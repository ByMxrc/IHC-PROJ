/**
 * Rutas de Inscripciones
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET - Obtener todas las inscripciones
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT r.*, 
             p.name || ' ' || p.last_name AS producer_name,
             f.name AS fair_name,
             f.start_date
      FROM registrations r
      JOIN producers p ON r.producer_id = p.producer_id
      JOIN fairs f ON r.fair_id = f.fair_id
      ORDER BY r.registration_date DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error obteniendo inscripciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener inscripciones' });
  }
});

// POST - Crear inscripción
router.post('/', async (req, res) => {
  try {
    const {
      producerId, fairId, productsToSell, estimatedQuantity,
      needsTransport,
      // Formatos alternativos
      producer_id, fair_id, products_to_sell, estimated_quantity, status
    } = req.body;

    // Procesar products_to_sell
    const processArray = (data) => {
      if (!data) return [];
      if (typeof data === 'string') {
        try {
          return JSON.parse(data);
        } catch {
          return [data];
        }
      }
      return Array.isArray(data) ? data : [];
    };

    const result = await query(`
      INSERT INTO registrations 
      (producer_id, fair_id, products_to_sell, estimated_quantity, status, registration_date)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `, [
      producer_id || producerId,
      fair_id || fairId,
      processArray(products_to_sell || productsToSell),
      estimated_quantity || estimatedQuantity,
      status || 'pending'
    ]);

    res.status(201).json({ 
      success: true, 
      message: 'Inscripción creada exitosamente',
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creando inscripción:', error);
    res.status(500).json({ success: false, message: 'Error al crear inscripción', error: error.message });
  }
});

module.exports = router;
