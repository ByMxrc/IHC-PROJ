/**
 * Rutas API para Reportes de Contenido
 * Permite a usuarios reportar errores o contenido incorrecto
 */

const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuración de multer para subir imágenes
// Usar memoryStorage para compatibilidad con Vercel (read-only file system)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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

// POST - Crear reporte
router.post('/', authenticateToken, upload.single('screenshot'), async (req, res) => {
  const { page, section, textToCorrect, reason, description } = req.body;
  const screenshot = req.file ? req.file.filename : null;
  
  try {
    const result = await pool.query(`
      INSERT INTO content_reports 
      (user_id, page, section, text_to_correct, reason, description, screenshot, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING *
    `, [req.user.id, page, section, textToCorrect, reason, description, screenshot]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Error al crear reporte' });
  }
});

// GET - Obtener reportes del usuario
router.get('/my-reports', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM content_reports 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

// GET - Obtener todos los reportes (admin)
router.get('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No autorizado' });
  }
  
  try {
    const result = await pool.query(`
      SELECT cr.*, u.username, u.email 
      FROM content_reports cr
      JOIN users u ON cr.user_id = u.id
      ORDER BY cr.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all reports:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

// PUT - Actualizar estado de reporte (admin)
router.put('/:id/status', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No autorizado' });
  }
  
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  
  try {
    const result = await pool.query(`
      UPDATE content_reports 
      SET status = $1, admin_notes = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [status, adminNotes, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Error al actualizar reporte' });
  }
});

module.exports = router;
