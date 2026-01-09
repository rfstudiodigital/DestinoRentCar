-- Script para agregar columnas faltantes a la tabla Notificacion existente
-- Ejecuta esto si la tabla ya existe pero le faltan columnas

-- Verificar y agregar columna adminId
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Notificacion' AND column_name = 'adminId'
    ) THEN
        ALTER TABLE "Notificacion" ADD COLUMN "adminId" TEXT;
    END IF;
END $$;

-- Verificar y agregar columna tipo
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Notificacion' AND column_name = 'tipo'
    ) THEN
        ALTER TABLE "Notificacion" ADD COLUMN "tipo" TEXT NOT NULL DEFAULT 'info';
    END IF;
END $$;

-- Verificar y agregar columna titulo
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Notificacion' AND column_name = 'titulo'
    ) THEN
        ALTER TABLE "Notificacion" ADD COLUMN "titulo" TEXT NOT NULL DEFAULT 'Notificación';
    END IF;
END $$;

-- Verificar y agregar columna mensaje
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Notificacion' AND column_name = 'mensaje'
    ) THEN
        ALTER TABLE "Notificacion" ADD COLUMN "mensaje" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Verificar y agregar columna leida
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Notificacion' AND column_name = 'leida'
    ) THEN
        ALTER TABLE "Notificacion" ADD COLUMN "leida" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- Verificar y agregar columna url
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Notificacion' AND column_name = 'url'
    ) THEN
        ALTER TABLE "Notificacion" ADD COLUMN "url" TEXT;
    END IF;
END $$;

-- Verificar y agregar columna rentaId
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Notificacion' AND column_name = 'rentaId'
    ) THEN
        ALTER TABLE "Notificacion" ADD COLUMN "rentaId" TEXT;
    END IF;
END $$;

-- Verificar y agregar columna createdAt si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Notificacion' AND column_name = 'createdAt'
    ) THEN
        ALTER TABLE "Notificacion" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Actualizar el estado por defecto de Renta
ALTER TABLE "Renta" ALTER COLUMN "estado" SET DEFAULT 'pendiente';

-- Crear índices (solo los que no existen)
CREATE INDEX IF NOT EXISTS "Renta_estado_idx" ON "Renta"("estado");
CREATE INDEX IF NOT EXISTS "Notificacion_clienteId_idx" ON "Notificacion"("clienteId");
CREATE INDEX IF NOT EXISTS "Notificacion_adminId_idx" ON "Notificacion"("adminId");
CREATE INDEX IF NOT EXISTS "Notificacion_leida_idx" ON "Notificacion"("leida");
CREATE INDEX IF NOT EXISTS "Notificacion_tipo_idx" ON "Notificacion"("tipo");
CREATE INDEX IF NOT EXISTS "Notificacion_createdAt_idx" ON "Notificacion"("createdAt");
CREATE INDEX IF NOT EXISTS "Notificacion_rentaId_idx" ON "Notificacion"("rentaId");
