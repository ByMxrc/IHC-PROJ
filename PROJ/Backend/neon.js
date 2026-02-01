/**
 * Configuración de Neon Database
 */

require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

// Crear instancia de Neon
const sql = neon(process.env.DATABASE_URL);

module.exports = { sql };
