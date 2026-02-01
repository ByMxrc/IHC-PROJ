require('dotenv').config();
const { query } = require('./db');

async function fixTableSchema() {
  try {
    console.log('=== Fixing fair_coordinators schema ===\n');
    
    // Drop existing table
    console.log('Dropping existing fair_coordinators table...');
    await query('DROP TABLE IF EXISTS fair_coordinators CASCADE');
    console.log('✅ Table dropped\n');
    
    // Create new table with correct primary key
    console.log('Creating new fair_coordinators table...');
    await query(`
      CREATE TABLE fair_coordinators (
        coordinator_id INTEGER NOT NULL,
        fair_id INTEGER NOT NULL,
        assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (coordinator_id, fair_id),
        FOREIGN KEY (coordinator_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (fair_id) REFERENCES fairs(fair_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table created with composite primary key\n');
    
    // Verify schema
    console.log('=== Verifying new schema ===\n');
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
    
    console.log('\n✅ Schema fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixTableSchema();
