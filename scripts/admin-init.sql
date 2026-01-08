-- ============================================
-- SCRIPT PARA CREAR TABLA ADMIN Y USUARIO INICIAL
-- Destino Rent Car - Sistema de Renta de Autos
-- ============================================
-- Ejecuta este script en Neon Console SQL Editor
-- Solo necesitas ejecutarlo UNA VEZ después de crear las otras tablas

-- ============================================
-- CREAR TABLA: Admin
-- ============================================

CREATE TABLE IF NOT EXISTS "Admin" (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nombre TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- INSERTAR ADMINISTRADOR INICIAL
-- ============================================
-- Credenciales:
-- Email: admin@demo.com
-- Password: Admin123

INSERT INTO "Admin" (id, email, password, nombre, "createdAt", "updatedAt")
VALUES 
  ('admin-001', 'admin@demo.com', 'Admin123', 'Administrador', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  nombre = EXCLUDED.nombre,
  "updatedAt" = NOW();

-- ============================================
-- VERIFICACIÓN (opcional)
-- ============================================
-- Ejecuta esto para verificar que el admin se creó correctamente:
-- SELECT id, email, nombre, "createdAt" FROM "Admin";
