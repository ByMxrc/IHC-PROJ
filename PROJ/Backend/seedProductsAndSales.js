/**
 * Script para asignar productos y ventas a productores y ferias
 */

require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

async function seedProductsAndSales() {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🌾 CREANDO PRODUCTOS Y VENTAS POR FERIA`);
  console.log(`${'='.repeat(70)}\n`);

  try {
    // Datos de productores con sus ferias y fechas
    const assignments = [
      {
        producerId: 3,
        producerName: 'Adriano Márquez',
        fairId: 1,
        fairName: 'Feria Lima 2026',
        saleDate: '2026-03-16T10:30:00',
        products: [
          { name: 'Papa Nativa', quantity: 500, unit: 'kg', unitPrice: 2.50, category: 'Tubérculo' },
          { name: 'Maíz Amarillo', quantity: 300, unit: 'kg', unitPrice: 3.20, category: 'Cereal' },
          { name: 'Frijol Negro', quantity: 200, unit: 'kg', unitPrice: 4.50, category: 'Legumbre' }
        ]
      },
      {
        producerId: 5,
        producerName: 'Juan Rodríguez García',
        fairId: 2,
        fairName: 'Feria Centro (Junín)',
        saleDate: '2026-04-11T09:00:00',
        products: [
          { name: 'Papa Blanca', quantity: 450, unit: 'kg', unitPrice: 2.80, category: 'Tubérculo' },
          { name: 'Cebada Perlada', quantity: 250, unit: 'kg', unitPrice: 3.50, category: 'Cereal' },
          { name: 'Arveja Verde', quantity: 180, unit: 'kg', unitPrice: 5.20, category: 'Legumbre' }
        ]
      },
      {
        producerId: 6,
        producerName: 'María Sánchez López',
        fairId: 3,
        fairName: 'Feria Sur (Arequipa)',
        saleDate: '2026-05-21T08:00:00',
        products: [
          { name: 'Tomate Fresco', quantity: 600, unit: 'kg', unitPrice: 2.00, category: 'Hortaliza' },
          { name: 'Lechuga Orgánica', quantity: 200, unit: 'unidades', unitPrice: 1.50, category: 'Verdura' },
          { name: 'Cebolla Roja', quantity: 350, unit: 'kg', unitPrice: 1.80, category: 'Hortaliza' }
        ]
      }
    ];

    // Crear productos y ventas
    for (const assignment of assignments) {
      console.log(`\n📍 ${assignment.producerName} → ${assignment.fairName}`);
      
      let saleCount = 0;
      for (const product of assignment.products) {
        // Crear producto
        const productResult = await sql.query(
          `INSERT INTO products (producer_id, product_name, description, quantity, unit, unit_price, category, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'available', NOW(), NOW())
           RETURNING product_id`,
          [
            assignment.producerId,
            product.name,
            `${product.name} de calidad premium`,
            product.quantity,
            product.unit,
            product.unitPrice,
            product.category
          ]
        );
        
        const productId = productResult[0].product_id;
        console.log(`   ✅ Producto: ${product.name} (${product.quantity} ${product.unit})`);

        // Crear venta
        const soldQuantity = Math.floor(product.quantity * (Math.random() * 0.8 + 0.2)); // 20-100% vendido
        const totalPrice = soldQuantity * product.unitPrice;

        await sql.query(
          `INSERT INTO sales (product_id, buyer_name, buyer_email, quantity_sold, unit_price, total_price, sale_date, payment_method, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'completed', NOW(), NOW())`,
          [
            productId,
            `Comprador ${Math.floor(Math.random() * 1000)}`,
            `buyer${Math.floor(Math.random() * 10000)}@agroferia.com`,
            soldQuantity,
            product.unitPrice,
            totalPrice,
            assignment.saleDate,
            ['efectivo', 'tarjeta', 'transferencia'][Math.floor(Math.random() * 3)]
          ]
        );

        console.log(`   💰 Venta: ${soldQuantity} ${product.unit} x S/. ${product.unitPrice} = S/. ${totalPrice.toFixed(2)}`);
        saleCount++;
      }

      console.log(`   📊 ${saleCount} ventas registradas`);
    }

    console.log(`\n${'='.repeat(70)}`);
    console.log(`✅ PRODUCTOS Y VENTAS CREADOS EXITOSAMENTE`);
    console.log(`${'='.repeat(70)}`);
    console.log(`\n📦 Resumen:`);
    console.log(`   • 9 productos creados (3 por productor)`);
    console.log(`   • 9 ventas registradas`);
    console.log(`   • Fechas asignadas según calendario de ferias\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedProductsAndSales();
