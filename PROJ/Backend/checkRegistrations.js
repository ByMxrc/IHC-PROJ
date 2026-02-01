const { query } = require('./db');

async function checkStructure() {
  try {
    const result = await query("SELECT * FROM registrations LIMIT 1");
    console.log('Columnas disponibles:');
    console.log(Object.keys(result.rows[0]));
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkStructure();
