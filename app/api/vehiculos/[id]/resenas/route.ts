import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    // El modelo Resena no existe en el schema actual
    // Retornar array vacío hasta que se implemente el modelo
    const resenas: any[] = [];
    const promedio = 0;

    return NextResponse.json({ resenas, promedio });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Error al obtener reseñas' },
      { status: 500 }
    );
  }
}

export async function POST(
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
    // El modelo Resena no existe en el schema actual
    // Retornar error informativo hasta que se implemente el modelo
    return NextResponse.json(
      { 
        error: 'Funcionalidad de reseñas no disponible',
        message: 'El modelo de reseñas aún no está implementado en la base de datos'
      },
      { status: 501 } // 501 Not Implemented
    );
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Error al crear reseña' },
      { status: 500 }
    );
  }
}
