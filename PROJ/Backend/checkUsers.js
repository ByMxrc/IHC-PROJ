const { query } = require('./db');

async function checkUsers() {
  try {
    console.log('\n=== Usuarios en la BD ===');
    const users = await query(`
      SELECT user_id, username, full_name, role, status FROM users ORDER BY user_id
    `);
    console.log(JSON.stringify(users.rows, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkUsers();
