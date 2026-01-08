import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Login de cliente (solo requiere email)
export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { email } = body;

    // Validaciones
    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Buscar cliente por email
    const cliente = await prisma.cliente.findUnique({
      where: { email },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: 'No encontramos una cuenta con este email. Por favor, regístrate primero.' },
        { status: 404 }
      );
    }

    // Crear respuesta exitosa
    return NextResponse.json({
      success: true,
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
      },
    });
  } catch (error: any) {
    console.error('Error en login de cliente:', error);
    
    let errorMessage = 'Error al procesar el login';
    
    if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
