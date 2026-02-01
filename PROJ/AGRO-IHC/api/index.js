/**
 * Función Serverless Catchall para Vercel
 * Maneja todas las rutas de /api
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

// Importar el servidor configurado
const { pool } = require('../server/db');

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

// Ruta de prueba
app.get('/health', async (req, res) => {
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

// Registrar rutas (sin el prefijo /api porque Vercel ya lo agrega)
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/producers', producersRoutes);
app.use('/products', productsRoutes);
app.use('/fairs', fairsRoutes);
app.use('/fair-coordinators', fairCoordinatorsRoutes);
app.use('/fair-surveys', fairSurveysRoutes);
app.use('/registrations', registrationsRoutes);
app.use('/announcements', announcementsRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/sales', salesRoutes);
app.use('/post-sale', postSaleRoutes);
app.use('/incidents', incidentsRoutes);
app.use('/content-reports', contentReportsRoutes);
app.use('/technical-help', technicalHelpRoutes);
app.use('/translations', translationsRoutes);
app.use('/transport', transportRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Exportar como handler de Vercel
module.exports = app;
