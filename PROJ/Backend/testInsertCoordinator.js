const { query } = require('./db');

async function testInsert() {
  try {
    console.log('\n=== Verificando datos ===');
    
    // Verificar ferias
    const fairs = await query('SELECT fair_id, name FROM fairs LIMIT 3');
    console.log('Ferias:');
    console.log(JSON.stringify(fairs.rows, null, 2));

    // Verificar coordinadores
    const coords = await query('SELECT user_id, username, role FROM users WHERE role = \'coordinator\'');
    console.log('\nCordinadores:');
    console.log(JSON.stringify(coords.rows, null, 2));

    // Intentar insertar una asignación
    console.log('\n=== Intentando INSERT ===');
    try {
      const result = await query(`
        INSERT INTO fair_coordinators (fair_id, coordinator_id, assigned_date)
        VALUES ($1, $2, NOW())
        RETURNING *
      `, [1, 2]);
      console.log('✅ Inserción exitosa:');
      console.log(JSON.stringify(result.rows[0], null, 2));
    } catch (insertError) {
      console.error('❌ Error en INSERT:');
      console.error(insertError.message);
      console.error('Code:', insertError.code);
      console.error('Detail:', insertError.detail);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

testInsert();
