// API para gestionar imágenes de vehículos
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
    // Obtener el vehículo para acceder a su campo imagen
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: params.id },
      select: { imagen: true },
    });

    if (!vehiculo) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }

    // Convertir el campo imagen (singular) a un array de imágenes
    // Si hay imagen, la retornamos como array, si no, retornamos array vacío
    const imagenes = vehiculo.imagen
      ? [
          {
            id: 'main',
            url: vehiculo.imagen,
            alt: 'Imagen principal del vehículo',
            esPortada: true,
            orden: 0,
          },
        ]
      : [];

    return NextResponse.json(imagenes);
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    return NextResponse.json(
      { error: 'Error al obtener imágenes' },
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
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL de imagen requerida' },
        { status: 400 }
      );
    }

    // Actualizar el campo imagen del vehículo (ya que no tenemos tabla separada)
    const vehiculo = await prisma.vehiculo.update({
      where: { id: params.id },
      data: { imagen: url },
    });

    // Retornar en el formato esperado
    return NextResponse.json({
      id: 'main',
      url: vehiculo.imagen,
      alt: 'Imagen principal del vehículo',
      esPortada: true,
      orden: 0,
    });
  } catch (error: any) {
    console.error('Error al crear imagen:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Error al crear imagen' },
      { status: 500 }
    );
  }
}
