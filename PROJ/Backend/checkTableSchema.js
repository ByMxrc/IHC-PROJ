require('dotenv').config();
const { query } = require('./db');

async function checkSchema() {
  try {
    console.log('=== Checking fair_coordinators schema ===\n');
    
    // Get table structure
    const result = await query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'fair_coordinators'
      ORDER BY ordinal_position
    `);
    
    console.log('Columns:');
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''} ${col.column_default || ''}`);
    });
    
    // Get constraints
    console.log('\n=== Constraints ===\n');
    const constraints = await query(`
      SELECT 
        constraint_name,
        constraint_type,
        column_name
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'fair_coordinators'
    `);
    
    constraints.rows.forEach(c => {
      console.log(`  ${c.constraint_name} (${c.constraint_type}) on ${c.column_name || 'N/A'}`);
    });
    
    // Get actual data
    console.log('\n=== Current Data ===\n');
    const data = await query('SELECT * FROM fair_coordinators');
    console.log(`Total records: ${data.rows.length}`);
    data.rows.forEach(row => {
      console.log(`  Coordinator ${row.coordinator_id} -> Fair ${row.fair_id} (${row.assigned_date})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
