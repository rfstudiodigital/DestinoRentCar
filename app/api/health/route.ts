import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  
  // Si no hay DATABASE_URL configurada, retornar que no está conectada
  if (!hasDatabaseUrl || !prisma) {
    return NextResponse.json({
      status: 'warning',
      database: 'not_configured',
      message: 'DATABASE_URL no está configurada. Configúrala en Vercel para habilitar la base de datos.',
      hasDatabaseUrl,
      hasPrisma: !!prisma,
      timestamp: new Date().toISOString(),
    });
  }
  
  try {
    // Verificar conexión a la base de datos
    await prisma.$queryRaw`SELECT 1`;
    
    // Intentar obtener conteo de vehículos para verificar que hay datos
    const vehiculosCount = await prisma.vehiculo.count().catch(() => 0);
    const clientesCount = await prisma.cliente.count().catch(() => 0);
    const rentasCount = await prisma.renta.count().catch(() => 0);
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      data: {
        vehiculos: vehiculosCount,
        clientes: clientesCount,
        rentas: rentasCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

