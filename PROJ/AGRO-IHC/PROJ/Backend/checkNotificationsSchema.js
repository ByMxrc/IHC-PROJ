require('dotenv').config();
const { query } = require('./db');

async function checkNotificationsSchema() {
  try {
    console.log('=== Checking notifications schema ===\n');
    
    const result = await query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'notifications'
      ORDER BY ordinal_position
    `);
    
    console.log('Columns:');
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });
    
    // Show sample data
    console.log('\n=== Sample data ===');
    const data = await query('SELECT * FROM notifications LIMIT 3');
    console.log(`Total records: ${data.rowCount}`);
    if (data.rows.length > 0) {
      console.log('Sample:', JSON.stringify(data.rows[0], null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkNotificationsSchema();
