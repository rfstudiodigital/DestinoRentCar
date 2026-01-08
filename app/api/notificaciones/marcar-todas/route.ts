import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // TODO: Obtener clienteId del usuario autenticado
    const primeCliente = await prisma.cliente.findFirst();
    
    if (!primeCliente) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    await prisma.notificacion.updateMany({
      where: { 
        clienteId: primeCliente.id,
        leida: false 
      },
      data: { leida: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking all as read:', error);
    return NextResponse.json(
      { error: 'Error al marcar notificaciones' },
      { status: 500 }
    );
  }
}
