/**
 * Rutas de Usuarios
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT user_id, username, email, full_name, phone, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, data: result.rows });
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
      'SELECT user_id, username, email, full_name, phone, role, is_active, created_at FROM users WHERE user_id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
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

    // Hash de password (temporal - implementar bcrypt)
    const passwordHash = password; // TODO: bcrypt.hash(password, 10)

    const result = await query(
      `INSERT INTO users (username, email, password_hash, full_name, phone, role, terms_accepted, terms_accepted_date)
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
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
