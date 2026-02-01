/**
 * Rutas de Ferias
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET - Obtener todas las ferias
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        fair_id as id,
        name,
        description,
        location,
        address,
        start_date as "startDate",
        end_date as "endDate",
        max_capacity as "maxCapacity",
        current_capacity as "currentCapacity",
        status,
        product_categories as "productCategories",
        requirements,
        created_at,
        updated_at
      FROM fairs 
      ORDER BY start_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo ferias:', error);
    res.status(500).json({ success: false, message: 'Error al obtener ferias' });
  }
});

// GET - Obtener feria por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT 
        fair_id as id,
        name,
        description,
        location,
        address,
        start_date as "startDate",
        end_date as "endDate",
        max_capacity as "maxCapacity",
        current_capacity as "currentCapacity",
        status,
        product_categories as "productCategories",
        requirements,
        created_at,
        updated_at
      FROM fairs 
      WHERE fair_id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Feria no encontrada' });
    }

    res.json(result.rows[0]);
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
      startDate, endDate, maxCapacity, productCategories, requirements,
      // Formatos alternativos
      start_date, end_date, max_capacity, product_categories, status
    } = req.body;

    // Procesar arrays
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
      INSERT INTO fairs 
      (name, description, location, address, start_date, end_date, max_capacity, current_capacity, status, product_categories, requirements, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `, [
      name, 
      description, 
      location, 
      address,
      start_date || startDate, 
      end_date || endDate, 
      max_capacity || maxCapacity || 50, 
      status || 'scheduled',
      processArray(product_categories || productCategories),
      processArray(requirements)
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
