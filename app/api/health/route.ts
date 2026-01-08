import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  
  // Si no hay DATABASE_URL configurada, retornar que no está conectada
  if (!hasDatabaseUrl || !prisma) {
    return NextResponse.json({
      status: 'ok',
      database: 'not_configured',
      message: 'DATABASE_URL no está configurada. Configúrala en Vercel para habilitar la base de datos.',
      timestamp: new Date().toISOString(),
    });
  }
  
  try {
    // Verificar conexión a la base de datos
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

