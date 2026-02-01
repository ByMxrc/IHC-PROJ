/**
 * Rutas API para Post-venta de Ferias
 * Registro de ventas y feedback después de una feria
 */

const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// POST - Crear reporte post-venta
router.post('/', authenticateToken, requireRole('producer'), async (req, res) => {
  const { fairId, productsSold, incidents, satisfaction, futureNeeds, wouldParticipateAgain } = req.body;
  
  try {
    const result = await pool.query(`
      INSERT INTO post_sale_reports 
      (user_id, fair_id, products_sold, incidents, satisfaction, future_needs, would_participate_again)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [req.user.id, fairId, JSON.stringify(productsSold), incidents, satisfaction, futureNeeds, wouldParticipateAgain]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating post-sale report:', error);
    res.status(500).json({ error: 'Error al crear reporte de post-venta' });
  }
});

// GET - Obtener reportes del usuario
router.get('/my-reports', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT psr.*, f.name as fair_name, f.location, f.start_date
      FROM post_sale_reports psr
      JOIN fairs f ON psr.fair_id = f.id
      WHERE psr.user_id = $1 
      ORDER BY psr.created_at DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

// GET - Obtener reportes por feria (admin/coordinator)
router.get('/fair/:fairId', authenticateToken, async (req, res) => {
  if (!['admin', 'coordinator'].includes(req.user.role)) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  
  const { fairId } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT psr.*, u.username, u.email 
      FROM post_sale_reports psr
      JOIN users u ON psr.user_id = u.id
      WHERE psr.fair_id = $1
      ORDER BY psr.created_at DESC
    `, [fairId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching fair reports:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

// GET - Estadísticas de post-venta por feria
router.get('/fair/:fairId/stats', authenticateToken, async (req, res) => {
  if (!['admin', 'coordinator'].includes(req.user.role)) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  
  const { fairId } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_reports,
        AVG(satisfaction) as avg_satisfaction,
        COUNT(CASE WHEN would_participate_again THEN 1 END) as would_return_count,
        COUNT(*) FILTER (WHERE incidents IS NOT NULL AND incidents != '') as incidents_count
      FROM post_sale_reports
      WHERE fair_id = $1
    `, [fairId]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

module.exports = router;
