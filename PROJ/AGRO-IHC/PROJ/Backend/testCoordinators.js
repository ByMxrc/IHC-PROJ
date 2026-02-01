require('dotenv').config();
const { query } = require('./db');

async function testCoordinatorsEndpoint() {
  try {
    console.log('=== Testing Coordinators Endpoint ===\n');
    
    // Get coordinators
    const result = await query(
      "SELECT user_id as id, username, email, full_name as name, phone, role FROM users WHERE role = 'coordinator'"
    );
    
    console.log(`Found ${result.rows.length} coordinators:`);
    result.rows.forEach(c => {
      console.log(`  - ID: ${c.id}, Name: ${c.name}, Username: ${c.username}`);
    });
    
    // Test assignment with first coordinator
    if (result.rows.length > 0) {
      const coordinator = result.rows[0];
      console.log(`\n=== Testing Assignment ===`);
      console.log(`Using Coordinator: ID=${coordinator.id}, Name=${coordinator.name}`);
      
      // Test POST data structure
      const postData = {
        fairId: 1,
        coordinatorId: coordinator.id,
        responsibilities: ['approveRegistrations']
      };
      console.log('POST data:', JSON.stringify(postData, null, 2));
      
      // Check if coordinator exists with this ID
      const check = await query(
        'SELECT user_id FROM users WHERE user_id = $1 AND role = $2',
        [coordinator.id, 'coordinator']
      );
      console.log(`Verification: Coordinator ${coordinator.id} with role 'coordinator' ${check.rows.length > 0 ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testCoordinatorsEndpoint();
