const { query } = require('./db');

async function checkSchema() {
  try {
    // Ver estructura de registrations
    console.log('\n=== Estructura de registrations ===');
    const regCols = await query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'registrations' 
      ORDER BY ordinal_position
    `);
    regCols.rows.forEach(row => console.log('- ' + row.column_name));

    // Ver estructura de users
    console.log('\n=== Estructura de users ===');
    const userCols = await query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    userCols.rows.forEach(row => console.log('- ' + row.column_name));

    // Ver datos actuales
    console.log('\n=== Datos en registrations ===');
    const regs = await query(`SELECT * FROM registrations LIMIT 1`);
    if (regs.rows.length > 0) {
      console.log('Primer registro:', regs.rows[0]);
    }

    console.log('\n=== Datos en producers ===');
    const prods = await query(`SELECT * FROM producers LIMIT 1`);
    if (prods.rows.length > 0) {
      console.log('Primer productor:', prods.rows[0]);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkSchema();
