import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const debug: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlFormat: process.env.DATABASE_URL 
      ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@') // Ocultar contraseña
      : null,
    hasPrisma: !!prisma,
  };

  // Verificar formato de DATABASE_URL
  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    debug.databaseUrlInfo = {
      startsWithPostgres: url.startsWith('postgresql://'),
      hasSslMode: url.includes('sslmode'),
      hasPgBouncer: url.includes('pgbouncer'),
      hasConnectionLimit: url.includes('connection_limit'),
      hasPooling: url.includes('pooler') || url.includes('pgbouncer'),
      isNeon: url.includes('neon.tech') || url.includes('neon'),
    };
  }

  if (!prisma) {
    return NextResponse.json({
      ...debug,
      error: 'Prisma client no disponible',
      suggestions: [
        'Verifica que DATABASE_URL esté configurada en Vercel',
        'Verifica el formato de DATABASE_URL',
        'Revisa los logs de build en Vercel',
      ],
    });
  }

  try {
    // Intentar conectar
    await prisma.$connect();
    debug.connectionStatus = 'connected';

    // Intentar una query simple
    try {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      debug.rawQueryTest = 'success';
      debug.rawQueryResult = result;
    } catch (error) {
      debug.rawQueryTest = 'failed';
      debug.rawQueryError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Intentar contar vehículos
    try {
      const vehiculosCount = await prisma.vehiculo.count();
      debug.vehiculosCount = vehiculosCount;
      debug.vehiculosTableExists = true;
    } catch (error: any) {
      debug.vehiculosTableExists = false;
      debug.vehiculosError = error.message;
      
      if (error.code === 'P2021' || error.message.includes('does not exist')) {
        debug.suggestions = [
          'La tabla Vehiculo no existe',
          'Ejecuta: npx prisma db push',
          'O crea una migración: npx prisma migrate dev --name init',
        ];
      }
    }

    // Intentar obtener un vehículo
    try {
      const vehiculos = await prisma.vehiculo.findMany({ take: 1 });
      debug.sampleQuery = 'success';
      debug.sampleData = vehiculos.length > 0 ? {
        id: vehiculos[0].id,
        marca: vehiculos[0].marca,
        modelo: vehiculos[0].modelo,
      } : null;
    } catch (error) {
      debug.sampleQuery = 'failed';
      debug.sampleError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Contar todas las tablas
    try {
      const clientesCount = await prisma.cliente.count();
      const rentasCount = await prisma.renta.count();
      debug.tableCounts = {
        vehiculos: debug.vehiculosCount || 0,
        clientes: clientesCount,
        rentas: rentasCount,
      };
    } catch (error) {
      // Ignorar errores de otras tablas
    }

    await prisma.$disconnect().catch(() => {});

    return NextResponse.json({
      ...debug,
      status: 'ok',
    });
  } catch (error) {
    debug.connectionStatus = 'failed';
    debug.connectionError = error instanceof Error ? error.message : 'Unknown error';
    debug.connectionStack = error instanceof Error ? error.stack : undefined;

    // Sugerencias basadas en el error
    if (error instanceof Error) {
      if (error.message.includes('SSL') || error.message.includes('ssl')) {
        debug.suggestions = [
          'Error SSL - Agrega ?sslmode=require a tu DATABASE_URL',
          'Formato: postgresql://user:pass@host/db?sslmode=require',
        ];
      } else if (error.message.includes('timeout')) {
        debug.suggestions = [
          'Timeout de conexión',
          'Verifica que la base de datos Neon esté activa',
          'Agrega ?connect_timeout=15 a tu DATABASE_URL',
        ];
      } else if (error.message.includes('password') || error.message.includes('authentication')) {
        debug.suggestions = [
          'Error de autenticación',
          'Verifica las credenciales en DATABASE_URL',
          'Obtén una nueva URL de conexión desde Neon',
        ];
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        debug.suggestions = [
          'No se puede resolver el hostname',
          'Verifica que la URL de conexión sea correcta',
          'Verifica tu conexión a internet',
        ];
      }
    }

    return NextResponse.json({
      ...debug,
      status: 'error',
    }, { status: 500 });
  }
}