import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Verificar si ya hay datos
  const vehiculosCount = await prisma.vehiculo.count();
  const clientesCount = await prisma.cliente.count();

  if (vehiculosCount > 0 || clientesCount > 0) {
    console.log(`⚠️  Ya hay datos en la base de datos (${vehiculosCount} vehículos, ${clientesCount} clientes)`);
    console.log('💡 Para limpiar y volver a sembrar, ejecuta: npx prisma migrate reset');
    return;
  }

  // Crear vehículos de ejemplo (solo con campos que existen en el schema)
  const vehiculos = await Promise.all([
    prisma.vehiculo.create({
      data: {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2023,
        placa: 'SAB-1234',
        color: 'Blanco',
        precioDiario: 2500.00,
        disponible: true,
        descripcion: 'Sedán confiable y económico, perfecto para la ciudad y viajes largos. Incluye aire acondicionado, dirección asistida y sistema multimedia.',
        imagen: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
      },
    }),
    prisma.vehiculo.create({
      data: {
        marca: 'Chevrolet',
        modelo: 'Onix',
        anio: 2024,
        placa: 'SAB-5678',
        color: 'Gris',
        precioDiario: 2200.00,
        disponible: true,
        descripcion: 'Hatchback compacto ideal para movilidad urbana. Excelente consumo de combustible y gran espacio interior.',
        imagen: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      },
    }),
    prisma.vehiculo.create({
      data: {
        marca: 'Volkswagen',
        modelo: 'Gol',
        anio: 2023,
        placa: 'SAB-9012',
        color: 'Rojo',
        precioDiario: 2100.00,
        disponible: true,
        descripcion: 'Auto económico y robusto. Ideal para uso diario con bajo mantenimiento y alto rendimiento.',
        imagen: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      },
    }),
    prisma.vehiculo.create({
      data: {
        marca: 'Ford',
        modelo: 'Ranger',
        anio: 2024,
        placa: 'SAB-3456',
        color: 'Negro',
        precioDiario: 4500.00,
        disponible: true,
        descripcion: 'Pick-up 4x4 potente y versátil. Perfecta para trabajo, campo y aventura. Incluye doble cabina y caja trasera amplia.',
        imagen: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      },
    }),
    prisma.vehiculo.create({
      data: {
        marca: 'Fiat',
        modelo: 'Cronos',
        anio: 2023,
        placa: 'SAB-7890',
        color: 'Azul',
        precioDiario: 2300.00,
        disponible: true,
        descripcion: 'Sedán espacioso y cómodo. Tecnología moderna y seguridad avanzada. Ideal para familias.',
        imagen: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      },
    }),
  ]);

  console.log(`✅ Creados ${vehiculos.length} vehículos`);

  // Crear clientes de ejemplo (solo con campos que existen en el schema)
  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        nombre: 'Juan Pérez',
        email: 'juan.perez@email.com',
        telefono: '+598 99 123 456',
        direccion: 'Av. 18 de Julio 1234, Montevideo',
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: 'María González',
        email: 'maria.gonzalez@email.com',
        telefono: '+598 98 234 567',
        direccion: 'Rambla República Argentina 567, Montevideo',
      },
    }),
  ]);

  console.log(`✅ Creados ${clientes.length} clientes`);

  // Crear admin de ejemplo
  try {
    await prisma.admin.create({
      data: {
        email: 'admin@demo.com',
        password: 'Admin123',
        nombre: 'Administrador',
      },
    });
    console.log('✅ Admin creado (admin@demo.com / Admin123)');
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('ℹ️  Admin ya existe');
    } else {
      console.error('Error creando admin:', error);
    }
  }

  // Crear una renta de ejemplo
  const fechaInicio = new Date();
  const fechaFin = new Date();
  fechaFin.setDate(fechaFin.getDate() + 5);

  const renta = await prisma.renta.create({
    data: {
      clienteId: clientes[0].id,
      vehiculoId: vehiculos[0].id,
      fechaInicio,
      fechaFin,
      precioTotal: 2500.00 * 5, // 5 días x $2500
      estado: 'pendiente',
      observaciones: 'Renta de prueba',
    },
  });

  console.log(`✅ Creada 1 renta de ejemplo`);

  console.log('✅ Seed completado exitosamente!');
  console.log(`📊 Resumen: ${vehiculos.length} vehículos, ${clientes.length} clientes, 1 renta`);
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
