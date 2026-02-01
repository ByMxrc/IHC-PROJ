/**
 * Rutas de Transporte
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET - Obtener todas las rutas de transporte
router.get('/', async (req, res) => {
  try {
    res.json({ success: true, data: [], message: 'Tabla transport_routes pendiente de crear' });
  } catch (error) {
    console.error('Error obteniendo rutas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener rutas' });
  }
});

// GET - Obtener rutas de transporte
router.get('/routes', async (req, res) => {
  try {
    // Tabla transport_routes no existe aún - devolver array vacío
    res.json({ success: true, data: [], message: 'Tabla transport_routes pendiente de crear' });
  } catch (error) {
    console.error('Error obteniendo rutas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener rutas' });
  }
});

// POST - Crear ruta de transporte
router.post('/routes', async (req, res) => {
  try {
    // Tabla transport_routes no existe aún
    res.status(501).json({ 
      success: false, 
      message: 'Funcionalidad de transporte pendiente de implementar - tabla no creada'
    });
  } catch (error) {
    console.error('Error creando ruta:', error);
    res.status(500).json({ success: false, message: 'Error al crear ruta' });
  }
});

module.exports = router;
