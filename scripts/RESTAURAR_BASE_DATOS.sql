-- ============================================
-- SCRIPT PARA RESTAURAR LA BASE DE DATOS COMPLETA
-- Destino Rent Car - Sistema de Renta de Autos
-- ============================================
-- INSTRUCCIONES:
-- 1. Primero ejecuta BACKUP_COMPLETO_BASE_DATOS.sql para crear la estructura
-- 2. Luego pega aquí todos los INSERT statements que obtuviste de EXPORTAR_DATOS.sql
-- 3. Ejecuta este script completo
-- ============================================

-- ============================================
-- PASO 1: ELIMINAR TODAS LAS TABLAS EXISTENTES
-- ============================================
-- Descomenta estas líneas para borrar todo y empezar desde cero
-- ⚠️ CUIDADO: Esto eliminará TODOS los datos existentes

DROP TABLE IF EXISTS "Documento" CASCADE;
DROP TABLE IF EXISTS "Notificacion" CASCADE;
DROP TABLE IF EXISTS "Renta" CASCADE;
DROP TABLE IF EXISTS "Vehiculo" CASCADE;
DROP TABLE IF EXISTS "Cliente" CASCADE;
DROP TABLE IF EXISTS "Admin" CASCADE;

-- ============================================
-- PASO 2: CREAR TODA LA ESTRUCTURA
-- ============================================
-- (Este contenido es el mismo que BACKUP_COMPLETO_BASE_DATOS.sql)

CREATE TABLE "Admin" (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nombre TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Cliente" (
    id TEXT NOT NULL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefono TEXT NOT NULL,
    direccion TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Vehiculo" (
    id TEXT NOT NULL PRIMARY KEY,
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    "año" INTEGER NOT NULL,
    placa TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    "precioDiario" DOUBLE PRECISION NOT NULL,
    disponible BOOLEAN NOT NULL DEFAULT true,
    imagen TEXT,
    descripcion TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Renta" (
    id TEXT NOT NULL PRIMARY KEY,
    "clienteId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "precioTotal" DOUBLE PRECISION NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    observaciones TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Renta_clienteId_fkey" FOREIGN KEY ("clienteId") 
        REFERENCES "Cliente"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Renta_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") 
        REFERENCES "Vehiculo"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Notificacion" (
    id TEXT NOT NULL PRIMARY KEY,
    "clienteId" TEXT,
    "adminId" TEXT,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN NOT NULL DEFAULT false,
    url TEXT,
    "rentaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Notificacion_clienteId_fkey" FOREIGN KEY ("clienteId") 
        REFERENCES "Cliente"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Documento" (
    id TEXT NOT NULL PRIMARY KEY,
    "clienteId" TEXT NOT NULL,
    tipo TEXT NOT NULL,
    nombre TEXT NOT NULL,
    url TEXT NOT NULL,
    verificado BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Documento_clienteId_fkey" FOREIGN KEY ("clienteId") 
        REFERENCES "Cliente"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crear índices
CREATE INDEX "Renta_clienteId_idx" ON "Renta"("clienteId");
CREATE INDEX "Renta_vehiculoId_idx" ON "Renta"("vehiculoId");
CREATE INDEX "Renta_estado_idx" ON "Renta"("estado");
CREATE INDEX "Renta_fechaInicio_fechaFin_idx" ON "Renta"("fechaInicio", "fechaFin");
CREATE INDEX "Notificacion_clienteId_idx" ON "Notificacion"("clienteId");
CREATE INDEX "Notificacion_adminId_idx" ON "Notificacion"("adminId");
CREATE INDEX "Notificacion_leida_idx" ON "Notificacion"("leida");
CREATE INDEX "Notificacion_tipo_idx" ON "Notificacion"("tipo");
CREATE INDEX "Notificacion_createdAt_idx" ON "Notificacion"("createdAt");
CREATE INDEX "Notificacion_rentaId_idx" ON "Notificacion"("rentaId");
CREATE INDEX "Documento_clienteId_idx" ON "Documento"("clienteId");
CREATE INDEX "Documento_tipo_idx" ON "Documento"("tipo");

-- ============================================
-- PASO 3: INSERTAR TUS DATOS
-- ============================================
-- Pega aquí todos los INSERT statements que obtuviste de EXPORTAR_DATOS.sql
-- Ejemplo:

/*
INSERT INTO "Admin" (id, email, password, nombre, "createdAt", "updatedAt") 
VALUES ('admin-001', 'admin@demo.com', 'Admin123', 'Administrador', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

INSERT INTO "Cliente" (id, nombre, email, telefono, direccion, "createdAt", "updatedAt") 
VALUES ('cli-001', 'Juan Pérez', 'juan@email.com', '+598 99 123 456', 'Montevideo', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- ... más INSERT statements aquí ...
*/

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
