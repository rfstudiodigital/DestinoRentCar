import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todos los vehículos
export async function GET(request: NextRequest) {
  if (!prisma) {
    console.error('❌ Prisma client no disponible. DATABASE_URL:', !!process.env.DATABASE_URL);
    return NextResponse.json(
      { 
        error: 'Base de datos no configurada',
        message: 'DATABASE_URL no está configurada en las variables de entorno'
      },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const soloDisponibles = searchParams.get('disponible') === 'true';

    const where = soloDisponibles ? { disponible: true } : {};

    console.log('🔍 Buscando vehículos con filtro:', JSON.stringify(where));
    console.log('📊 Prisma client estado:', prisma ? 'disponible' : 'no disponible');

    // Verificar que prisma esté disponible antes de usarlo
    if (!prisma) {
      throw new Error('Prisma client no está disponible');
    }

    // Intentar query simple primero para verificar conexión
    let vehiculos: any[] = [];
    
    try {
      vehiculos = await prisma.vehiculo.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      console.log(`✅ Vehículos encontrados: ${vehiculos.length}`);
    } catch (queryError: any) {
      console.error('❌ Error en query findMany:', queryError);
      console.error('Error code:', queryError?.code);
      console.error('Error message:', queryError?.message);
      
      // Si es un error de tabla no encontrada, informar mejor
      if (queryError?.code === 'P2021' || queryError?.message?.includes('does not exist')) {
        throw new Error('La tabla Vehiculo no existe. Ejecuta: npx prisma db push');
      }
      
      throw queryError;
    }
    
    if (vehiculos.length === 0) {
      console.log('⚠️  No se encontraron vehículos en la base de datos');
      
      // Verificar si la tabla existe y tiene algún registro
      try {
        const totalCount = await prisma.vehiculo.count();
        console.log(`📊 Total de vehículos en BD: ${totalCount}`);
      } catch (countError: any) {
        console.error('❌ Error contando vehículos:', countError);
        if (countError?.code === 'P2021') {
          throw new Error('La tabla Vehiculo no existe. Ejecuta: npx prisma db push');
        }
      }
    }

    return NextResponse.json(vehiculos, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('❌ Error obteniendo vehículos:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorCode = (error as any)?.code;
    const errorName = (error as any)?.name;
    
    console.error('❌ Error name:', errorName);
    console.error('❌ Error code:', errorCode);
    console.error('❌ Stack trace:', errorStack);
    
    return NextResponse.json(
      { 
        error: 'Error al obtener vehículos',
        message: errorMessage,
        code: errorCode,
        name: errorName,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack }),
      },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo vehículo
export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { marca, modelo, anio, placa, color, precioDiario, imagen, descripcion } = body;

    // Validaciones
    if (!marca || !modelo || !anio || !placa || !color || !precioDiario) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const vehiculo = await prisma.vehiculo.create({
      data: {
        marca,
        modelo,
        anio: parseInt(anio),
        placa,
        color,
        precioDiario: parseFloat(precioDiario),
        imagen: imagen || null,
        descripcion: descripcion || null,
        disponible: true,
      },
    });

    return NextResponse.json(vehiculo, { status: 201 });
  } catch (error: any) {
    console.error('Error creando vehículo:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un vehículo con esta placa' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al crear vehículo' },
      { status: 500 }
    );
  }
}

