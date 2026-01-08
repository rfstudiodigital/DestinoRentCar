import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Actualizar renta (cambiar estado, etc.)
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
    const { estado, observaciones } = body;

    const renta = await prisma.renta.findUnique({
      where: { id: params.id },
      include: { vehiculo: true },
    });

    if (!renta) {
      return NextResponse.json(
        { error: 'Renta no encontrada' },
        { status: 404 }
      );
    }

    // Si se completa o cancela la renta, marcar vehículo como disponible
    if (estado === 'completada' || estado === 'cancelada') {
      await prisma.vehiculo.update({
        where: { id: renta.vehiculoId },
        data: { disponible: true },
      });
    }

    const rentaActualizada = await prisma.renta.update({
      where: { id: params.id },
      data: {
        ...(estado && { estado }),
        ...(observaciones !== undefined && { observaciones }),
      },
      include: {
        cliente: true,
        vehiculo: true,
      },
    });

    return NextResponse.json(rentaActualizada);
  } catch (error: any) {
    console.error('Error actualizando renta:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Renta no encontrada' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Error al actualizar renta' },
      { status: 500 }
    );
  }
}

