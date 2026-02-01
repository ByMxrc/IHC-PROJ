require('dotenv').config();
const { query } = require('./db');

async function testMultipleAssignments() {
  try {
    console.log('=== Testing Multiple Coordinator Assignments ===\n');
    
    // Test 1: Assign coordinator 2 to fairs 1 and 2
    console.log('Test 1: Assigning coordinator 2 (abive) to fairs 1 and 2');
    try {
      const result1 = await query(
        'INSERT INTO fair_coordinators (coordinator_id, fair_id) VALUES ($1, $2) RETURNING *',
        [2, 1]
      );
      console.log('✅ Assigned to Fair 1:', result1.rows[0]);
      
      const result2 = await query(
        'INSERT INTO fair_coordinators (coordinator_id, fair_id) VALUES ($1, $2) RETURNING *',
        [2, 2]
      );
      console.log('✅ Assigned to Fair 2:', result2.rows[0]);
    } catch (e) {
      console.log('⚠️ Error:', e.message);
    }
    
    // Test 2: Assign coordinator 4 to fair 3
    console.log('\nTest 2: Assigning coordinator 4 (cmorales) to fair 3');
    try {
      const result3 = await query(
        'INSERT INTO fair_coordinators (coordinator_id, fair_id) VALUES ($1, $2) RETURNING *',
        [4, 3]
      );
      console.log('✅ Assigned:', result3.rows[0]);
    } catch (e) {
      console.log('⚠️ Error:', e.message);
    }
    
    // Show all assignments
    console.log('\n=== All Assignments ===');
    const all = await query(`
      SELECT 
        fc.coordinator_id,
        u.username,
        fc.fair_id,
        f.name,
        fc.assigned_date
      FROM fair_coordinators fc
      JOIN users u ON fc.coordinator_id = u.user_id
      JOIN fairs f ON fc.fair_id = f.fair_id
      ORDER BY u.username, f.fair_id
    `);
    
    all.rows.forEach(row => {
      console.log(`  ${row.username} (${row.coordinator_id}) -> ${row.name} (Fair ${row.fair_id})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testMultipleAssignments();
