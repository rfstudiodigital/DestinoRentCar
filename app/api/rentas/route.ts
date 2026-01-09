import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todas las rentas (SOLO ADMIN)
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  // Verificar que sea admin (desde headers o cookie)
  // En producción, usarías un token JWT o sesión segura
  // Por ahora, verificamos desde el header
  const adminAuth = request.headers.get('x-admin-auth');
  
  // Si no hay header, verificar desde cookie o rechazar
  // Por seguridad, solo permitir si viene del panel admin
  if (!adminAuth || adminAuth !== 'true') {
    return NextResponse.json(
      { error: 'Acceso denegado. Solo administradores pueden ver esta información.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    const clienteId = searchParams.get('clienteId');
    const vehiculoId = searchParams.get('vehiculoId');

    const where: any = {};
    if (estado) where.estado = estado;
    if (clienteId) where.clienteId = clienteId;
    if (vehiculoId) where.vehiculoId = vehiculoId;

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

    // Obtener información del cliente
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    // Crear la renta con estado pendiente
    const renta = await prisma.renta.create({
      data: {
        clienteId,
        vehiculoId,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        precioTotal,
        observaciones: observaciones || null,
        estado: 'pendiente', // Estado inicial pendiente, el admin debe aprobar
      },
      include: {
        cliente: true,
        vehiculo: true,
      },
    });

    // Crear notificación para el ADMIN sobre la nueva reserva
    try {
      await prisma.notificacion.create({
        data: {
          adminId: 'admin', // Para todas las notificaciones de admin
          tipo: 'nueva_reserva',
          titulo: 'Nueva Reserva Solicitada',
          mensaje: `${cliente.nombre} ha solicitado una reserva para ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa}) del ${inicio.toLocaleDateString('es-ES')} al ${fin.toLocaleDateString('es-ES')}. Total: ${precioTotal.toLocaleString('es-UY', { style: 'currency', currency: 'UYU' })}`,
          url: '/admin?tab=rentas',
          rentaId: renta.id,
          leida: false,
        },
      });
    } catch (notifError) {
      // Si falla la notificación, no romper el flujo de creación de renta
      console.error('Error creando notificación para admin:', notifError);
    }

    // Crear notificación para el CLIENTE
    try {
      await prisma.notificacion.create({
        data: {
          clienteId: cliente.id,
          tipo: 'reserva_enviada',
          titulo: 'Reserva Enviada',
          mensaje: `Tu reserva para ${vehiculo.marca} ${vehiculo.modelo} ha sido enviada. Esperando confirmación del administrador.`,
          url: '/rentas',
          rentaId: renta.id,
          leida: false,
        },
      });
    } catch (notifError) {
      console.error('Error creando notificación para cliente:', notifError);
    }

    // NO marcar vehículo como no disponible todavía
    // El vehículo solo se marcará como no disponible cuando el admin apruebe la reserva

    return NextResponse.json(renta, { status: 201 });
  } catch (error: any) {
    console.error('Error creando renta:', error);
    return NextResponse.json(
      { error: 'Error al crear renta' },
      { status: 500 }
    );
  }
}

