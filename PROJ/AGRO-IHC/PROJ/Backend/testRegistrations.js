const { query } = require('./db');

async function testQuery() {
  try {
    const result = await query(`
      SELECT r.registration_id as id,
             r.fair_id as "fairId",
             r.producer_id as "producerId",
             COALESCE(u.full_name, p.first_name || ' ' || p.last_name) as "producerName",
             f.name as "fairName",
             f.start_date as "fairStartDate",
             r.registration_date as "registrationDate",
             r.status,
             r.assigned_spot as "assignedSpot",
             r.notes
      FROM registrations r
      LEFT JOIN producers p ON r.producer_id = p.producer_id
      LEFT JOIN users u ON p.user_id = u.user_id
      LEFT JOIN fairs f ON r.fair_id = f.fair_id
      ORDER BY r.registration_date DESC
      LIMIT 3
    `);
    console.log('Resultado del query:');
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

testQuery();
