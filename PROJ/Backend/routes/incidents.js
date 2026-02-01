/**
 * Rutas API para Reportes de Incidencias en Ferias
 * Permite a coordinadores registrar incidentes durante las ferias
 */

const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
  destination: './uploads/incidents/',
  filename: (req, file, cb) => {
    cb(null, `incident-${Date.now()}${path.extname(file.originalname)}`);
  }
});

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

// POST - Crear reporte de incidente
router.post('/', authenticateToken, requireRole('coordinator'), upload.single('photo'), async (req, res) => {
  const { fairId, incidentType, description, location, priority } = req.body;
  const photo = req.file ? req.file.filename : null;
  
  try {
    const result = await pool.query(`
      INSERT INTO incident_reports 
      (fair_id, reported_by, incident_type, description, location, priority, photo, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'open')
      RETURNING *
    `, [fairId, req.user.id, incidentType, description, location, priority, photo]);
    
    // Si es crítico, enviar notificación al admin
    if (priority === 'critical') {
      await pool.query(`
        INSERT INTO notifications (user_id, type, title, message, link)
        SELECT id, 'incident', 'Incidente Crítico', $1, '/incidents/' || $2
        FROM users WHERE role = 'admin'
      `, [`Incidente crítico reportado en feria ID ${fairId}`, result.rows[0].id]);
    }
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating incident report:', error);
    res.status(500).json({ error: 'Error al crear reporte de incidente' });
  }
});

// GET - Obtener incidentes de una feria
router.get('/fair/:fairId', authenticateToken, async (req, res) => {
  const { fairId } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT ir.*, u.username as reporter_name, u.email as reporter_email
      FROM incident_reports ir
      JOIN users u ON ir.reported_by = u.id
      WHERE ir.fair_id = $1
      ORDER BY 
        CASE ir.priority 
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        ir.created_at DESC
    `, [fairId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Error al obtener incidentes' });
  }
});

// GET - Obtener incidentes por coordinador
router.get('/my-reports', authenticateToken, requireRole('coordinator'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ir.*, f.name as fair_name, f.location
      FROM incident_reports ir
      JOIN fairs f ON ir.fair_id = f.id
      WHERE ir.reported_by = $1
      ORDER BY ir.created_at DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching my reports:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

// GET - Obtener todos los incidentes (admin)
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ir.*, f.name as fair_name, f.location, u.username as reporter_name
      FROM incident_reports ir
      JOIN fairs f ON ir.fair_id = f.id
      JOIN users u ON ir.reported_by = u.id
      ORDER BY 
        CASE ir.status
          WHEN 'open' THEN 1
          WHEN 'in_progress' THEN 2
          WHEN 'resolved' THEN 3
        END,
        CASE ir.priority 
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        ir.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all incidents:', error);
    res.status(500).json({ error: 'Error al obtener incidentes' });
  }
});

// PUT - Actualizar estado de incidente
router.put('/:id/status', authenticateToken, async (req, res) => {
  if (!['admin', 'coordinator'].includes(req.user.role)) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  
  const { id } = req.params;
  const { status, resolution } = req.body;
  
  try {
    const result = await pool.query(`
      UPDATE incident_reports 
      SET status = $1, resolution = $2, resolved_by = $3, resolved_at = NOW(), updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [status, resolution, req.user.id, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ error: 'Error al actualizar incidente' });
  }
});

// GET - Estadísticas de incidentes por feria
router.get('/fair/:fairId/stats', authenticateToken, async (req, res) => {
  const { fairId } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
        COUNT(CASE WHEN priority = 'critical' THEN 1 END) as critical,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high,
        COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium,
        COUNT(CASE WHEN priority = 'low' THEN 1 END) as low
      FROM incident_reports
      WHERE fair_id = $1
    `, [fairId]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

module.exports = router;
