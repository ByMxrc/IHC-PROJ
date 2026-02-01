require('dotenv').config();
const { query } = require('./db');

async function seedData() {
  try {
    console.log('=== Seeding fair_coordinators ===\n');
    
    // Insert coordinator assignments
    const assignments = [
      { coordinatorId: 2, fairId: 1 },
      { coordinatorId: 2, fairId: 2 },
      { coordinatorId: 4, fairId: 3 },
    ];
    
    for (const { coordinatorId, fairId } of assignments) {
      try {
        await query(
          'INSERT INTO fair_coordinators (coordinator_id, fair_id) VALUES ($1, $2)',
          [coordinatorId, fairId]
        );
        console.log(`✅ Assigned coordinator ${coordinatorId} to fair ${fairId}`);
      } catch (e) {
        console.log(`⚠️ Coordinator ${coordinatorId} already assigned to fair ${fairId}`);
      }
    }
    
    // Show final data
    console.log('\n=== Final Assignments ===');
    const result = await query(`
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
    
    result.rows.forEach(row => {
      console.log(`  ${row.username} (id:${row.coordinator_id}) -> ${row.name}`);
    });
    
    console.log(`\n✅ Seeding complete! ${result.rows.length} total assignments`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedData();
