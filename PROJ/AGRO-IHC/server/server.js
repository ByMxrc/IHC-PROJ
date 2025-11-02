/**
 * Servidor Express - API REST para AgroFeria
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./db');

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// =====================================================
// RUTAS DE LA API
// =====================================================

// Ruta de prueba
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'Disconnected',
      error: error.message 
    });
  }
});

// =====================================================
// AUTH ROUTES
// =====================================================
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// =====================================================
// USER ROUTES
// =====================================================
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// =====================================================
// PRODUCER ROUTES
// =====================================================
const producerRoutes = require('./routes/producers');
app.use('/api/producers', producerRoutes);

// =====================================================
// FAIR ROUTES
// =====================================================
const fairRoutes = require('./routes/fairs');
app.use('/api/fairs', fairRoutes);

// =====================================================
// REGISTRATION ROUTES
// =====================================================
const registrationRoutes = require('./routes/registrations');

// =====================================================
// TRANSLATIONS ROUTES
// =====================================================
const translationRoutes = require('./routes/translations');
app.use('/api/registrations', registrationRoutes);
app.use('/api/translations', translationRoutes);

// =====================================================
// NOTIFICATION ROUTES
// =====================================================
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

// =====================================================
// SALES ROUTES
// =====================================================
const salesRoutes = require('./routes/sales');
app.use('/api/sales', salesRoutes);

// =====================================================
// TRANSPORT ROUTES
// =====================================================
const transportRoutes = require('./routes/transport');
app.use('/api/transport', transportRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV}\n`);
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await pool.end();
  process.exit(0);
});
