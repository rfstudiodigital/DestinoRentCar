import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
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
    const { leida } = body;

    const notificacion = await prisma.notificacion.update({
      where: { id: params.id },
      data: { leida },
    });

    return NextResponse.json(notificacion);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Error al actualizar notificación' },
      { status: 500 }
    );
  }
}
