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
      SELECT * FROM producers
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
      farmName, farmSize, mainProducts,
      // Formatos alternativos
      name, last_name, document_type, document_number,
      farm_size, product_types, status
    } = req.body;

    // Procesar product_types
    let productTypeArray = [];
    const productTypesData = product_types || mainProducts;
    
    if (productTypesData) {
      if (typeof productTypesData === 'string') {
        try {
          productTypeArray = JSON.parse(productTypesData);
        } catch {
          productTypeArray = [productTypesData];
        }
      } else if (Array.isArray(productTypesData)) {
        productTypeArray = productTypesData;
      }
    }

    const result = await query(`
      INSERT INTO producers 
      (name, last_name, document_type, document_number, email, phone,
       address, district, province, department, farm_size, product_type, status, registration_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      RETURNING *
    `, [
      name || firstName,
      last_name || lastName,
      document_type || documentType || 'DNI',
      document_number || documentNumber,
      email,
      phone,
      address,
      district,
      province,
      department,
      farm_size || farmSize || 0,
      productTypeArray,
      status || 'active'
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
