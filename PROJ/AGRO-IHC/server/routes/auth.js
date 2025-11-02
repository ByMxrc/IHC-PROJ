/**
 * Rutas de Autenticación
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db');

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Usuario y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const result = await query(
      'SELECT * FROM users WHERE username = $1 AND is_active = true',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario o contraseña incorrectos' 
      });
    }

    const user = result.rows[0];

    // Verificar si está bloqueado
    if (user.is_blocked && user.blocked_until) {
      const now = new Date();
      const blockedUntil = new Date(user.blocked_until);
      
      if (now < blockedUntil) {
        const minutesLeft = Math.ceil((blockedUntil - now) / 60000);
        return res.status(403).json({ 
          success: false,
          message: `Cuenta bloqueada. Intenta en ${minutesLeft} minutos` 
        });
      } else {
        // Desbloquear usuario
        await query(
          'UPDATE users SET is_blocked = false, blocked_until = NULL, failed_login_attempts = 0 WHERE user_id = $1',
          [user.user_id]
        );
      }
    }

    // Verificar contraseña (por ahora simple, luego se hashea)
    // En producción: const isValid = await bcrypt.compare(password, user.password_hash);
    const isValid = password === 'admin123'; // Temporal

    if (!isValid) {
      // Incrementar intentos fallidos
      const newAttempts = user.failed_login_attempts + 1;
      const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 3;

      if (newAttempts >= maxAttempts) {
        const lockoutMinutes = parseInt(process.env.LOCKOUT_DURATION_MINUTES) || 15;
        const blockedUntil = new Date(Date.now() + lockoutMinutes * 60000);
        
        await query(
          'UPDATE users SET is_blocked = true, blocked_until = $1, failed_login_attempts = $2 WHERE user_id = $3',
          [blockedUntil, newAttempts, user.user_id]
        );

        return res.status(403).json({ 
          success: false,
          message: `Cuenta bloqueada por ${lockoutMinutes} minutos debido a múltiples intentos fallidos` 
        });
      } else {
        await query(
          'UPDATE users SET failed_login_attempts = $1 WHERE user_id = $2',
          [newAttempts, user.user_id]
        );

        return res.status(401).json({ 
          success: false,
          message: 'Usuario o contraseña incorrectos' 
        });
      }
    }

    // Login exitoso - resetear intentos
    await query(
      'UPDATE users SET failed_login_attempts = 0, last_login = NOW() WHERE user_id = $1',
      [user.user_id]
    );

    // Generar JWT
    const expiresIn = rememberMe 
      ? process.env.JWT_REMEMBER_EXPIRES_IN || '30d'
      : process.env.JWT_EXPIRES_IN || '1d';

    const token = jwt.sign(
      { 
        userId: user.user_id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // Guardar token en BD
    const sessionExpiry = new Date(
      Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
    );
    
    await query(
      'UPDATE users SET session_token = $1, session_expiry = $2 WHERE user_id = $3',
      [token, sessionExpiry, user.user_id]
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
});

// LOGOUT
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId) {
      await query(
        'UPDATE users SET session_token = NULL, session_expiry = NULL WHERE user_id = $1',
        [userId]
      );
    }

    res.json({ success: true, message: 'Sesión cerrada' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
  }
});

// VERIFICAR SESIÓN
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ valid: false, message: 'Token no proporcionado' });
    }

    // Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar en BD
    const result = await query(
      'SELECT user_id, username, email, full_name, role, session_expiry FROM users WHERE user_id = $1 AND session_token = $2 AND is_active = true',
      [decoded.userId, token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ valid: false, message: 'Sesión inválida' });
    }

    const user = result.rows[0];

    // Verificar expiración
    if (user.session_expiry && new Date(user.session_expiry) < new Date()) {
      return res.status(401).json({ valid: false, message: 'Sesión expirada' });
    }

    res.json({
      valid: true,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error verificando sesión:', error);
    res.status(401).json({ valid: false, message: 'Token inválido' });
  }
});

module.exports = router;
