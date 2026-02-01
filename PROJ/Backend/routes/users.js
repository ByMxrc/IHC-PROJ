/**
 * Rutas de Usuarios
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET - Obtener todos los usuarios (con filtro opcional por rol)
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    
    let sql = 'SELECT user_id as id, username, email, full_name as name, phone, role, status, created_at FROM users';
    let params = [];
    
    // Filtrar por rol si se proporciona
    if (role) {
      sql += ' WHERE role = $1';
      params.push(role);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    
    // Contar coordinadores asignados a ferias si es el caso
    if (role === 'coordinator') {
      const fairCoordinatorsResult = await query(
        'SELECT coordinator_id, COUNT(*) as assigned_fairs FROM fair_coordinators GROUP BY coordinator_id'
      );
      const fairMap = {};
      fairCoordinatorsResult.rows.forEach(row => {
        fairMap[row.coordinator_id] = row.assigned_fairs;
      });
      
      result.rows = result.rows.map(user => ({
        ...user,
        assignedFairs: fairMap[user.id] || 0
      }));
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
  }
});

// GET - Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT user_id as id, username, email, full_name as name, phone, role, status, created_at FROM users WHERE user_id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ success: false, message: 'Error al obtener usuario' });
  }
});

// POST - Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { username, email, password, fullName, phone, role } = req.body;

    // Validaciones básicas
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email y password son requeridos' 
      });
    }

    // Verificar si existe el usuario
    const exists = await query(
      'SELECT user_id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'El usuario o email ya existe' 
      });
    }

    // Guardar password en texto plano (sin hash)
    const passwordHash = password;

    const result = await query(
      `INSERT INTO users (username, email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING user_id, username, email, full_name, role`,
      [username, email, passwordHash, fullName, phone, role || 'user']
    );

    res.status(201).json({ 
      success: true, 
      message: 'Usuario creado exitosamente',
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ success: false, message: 'Error al crear usuario' });
  }
});

// PUT - Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, fullName, phone } = req.body;

    const result = await query(
      `UPDATE users 
       SET email = COALESCE($1, email),
           full_name = COALESCE($2, full_name),
           phone = COALESCE($3, phone),
           updated_at = NOW()
       WHERE user_id = $4
       RETURNING user_id, username, email, full_name, phone, role`,
      [email, fullName, phone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ 
      success: true, 
      message: 'Usuario actualizado',
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
});

// DELETE - Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM users WHERE user_id = $1 RETURNING user_id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
  }
});

module.exports = router;
