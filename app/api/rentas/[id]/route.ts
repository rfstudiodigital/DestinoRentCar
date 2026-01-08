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

    // Si se completa o cancela la renta, verificar si hay otras rentas activas antes de marcar como disponible
    if (estado === 'completada' || estado === 'cancelada') {
      // Verificar si hay otras rentas activas para este vehículo
      const otrasRentasActivas = await prisma.renta.count({
        where: {
          vehiculoId: renta.vehiculoId,
          estado: 'activa',
          id: { not: params.id }, // Excluir la renta actual
        },
      });

      // Solo marcar como disponible si no hay otras rentas activas
      if (otrasRentasActivas === 0) {
        await prisma.vehiculo.update({
          where: { id: renta.vehiculoId },
          data: { disponible: true },
        });
      }
    }

    // Si se activa una renta (estado cambia a 'activa'), marcar vehículo como no disponible
    if (estado === 'activa' && renta.estado !== 'activa') {
      await prisma.vehiculo.update({
        where: { id: renta.vehiculoId },
        data: { disponible: false },
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

