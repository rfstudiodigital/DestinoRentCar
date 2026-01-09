import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Verificando estado de la base de datos...\n');

  // Verificar DATABASE_URL
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  console.log(`📝 DATABASE_URL configurada: ${hasDatabaseUrl ? '✅ Sí' : '❌ No'}`);
  
  if (!hasDatabaseUrl) {
    console.log('\n⚠️  DATABASE_URL no está configurada.');
    console.log('💡 Configúrala en Vercel: Settings > Environment Variables');
    process.exit(1);
  }

  try {
    // Verificar conexión
    console.log('\n🔌 Intentando conectar a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa\n');

    // Verificar tablas y contar registros
    console.log('📊 Contando registros...');
    
    const vehiculosCount = await prisma.vehiculo.count();
    const clientesCount = await prisma.cliente.count();
    const rentasCount = await prisma.renta.count();
    // El modelo Resena no existe en el schema actual
    const resenasCount = 0; // await prisma.resena.count();
    const documentosCount = await prisma.documento.count();
    const notificacionesCount = await prisma.notificacion.count();

    console.log(`  Vehículos: ${vehiculosCount}`);
    console.log(`  Clientes: ${clientesCount}`);
    console.log(`  Rentas: ${rentasCount}`);
    console.log(`  Reseñas: ${resenasCount}`);
    console.log(`  Documentos: ${documentosCount}`);
    console.log(`  Notificaciones: ${notificacionesCount}\n`);

    if (vehiculosCount === 0 && clientesCount === 0) {
      console.log('⚠️  La base de datos está vacía.');
      console.log('💡 Ejecuta: npm run db:seed para crear datos de ejemplo\n');
    } else {
      console.log('✅ Base de datos tiene datos\n');
      
      // Mostrar algunos vehículos
      if (vehiculosCount > 0) {
        const vehiculos = await prisma.vehiculo.findMany({
          take: 3,
          select: {
            marca: true,
            modelo: true,
            anio: true,
            placa: true,
            disponible: true,
          },
        });
        
        console.log('🚗 Primeros vehículos:');
        vehiculos.forEach((v) => {
          console.log(`  - ${v.marca} ${v.modelo} ${v.anio} (${v.placa}) - ${v.disponible ? 'Disponible' : 'No disponible'}`);
        });
        console.log('');
      }
    }

  } catch (error) {
    console.error('\n❌ Error verificando base de datos:', error);
    if (error instanceof Error) {
      console.error('Mensaje:', error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
