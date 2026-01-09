import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todos los vehículos
export async function GET(request: NextRequest) {
  if (!prisma) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Prisma client no disponible. DATABASE_URL:', !!process.env.DATABASE_URL);
    }
    return NextResponse.json(
      { 
        error: 'Base de datos no configurada',
        message: 'DATABASE_URL no está configurada en las variables de entorno',
      },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const soloDisponibles = searchParams.get('disponible') === 'true';

    const where = soloDisponibles ? { disponible: true } : {};

    const vehiculos = await prisma.vehiculo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(vehiculos, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('Error obteniendo vehículos:', error);
    
    // Mensajes específicos según el código de error de Prisma
    let userMessage = 'Error al obtener vehículos';
    let suggestion = '';
    
    if (error?.code === 'P2021') {
      userMessage = 'La tabla Vehiculo no existe en la base de datos';
      suggestion = 'Ejecuta el script SQL en Neon Console para crear las tablas';
    } else if (error?.code === 'P2022') {
      userMessage = 'El schema de Prisma no está sincronizado con la base de datos';
      suggestion = 'Ejecuta: npx prisma db push';
    } else if (error?.code === 'P1001' || error?.code === 'P1008' || error?.code === 'P1017') {
      userMessage = 'Error de conexión a la base de datos';
      suggestion = 'Verifica que Neon esté activo y la URL de conexión sea correcta';
    } else if (error?.message?.includes('SSL') || error?.message?.includes('ssl')) {
      userMessage = 'Error SSL: Se requiere conexión segura';
      suggestion = 'Agrega ?sslmode=require a tu DATABASE_URL';
    }
    
    return NextResponse.json(
      { 
        error: userMessage,
        ...(suggestion && { suggestion }),
        ...(process.env.NODE_ENV === 'development' && { 
          details: error?.message,
          code: error?.code,
        }),
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

