-- ============================================
-- BASE DE DATOS COMPLETA - DESTINO RENT CAR
-- Sistema de Renta de Autos
-- ============================================
-- ⚠️ IMPORTANTE: Este script ELIMINARÁ todas las tablas existentes
-- y creará todo desde cero con datos de ejemplo
-- Ejecuta este script completo en Neon Console SQL Editor
-- ============================================

-- ============================================
-- PASO 1: ELIMINAR TODAS LAS TABLAS EXISTENTES
-- ============================================
-- ⚠️ CUIDADO: Esto eliminará TODOS los datos existentes

DROP TABLE IF EXISTS "Documento" CASCADE;
DROP TABLE IF EXISTS "Notificacion" CASCADE;
DROP TABLE IF EXISTS "Renta" CASCADE;
DROP TABLE IF EXISTS "Vehiculo" CASCADE;
DROP TABLE IF EXISTS "Cliente" CASCADE;
DROP TABLE IF EXISTS "Admin" CASCADE;

-- ============================================
-- PASO 2: CREAR TODAS LAS TABLAS
-- ============================================

-- TABLA: Admin
CREATE TABLE "Admin" (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nombre TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: Cliente
CREATE TABLE "Cliente" (
    id TEXT NOT NULL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefono TEXT NOT NULL,
    direccion TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: Vehiculo
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

-- TABLA: Renta
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

-- TABLA: Notificacion
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

-- TABLA: Documento
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

-- ============================================
-- PASO 3: CREAR TODOS LOS ÍNDICES
-- ============================================

-- Índices para Renta
CREATE INDEX "Renta_clienteId_idx" ON "Renta"("clienteId");
CREATE INDEX "Renta_vehiculoId_idx" ON "Renta"("vehiculoId");
CREATE INDEX "Renta_estado_idx" ON "Renta"("estado");
CREATE INDEX "Renta_fechaInicio_fechaFin_idx" ON "Renta"("fechaInicio", "fechaFin");

-- Índices para Notificacion
CREATE INDEX "Notificacion_clienteId_idx" ON "Notificacion"("clienteId");
CREATE INDEX "Notificacion_adminId_idx" ON "Notificacion"("adminId");
CREATE INDEX "Notificacion_leida_idx" ON "Notificacion"("leida");
CREATE INDEX "Notificacion_tipo_idx" ON "Notificacion"("tipo");
CREATE INDEX "Notificacion_createdAt_idx" ON "Notificacion"("createdAt");
CREATE INDEX "Notificacion_rentaId_idx" ON "Notificacion"("rentaId");

-- Índices para Documento
CREATE INDEX "Documento_clienteId_idx" ON "Documento"("clienteId");
CREATE INDEX "Documento_tipo_idx" ON "Documento"("tipo");

-- ============================================
-- PASO 4: INSERTAR DATOS DE EJEMPLO
-- ============================================

-- ============================================
-- DATOS DE ADMIN
-- ============================================
-- Credenciales: admin@demo.com / Admin123
INSERT INTO "Admin" (id, email, password, nombre, "createdAt", "updatedAt")
VALUES 
  ('admin-001', 'admin@demo.com', 'Admin123', 'Administrador', NOW(), NOW());

-- ============================================
-- DATOS DE CLIENTES (2 clientes de ejemplo)
-- ============================================
INSERT INTO "Cliente" (id, nombre, email, telefono, direccion, "createdAt", "updatedAt")
VALUES 
  ('cli-001', 'Juan Pérez', 'juan.perez@email.com', '+598 99 123 456', 'Av. 18 de Julio 1234, Montevideo', NOW(), NOW()),
  ('cli-002', 'María González', 'maria.gonzalez@email.com', '+598 98 234 567', 'Rambla República Argentina 567, Montevideo', NOW(), NOW());

-- ============================================
-- DATOS DE VEHÍCULOS (12 vehículos de ejemplo)
-- ============================================
INSERT INTO "Vehiculo" (id, marca, modelo, "año", placa, color, "precioDiario", disponible, imagen, descripcion, "createdAt", "updatedAt")
VALUES 
  ('veh-001', 'Toyota', 'Corolla', 2023, 'SAB-1234', 'Blanco', 2500.00, true, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', 'Sedán confiable y económico, perfecto para la ciudad y viajes largos. Incluye aire acondicionado, dirección asistida y sistema multimedia.', NOW(), NOW()),
  ('veh-002', 'Chevrolet', 'Onix', 2024, 'SAB-5678', 'Gris', 2200.00, true, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop', 'Hatchback compacto ideal para movilidad urbana. Excelente consumo de combustible y gran espacio interior.', NOW(), NOW()),
  ('veh-003', 'Volkswagen', 'Gol', 2023, 'SAB-9012', 'Rojo', 2100.00, true, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Auto económico y robusto. Ideal para uso diario con bajo mantenimiento y alto rendimiento.', NOW(), NOW()),
  ('veh-004', 'Ford', 'Ranger', 2024, 'SAB-3456', 'Negro', 4500.00, true, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Pick-up 4x4 potente y versátil. Perfecta para trabajo, campo y aventura. Incluye doble cabina y caja trasera amplia.', NOW(), NOW()),
  ('veh-005', 'Fiat', 'Cronos', 2023, 'SAB-7890', 'Azul', 2300.00, true, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', 'Sedán espacioso y cómodo. Tecnología moderna y seguridad avanzada. Ideal para familias.', NOW(), NOW()),
  ('veh-006', 'Renault', 'Duster', 2024, 'SAB-2468', 'Blanco', 3800.00, true, 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop', 'SUV compacto con excelente altura libre. Perfecto para caminos de tierra y ciudad. Amplio espacio interior.', NOW(), NOW()),
  ('veh-007', 'Peugeot', '208', 2023, 'SAB-1357', 'Amarillo', 2400.00, true, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop', 'Hatchback deportivo y elegante. Diseño francés con tecnología avanzada y excelente manejo.', NOW(), NOW()),
  ('veh-008', 'Nissan', 'Frontier', 2024, 'SAB-9876', 'Gris', 4200.00, true, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Pick-up robusta y confiable. Motor potente y gran capacidad de carga. Ideal para trabajo pesado.', NOW(), NOW()),
  ('veh-009', 'Suzuki', 'Vitara', 2023, 'SAB-5432', 'Rojo', 3200.00, true, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop', 'SUV compacto ágil y eficiente. Tracción delantera y 4x4 disponible. Perfecto para la ciudad y campo.', NOW(), NOW()),
  ('veh-010', 'Hyundai', 'HB20', 2024, 'SAB-1111', 'Negro', 2250.00, true, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', 'Hatchback moderno y bien equipado. Garantía extendida y excelente relación precio-calidad.', NOW(), NOW()),
  ('veh-011', 'Chevrolet', 'Cruze', 2023, 'SAB-2222', 'Azul', 2800.00, true, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop', 'Sedán premium con excelente equipamiento. Motor turbo y transmisión automática. Máxima comodidad.', NOW(), NOW()),
  ('veh-012', 'Volkswagen', 'Amarok', 2024, 'SAB-3333', 'Blanco', 4800.00, true, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Pick-up premium alemana. Doble cabina con lujos. Motor diesel potente. Ideal para trabajo y ocio.', NOW(), NOW());

-- ============================================
-- DATOS DE RENTAS (1 renta de ejemplo)
-- ============================================
INSERT INTO "Renta" (id, "clienteId", "vehiculoId", "fechaInicio", "fechaFin", "precioTotal", estado, observaciones, "createdAt", "updatedAt")
VALUES 
  ('renta-001', 'cli-001', 'veh-001', NOW() + INTERVAL '1 day', NOW() + INTERVAL '6 days', 15000.00, 'pendiente', 'Renta de ejemplo - Cliente Juan Pérez alquilando Toyota Corolla', NOW(), NOW());

-- ============================================
-- DATOS DE NOTIFICACIONES (1 notificación de ejemplo para admin)
-- ============================================
INSERT INTO "Notificacion" (id, "clienteId", "adminId", tipo, titulo, mensaje, leida, url, "rentaId", "createdAt")
VALUES 
  ('notif-001', NULL, 'admin', 'nueva_reserva', 'Nueva Reserva', 'Juan Pérez ha realizado una nueva reserva para el vehículo Toyota Corolla (SAB-1234)', false, '/admin', 'renta-001', NOW());

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
-- Ejecuta estos queries para verificar que todo esté correcto:

-- Ver cantidad de registros por tabla
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

-- Ver vehículos disponibles
SELECT id, marca, modelo, "año", placa, color, "precioDiario", disponible 
FROM "Vehiculo" 
ORDER BY marca, modelo;

-- Ver clientes
SELECT id, nombre, email, telefono 
FROM "Cliente";

-- Ver rentas
SELECT r.id, c.nombre as cliente, v.marca || ' ' || v.modelo as vehiculo, r.estado, r."precioTotal"
FROM "Renta" r
JOIN "Cliente" c ON r."clienteId" = c.id
JOIN "Vehiculo" v ON r."vehiculoId" = v.id;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- ✅ Base de datos creada exitosamente con:
--    - 1 Administrador (admin@demo.com / Admin123)
--    - 2 Clientes de ejemplo
--    - 12 Vehículos de ejemplo
--    - 1 Renta de ejemplo
--    - 1 Notificación de ejemplo
-- ============================================
