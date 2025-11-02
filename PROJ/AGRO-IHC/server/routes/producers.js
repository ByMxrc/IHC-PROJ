/**
 * Rutas de Productores
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET - Obtener todos los productores
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM v_producers_summary
      ORDER BY registration_date DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error obteniendo productores:', error);
    res.status(500).json({ success: false, message: 'Error al obtener productores' });
  }
});

// GET - Obtener productor por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM producers WHERE producer_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Productor no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo productor:', error);
    res.status(500).json({ success: false, message: 'Error al obtener productor' });
  }
});

// POST - Crear productor
router.post('/', async (req, res) => {
  try {
    const {
      firstName, lastName, documentType, documentNumber,
      email, phone, address, district, province, department,
      farmName, farmSize, mainProducts
    } = req.body;

    const result = await query(`
      INSERT INTO producers 
      (first_name, last_name, document_type, document_number, email, phone,
       address, district, province, department, farm_name, farm_size, main_products)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      firstName, lastName, documentType, documentNumber,
      email, phone, address, district, province, department,
      farmName, farmSize, mainProducts
    ]);

    res.status(201).json({ 
      success: true, 
      message: 'Productor creado exitosamente',
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creando productor:', error);
    res.status(500).json({ success: false, message: 'Error al crear productor' });
  }
});

module.exports = router;
