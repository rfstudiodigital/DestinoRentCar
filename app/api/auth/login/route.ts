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
    // Verificar si el modelo Admin existe en Prisma Client
    let admin;
    try {
      // @ts-expect-error - Admin model may not be available until db is synced
      admin = await prisma.admin.findUnique({
        where: { email },
      });
    } catch (prismaError: any) {
      // Si hay un error al acceder al modelo Admin, probablemente la tabla no existe
      console.error('Error accediendo a tabla Admin:', prismaError);
      if (prismaError.code === 'P2001' || prismaError.message?.includes('does not exist')) {
        return NextResponse.json(
          { error: 'La tabla Admin no existe en la base de datos. Ejecuta el script SQL para crearla.' },
          { status: 500 }
        );
      }
      throw prismaError;
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
