import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined;
};

// Verificar si DATABASE_URL está configurada
const hasDatabaseUrl = !!process.env.DATABASE_URL;

// Solo crear PrismaClient si DATABASE_URL está configurada
const createPrismaClient = (): PrismaClient | null => {
  if (!hasDatabaseUrl) {
    console.warn('⚠️  DATABASE_URL no está configurada. Las funciones de base de datos no estarán disponibles.');
    return null;
  }
  
  try {
    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
    
    return client;
  } catch (error) {
    console.error('❌ Error creando PrismaClient:', error);
    return null;
  }
};

export const prisma: PrismaClient | null =
  globalForPrisma.prisma ?? createPrismaClient();

// Solo reutilizar en desarrollo, en producción cada request puede ser una nueva instancia
if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

