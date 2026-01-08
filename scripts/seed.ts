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

  // Crear vehículos de ejemplo
  const vehiculos = await Promise.all([
    prisma.vehiculo.create({
      data: {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2023,
        placa: 'ABC-1234',
        color: 'Blanco',
        precioDiario: 50,
        disponible: true,
        descripcion: 'Vehículo económico y confiable, perfecto para la ciudad.',
        tipoVehiculo: 'Sedan',
        transmision: 'Automática',
        combustible: 'Gasolina',
        pasajeros: 5,
        puertas: 4,
        motor: '1.8L',
        aireAcondicionado: true,
        gps: true,
        bluetooth: true,
        camaraReversa: true,
      },
    }),
    prisma.vehiculo.create({
      data: {
        marca: 'Honda',
        modelo: 'CR-V',
        anio: 2024,
        placa: 'XYZ-5678',
        color: 'Negro',
        precioDiario: 75,
        disponible: true,
        descripcion: 'SUV espaciosa y cómoda, ideal para viajes familiares.',
        tipoVehiculo: 'SUV',
        transmision: 'Automática',
        combustible: 'Híbrido',
        pasajeros: 7,
        puertas: 5,
        motor: '2.0L Hybrid',
        aireAcondicionado: true,
        gps: true,
        bluetooth: true,
        camaraReversa: true,
        sensoresEstacionamiento: true,
      },
    }),
    prisma.vehiculo.create({
      data: {
        marca: 'Ford',
        modelo: 'Ranger',
        anio: 2023,
        placa: 'DEF-9012',
        color: 'Gris',
        precioDiario: 80,
        disponible: true,
        descripcion: 'Pickup robusta, perfecta para trabajos y aventuras.',
        tipoVehiculo: 'Pickup',
        transmision: 'Manual',
        combustible: 'Diesel',
        pasajeros: 5,
        puertas: 4,
        motor: '2.2L Turbo',
        aireAcondicionado: true,
        gps: false,
        bluetooth: true,
        camaraReversa: false,
        sensoresEstacionamiento: false,
      },
    }),
    prisma.vehiculo.create({
      data: {
        marca: 'Volkswagen',
        modelo: 'Golf',
        anio: 2024,
        placa: 'GHI-3456',
        color: 'Rojo',
        precioDiario: 55,
        disponible: true,
        descripcion: 'Compacto europeo con excelente manejo y eficiencia.',
        tipoVehiculo: 'Compacto',
        transmision: 'Automática',
        combustible: 'Gasolina',
        pasajeros: 5,
        puertas: 5,
        motor: '1.4L Turbo',
        aireAcondicionado: true,
        gps: true,
        bluetooth: true,
        camaraReversa: true,
      },
    }),
    prisma.vehiculo.create({
      data: {
        marca: 'Nissan',
        modelo: 'Sentra',
        anio: 2023,
        placa: 'JKL-7890',
        color: 'Azul',
        precioDiario: 45,
        disponible: false, // No disponible para pruebas
        descripcion: 'Sedan económico con excelente relación precio-calidad.',
        tipoVehiculo: 'Sedan',
        transmision: 'Automática',
        combustible: 'Gasolina',
        pasajeros: 5,
        puertas: 4,
        motor: '1.6L',
        aireAcondicionado: true,
        gps: false,
        bluetooth: true,
        camaraReversa: false,
      },
    }),
  ]);

  console.log(`✅ Creados ${vehiculos.length} vehículos`);

  // Crear clientes de ejemplo
  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        nombre: 'Juan',
        email: 'juan@example.com',
        telefono: '+59899123456',
        direccion: 'Av. 18 de Julio 1234',
        licencia: '123456789',
        idioma: 'es',
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: 'María',
        email: 'maria@example.com',
        telefono: '+59899234567',
        direccion: 'Bvar. Artigas 5678',
        licencia: '987654321',
        idioma: 'es',
      },
    }),
  ]);

  console.log(`✅ Creados ${clientes.length} clientes`);

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
      precioTotal: 50 * 5, // 5 días x $50
      estado: 'activa',
      observaciones: 'Renta de prueba',
    },
  });

  console.log(`✅ Creada 1 renta de ejemplo`);

  // Marcar vehículo como no disponible
  await prisma.vehiculo.update({
    where: { id: vehiculos[0].id },
    data: { disponible: false },
  });

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