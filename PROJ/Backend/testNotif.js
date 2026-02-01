const { query } = require('./db');

async function testNotifications() {
  try {
    // Crear una notificación de prueba para el coordinador abive (user_id 2)
    console.log('\n=== Creando notificación de prueba ===');
    const result = await query(`
      INSERT INTO notifications (user_id, title, message, type, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `, [2, 'Prueba de Notificación', 'Esta es una notificación de prueba', 'info']);
    
    console.log('✅ Notificación creada:', result.rows[0]);

    // Ver todas las notificaciones
    console.log('\n=== Notificaciones en la BD ===');
    const allNotifs = await query(`
      SELECT notification_id, user_id, title, message, type, is_read, created_at 
      FROM notifications 
      ORDER BY created_at DESC
      LIMIT 10
    `);
    console.log(JSON.stringify(allNotifs.rows, null, 2));

    // Verificar el endpoint GET user
    console.log('\n=== Notificaciones para user_id 2 ===');
    const userNotifs = await query(`
      SELECT notification_id, user_id, title, message, type, is_read, created_at 
      FROM notifications 
      WHERE user_id = 2
      ORDER BY created_at DESC
    `);
    console.log(JSON.stringify(userNotifs.rows, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

testNotifications();
