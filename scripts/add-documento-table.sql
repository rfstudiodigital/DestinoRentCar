-- Script SQL para agregar la tabla Documento
-- Ejecuta esto en Neon Console SQL Editor

-- Crear tabla de Documentos
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

-- Agregar foreign key para Cliente
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

-- Crear índices
CREATE INDEX IF NOT EXISTS "Documento_clienteId_idx" ON "Documento"("clienteId");
CREATE INDEX IF NOT EXISTS "Documento_tipo_idx" ON "Documento"("tipo");
