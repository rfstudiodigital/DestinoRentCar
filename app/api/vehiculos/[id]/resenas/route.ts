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
    const resenas = await prisma.resena.findMany({
      where: { vehiculoId: params.id },
      include: {
        cliente: {
          select: {
            nombre: true,
            email: true,
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
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { calificacion, comentario, rentaId } = body;

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

    // Si no se proporciona rentaId, buscar una renta del cliente para este vehículo
    let rentaIdFinal = rentaId;
    if (!rentaIdFinal) {
      const renta = await prisma.renta.findFirst({
        where: {
          clienteId: primeCliente.id,
          vehiculoId: params.id,
          estado: { in: ['completada', 'activa'] },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!renta) {
        return NextResponse.json(
          { error: 'Debes tener una renta activa o completada de este vehículo para dejar una reseña' },
          { status: 400 }
        );
      }

      rentaIdFinal = renta.id;
    }

    // Verificar que la renta existe y pertenece al cliente
    const renta = await prisma.renta.findUnique({
      where: { id: rentaIdFinal },
    });

    if (!renta) {
      return NextResponse.json(
        { error: 'Renta no encontrada' },
        { status: 404 }
      );
    }

    if (renta.clienteId !== primeCliente.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para dejar una reseña en esta renta' },
        { status: 403 }
      );
    }

    if (renta.vehiculoId !== params.id) {
      return NextResponse.json(
        { error: 'La renta no corresponde a este vehículo' },
        { status: 400 }
      );
    }

    // Verificar si ya existe una reseña para esta renta
    const resenaExistente = await prisma.resena.findUnique({
      where: { rentaId: rentaIdFinal },
    });

    if (resenaExistente) {
      return NextResponse.json(
        { error: 'Ya existe una reseña para esta renta' },
        { status: 400 }
      );
    }

    const resena = await prisma.resena.create({
      data: {
        rentaId: rentaIdFinal,
        vehiculoId: params.id,
        clienteId: primeCliente.id,
        calificacion,
        comentario: comentario.trim(),
      },
      include: {
        cliente: {
          select: {
            nombre: true,
            email: true,
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
