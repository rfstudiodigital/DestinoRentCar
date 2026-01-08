import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todos los vehículos
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
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

    return NextResponse.json(vehiculos);
  } catch (error) {
    console.error('Error obteniendo vehículos:', error);
    return NextResponse.json(
      { error: 'Error al obtener vehículos' },
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

