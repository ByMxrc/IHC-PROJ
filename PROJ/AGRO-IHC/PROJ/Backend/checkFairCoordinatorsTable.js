const { query } = require('./db');

async function checkFairCoordinatorsTable() {
  try {
    console.log('\n=== Estructura de fair_coordinators ===');
    const cols = await query(`
      SELECT column_name, data_type FROM information_schema.columns 
      WHERE table_name = 'fair_coordinators' 
      ORDER BY ordinal_position
    `);
    cols.rows.forEach(row => console.log(`- ${row.column_name}: ${row.data_type}`));

  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkFairCoordinatorsTable();
