/**
 * Rutas para gestión de productos
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const { producer_id } = req.query;
    
    let sql = `
      SELECT 
        p.*,
        u.full_name as producer_name
      FROM products p
      LEFT JOIN users u ON p.producer_id = u.user_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (producer_id) {
      sql += ' AND p.producer_id = $1';
      params.push(producer_id);
    }
    
    sql += ' ORDER BY p.created_at DESC';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT 
        p.*,
        u.full_name as producer_name
      FROM products p
      LEFT JOIN users u ON p.producer_id = u.user_id
      WHERE p.product_id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { producer_id, product_name, quantity, unit, unit_price } = req.body;
    
    // Validación básica
    if (!producer_id || !product_name || !quantity || !unit || !unit_price) {
      return res.status(400).json({ success: false, error: 'Todos los campos son obligatorios' });
    }
    
    const result = await query(
      `INSERT INTO products (producer_id, product_name, quantity, unit, unit_price, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [producer_id, product_name, quantity, unit, unit_price]
    );
    
    res.status(201).json({ 
      success: true,
      message: 'Producto creado exitosamente',
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ success: false, error: 'Error al crear producto' });
  }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, quantity, unit, unit_price } = req.body;
    
    // Verificar si el producto existe
    const checkResult = await query('SELECT * FROM products WHERE product_id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    const result = await query(
      `UPDATE products 
       SET product_name = $1, 
           quantity = $2, 
           unit = $3, 
           unit_price = $4, 
           updated_at = NOW()
       WHERE product_id = $5
       RETURNING *`,
      [product_name, quantity, unit, unit_price, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el producto existe
    const checkResult = await query('SELECT * FROM products WHERE product_id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    await query('DELETE FROM products WHERE product_id = $1', [id]);
    
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
