import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const vehiculos = [
  {
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2023,
    placa: 'SAB-1234',
    color: 'Blanco',
    precioDiario: 2500,
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
    descripcion: 'Sedán confiable y económico, perfecto para la ciudad y viajes largos. Incluye aire acondicionado, dirección asistida y sistema multimedia.',
  },
  {
    marca: 'Chevrolet',
    modelo: 'Onix',
    anio: 2024,
    placa: 'SAB-5678',
    color: 'Gris',
    precioDiario: 2200,
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    descripcion: 'Hatchback compacto ideal para movilidad urbana. Excelente consumo de combustible y gran espacio interior.',
  },
  {
    marca: 'Volkswagen',
    modelo: 'Gol',
    anio: 2023,
    placa: 'SAB-9012',
    color: 'Rojo',
    precioDiario: 2100,
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    descripcion: 'Auto económico y robusto. Ideal para uso diario con bajo mantenimiento y alto rendimiento.',
  },
  {
    marca: 'Ford',
    modelo: 'Ranger',
    anio: 2024,
    placa: 'SAB-3456',
    color: 'Negro',
    precioDiario: 4500,
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    descripcion: 'Pick-up 4x4 potente y versátil. Perfecta para trabajo, campo y aventura. Incluye doble cabina y caja trasera amplia.',
  },
  {
    marca: 'Fiat',
    modelo: 'Cronos',
    anio: 2023,
    placa: 'SAB-7890',
    color: 'Azul',
    precioDiario: 2300,
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    descripcion: 'Sedán espacioso y cómodo. Tecnología moderna y seguridad avanzada. Ideal para familias.',
  },
  {
    marca: 'Renault',
    modelo: 'Duster',
    anio: 2024,
    placa: 'SAB-2468',
    color: 'Blanco',
    precioDiario: 3800,
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
    descripcion: 'SUV compacto con excelente altura libre. Perfecto para caminos de tierra y ciudad. Amplio espacio interior.',
  },
  {
    marca: 'Peugeot',
    modelo: '208',
    anio: 2023,
    placa: 'SAB-1357',
    color: 'Amarillo',
    precioDiario: 2400,
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop',
    descripcion: 'Hatchback deportivo y elegante. Diseño francés con tecnología avanzada y excelente manejo.',
  },
  {
    marca: 'Nissan',
    modelo: 'Frontier',
    anio: 2024,
    placa: 'SAB-9876',
    color: 'Gris',
    precioDiario: 4200,
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    descripcion: 'Pick-up robusta y confiable. Motor potente y gran capacidad de carga. Ideal para trabajo pesado.',
  },
  {
    marca: 'Suzuki',
    modelo: 'Vitara',
    anio: 2023,
    placa: 'SAB-5432',
    color: 'Rojo',
    precioDiario: 3200,
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop',
    descripcion: 'SUV compacto ágil y eficiente. Tracción delantera y 4x4 disponible. Perfecto para la ciudad y campo.',
  },
  {
    marca: 'Hyundai',
    modelo: 'HB20',
    anio: 2024,
    placa: 'SAB-1111',
    color: 'Negro',
    precioDiario: 2250,
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    descripcion: 'Hatchback moderno y bien equipado. Garantía extendida y excelente relación precio-calidad.',
  },
  {
    marca: 'Chevrolet',
    modelo: 'Cruze',
    anio: 2023,
    placa: 'SAB-2222',
    color: 'Azul',
    precioDiario: 2800,
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop',
    descripcion: 'Sedán premium con excelente equipamiento. Motor turbo y transmisión automática. Máxima comodidad.',
  },
  {
    marca: 'Volkswagen',
    modelo: 'Amarok',
    anio: 2024,
    placa: 'SAB-3333',
    color: 'Blanco',
    precioDiario: 4800,
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    descripcion: 'Pick-up premium alemana. Doble cabina con lujos. Motor diesel potente. Ideal para trabajo y ocio.',
  },
];

const clientes = [
  {
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+598 99 123 456',
    direccion: 'Av. 18 de Julio 1234, Montevideo',
  },
  {
    nombre: 'María González',
    email: 'maria.gonzalez@email.com',
    telefono: '+598 98 234 567',
    direccion: 'Rambla República Argentina 567, Montevideo',
  },
  {
    nombre: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    telefono: '+598 97 345 678',
    direccion: 'Bulevar Artigas 890, Montevideo',
  },
  {
    nombre: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    telefono: '+598 96 456 789',
    direccion: 'Calle Ejido 2345, Montevideo',
  },
  {
    nombre: 'Luis Fernández',
    email: 'luis.fernandez@email.com',
    telefono: '+598 95 567 890',
    direccion: 'Av. Agraciada 678, Montevideo',
  },
  {
    nombre: 'Laura Silva',
    email: 'laura.silva@email.com',
    telefono: '+598 94 678 901',
    direccion: 'Calle Colonia 123, Montevideo',
  },
  {
    nombre: 'Pedro López',
    email: 'pedro.lopez@email.com',
    telefono: '+598 93 789 012',
    direccion: 'Av. Rivera 3456, Montevideo',
  },
  {
    nombre: 'Carmen Díaz',
    email: 'carmen.diaz@email.com',
    telefono: '+598 92 890 123',
    direccion: 'Bulevar España 789, Montevideo',
  },
];

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  // Limpiar datos existentes (opcional - comentar si no quieres eliminar datos)
  // console.log('🗑️  Limpiando datos existentes...');
  // await prisma.renta.deleteMany();
  // await prisma.vehiculo.deleteMany();
  // await prisma.cliente.deleteMany();

  // Crear vehículos
  console.log('🚗 Creando vehículos...');
  for (const vehiculo of vehiculos) {
    try {
      const created = await prisma.vehiculo.upsert({
        where: { placa: vehiculo.placa },
        update: vehiculo,
        create: vehiculo,
      });
      console.log(`   ✓ ${created.marca} ${created.modelo} ${created.anio} - Placa: ${created.placa}`);
    } catch (error: any) {
      console.log(`   ✗ Error al crear ${vehiculo.marca} ${vehiculo.modelo}: ${error.message}`);
    }
  }

  // Crear clientes
  console.log('\n👥 Creando clientes...');
  for (const cliente of clientes) {
    try {
      const created = await prisma.cliente.upsert({
        where: { email: cliente.email },
        update: cliente,
        create: cliente,
      });
      console.log(`   ✓ ${created.nombre} - ${created.email}`);
    } catch (error: any) {
      console.log(`   ✗ Error al crear ${cliente.nombre}: ${error.message}`);
    }
  }

  console.log('\n✅ Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
