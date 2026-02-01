/**
 * Script para completar datos de usuarios, productores, ferias, registraciones y traducciones
 */

require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

async function seedData() {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🌾 COMPLETANDO DATOS DEL SISTEMA - AGROFERIA`);
  console.log(`${'='.repeat(70)}\n`);

  try {
    // ========== 1. ACTUALIZAR USUARIOS EXISTENTES ==========
    console.log(`\n📝 PASO 1: Actualizando datos de usuarios existentes...\n`);

    // Actualizar Admin
    await sql.query(
      `UPDATE users SET email = 'bymxrc@agroferia.com', full_name = 'Brycelio Rimarachín' 
       WHERE username = 'bymxrc'`
    );
    console.log(`✅ Admin actualizado: Brycelio Rimarachín (bymxrc@agroferia.com)`);

    // Actualizar Coordinador
    await sql.query(
      `UPDATE users SET email = 'abive@agroferia.com', full_name = 'Abigaíl Vélez' 
       WHERE username = 'abive'`
    );
    console.log(`✅ Coordinador actualizado: Abigaíl Vélez (abive@agroferia.com)`);

    // Actualizar Productor existente
    await sql.query(
      `UPDATE users SET email = 'adrmarc@agroferia.com', full_name = 'Adriano Márquez' 
       WHERE username = 'adrmarc'`
    );
    console.log(`✅ Productor actualizado: Adriano Márquez (adrmarc@agroferia.com)\n`);

    // ========== 2. CREAR NUEVO COORDINADOR ==========
    console.log(`📝 PASO 2: Creando coordinador adicional...\n`);

    const coordResult = await sql.query(
      `INSERT INTO users (username, email, password_hash, full_name, phone, role, status)
       VALUES ('cmorales', 'cmorales@agroferia.com', 'coord_pass', 'Carlos Morales', '+51 999 111 004', 'coordinator', 'active')
       RETURNING user_id`
    );
    const coordId = coordResult[0].user_id;
    console.log(`✅ Nuevo coordinador creado: Carlos Morales (ID: ${coordId})\n`);

    // ========== 3. CREAR PRODUCTORES ADICIONALES ==========
    console.log(`📝 PASO 3: Creando productores adicionales...\n`);

    // Crear usuario productor 2
    const prod2Result = await sql.query(
      `INSERT INTO users (username, email, password_hash, full_name, phone, role, status)
       VALUES ('jrodriguez', 'jrodriguez@agroferia.com', 'prod2_pass', 'Juan Rodríguez', '+51 999 222 005', 'producer', 'active')
       RETURNING user_id`
    );
    const prod2UserId = prod2Result[0].user_id;

    // Crear registro productor 2
    await sql.query(
      `INSERT INTO producers (user_id, first_name, last_name, document_type, document_number, phone, email, 
        address, district, province, department, farm_name, farm_size, main_products, status)
       VALUES ($1, 'Juan', 'Rodríguez García', 'DNI', '45678901', '+51 999 222 005', 'jrodriguez@agroferia.com',
        'Jr. Agricultura 234', 'San Isidro', 'Lima', 'Lima', 'Granja Rodríguez', 15.5, 
        '["Papa", "Maíz", "Frijol"]', 'active')`,
      [prod2UserId]
    );
    console.log(`✅ Productor 2 creado: Juan Rodríguez García`);

    // Crear usuario productor 3
    const prod3Result = await sql.query(
      `INSERT INTO users (username, email, password_hash, full_name, phone, role, status)
       VALUES ('msanchez', 'msanchez@agroferia.com', 'prod3_pass', 'María Sánchez', '+51 999 333 006', 'producer', 'active')
       RETURNING user_id`
    );
    const prod3UserId = prod3Result[0].user_id;

    // Crear registro productor 3
    await sql.query(
      `INSERT INTO producers (user_id, first_name, last_name, document_type, document_number, phone, email, 
        address, district, province, department, farm_name, farm_size, main_products, status)
       VALUES ($1, 'María', 'Sánchez López', 'DNI', '56789012', '+51 999 333 006', 'msanchez@agroferia.com',
        'Av. Agricultores 456', 'La Molina', 'Lima', 'Lima', 'Huerta Sánchez', 22.8, 
        '["Tomate", "Lechuga", "Cebolla"]', 'active')`,
      [prod3UserId]
    );
    console.log(`✅ Productor 3 creado: María Sánchez López\n`);

    // ========== 4. CREAR FERIAS ==========
    console.log(`📝 PASO 4: Creando ferias...\n`);

    const fairs = [
      {
        name: 'Feria Agroproductiva Lima 2026',
        description: 'Gran feria agroproductiva de Lima con participantes de toda la región',
        location: 'Lima',
        address: 'Av. Paseo de la República 3000',
        district: 'San Isidro',
        province: 'Lima',
        department: 'Lima',
        start_date: '2026-03-15T08:00:00',
        end_date: '2026-03-17T18:00:00',
        max_capacity: 50,
        product_categories: '["Papa", "Maíz", "Frijol", "Tomate"]',
        requirements: '["Registro sanitario", "Documento de identidad"]'
      },
      {
        name: 'Feria Regional del Centro',
        description: 'Feria de productos agrícolas de la región central',
        location: 'Junín',
        address: 'Calle Principal 123',
        district: 'Huancayo',
        province: 'Huancayo',
        department: 'Junín',
        start_date: '2026-04-10T09:00:00',
        end_date: '2026-04-12T19:00:00',
        max_capacity: 40,
        product_categories: '["Papa", "Cebada", "Trigo", "Arveja"]',
        requirements: '["Autorización municipal", "Carnet de productor"]'
      },
      {
        name: 'Feria de Productos Frescos del Sur',
        description: 'Exposición y venta de productos frescos de la región sur',
        location: 'Arequipa',
        address: 'Parque Industrial Zona 1',
        district: 'Arequipa',
        province: 'Arequipa',
        department: 'Arequipa',
        start_date: '2026-05-20T08:30:00',
        end_date: '2026-05-22T18:30:00',
        max_capacity: 60,
        product_categories: '["Pimiento", "Lechuga", "Cebolla", "Ajo"]',
        requirements: '["Documento de identidad", "Comprobante de domicilio"]'
      }
    ];

    const fairIds = [];
    for (const fair of fairs) {
      const result = await sql.query(
        `INSERT INTO fairs (name, description, location, address, district, province, department, 
         start_date, end_date, max_capacity, current_capacity, status, product_categories, requirements, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, 'scheduled', $11, $12, NOW(), NOW())
         RETURNING fair_id`,
        [fair.name, fair.description, fair.location, fair.address, fair.district, fair.province, 
         fair.department, fair.start_date, fair.end_date, fair.max_capacity, 
         fair.product_categories, fair.requirements]
      );
      fairIds.push(result[0].fair_id);
      console.log(`✅ Feria creada: ${fair.name} (ID: ${result[0].fair_id})`);
    }
    console.log();

    // ========== 5. CREAR REGISTRACIONES ==========
    console.log(`📝 PASO 5: Creando inscripciones a ferias...\n`);

    const prod1Id = 3; // Usuario adrmarc es productor
    
    // Inscripción 1: Productor 1 a Feria 1
    await sql.query(
      `INSERT INTO registrations (fair_id, producer_id, registration_date, status, assigned_spot, notes, created_at, updated_at)
       VALUES ($1, $2, NOW(), 'approved', 'A-01', 'Productor confirmado', NOW(), NOW())`,
      [fairIds[0], prod1Id]
    );
    console.log(`✅ Inscripción 1: Adriano Márquez → Feria Lima 2026 (Puesto A-01)`);

    // Inscripción 2: Productor 2 a Feria 2
    await sql.query(
      `INSERT INTO registrations (fair_id, producer_id, registration_date, status, assigned_spot, notes, created_at, updated_at)
       VALUES ($1, $2, NOW(), 'approved', 'B-05', 'Productor confirmado', NOW(), NOW())`,
      [fairIds[1], prod2UserId]
    );
    console.log(`✅ Inscripción 2: Juan Rodríguez → Feria Centro (Puesto B-05)`);

    // Inscripción 3: Productor 3 a Feria 3
    await sql.query(
      `INSERT INTO registrations (fair_id, producer_id, registration_date, status, assigned_spot, notes, created_at, updated_at)
       VALUES ($1, $2, NOW(), 'approved', 'C-10', 'Productor confirmado', NOW(), NOW())`,
      [fairIds[2], prod3UserId]
    );
    console.log(`✅ Inscripción 3: María Sánchez → Feria Sur (Puesto C-10)\n`);

    // ========== 6. CREAR TRADUCCIONES ==========
    console.log(`📝 PASO 6: Creando traducciones del sistema...\n`);

    const translations = [
      // ESPAÑOL
      { lang: 'es', key: 'nav.home', value: 'Inicio' },
      { lang: 'es', key: 'nav.producers', value: 'Gestión de Productores' },
      { lang: 'es', key: 'nav.fairs', value: 'Ferias' },
      { lang: 'es', key: 'nav.products', value: 'Productos' },
      { lang: 'es', key: 'nav.sales', value: 'Ventas' },
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

      // INGLÉS
      { lang: 'en', key: 'nav.home', value: 'Home' },
      { lang: 'en', key: 'nav.producers', value: 'Producers Management' },
      { lang: 'en', key: 'nav.fairs', value: 'Fairs' },
      { lang: 'en', key: 'nav.products', value: 'Products' },
      { lang: 'en', key: 'nav.sales', value: 'Sales' },
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
      { lang: 'en', key: 'success.deleted', value: 'Deleted successfully' }
    ];

    let translationCount = 0;
    for (const trans of translations) {
      try {
        await sql.query(
          `INSERT INTO translations (language_code, key, value, created_at, updated_at)
           VALUES ($1, $2, $3, NOW(), NOW())
           ON CONFLICT (language_code, key) DO UPDATE SET value = $3, updated_at = NOW()`,
          [trans.lang, trans.key, trans.value]
        );
        translationCount++;
      } catch (error) {
        // Ignorar errores de duplicados
      }
    }
    console.log(`✅ ${translationCount} traducciones creadas (Español + Inglés)\n`);

    // ========== RESUMEN FINAL ==========
    console.log(`${'='.repeat(70)}`);
    console.log(`✅ DATOS COMPLETADOS EXITOSAMENTE`);
    console.log(`${'='.repeat(70)}\n`);

    console.log(`📊 RESUMEN DE DATOS CREADOS:`);
    console.log(`   • 1 Admin actualizado (Brycelio Rimarachín)`);
    console.log(`   • 1 Coordinador actualizado (Abigaíl Vélez)`);
    console.log(`   • 1 Coordinador nuevo (Carlos Morales)`);
    console.log(`   • 1 Productor actualizado (Adriano Márquez)`);
    console.log(`   • 2 Productores nuevos (Juan Rodríguez, María Sánchez)`);
    console.log(`   • 3 Ferias creadas`);
    console.log(`   • 3 Inscripciones creadas`);
    console.log(`   • ${translationCount} Traducciones (ES/EN)\n`);

    console.log(`🔐 CREDENCIALES DISPONIBLES:`);
    console.log(`   Administrador: bymxrc / mxrc_admin`);
    console.log(`   Coordinador 1: abive / abiga_nave`);
    console.log(`   Coordinador 2: cmorales / coord_pass`);
    console.log(`   Productor 1: adrmarc / unk_pass`);
    console.log(`   Productor 2: jrodriguez / prod2_pass`);
    console.log(`   Productor 3: msanchez / prod3_pass\n`);

    console.log(`🎉 ¡Sistema listo para usar!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedData();
