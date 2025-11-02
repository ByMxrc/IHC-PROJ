/**
 * Rutas de Notificaciones
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

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
      INSERT INTO notifications (user_id, title, message, type, category, action_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [userId, title, message, type, category, actionUrl]);

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
