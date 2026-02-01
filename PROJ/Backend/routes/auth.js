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

    console.log('🔍 Login attempt:', { username, passwordLength: password?.length, rememberMe });

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Usuario y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    console.log('👤 Usuario encontrado:', result.rows.length > 0 ? 'SÍ' : 'NO');
    if (result.rows.length > 0) {
      console.log('   - Username:', result.rows[0].username);
      console.log('   - Password hash exists:', !!result.rows[0].password_hash);
      console.log('   - Password hash length:', result.rows[0].password_hash?.length);
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario o contraseña incorrectos' 
      });
    }

    const user = result.rows[0];

    // Verificar si está bloqueado temporalmente (usando last_login_attempt)
    if (user.last_login_attempt && user.failed_login_attempts >= 5) {
      const now = new Date();
      const lastAttempt = new Date(user.last_login_attempt);
      const lockoutMinutes = 15; // 15 minutos de bloqueo
      const blockedUntil = new Date(lastAttempt.getTime() + lockoutMinutes * 60000);
      
      if (now < blockedUntil) {
        const minutesLeft = Math.ceil((blockedUntil - now) / 60000);
        console.log('🚫 Usuario bloqueado temporalmente');
        return res.status(403).json({ 
          success: false,
          message: `Cuenta bloqueada temporalmente. Intenta nuevamente en ${minutesLeft} minuto${minutesLeft !== 1 ? 's' : ''}` 
        });
      } else {
        // Tiempo de bloqueo expirado - resetear intentos
        await query(
          'UPDATE users SET failed_login_attempts = 0 WHERE user_id = $1',
          [user.user_id]
        );
        user.failed_login_attempts = 0;
      }
    }

    // Verificar contraseña en texto plano (sin bcrypt)
    const isValid = password === user.password_hash;
    
    console.log('🔐 Verificación de contraseña:', isValid ? '✓ CORRECTA' : '✗ INCORRECTA');
    console.log('   - Password ingresado:', password);
    console.log('   - Password en BD:', user.password_hash);

    if (!isValid) {
      // Incrementar intentos fallidos
      const newAttempts = (user.failed_login_attempts || 0) + 1;
      const maxAttempts = 5; // 5 intentos antes de bloquear

      await query(
        'UPDATE users SET failed_login_attempts = $1, last_login_attempt = NOW() WHERE user_id = $2',
        [newAttempts, user.user_id]
      );

      if (newAttempts >= maxAttempts) {
        console.log(`⚠️ Usuario bloqueado después de ${newAttempts} intentos fallidos`);
        return res.status(403).json({ 
          success: false,
          message: `Cuenta bloqueada temporalmente por 15 minutos debido a múltiples intentos fallidos (${newAttempts}/${maxAttempts})` 
        });
      } else {
        const remainingAttempts = maxAttempts - newAttempts;
        console.log(`⚠️ Intento fallido ${newAttempts}/${maxAttempts}`);
        return res.status(401).json({ 
          success: false,
          message: `Usuario o contraseña incorrectos. Te quedan ${remainingAttempts} intento${remainingAttempts !== 1 ? 's' : ''}` 
        });
      }
    }

    // Login exitoso - resetear intentos fallidos
    await query(
      'UPDATE users SET failed_login_attempts = 0, last_login_attempt = NOW() WHERE user_id = $1',
      [user.user_id]
    );
    console.log('✅ Login exitoso - intentos reseteados');

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

    // Guardar token en BD (comentado - columnas no existen)
    // const sessionExpiry = new Date(
    //   Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
    // );
    // await query(
    //   'UPDATE users SET session_token = $1, session_expiry = $2 WHERE user_id = $3',
    //   [token, sessionExpiry, user.user_id]
    // );

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
      'SELECT user_id, username, email, full_name, role, session_expiry FROM users WHERE user_id = $1 AND session_token = $2',
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