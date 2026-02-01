/**
 * Rutas API para Avisos Globales (Global Announcements)
 * Gestión de banners informativos del sistema
 */

const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET - Obtener todos los avisos activos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;
    
    const result = await pool.query(`
      SELECT * FROM global_announcements 
      WHERE is_active = true 
        AND start_date <= NOW() 
        AND end_date >= NOW()
        AND (target_audience @> ARRAY[$1]::text[] OR 'all' = ANY(target_audience))
      ORDER BY level DESC, created_at DESC
    `, [role]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Error al obtener avisos' });
  }
});

// GET - Obtener todos los avisos (admin)
router.get('/all', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM global_announcements 
      ORDER BY created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all announcements:', error);
    res.status(500).json({ error: 'Error al obtener avisos' });
  }
});

// POST - Crear nuevo aviso (admin)
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  const { title, message, level, startDate, endDate, targetAudience, isActive } = req.body;
  
  try {
    const result = await pool.query(`
      INSERT INTO global_announcements 
      (title, message, level, start_date, end_date, target_audience, is_active, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [title, message, level, startDate, endDate, targetAudience, isActive, req.user.id]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Error al crear aviso' });
  }
});

// PUT - Actualizar aviso (admin)
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { title, message, level, startDate, endDate, targetAudience, isActive } = req.body;
  
  try {
    const result = await pool.query(`
      UPDATE global_announcements 
      SET title = $1, message = $2, level = $3, start_date = $4, 
          end_date = $5, target_audience = $6, is_active = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `, [title, message, level, startDate, endDate, targetAudience, isActive, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aviso no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Error al actualizar aviso' });
  }
});

// DELETE - Eliminar aviso (admin)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM global_announcements WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aviso no encontrado' });
    }
    
    res.json({ message: 'Aviso eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Error al eliminar aviso' });
  }
});

module.exports = router;
