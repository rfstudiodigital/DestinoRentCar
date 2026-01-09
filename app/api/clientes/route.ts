import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth-helpers';

// GET - Listar todos los clientes (SOLO ADMIN)
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  // Verificar que sea admin
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Acceso denegado. Solo administradores pueden ver esta información.' },
      { status: 403 }
    );
  }

  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        rentas: {
          include: {
            vehiculo: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return NextResponse.json(
      { error: 'Error al obtener clientes' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo cliente
export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { nombre, email, telefono, direccion } = body;

    // Validaciones
    if (!nombre || !email || !telefono) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        email,
        telefono,
        direccion: direccion || null,
      },
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch (error: any) {
    console.error('Error creando cliente:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un cliente con este email' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    );
  }
}

