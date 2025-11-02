/**
 * Rutas de Ferias
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET - Obtener todas las ferias
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM v_fairs_summary ORDER BY start_date DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error obteniendo ferias:', error);
    res.status(500).json({ success: false, message: 'Error al obtener ferias' });
  }
});

// GET - Obtener feria por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM fairs WHERE fair_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Feria no encontrada' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo feria:', error);
    res.status(500).json({ success: false, message: 'Error al obtener feria' });
  }
});

// POST - Crear feria
router.post('/', async (req, res) => {
  try {
    const {
      name, description, location, address, district, province, department,
      startDate, endDate, maxCapacity, productCategories, requirements
    } = req.body;

    const result = await query(`
      INSERT INTO fairs 
      (name, description, location, address, district, province, department,
       start_date, end_date, max_capacity, product_categories, requirements)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      name, description, location, address, district, province, department,
      startDate, endDate, maxCapacity, productCategories, requirements
    ]);

    res.status(201).json({ 
      success: true, 
      message: 'Feria creada exitosamente',
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creando feria:', error);
    res.status(500).json({ success: false, message: 'Error al crear feria' });
  }
});

module.exports = router;
