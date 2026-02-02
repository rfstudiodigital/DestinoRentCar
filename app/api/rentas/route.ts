import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validarFechasRenta, isAdminAuthenticated } from '@/lib/auth-helpers';

// GET - Listar todas las rentas (SOLO ADMIN)
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  // Verificar que sea admin
  if (!isAdminAuthenticated(request)) {
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

    // Validaciones básicas
    if (!clienteId || !vehiculoId || !fechaInicio || !fechaFin) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar fechas
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const validacionFechas = validarFechasRenta(inicio, fin);
    
    if (!validacionFechas.isValid) {
      return NextResponse.json(
        { error: validacionFechas.errorMessage },
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
        { error: 'El vehículo no está disponible actualmente' },
        { status: 400 }
      );
    }

    // Verificar que no haya rentas activas o pendientes en ese período
    // (las pendientes podrían ser aprobadas y conflictuar)
    const rentasConflictivas = await prisma.renta.findFirst({
      where: {
        vehiculoId,
        estado: { in: ['activa', 'pendiente'] }, // Verificar activas y pendientes
        OR: [
          {
            AND: [
              { fechaInicio: { lte: inicio } },
              { fechaFin: { gte: inicio } },
            ],
          },
          {
            AND: [
              { fechaInicio: { lte: fin } },
              { fechaFin: { gte: fin } },
            ],
          },
          {
            AND: [
              { fechaInicio: { gte: inicio } },
              { fechaFin: { lte: fin } },
            ],
          },
        ],
      },
    });

    if (rentasConflictivas) {
      return NextResponse.json(
        { 
          error: 'El vehículo ya tiene una reserva en ese período',
          detalles: `Hay una reserva ${rentasConflictivas.estado} del ${new Date(rentasConflictivas.fechaInicio).toLocaleDateString('es-ES')} al ${new Date(rentasConflictivas.fechaFin).toLocaleDateString('es-ES')}`
        },
        { status: 400 }
      );
    }

    // Calcular precio total
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
        fechaInicio: inicio,
        fechaFin: fin,
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
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creando renta:', error);
    }
    
    // Manejo de errores específicos de Prisma
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una renta con estos datos' },
        { status: 400 }
      );
    }
    
    if (error?.code === 'P2003') {
      return NextResponse.json(
        { error: 'Cliente o vehículo no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Error al crear renta',
        ...(process.env.NODE_ENV === 'development' && { 
          details: error?.message 
        })
      },
      { status: 500 }
    );
  }
}

