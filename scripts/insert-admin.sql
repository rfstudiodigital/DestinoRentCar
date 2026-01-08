-- ============================================
-- INSERTAR USUARIO ADMIN
-- Destino Rent Car - Sistema de Renta de Autos
-- ============================================
-- Ejecuta este script en Neon Console SQL Editor

-- ============================================
-- VERIFICAR SI LA TABLA EXISTE (opcional)
-- ============================================
-- Si la tabla no existe, créala primero ejecutando:
-- CREATE TABLE IF NOT EXISTS "Admin" (
--     id TEXT NOT NULL PRIMARY KEY,
--     email TEXT NOT NULL UNIQUE,
--     password TEXT NOT NULL,
--     nombre TEXT,
--     rol TEXT DEFAULT 'admin',
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- ============================================
-- INSERTAR O ACTUALIZAR ADMINISTRADOR
-- ============================================
-- Credenciales:
-- Email: admin@demo.com
-- Password: Admin123

INSERT INTO "Admin" (id, email, password, nombre, "createdAt", "updatedAt")
VALUES 
  (
    'admin-' || gen_random_uuid()::text,  -- Genera un ID único
    'admin@demo.com',
    'Admin123',
    'Administrador',
    NOW(),
    NOW()
  )
ON CONFLICT (email) 
DO UPDATE SET
  password = EXCLUDED.password,
  nombre = EXCLUDED.nombre,
  "updatedAt" = NOW();

-- ============================================
-- VERSIÓN ALTERNATIVA CON ID FIJO (si prefieres)
-- ============================================
-- INSERT INTO "Admin" (id, email, password, nombre, "createdAt", "updatedAt")
-- VALUES 
--   (
--     'admin-001',
--     'admin@demo.com',
--     'Admin123',
--     'Administrador',
--     NOW(),
--     NOW()
--   )
-- ON CONFLICT (email) 
-- DO UPDATE SET
--   password = EXCLUDED.password,
--   nombre = EXCLUDED.nombre,
--   "updatedAt" = NOW();

-- ============================================
-- VERIFICAR QUE SE INSERTÓ CORRECTAMENTE
-- ============================================
-- SELECT id, email, nombre, "createdAt" 
-- FROM "Admin" 
-- WHERE email = 'admin@demo.com';
