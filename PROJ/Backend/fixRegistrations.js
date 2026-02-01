const { query } = require('./db');

async function fixRegistrations() {
  try {
    // Cambiar producerId 5 -> 1, producerId 6 -> 2
    await query(`UPDATE registrations SET producer_id = 1 WHERE producer_id = 5`);
    await query(`UPDATE registrations SET producer_id = 2 WHERE producer_id = 6`);
    
    console.log('✅ Inscripciones actualizadas');
    
    // Verificar resultado
    const result = await query(`
      SELECT r.registration_id, r.producer_id, p.first_name, p.last_name, f.name
      FROM registrations r
      LEFT JOIN producers p ON r.producer_id = p.producer_id
      LEFT JOIN fairs f ON r.fair_id = f.fair_id
      ORDER BY r.registration_date DESC
    `);
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

fixRegistrations();
