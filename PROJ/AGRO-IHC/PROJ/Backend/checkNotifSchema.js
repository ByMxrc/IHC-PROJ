const { query } = require('./db');

async function checkNotificationsSchema() {
  try {
    console.log('\n=== Estructura de notifications ===');
    const cols = await query(`
      SELECT column_name, data_type FROM information_schema.columns 
      WHERE table_name = 'notifications' 
      ORDER BY ordinal_position
    `);
    cols.rows.forEach(row => console.log(`- ${row.column_name}: ${row.data_type}`));

  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkNotificationsSchema();
