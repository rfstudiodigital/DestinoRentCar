import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener un vehículo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: params.id },
      include: {
        rentas: {
          where: { estado: { in: ['activa', 'pendiente'] } },
          include: { cliente: true },
          orderBy: { fechaInicio: 'asc' },
        },
      },
    });

    if (!vehiculo) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(vehiculo);
  } catch (error) {
    console.error('Error obteniendo vehículo:', error);
    return NextResponse.json(
      { error: 'Error al obtener vehículo' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar vehículo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { marca, modelo, anio, placa, color, precioDiario, imagen, descripcion, disponible } = body;

    const vehiculo = await prisma.vehiculo.update({
      where: { id: params.id },
      data: {
        ...(marca && { marca }),
        ...(modelo && { modelo }),
        ...(anio && { anio: parseInt(anio) }),
        ...(placa && { placa }),
        ...(color && { color }),
        ...(precioDiario && { precioDiario: parseFloat(precioDiario) }),
        ...(imagen !== undefined && { imagen }),
        ...(descripcion !== undefined && { descripcion }),
        ...(disponible !== undefined && { disponible }),
      },
    });

    return NextResponse.json(vehiculo);
  } catch (error: any) {
    console.error('Error actualizando vehículo:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un vehículo con esta placa' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al actualizar vehículo' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar vehículo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    // Verificar si tiene rentas activas
    const rentasActivas = await prisma.renta.count({
      where: {
        vehiculoId: params.id,
        estado: 'activa',
      },
    });

    if (rentasActivas > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un vehículo con rentas activas' },
        { status: 400 }
      );
    }

    await prisma.vehiculo.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Vehículo eliminado correctamente' });
  } catch (error: any) {
    console.error('Error eliminando vehículo:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Error al eliminar vehículo' },
      { status: 500 }
    );
  }
}

