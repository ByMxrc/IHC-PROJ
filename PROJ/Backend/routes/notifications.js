/**
 * Rutas de Notificaciones
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET - Obtener todas las notificaciones
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM notifications
      ORDER BY created_at DESC
      LIMIT 100
    `, []);
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener notificaciones' });
  }
});

// GET - Obtener notificaciones de un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await query(`
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [userId]);
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener notificaciones' });
  }
});

// POST - Crear notificación
router.post('/', async (req, res) => {
  try {
    const { userId, title, message, type, category, actionUrl } = req.body;

    const result = await query(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [userId, title, message, type]);

    res.status(201).json({ 
      success: true, 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creando notificación:', error);
    res.status(500).json({ success: false, message: 'Error al crear notificación' });
  }
});

// PUT - Marcar como leída
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      UPDATE notifications
      SET is_read = true, read_at = NOW()
      WHERE notification_id = $1
      RETURNING *
    `, [id]);

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error marcando notificación:', error);
    res.status(500).json({ success: false, message: 'Error al marcar notificación' });
  }
});

// PATCH - Marcar como leída (alias para PUT)
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      UPDATE notifications
      SET is_read = true, read_at = NOW()
      WHERE notification_id = $1
      RETURNING *
    `, [id]);

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error marcando notificación:', error);
    res.status(500).json({ success: false, message: 'Error al marcar notificación' });
  }
});

// PATCH - Marcar todas como leídas
router.patch('/read-all', async (req, res) => {
  try {
    const result = await query(`
      UPDATE notifications
      SET is_read = true, read_at = NOW()
      WHERE is_read = false
      RETURNING *
    `);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error marcando notificaciones:', error);
    res.status(500).json({ success: false, message: 'Error al marcar notificaciones' });
  }
});

// DELETE - Eliminar notificación
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM notifications WHERE notification_id = $1', [id]);
    res.json({ success: true, message: 'Notificación eliminada' });
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar notificación' });
  }
});

module.exports = router;
