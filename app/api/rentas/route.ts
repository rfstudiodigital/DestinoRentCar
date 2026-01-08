import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todas las rentas
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    const clienteId = searchParams.get('clienteId');

    const where: any = {};
    if (estado) where.estado = estado;
    if (clienteId) where.clienteId = clienteId;

    const rentas = await prisma.renta.findMany({
      where,
      include: {
        cliente: true,
        vehiculo: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(rentas);
  } catch (error) {
    console.error('Error obteniendo rentas:', error);
    return NextResponse.json(
      { error: 'Error al obtener rentas' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva renta
export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { clienteId, vehiculoId, fechaInicio, fechaFin, observaciones } = body;

    // Validaciones
    if (!clienteId || !vehiculoId || !fechaInicio || !fechaFin) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el vehículo esté disponible
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: vehiculoId },
    });

    if (!vehiculo) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }

    if (!vehiculo.disponible) {
      return NextResponse.json(
        { error: 'El vehículo no está disponible' },
        { status: 400 }
      );
    }

    // Verificar que no haya rentas activas en ese período
    const rentasConflictivas = await prisma.renta.findFirst({
      where: {
        vehiculoId,
        estado: 'activa',
        OR: [
          {
            AND: [
              { fechaInicio: { lte: new Date(fechaInicio) } },
              { fechaFin: { gte: new Date(fechaInicio) } },
            ],
          },
          {
            AND: [
              { fechaInicio: { lte: new Date(fechaFin) } },
              { fechaFin: { gte: new Date(fechaFin) } },
            ],
          },
          {
            AND: [
              { fechaInicio: { gte: new Date(fechaInicio) } },
              { fechaFin: { lte: new Date(fechaFin) } },
            ],
          },
        ],
      },
    });

    if (rentasConflictivas) {
      return NextResponse.json(
        { error: 'El vehículo ya está rentado en ese período' },
        { status: 400 }
      );
    }

    // Calcular precio total
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    const precioTotal = dias * vehiculo.precioDiario;

    // Crear la renta
    const renta = await prisma.renta.create({
      data: {
        clienteId,
        vehiculoId,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        precioTotal,
        observaciones: observaciones || null,
        estado: 'activa',
      },
      include: {
        cliente: true,
        vehiculo: true,
      },
    });

    // Marcar vehículo como no disponible
    await prisma.vehiculo.update({
      where: { id: vehiculoId },
      data: { disponible: false },
    });

    return NextResponse.json(renta, { status: 201 });
  } catch (error: any) {
    console.error('Error creando renta:', error);
    return NextResponse.json(
      { error: 'Error al crear renta' },
      { status: 500 }
    );
  }
}

