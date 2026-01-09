import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    // Verificar si es admin o cliente
    const adminAuth = request.headers.get('x-admin-auth');
    
    if (adminAuth === 'true') {
      // Si es admin, marcar todas las notificaciones de admin
      await prisma.notificacion.updateMany({
        where: { adminId: 'admin', leida: false },
        data: { leida: true },
      });
    } else {
      // Si es cliente, obtener clienteId desde query params
      const { searchParams } = new URL(request.url);
      const clienteId = searchParams.get('clienteId');
      
      if (!clienteId) {
        return NextResponse.json(
          { error: 'clienteId es requerido para clientes' },
          { status: 400 }
        );
      }

      await prisma.notificacion.updateMany({
        where: { clienteId: clienteId, leida: false, adminId: null },
        data: { leida: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking all as read:', error);
    return NextResponse.json(
      { error: 'Error al marcar notificaciones' },
      { status: 500 }
    );
  }
}
