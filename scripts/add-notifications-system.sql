-- Script SQL para agregar el sistema de notificaciones
-- Ejecutar este script en Neon Console SQL Editor

-- 1. Actualizar el modelo Renta para cambiar el estado por defecto y agregar índice
ALTER TABLE "Renta" ALTER COLUMN "estado" SET DEFAULT 'pendiente';

-- 2. Agregar índice para estado en Renta
CREATE INDEX IF NOT EXISTS "Renta_estado_idx" ON "Renta"("estado");

-- 3. Crear tabla de Notificaciones
CREATE TABLE IF NOT EXISTS "Notificacion" (
  "id" TEXT NOT NULL,
  "clienteId" TEXT,
  "adminId" TEXT,
  "tipo" TEXT NOT NULL,
  "titulo" TEXT NOT NULL,
  "mensaje" TEXT NOT NULL,
  "leida" BOOLEAN NOT NULL DEFAULT false,
  "url" TEXT,
  "rentaId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- 4. Agregar foreign key para Cliente
ALTER TABLE "Notificacion" 
ADD CONSTRAINT "Notificacion_clienteId_fkey" 
FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS "Notificacion_clienteId_idx" ON "Notificacion"("clienteId");
CREATE INDEX IF NOT EXISTS "Notificacion_adminId_idx" ON "Notificacion"("adminId");
CREATE INDEX IF NOT EXISTS "Notificacion_leida_idx" ON "Notificacion"("leida");
CREATE INDEX IF NOT EXISTS "Notificacion_tipo_idx" ON "Notificacion"("tipo");
CREATE INDEX IF NOT EXISTS "Notificacion_createdAt_idx" ON "Notificacion"("createdAt");
CREATE INDEX IF NOT EXISTS "Notificacion_rentaId_idx" ON "Notificacion"("rentaId");
