/**
 * Función Serverless para Vercel
 * Exporta las rutas de la API de Express como una función de Vercel
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('../server/db');

// Cargar variables de entorno
dotenv.config({ path: '../.env' });

// Crear aplicación Express
const app = express();

// Configurar CORS dinámicamente
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3001',
  'https://ihc-proj-weld.vercel.app'
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

// Importar todas las rutas
const authRoutes = require('../server/routes/auth');
const usersRoutes = require('../server/routes/users');
const producersRoutes = require('../server/routes/producers');
const productsRoutes = require('../server/routes/products');
const fairsRoutes = require('../server/routes/fairs');
const fairCoordinatorsRoutes = require('../server/routes/fairCoordinators');
const fairSurveysRoutes = require('../server/routes/fairSurveys');
const registrationsRoutes = require('../server/routes/registrations');
const announcementsRoutes = require('../server/routes/announcements');
const notificationsRoutes = require('../server/routes/notifications');
const salesRoutes = require('../server/routes/sales');
const postSaleRoutes = require('../server/routes/postSale');
const incidentsRoutes = require('../server/routes/incidents');
const contentReportsRoutes = require('../server/routes/contentReports');
const technicalHelpRoutes = require('../server/routes/technicalHelp');
const translationsRoutes = require('../server/routes/translations');
const transportRoutes = require('../server/routes/transport');

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/producers', producersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/fairs', fairsRoutes);
app.use('/api/fair-coordinators', fairCoordinatorsRoutes);
app.use('/api/fair-surveys', fairSurveysRoutes);
app.use('/api/registrations', registrationsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/post-sale', postSaleRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/content-reports', contentReportsRoutes);
app.use('/api/technical-help', technicalHelpRoutes);
app.use('/api/translations', translationsRoutes);
app.use('/api/transport', transportRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Exportar como función serverless de Vercel
module.exports = app;
