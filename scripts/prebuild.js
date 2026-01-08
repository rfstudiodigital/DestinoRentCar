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
  // Usar la versión específica de Prisma del package.json
  execSync('npx prisma@5.16.0 generate', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('✅ Prisma Client generado exitosamente');
  
  // Si hay DATABASE_URL configurada y estamos en producción, ejecutar migraciones
  if (hasDatabaseUrl && isProduction) {
    console.log('🔄 Verificando migraciones de base de datos...');
    try {
      // Verificar si hay migraciones en el directorio
      const fs = require('fs');
      const path = require('path');
      const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
      const hasMigrations = fs.existsSync(migrationsDir) && 
                           fs.readdirSync(migrationsDir).length > 0;
      
      if (hasMigrations) {
        // Si hay migraciones, intentar aplicarlas
        execSync('npx prisma@5.16.0 migrate deploy', { 
          stdio: 'inherit',
          env: { ...process.env }
        });
        console.log('✅ Migraciones aplicadas exitosamente');
      } else {
        console.log('ℹ️  No hay migraciones en el directorio. La base de datos se sincroniza con el schema.');
      }
    } catch (migrateError) {
      // Si el error es porque la base de datos no está vacía y no hay migraciones,
      // simplemente continuamos sin fallar el build (el esquema ya está sincronizado)
      const errorMsg = migrateError.message || migrateError.toString();
      if (errorMsg.includes('P3005') || errorMsg.includes('not empty')) {
        console.log('ℹ️  La base de datos ya tiene esquema. Esto es normal si ya has usado db:push.');
        console.log('💡 Para usar migraciones en producción, crea una migración inicial localmente.');
      } else {
        console.warn('⚠️  Error ejecutando migraciones:', errorMsg);
        console.log('💡 Continuando el build. Puedes ejecutar manualmente: npx prisma migrate deploy');
      }
      // No fallar el build si las migraciones fallan
    }
  }
} catch (error) {
  console.error('❌ Error generando Prisma Client');
  if (error.message) {
    console.error('Error:', error.message);
  }
  process.exit(1);
}

