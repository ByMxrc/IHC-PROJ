const { query } = require('./db');

async function checkNotifications() {
  try {
    // Ver usuarios coordinadores
    console.log('\n=== Coordinadores ===');
    const coords = await query(`
      SELECT user_id, username, full_name, role FROM users WHERE role = 'coordinator'
    `);
    console.log(JSON.stringify(coords.rows, null, 2));

    // Ver notificaciones creadas
    console.log('\n=== Notificaciones ===');
    const notifs = await query(`
      SELECT notification_id, user_id, title, message, is_read, created_at FROM notifications
      ORDER BY created_at DESC
      LIMIT 10
    `);
    console.log(JSON.stringify(notifs.rows, null, 2));

    // Ver asignaciones de coordinadores a ferias
    console.log('\n=== Fair Coordinators ===');
    const fairCoords = await query(`
      SELECT fc.id, fc.fair_id, fc.coordinator_id, f.name as fair_name, u.full_name, u.user_id
      FROM fair_coordinators fc
      LEFT JOIN fairs f ON fc.fair_id = f.fair_id
      LEFT JOIN users u ON fc.coordinator_id = u.user_id
      ORDER BY fc.created_at DESC
      LIMIT 5
    `);
    console.log(JSON.stringify(fairCoords.rows, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkNotifications();
