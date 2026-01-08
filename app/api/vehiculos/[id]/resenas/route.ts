import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resenas = await prisma.resena.findMany({
      where: { vehiculoId: params.id },
      include: {
        cliente: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const promedio = resenas.length > 0
      ? resenas.reduce((sum: number, r: any) => sum + r.calificacion, 0) / resenas.length
      : 0;

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
  try {
    const body = await request.json();
    const { calificacion, comentario } = body;

    // Validaciones
    if (!calificacion || calificacion < 1 || calificacion > 5) {
      return NextResponse.json(
        { error: 'Calificación debe estar entre 1 y 5' },
        { status: 400 }
      );
    }

    if (!comentario || comentario.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comentario debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    // TODO: Obtener clienteId del usuario autenticado
    // Por ahora, usamos el primer cliente de prueba
    const primeCliente = await prisma.cliente.findFirst();
    
    if (!primeCliente) {
      return NextResponse.json(
        { error: 'No se encontró cliente' },
        { status: 404 }
      );
    }

    const resena = await prisma.resena.create({
      data: {
        vehiculoId: params.id,
        clienteId: primeCliente.id,
        calificacion,
        comentario: comentario.trim(),
      },
      include: {
        cliente: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
      },
    });

    // Actualizar calificación promedio del vehículo
    const todasResenas = await prisma.resena.findMany({
      where: { vehiculoId: params.id },
      select: { calificacion: true },
    });

    const nuevoPromedio = todasResenas.reduce((sum: number, r: any) => sum + r.calificacion, 0) / todasResenas.length;

    await prisma.vehiculo.update({
      where: { id: params.id },
      data: { calificacionPromedio: nuevoPromedio },
    });

    return NextResponse.json(resena, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Error al crear reseña' },
      { status: 500 }
    );
  }
}
