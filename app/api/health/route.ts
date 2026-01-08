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
    // Verificar conexión a la base de datos usando count
    // Prisma maneja las conexiones automáticamente en serverless
    console.log('🔍 Verificando conexión a base de datos...');
    
    let vehiculosCount = 0;
    let clientesCount = 0;
    let rentasCount = 0;
    
    try {
      vehiculosCount = await prisma.vehiculo.count();
      console.log(`✅ Conteo vehículos: ${vehiculosCount}`);
    } catch (countError: any) {
      console.error('❌ Error contando vehículos:', countError);
      console.error('Error code:', countError?.code);
      console.error('Error message:', countError?.message);
      throw countError; // Relanzar para que se capture en el catch general
    }
    
    try {
      clientesCount = await prisma.cliente.count();
      console.log(`✅ Conteo clientes: ${clientesCount}`);
    } catch (error) {
      console.error('⚠️  Error contando clientes (ignorado):', error);
    }
    
    try {
      rentasCount = await prisma.renta.count();
      console.log(`✅ Conteo rentas: ${rentasCount}`);
    } catch (error) {
      console.error('⚠️  Error contando rentas (ignorado):', error);
    }
    
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

