/**
 * Configuración de la Base de Datos PostgreSQL
 */

const { Pool } = require('pg');
require('dotenv').config();

// Configuración de conexión - soporta Neon DB y PostgreSQL local
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false, 
        },
        max: 5,
        min: 1,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 30000,
        query_timeout: 30000,
        allowExitOnIdle: true,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5433,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'agroferia_db',
        ssl: false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      }
);

// Verificar conexión
pool.on('connect', () => {
  const dbType = process.env.DATABASE_URL ? 'Neon DB' : 'PostgreSQL Local';
  console.log(`✅ Conectado a ${dbType}`);
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en PostgreSQL:', err);
  process.exit(-1);
});

// Función helper para queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query ejecutada:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error en query:', error);
    throw error;
  }
};

// Función helper para transacciones
const getClient = () => pool.connect();

module.exports = {
  query,
  getClient,
  pool,
};
