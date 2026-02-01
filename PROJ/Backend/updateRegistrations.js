/**
 * Script para actualizar inscripciones con productos y fechas diferentes
 */

const { query } = require('./db');

async function updateRegistrations() {
  try {
    console.log('🔄 Actualizando inscripciones...\n');

    // Registros con productos específicos y fechas diferentes
    const registrations = [
      {
        id: 1,
        products: ['Papa Nativa', 'Maíz Amarillo', 'Frijol Negro'],
        date: '2026-01-15'
      },
      {
        id: 2,
        products: ['Papa Blanca', 'Cebada', 'Arveja'],
        date: '2026-02-10'
      },
      {
        id: 3,
        products: ['Tomate', 'Lechuga', 'Cebolla'],
        date: '2026-01-20'
      }
    ];

    for (const reg of registrations) {
      const result = await query(
        `UPDATE registrations 
         SET notes = $1, registration_date = $2
         WHERE registration_id = $3
         RETURNING *`,
        [
          reg.products.join(', '),
          reg.date,
          reg.id
        ]
      );
      console.log(`✅ Registración ${reg.id} actualizada:`);
      console.log(`   Productos: ${reg.products.join(', ')}`);
      console.log(`   Fecha: ${reg.date}\n`);
    }

    console.log('✅ ¡Todas las inscripciones han sido actualizadas!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateRegistrations();
