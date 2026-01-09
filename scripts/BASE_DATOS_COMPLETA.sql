-- ============================================
-- BASE DE DATOS COMPLETA - DESTINO RENT CAR
-- Sistema de Renta de Autos
-- ============================================
-- Este script contiene TODA la estructura y está listo para tus datos
-- Ejecuta este script completo en Neon Console SQL Editor
-- ============================================

-- ============================================
-- PASO 1: ELIMINAR TABLAS EXISTENTES (OPCIONAL)
-- ============================================
-- Descomenta estas líneas si quieres borrar todo y empezar desde cero
-- ⚠️ CUIDADO: Esto eliminará TODOS los datos existentes

-- DROP TABLE IF EXISTS "Documento" CASCADE;
-- DROP TABLE IF EXISTS "Notificacion" CASCADE;
-- DROP TABLE IF EXISTS "Renta" CASCADE;
-- DROP TABLE IF EXISTS "Vehiculo" CASCADE;
-- DROP TABLE IF EXISTS "Cliente" CASCADE;
-- DROP TABLE IF EXISTS "Admin" CASCADE;

-- ============================================
-- PASO 2: CREAR TODAS LAS TABLAS
-- ============================================

-- TABLA: Admin
CREATE TABLE IF NOT EXISTS "Admin" (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nombre TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: Cliente
CREATE TABLE IF NOT EXISTS "Cliente" (
    id TEXT NOT NULL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefono TEXT NOT NULL,
    direccion TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: Vehiculo
CREATE TABLE IF NOT EXISTS "Vehiculo" (
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

-- TABLA: Renta
CREATE TABLE IF NOT EXISTS "Renta" (
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

-- TABLA: Notificacion
CREATE TABLE IF NOT EXISTS "Notificacion" (
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

-- TABLA: Documento
CREATE TABLE IF NOT EXISTS "Documento" (
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

-- ============================================
-- PASO 3: CREAR TODOS LOS ÍNDICES
-- ============================================

-- Índices para Renta
CREATE INDEX IF NOT EXISTS "Renta_clienteId_idx" ON "Renta"("clienteId");
CREATE INDEX IF NOT EXISTS "Renta_vehiculoId_idx" ON "Renta"("vehiculoId");
CREATE INDEX IF NOT EXISTS "Renta_estado_idx" ON "Renta"("estado");
CREATE INDEX IF NOT EXISTS "Renta_fechaInicio_fechaFin_idx" ON "Renta"("fechaInicio", "fechaFin");

-- Índices para Notificacion
CREATE INDEX IF NOT EXISTS "Notificacion_clienteId_idx" ON "Notificacion"("clienteId");
CREATE INDEX IF NOT EXISTS "Notificacion_adminId_idx" ON "Notificacion"("adminId");
CREATE INDEX IF NOT EXISTS "Notificacion_leida_idx" ON "Notificacion"("leida");
CREATE INDEX IF NOT EXISTS "Notificacion_tipo_idx" ON "Notificacion"("tipo");
CREATE INDEX IF NOT EXISTS "Notificacion_createdAt_idx" ON "Notificacion"("createdAt");
CREATE INDEX IF NOT EXISTS "Notificacion_rentaId_idx" ON "Notificacion"("rentaId");

-- Índices para Documento
CREATE INDEX IF NOT EXISTS "Documento_clienteId_idx" ON "Documento"("clienteId");
CREATE INDEX IF NOT EXISTS "Documento_tipo_idx" ON "Documento"("tipo");

-- ============================================
-- PASO 4: INSERTAR DATOS
-- ============================================
-- Pega aquí todos tus INSERT statements que obtuviste de EXPORTAR_DATOS.sql
-- O usa los datos de ejemplo que están abajo

-- ============================================
-- DATOS DE ADMIN (Ejemplo)
-- ============================================
INSERT INTO "Admin" (id, email, password, nombre, "createdAt", "updatedAt")
VALUES 
  ('admin-001', 'admin@demo.com', 'Admin123', 'Administrador', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  nombre = EXCLUDED.nombre,
  "updatedAt" = NOW();

-- ============================================
-- DATOS DE CLIENTES (Ejemplo - Reemplaza con tus datos reales)
-- ============================================
/*
INSERT INTO "Cliente" (id, nombre, email, telefono, direccion, "createdAt", "updatedAt")
VALUES 
  ('cli-001', 'Juan Pérez', 'juan.perez@email.com', '+598 99 123 456', 'Av. 18 de Julio 1234, Montevideo', NOW(), NOW()),
  ('cli-002', 'María González', 'maria.gonzalez@email.com', '+598 98 234 567', 'Rambla República Argentina 567, Montevideo', NOW(), NOW());
*/

-- ============================================
-- DATOS DE VEHÍCULOS (Ejemplo - Reemplaza con tus datos reales)
-- ============================================
/*
INSERT INTO "Vehiculo" (id, marca, modelo, "año", placa, color, "precioDiario", disponible, imagen, descripcion, "createdAt", "updatedAt")
VALUES 
  ('veh-001', 'Toyota', 'Corolla', 2023, 'SAB-1234', 'Blanco', 2500.00, true, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', 'Sedán confiable y económico', NOW(), NOW()),
  ('veh-002', 'Chevrolet', 'Onix', 2024, 'SAB-5678', 'Gris', 2200.00, true, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop', 'Hatchback compacto ideal para ciudad', NOW(), NOW());
*/

-- ============================================
-- DATOS DE RENTAS (Ejemplo - Reemplaza con tus datos reales)
-- ============================================
/*
INSERT INTO "Renta" (id, "clienteId", "vehiculoId", "fechaInicio", "fechaFin", "precioTotal", estado, observaciones, "createdAt", "updatedAt")
VALUES 
  ('renta-001', 'cli-001', 'veh-001', '2024-01-15 10:00:00', '2024-01-20 18:00:00', 12500.00, 'completada', 'Cliente puntual', NOW(), NOW());
*/

-- ============================================
-- DATOS DE NOTIFICACIONES (Ejemplo - Reemplaza con tus datos reales)
-- ============================================
/*
INSERT INTO "Notificacion" (id, "clienteId", "adminId", tipo, titulo, mensaje, leida, url, "rentaId", "createdAt")
VALUES 
  ('notif-001', NULL, 'admin', 'nueva_reserva', 'Nueva Reserva', 'Se ha creado una nueva reserva', false, '/admin', 'renta-001', NOW());
*/

-- ============================================
-- DATOS DE DOCUMENTOS (Ejemplo - Reemplaza con tus datos reales)
-- ============================================
/*
INSERT INTO "Documento" (id, "clienteId", tipo, nombre, url, verificado, "createdAt")
VALUES 
  ('doc-001', 'cli-001', 'licencia', 'licencia_juan.pdf', '/documentos/licencia_juan.pdf', false, NOW());
*/

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
-- Ejecuta estos queries para verificar que todo esté correcto:

-- Ver cantidad de registros
SELECT 'Admin' as tabla, COUNT(*) as total FROM "Admin"
UNION ALL
SELECT 'Cliente', COUNT(*) FROM "Cliente"
UNION ALL
SELECT 'Vehiculo', COUNT(*) FROM "Vehiculo"
UNION ALL
SELECT 'Renta', COUNT(*) FROM "Renta"
UNION ALL
SELECT 'Notificacion', COUNT(*) FROM "Notificacion"
UNION ALL
SELECT 'Documento', COUNT(*) FROM "Documento";

-- Ver estructura de tablas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name IN ('Admin', 'Cliente', 'Vehiculo', 'Renta', 'Notificacion', 'Documento')
ORDER BY table_name, ordinal_position;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- Para exportar tus datos existentes, ejecuta el script EXPORTAR_DATOS.sql
-- y pega los resultados en la sección "PASO 4" de este archivo
-- ============================================
