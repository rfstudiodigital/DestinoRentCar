import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Login de administrador
export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validaciones
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar admin por email
    let admin: any = null;
    
    try {
      admin = await prisma.admin.findUnique({
        where: { email },
      });
    } catch (error: any) {
      console.error('Error accediendo a tabla Admin:', error);
      // Verificar si el error es porque la tabla no existe
      if (error.message?.includes('does not exist') || 
          error.message?.includes('relation') ||
          error.code === '42P01') {
        return NextResponse.json(
          { 
            error: 'La tabla Admin no existe en la base de datos. Por favor, ejecuta el script SQL en Neon Console para crearla.',
            details: 'Ejecuta el código SQL del archivo scripts/admin-init.sql en el SQL Editor de Neon'
          },
          { status: 500 }
        );
      }
      throw error;
    }

    if (!admin) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Comparar contraseña (simple comparación para demo)
    // En producción, deberías usar bcrypt para hash
    if (admin.password !== password) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Crear respuesta exitosa (sin enviar la contraseña)
    const { password: _, ...adminWithoutPassword } = admin;

    return NextResponse.json({
      success: true,
      admin: adminWithoutPassword,
    });
  } catch (error: any) {
    console.error('Error en login:', error);
    
    // Dar mensajes de error más específicos
    let errorMessage = 'Error al procesar el login';
    
    if (error.code === 'P2001' || error.message?.includes('does not exist')) {
      errorMessage = 'La tabla Admin no existe en la base de datos. Por favor, ejecuta el script SQL para crearla.';
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
