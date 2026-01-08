// Script para generar Prisma Client y ejecutar migraciones
const { execSync } = require('child_process');

// Verificar si DATABASE_URL está definida
const hasDatabaseUrl = !!process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

if (!hasDatabaseUrl) {
  console.log('⚠️  DATABASE_URL no está configurada. Usando URL temporal para generar Prisma Client...');
  
  // URL temporal solo para generar el cliente Prisma (no se usará para conexiones reales)
  // Prisma solo necesita esta URL para validar el schema, no se conecta realmente
  const tempDatabaseUrl = 'postgresql://user:password@localhost:5432/tempdb?sslmode=disable';
  
  // Establecer temporalmente DATABASE_URL para prisma generate
  process.env.DATABASE_URL = tempDatabaseUrl;
  console.log('✅ URL temporal configurada para la generación del cliente');
}

try {
  console.log('📦 Generando Prisma Client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('✅ Prisma Client generado exitosamente');
  
  // Si hay DATABASE_URL configurada y estamos en producción, ejecutar migraciones
  if (hasDatabaseUrl && isProduction) {
    console.log('🔄 Ejecutando migraciones de base de datos...');
    try {
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit',
        env: { ...process.env }
      });
      console.log('✅ Migraciones aplicadas exitosamente');
    } catch (migrateError) {
      console.warn('⚠️  Error ejecutando migraciones:', migrateError.message);
      console.log('💡 Si es la primera vez, puedes ejecutar manualmente: npx prisma migrate deploy');
      // No fallar el build si las migraciones fallan (podría ser que ya están aplicadas)
    }
  }
} catch (error) {
  console.error('❌ Error generando Prisma Client');
  if (error.message) {
    console.error('Error:', error.message);
  }
  process.exit(1);
}

