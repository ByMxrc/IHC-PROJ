/**
 * Servidor Express - API REST para AgroFeria
 * Con Neon Database
 */

require("dotenv").config();

const express = require('express');
const cors = require('cors');
const { neon } = require("@neondatabase/serverless");

// Crear instancia de Neon
const sql = neon(process.env.DATABASE_URL);

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS dinámicamente
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://ihc-proj-weld.vercel.app',
  'https://agro-proj.vercel.app'
];

if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}

// Middlewares
app.use(cors({
  origin: allowedOrigins,
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

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API AgroFeria', status: 'OK', version: '1.0.0' });
});

// Ruta de prueba - Health Check
app.get('/api/health', async (req, res) => {
  try {
    const result = await sql`SELECT NOW() as timestamp, version()`;
    res.json({ 
      status: 'OK', 
      database: 'Neon Connected',
      timestamp: result[0].timestamp,
      version: result[0].version
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
app.use('/api/registrations', registrationRoutes);

// =====================================================
// TRANSLATIONS ROUTES
// =====================================================
const translationRoutes = require('./routes/translations');
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

// =====================================================
// PRODUCT ROUTES
// =====================================================
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// =====================================================
// ANNOUNCEMENTS ROUTES
// =====================================================
const announcementRoutes = require('./routes/announcements');
app.use('/api/announcements', announcementRoutes);

// =====================================================
// CONTENT REPORTS ROUTES
// =====================================================
const contentReportRoutes = require('./routes/contentReports');
app.use('/api/content-reports', contentReportRoutes);

// =====================================================
// TECHNICAL HELP ROUTES
// =====================================================
const technicalHelpRoutes = require('./routes/technicalHelp');
app.use('/api/technical-help', technicalHelpRoutes);

// =====================================================
// POST-SALE ROUTES
// =====================================================
const postSaleRoutes = require('./routes/postSale');
app.use('/api/post-sale', postSaleRoutes);

// =====================================================
// FAIR SURVEYS ROUTES
// =====================================================
const fairSurveyRoutes = require('./routes/fairSurveys');
app.use('/api/fair-surveys', fairSurveyRoutes);

// =====================================================
// INCIDENT REPORTS ROUTES
// =====================================================
const incidentRoutes = require('./routes/incidents');
app.use('/api/incidents', incidentRoutes);

// =====================================================
// FAIR COORDINATORS ROUTES
// =====================================================
const fairCoordinatorRoutes = require('./routes/fairCoordinators');
app.use('/api/fair-coordinators', fairCoordinatorRoutes);

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
  console.log(`📊 Base de datos: Neon DB (PostgreSQL Serverless)`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'production'}\n`);
});

// Exportar para Vercel Functions
module.exports = app;
