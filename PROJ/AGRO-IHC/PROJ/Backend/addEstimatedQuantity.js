const { query } = require('./db');

async function addEstimatedQuantity() {
  try {
    // Agregar columna si no existe
    await query(`
      ALTER TABLE registrations 
      ADD COLUMN IF NOT EXISTS estimated_quantity INTEGER DEFAULT 0
    `);
    
    console.log('✅ Columna estimated_quantity agregada');
    
    // Actualizar con valores
    await query(`UPDATE registrations SET estimated_quantity = 100 WHERE registration_id = 1`);
    await query(`UPDATE registrations SET estimated_quantity = 80 WHERE registration_id = 2`);
    await query(`UPDATE registrations SET estimated_quantity = 120 WHERE registration_id = 3`);
    
    console.log('✅ Cantidades estimadas actualizadas');
    
    // Verificar resultado
    const result = await query(`
      SELECT registration_id, estimated_quantity, notes FROM registrations ORDER BY registration_id
    `);
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

addEstimatedQuantity();
