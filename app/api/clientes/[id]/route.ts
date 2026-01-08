import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener un cliente por ID (solo su propia información)
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
    const cliente = await prisma.cliente.findUnique({
      where: { id: params.id },
      include: {
        rentas: {
          where: {
            clienteId: params.id, // Solo sus propias rentas
          },
          include: {
            vehiculo: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(cliente);
  } catch (error) {
    console.error('Error obteniendo cliente:', error);
    return NextResponse.json(
      { error: 'Error al obtener cliente' },
      { status: 500 }
    );
  }
}
