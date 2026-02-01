/**
 * Script para crear traducciones
 */

require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

async function seedTranslations() {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🌐 CREANDO TRADUCCIONES DEL SISTEMA`);
  console.log(`${'='.repeat(70)}\n`);

  const translations = [
    // ESPAÑOL
    { lang: 'es', key: 'nav.home', value: 'Inicio' },
    { lang: 'es', key: 'nav.producers', value: 'Gestión de Productores' },
    { lang: 'es', key: 'nav.fairs', value: 'Ferias' },
    { lang: 'es', key: 'nav.products', value: 'Productos' },
    { lang: 'es', key: 'nav.sales', value: 'Ventas' },
    { lang: 'es', key: 'nav.incidents', value: 'Incidentes' },
    { lang: 'es', key: 'nav.admin', value: 'Administración' },
    { lang: 'es', key: 'nav.logout', value: 'Cerrar Sesión' },
    { lang: 'es', key: 'btn.save', value: 'Guardar' },
    { lang: 'es', key: 'btn.cancel', value: 'Cancelar' },
    { lang: 'es', key: 'btn.delete', value: 'Eliminar' },
    { lang: 'es', key: 'btn.edit', value: 'Editar' },
    { lang: 'es', key: 'btn.add', value: 'Agregar' },
    { lang: 'es', key: 'btn.search', value: 'Buscar' },
    { lang: 'es', key: 'form.username', value: 'Usuario' },
    { lang: 'es', key: 'form.password', value: 'Contraseña' },
    { lang: 'es', key: 'form.email', value: 'Correo Electrónico' },
    { lang: 'es', key: 'form.fullname', value: 'Nombre Completo' },
    { lang: 'es', key: 'form.phone', value: 'Teléfono' },
    { lang: 'es', key: 'form.address', value: 'Dirección' },
    { lang: 'es', key: 'login.title', value: 'Iniciar Sesión' },
    { lang: 'es', key: 'login.submit', value: 'Iniciar Sesión' },
    { lang: 'es', key: 'error.required', value: 'Campo requerido' },
    { lang: 'es', key: 'error.invalid_email', value: 'Correo inválido' },
    { lang: 'es', key: 'success.saved', value: 'Guardado exitosamente' },
    { lang: 'es', key: 'success.deleted', value: 'Eliminado exitosamente' },
    { lang: 'es', key: 'title.producers', value: 'Gestión de Productores' },
    { lang: 'es', key: 'title.fairs', value: 'Ferias Agroproductivas' },
    { lang: 'es', key: 'title.products', value: 'Catálogo de Productos' },
    { lang: 'es', key: 'title.sales', value: 'Registro de Ventas' },
    { lang: 'es', key: 'label.total', value: 'Total' },
    { lang: 'es', key: 'label.active', value: 'Activos' },
    { lang: 'es', key: 'label.pending', value: 'Pendientes' },

    // INGLÉS
    { lang: 'en', key: 'nav.home', value: 'Home' },
    { lang: 'en', key: 'nav.producers', value: 'Producers Management' },
    { lang: 'en', key: 'nav.fairs', value: 'Fairs' },
    { lang: 'en', key: 'nav.products', value: 'Products' },
    { lang: 'en', key: 'nav.sales', value: 'Sales' },
    { lang: 'en', key: 'nav.incidents', value: 'Incidents' },
    { lang: 'en', key: 'nav.admin', value: 'Administration' },
    { lang: 'en', key: 'nav.logout', value: 'Logout' },
    { lang: 'en', key: 'btn.save', value: 'Save' },
    { lang: 'en', key: 'btn.cancel', value: 'Cancel' },
    { lang: 'en', key: 'btn.delete', value: 'Delete' },
    { lang: 'en', key: 'btn.edit', value: 'Edit' },
    { lang: 'en', key: 'btn.add', value: 'Add' },
    { lang: 'en', key: 'btn.search', value: 'Search' },
    { lang: 'en', key: 'form.username', value: 'Username' },
    { lang: 'en', key: 'form.password', value: 'Password' },
    { lang: 'en', key: 'form.email', value: 'Email' },
    { lang: 'en', key: 'form.fullname', value: 'Full Name' },
    { lang: 'en', key: 'form.phone', value: 'Phone' },
    { lang: 'en', key: 'form.address', value: 'Address' },
    { lang: 'en', key: 'login.title', value: 'Sign In' },
    { lang: 'en', key: 'login.submit', value: 'Sign In' },
    { lang: 'en', key: 'error.required', value: 'Required field' },
    { lang: 'en', key: 'error.invalid_email', value: 'Invalid email' },
    { lang: 'en', key: 'success.saved', value: 'Saved successfully' },
    { lang: 'en', key: 'success.deleted', value: 'Deleted successfully' },
    { lang: 'en', key: 'title.producers', value: 'Producers Management' },
    { lang: 'en', key: 'title.fairs', value: 'Agricultural Fairs' },
    { lang: 'en', key: 'title.products', value: 'Product Catalog' },
    { lang: 'en', key: 'title.sales', value: 'Sales Record' },
    { lang: 'en', key: 'label.total', value: 'Total' },
    { lang: 'en', key: 'label.active', value: 'Active' },
    { lang: 'en', key: 'label.pending', value: 'Pending' }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const trans of translations) {
    try {
      await sql.query(
        `INSERT INTO translations (language_code, key, value, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())`,
        [trans.lang, trans.key, trans.value]
      );
      successCount++;
    } catch (error) {
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        // Intentar actualizar si ya existe
        try {
          await sql.query(
            `UPDATE translations SET value = $1, updated_at = NOW() 
             WHERE language_code = $2 AND key = $3`,
            [trans.value, trans.lang, trans.key]
          );
          successCount++;
        } catch (updateError) {
          errorCount++;
        }
      } else {
        errorCount++;
        console.error(`Error insertando ${trans.lang}/${trans.key}:`, error.message.split('\n')[0]);
      }
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ TRADUCCIONES COMPLETADAS`);
  console.log(`${'='.repeat(70)}`);
  console.log(`✅ Traducciones creadas/actualizadas: ${successCount}`);
  if (errorCount > 0) {
    console.log(`⚠️  Errores: ${errorCount}`);
  }
  console.log(`\n🌐 Idiomas disponibles:`);
  console.log(`   • Español (es)`);
  console.log(`   • Inglés (en)\n`);

  process.exit(0);
}

seedTranslations().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
