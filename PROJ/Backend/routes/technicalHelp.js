/**
 * Rutas API para Solicitudes de Ayuda Técnica
 * Permite a productores solicitar soporte
 */

const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
  destination: './uploads/help-requests/',
  filename: (req, file, cb) => {
    cb(null, `help-${Date.now()}-${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB total
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});

// POST - Crear solicitud de ayuda
router.post('/', authenticateToken, requireRole('producer'), upload.array('photos', 5), async (req, res) => {
  const { helpType, crop, problem, urgency, contactPreference, additionalInfo } = req.body;
  const photos = req.files ? req.files.map(f => f.filename) : [];
  
  try {
    const result = await pool.query(`
      INSERT INTO technical_help_requests 
      (user_id, help_type, crop, problem, urgency, contact_preference, additional_info, photos, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
      RETURNING *
    `, [req.user.id, helpType, crop, problem, urgency, contactPreference, additionalInfo, photos]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating help request:', error);
    res.status(500).json({ error: 'Error al crear solicitud de ayuda' });
  }
});

// GET - Obtener solicitudes del usuario
router.get('/my-requests', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM technical_help_requests 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

// GET - Obtener todas las solicitudes (admin/coordinator)
router.get('/', authenticateToken, async (req, res) => {
  if (!['admin', 'coordinator'].includes(req.user.role)) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  
  try {
    const result = await pool.query(`
      SELECT thr.*, u.username, u.email, u.phone 
      FROM technical_help_requests thr
      JOIN users u ON thr.user_id = u.id
      ORDER BY 
        CASE thr.urgency 
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        thr.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all requests:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

// PUT - Actualizar estado de solicitud
router.put('/:id/status', authenticateToken, async (req, res) => {
  if (!['admin', 'coordinator'].includes(req.user.role)) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  
  const { id } = req.params;
  const { status, response } = req.body;
  
  try {
    const result = await pool.query(`
      UPDATE technical_help_requests 
      SET status = $1, response = $2, responded_by = $3, responded_at = NOW(), updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [status, response, req.user.id, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Error al actualizar solicitud' });
  }
});

module.exports = router;
