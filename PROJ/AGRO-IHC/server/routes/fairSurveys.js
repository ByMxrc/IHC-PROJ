/**
 * Rutas API para Encuestas de Satisfacción de Ferias
 * Permite obtener feedback detallado de los productores
 */

const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// POST - Crear encuesta
router.post('/', authenticateToken, requireRole('producer'), async (req, res) => {
  const { fairId, overallSatisfaction, whatWorked, whatToImprove, wouldReturn, allowContact } = req.body;
  
  try {
    // Verificar si ya existe una encuesta del usuario para esta feria
    const existing = await pool.query(
      'SELECT id FROM fair_surveys WHERE user_id = $1 AND fair_id = $2',
      [req.user.id, fairId]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Ya completaste la encuesta para esta feria' });
    }
    
    const result = await pool.query(`
      INSERT INTO fair_surveys 
      (user_id, fair_id, overall_satisfaction, what_worked, what_to_improve, would_return, allow_contact)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [req.user.id, fairId, overallSatisfaction, whatWorked, whatToImprove, wouldReturn, allowContact]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ error: 'Error al crear encuesta' });
  }
});

// GET - Obtener encuestas del usuario
router.get('/my-surveys', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT fs.*, f.name as fair_name, f.location, f.start_date
      FROM fair_surveys fs
      JOIN fairs f ON fs.fair_id = f.id
      WHERE fs.user_id = $1 
      ORDER BY fs.created_at DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ error: 'Error al obtener encuestas' });
  }
});

// GET - Obtener encuestas por feria (admin/coordinator)
router.get('/fair/:fairId', authenticateToken, async (req, res) => {
  if (!['admin', 'coordinator'].includes(req.user.role)) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  
  const { fairId } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT fs.*, u.username, u.email 
      FROM fair_surveys fs
      JOIN users u ON fs.user_id = u.id
      WHERE fs.fair_id = $1
      ORDER BY fs.created_at DESC
    `, [fairId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching fair surveys:', error);
    res.status(500).json({ error: 'Error al obtener encuestas' });
  }
});

// GET - Estadísticas de encuestas por feria
router.get('/fair/:fairId/stats', authenticateToken, async (req, res) => {
  if (!['admin', 'coordinator'].includes(req.user.role)) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  
  const { fairId } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_surveys,
        AVG(overall_satisfaction) as avg_satisfaction,
        AVG(would_return) as avg_would_return,
        COUNT(CASE WHEN allow_contact THEN 1 END) as allow_contact_count,
        COUNT(CASE WHEN overall_satisfaction >= 8 THEN 1 END) as promoters,
        COUNT(CASE WHEN overall_satisfaction <= 6 THEN 1 END) as detractors
      FROM fair_surveys
      WHERE fair_id = $1
    `, [fairId]);
    
    const stats = result.rows[0];
    
    // Calcular NPS (Net Promoter Score)
    const nps = ((stats.promoters - stats.detractors) / stats.total_surveys) * 100;
    stats.nps = Math.round(nps) || 0;
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// GET - Obtener feedback textual por feria
router.get('/fair/:fairId/feedback', authenticateToken, async (req, res) => {
  if (!['admin', 'coordinator'].includes(req.user.role)) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  
  const { fairId } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT 
        what_worked,
        what_to_improve,
        overall_satisfaction,
        created_at
      FROM fair_surveys
      WHERE fair_id = $1
      ORDER BY created_at DESC
    `, [fairId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Error al obtener feedback' });
  }
});

module.exports = router;
