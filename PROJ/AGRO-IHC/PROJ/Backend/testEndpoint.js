const { query } = require('./db');

async function testNotificationEndpoint() {
  try {
    // Primero, verificar que la notificación existe en la BD
    console.log('\n=== Notificaciones en BD para user_id 2 ===');
    const dbResult = await query(`
      SELECT * FROM notifications WHERE user_id = 2 ORDER BY created_at DESC
    `);
    console.log(`Total: ${dbResult.rows.length}`);
    console.log(JSON.stringify(dbResult.rows, null, 2));

    // Ahora simular la respuesta del endpoint
    console.log('\n=== Respuesta del endpoint ===');
    const response = {
      success: true,
      data: dbResult.rows
    };
    console.log(JSON.stringify(response, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

testNotificationEndpoint();
