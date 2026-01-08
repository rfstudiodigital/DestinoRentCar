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

    // Test 2: Verificar conexión y tabla Vehiculo con count
    // Usamos count directamente para verificar tanto conexión como existencia de tabla
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
      console.error('❌ Error en test-db:', tableError);
      
      // Error de tabla no existe
      if (tableError.code === 'P2021' || tableError.message?.includes('does not exist')) {
        return NextResponse.json({
          test: 'failed',
          step: 'table_exists',
          error: 'La tabla Vehiculo no existe',
          code: tableError.code,
          suggestion: 'Ejecuta: npx prisma db push (localmente) o verifica que las migraciones se hayan aplicado en producción',
        }, { status: 500 });
      }
      
      // Error de conexión SSL
      if (tableError.message?.includes('SSL') || tableError.message?.includes('ssl')) {
        return NextResponse.json({
          test: 'failed',
          step: 'connection',
          error: tableError.message,
          code: tableError.code,
          suggestion: 'Agrega ?sslmode=require a tu DATABASE_URL\nFormato: postgresql://user:pass@host/db?sslmode=require',
        }, { status: 500 });
      }
      
      // Error de timeout
      if (tableError.message?.includes('timeout')) {
        return NextResponse.json({
          test: 'failed',
          step: 'connection',
          error: tableError.message,
          code: tableError.code,
          suggestion: 'Verifica que Neon esté activo y usa la URL con pooler\nEjemplo: ep-xxx-pooler.us-east-2.aws.neon.tech',
        }, { status: 500 });
      }
      
      // Error de autenticación
      if (tableError.message?.includes('password') || tableError.message?.includes('authentication')) {
        return NextResponse.json({
          test: 'failed',
          step: 'connection',
          error: tableError.message,
          code: tableError.code,
          suggestion: 'Verifica las credenciales en DATABASE_URL\nObtén una nueva URL de conexión desde Neon',
        }, { status: 500 });
      }
      
      // Otro error
      return NextResponse.json({
        test: 'failed',
        step: 'query_table',
        error: tableError.message || 'Error desconocido',
        code: tableError.code,
        suggestion: 'Revisa los logs en Vercel para más detalles',
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