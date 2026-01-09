-- Script SQL completo para crear todas las tablas necesarias
-- Ejecuta esto en Neon Console SQL Editor si falta alguna tabla

-- 1. Crear tabla Notificacion (si no existe)
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

-- 2. Agregar foreign key para Notificacion.Cliente (solo si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Notificacion_clienteId_fkey'
    ) THEN
        ALTER TABLE "Notificacion" 
        ADD CONSTRAINT "Notificacion_clienteId_fkey" 
        FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- 3. Crear tabla Documento (si no existe)
CREATE TABLE IF NOT EXISTS "Documento" (
  "id" TEXT NOT NULL,
  "clienteId" TEXT NOT NULL,
  "tipo" TEXT NOT NULL,
  "nombre" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "verificado" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- 4. Agregar foreign key para Documento.Cliente (solo si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Documento_clienteId_fkey'
    ) THEN
        ALTER TABLE "Documento" 
        ADD CONSTRAINT "Documento_clienteId_fkey" 
        FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- 5. Actualizar estado por defecto de Renta
ALTER TABLE "Renta" ALTER COLUMN "estado" SET DEFAULT 'pendiente';

-- 6. Crear todos los índices necesarios (solo los que no existen)
CREATE INDEX IF NOT EXISTS "Renta_estado_idx" ON "Renta"("estado");
CREATE INDEX IF NOT EXISTS "Notificacion_clienteId_idx" ON "Notificacion"("clienteId");
CREATE INDEX IF NOT EXISTS "Notificacion_adminId_idx" ON "Notificacion"("adminId");
CREATE INDEX IF NOT EXISTS "Notificacion_leida_idx" ON "Notificacion"("leida");
CREATE INDEX IF NOT EXISTS "Notificacion_tipo_idx" ON "Notificacion"("tipo");
CREATE INDEX IF NOT EXISTS "Notificacion_createdAt_idx" ON "Notificacion"("createdAt");
CREATE INDEX IF NOT EXISTS "Notificacion_rentaId_idx" ON "Notificacion"("rentaId");
CREATE INDEX IF NOT EXISTS "Documento_clienteId_idx" ON "Documento"("clienteId");
CREATE INDEX IF NOT EXISTS "Documento_tipo_idx" ON "Documento"("tipo");

-- 7. Agregar columnas faltantes a Notificacion (por si acaso)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Notificacion' AND column_name = 'adminId'
    ) THEN
        ALTER TABLE "Notificacion" ADD COLUMN "adminId" TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Notificacion' AND column_name = 'rentaId'
    ) THEN
        ALTER TABLE "Notificacion" ADD COLUMN "rentaId" TEXT;
    END IF;
END $$;
