import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    // TODO: Obtener clienteId del usuario autenticado
    const primeCliente = await prisma.cliente.findFirst();
    
    if (!primeCliente) {
      return NextResponse.json([]);
    }

    const notificaciones = await prisma.notificacion.findMany({
      where: { clienteId: primeCliente.id },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limitar a las últimas 50
    });

    return NextResponse.json(notificaciones);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Error al obtener notificaciones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { clienteId, mensaje, tipo } = body;

    if (!mensaje || !tipo) {
      return NextResponse.json(
        { error: 'Mensaje y tipo son requeridos' },
        { status: 400 }
      );
    }

    const notificacion = await prisma.notificacion.create({
      data: {
        clienteId,
        mensaje,
        tipo,
      },
    });

    return NextResponse.json(notificacion, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Error al crear notificación' },
      { status: 500 }
    );
  }
}
