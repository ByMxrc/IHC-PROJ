/**
 * Rutas API para Asignación de Coordinadores
 * Permite a administradores asignar coordinadores a ferias
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// POST - Asignar coordinador a feria
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  const { fairId, coordinatorId, responsibilities } = req.body;
  
  try {
    // Verificar que el coordinador exista y tenga el rol correcto
    const coordinator = await query(
      'SELECT user_id FROM users WHERE user_id = $1 AND role = $2',
      [coordinatorId, 'coordinator']
    );
    
    if (coordinator.rows.length === 0) {
      return res.status(400).json({ error: 'Coordinador no válido' });
    }
    
    // Verificar que la feria exista
    const fair = await query('SELECT fair_id FROM fairs WHERE fair_id = $1', [fairId]);
    
    if (fair.rows.length === 0) {
      return res.status(404).json({ error: 'Feria no encontrada' });
    }
    
    // Verificar si ya existe una asignación
    const existing = await query(
      'SELECT id FROM fair_coordinators WHERE fair_id = $1 AND coordinator_id = $2',
      [fairId, coordinatorId]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Este coordinador ya está asignado a esta feria' });
    }
    
    // Crear asignación
    const result = await query(`
      INSERT INTO fair_coordinators 
      (fair_id, coordinator_id, responsibilities, assigned_by, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `, [fairId, coordinatorId, responsibilities, req.user.user_id || req.user.id]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error assigning coordinator:', error);
    res.status(500).json({ error: 'Error al asignar coordinador' });
  }
});

// GET - Obtener coordinadores disponibles (no asignados a una feria específica)
router.get('/available/:fairId', authenticateToken, requireRole('admin'), async (req, res) => {
  const { fairId } = req.params;
  
  try {
    const result = await query(`
      SELECT 
        u.user_id as id,
        u.username,
        u.email,
        u.full_name as name,
        u.phone,
        COUNT(fc.id)::int as assignedFairs
      FROM users u
      LEFT JOIN fair_coordinators fc ON u.user_id = fc.coordinator_id
      WHERE u.role = 'coordinator'
        AND u.user_id NOT IN (
          SELECT coordinator_id 
          FROM fair_coordinators 
          WHERE fair_id = $1
        )
      GROUP BY u.user_id, u.username, u.email, u.full_name, u.phone
      ORDER BY COUNT(fc.id) ASC, u.full_name ASC
    `, [fairId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching available coordinators:', error);
    res.status(500).json({ error: 'Error al obtener coordinadores disponibles' });
  }
});

// GET - Obtener coordinadores de una feria
router.get('/fair/:fairId', authenticateToken, async (req, res) => {
  const { fairId } = req.params;
  
  try {
    const result = await query(`
      SELECT 
        fc.*,
        u.username,
        u.email,
        u.full_name,
        u.phone,
        a.username as assigned_by_name
      FROM fair_coordinators fc
      JOIN users u ON fc.coordinator_id = u.user_id
      LEFT JOIN users a ON fc.assigned_by = a.user_id
      WHERE fc.fair_id = $1
      ORDER BY fc.created_at DESC
    `, [fairId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching coordinators:', error);
    res.status(500).json({ error: 'Error al obtener coordinadores' });
  }
});

// GET - Obtener ferias asignadas a un coordinador
router.get('/coordinator/:coordinatorId', authenticateToken, async (req, res) => {
  const { coordinatorId } = req.params;
  
  // Solo admin o el mismo coordinador pueden ver sus asignaciones
  const userId = req.user.user_id || req.user.id;
  if (req.user.role !== 'admin' && userId !== parseInt(coordinatorId)) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  
  try {
    const result = await query(`
      SELECT 
        fc.*,
        f.name as fair_name,
        f.location,
        f.start_date,
        f.end_date,
        f.status
      FROM fair_coordinators fc
      JOIN fairs f ON fc.fair_id = f.fair_id
      WHERE fc.coordinator_id = $1
      ORDER BY f.start_date DESC
    `, [coordinatorId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Error al obtener asignaciones' });
  }
});

// GET - Mis ferias asignadas (para coordinador logueado)
router.get('/my-fairs', authenticateToken, requireRole('coordinator'), async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
    const result = await query(`
      SELECT 
        fc.*,
        f.name as fair_name,
        f.location,
        f.start_date,
        f.end_date,
        f.status,
        f.description
      FROM fair_coordinators fc
      JOIN fairs f ON fc.fair_id = f.fair_id
      WHERE fc.coordinator_id = $1
      ORDER BY f.start_date DESC
    `, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching my fairs:', error);
    res.status(500).json({ error: 'Error al obtener ferias' });
  }
});

// PUT - Actualizar responsabilidades
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { responsibilities } = req.body;
  
  try {
    const result = await query(`
      UPDATE fair_coordinators 
      SET responsibilities = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [responsibilities, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ error: 'Error al actualizar asignación' });
  }
});

// DELETE - Remover coordinador de feria
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await query('DELETE FROM fair_coordinators WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }
    
    res.json({ message: 'Coordinador removido exitosamente' });
  } catch (error) {
    console.error('Error removing coordinator:', error);
    res.status(500).json({ error: 'Error al remover coordinador' });
  }
});

module.exports = router;
