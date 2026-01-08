import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test 1: Verificar Prisma Client
    if (!prisma) {
      return NextResponse.json({
        test: 'failed',
        step: 'prisma_client',
        error: 'Prisma client no disponible',
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        suggestion: 'Verifica que DATABASE_URL esté configurada en Vercel',
      }, { status: 500 });
    }

    // Test 2: Verificar conexión con query simple
    try {
      const testQuery = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('✅ Test query exitoso:', testQuery);
    } catch (queryError: any) {
      return NextResponse.json({
        test: 'failed',
        step: 'connection',
        error: queryError.message,
        code: queryError.code,
        suggestion: queryError.message.includes('SSL') 
          ? 'Agrega ?sslmode=require a tu DATABASE_URL'
          : queryError.message.includes('timeout')
          ? 'Verifica que Neon esté activo y usa la URL con pooler'
          : 'Verifica la conexión a la base de datos',
      }, { status: 500 });
    }

    // Test 3: Verificar si existe la tabla Vehiculo
    try {
      const count = await prisma.vehiculo.count();
      return NextResponse.json({
        test: 'success',
        step: 'all_tests',
        vehiculos: count,
        message: count === 0 
          ? 'La tabla existe pero está vacía. Ejecuta: npm run db:seed'
          : `Base de datos funcionando correctamente con ${count} vehículos`,
      });
    } catch (tableError: any) {
      if (tableError.code === 'P2021' || tableError.message.includes('does not exist')) {
        return NextResponse.json({
          test: 'failed',
          step: 'table_exists',
          error: 'La tabla Vehiculo no existe',
          suggestion: 'Ejecuta: npx prisma db push (localmente) o verifica que las migraciones se hayan aplicado en producción',
        }, { status: 500 });
      }
      
      return NextResponse.json({
        test: 'failed',
        step: 'query_table',
        error: tableError.message,
        code: tableError.code,
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      test: 'failed',
      step: 'unknown',
      error: error.message || 'Error desconocido',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}