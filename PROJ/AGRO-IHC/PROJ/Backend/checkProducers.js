const { query } = require('./db');

async function checkProducers() {
  try {
    const result = await query(`
      SELECT p.producer_id, p.user_id, p.first_name, p.last_name, u.full_name
      FROM producers p
      LEFT JOIN users u ON p.user_id = u.user_id
    `);
    console.log('Productores:');
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkProducers();
