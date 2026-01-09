import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener notificaciones del admin
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  // Verificar que sea admin
  const adminAuth = request.headers.get('x-admin-auth');
  if (!adminAuth || adminAuth !== 'true') {
    return NextResponse.json(
      { error: 'Acceso denegado' },
      { status: 403 }
    );
  }

  try {
    // Obtener todas las notificaciones de admin (adminId = 'admin')
    const notificaciones = await prisma.notificacion.findMany({
      where: {
        adminId: 'admin',
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limitar a las últimas 50
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(notificaciones);
  } catch (error: any) {
    console.error('Error obteniendo notificaciones de admin:', error);
    return NextResponse.json(
      { error: 'Error al obtener notificaciones' },
      { status: 500 }
    );
  }
}
