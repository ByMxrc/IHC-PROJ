const { query } = require('./db');

async function checkSchema() {
  try {
    // Ver estructura de fair_coordinators
    console.log('\n=== Estructura de fair_coordinators ===');
    const cols = await query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'fair_coordinators' 
      ORDER BY ordinal_position
    `);
    cols.rows.forEach(row => console.log('- ' + row.column_name));

    // Ver datos en fair_coordinators
    console.log('\n=== Fair Coordinators ===');
    const fairCoords = await query(`
      SELECT * FROM fair_coordinators LIMIT 5
    `);
    console.log(JSON.stringify(fairCoords.rows, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkSchema();
