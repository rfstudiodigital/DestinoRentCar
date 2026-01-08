// API para gestionar imágenes de vehículos
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const imagenes = await prisma?.imagenVehiculo.findMany({
      where: {
        vehiculoId: params.id,
      },
      orderBy: [
        { esPortada: 'desc' },
        { orden: 'asc' },
      ],
    });

    return NextResponse.json(imagenes || []);
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
  try {
    const body = await request.json();
    const { url, orden = 0, esPortada = false } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL de imagen requerida' },
        { status: 400 }
      );
    }

    const imagen = await prisma?.imagenVehiculo.create({
      data: {
        vehiculoId: params.id,
        url,
        orden,
        esPortada,
      },
    });

    return NextResponse.json(imagen);
  } catch (error) {
    console.error('Error al crear imagen:', error);
    return NextResponse.json(
      { error: 'Error al crear imagen' },
      { status: 500 }
    );
  }
}
