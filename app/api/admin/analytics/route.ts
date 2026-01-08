import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const periodo = searchParams.get('periodo') || 'mes';

    // Obtener todas las rentas
    const rentas = await prisma.renta.findMany({
      include: {
        vehiculo: {
          select: {
            marca: true,
            modelo: true,
            anio: true,
          },
        },
      },
    });

    // KPIs
    const totalRentas = rentas.length;
    const ingresos = rentas.reduce((sum: number, r: any) => sum + r.precioTotal, 0);
    const vehiculosActivos = await prisma.vehiculo.count({ where: { disponible: true } });
    const clientesActivos = await prisma.cliente.count();

    // Rentas por mes (últimos 6 meses)
    const hoy = new Date();
    const mesesAtras = periodo === 'mes' ? 6 : periodo === 'trimestre' ? 12 : 24;
    const fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - mesesAtras, 1);

    const rentasPorMes = [];
    for (let i = 0; i < mesesAtras; i++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const mesNombre = fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      
      const rentasMes = rentas.filter((r: any) => {
        const fechaRenta = new Date(r.createdAt);
        return fechaRenta.getMonth() === fecha.getMonth() && fechaRenta.getFullYear() === fecha.getFullYear();
      });

      rentasPorMes.unshift({
        mes: mesNombre,
        cantidad: rentasMes.length,
        ingresos: rentasMes.reduce((sum: number, r: any) => sum + r.precioTotal, 0),
      });
    }

    // Vehículos más rentados
    const vehiculosMap = new Map<string, number>();
    rentas.forEach((r: any) => {
      const key = `${r.vehiculo.marca} ${r.vehiculo.modelo}`;
      vehiculosMap.set(key, (vehiculosMap.get(key) || 0) + 1);
    });

    const vehiculosMasRentados = Array.from(vehiculosMap.entries())
      .map(([vehiculo, rentas]) => ({ vehiculo, rentas }))
      .sort((a, b) => b.rentas - a.rentas)
      .slice(0, 5);

    // Estados de rentas
    const estadosMap = new Map<string, number>();
    rentas.forEach((r: any) => {
      estadosMap.set(r.estado, (estadosMap.get(r.estado) || 0) + 1);
    });

    const estadosRentas = Array.from(estadosMap.entries())
      .map(([estado, cantidad]) => ({ estado, cantidad }));

    const analytics = {
      totalRentas,
      ingresos,
      vehiculosActivos,
      clientesActivos,
      rentasPorMes,
      vehiculosMasRentados,
      estadosRentas,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Error al obtener analíticas' },
      { status: 500 }
    );
  }
}
