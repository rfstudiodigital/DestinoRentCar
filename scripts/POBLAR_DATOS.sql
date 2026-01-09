-- ============================================
-- SCRIPT PARA POBLAR LA BASE DE DATOS
-- Ejecuta este script en Neon Console SQL Editor
-- ============================================

-- ============================================
-- 1. ADMIN (si no existe)
-- ============================================
INSERT INTO "Admin" (id, email, password, nombre, "createdAt", "updatedAt")
VALUES 
  ('admin-001', 'admin@demo.com', 'Admin123', 'Administrador', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  nombre = EXCLUDED.nombre,
  "updatedAt" = NOW();

-- ============================================
-- 2. VEHÍCULOS (12 vehículos de ejemplo)
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
  ('veh-012', 'Volkswagen', 'Amarok', 2024, 'SAB-3333', 'Blanco', 4800.00, true, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Pick-up premium alemana. Doble cabina con lujos. Motor diesel potente. Ideal para trabajo y ocio.', NOW(), NOW())
ON CONFLICT (placa) DO UPDATE SET
  marca = EXCLUDED.marca,
  modelo = EXCLUDED.modelo,
  "año" = EXCLUDED."año",
  color = EXCLUDED.color,
  "precioDiario" = EXCLUDED."precioDiario",
  disponible = EXCLUDED.disponible,
  imagen = EXCLUDED.imagen,
  descripcion = EXCLUDED.descripcion,
  "updatedAt" = NOW();

-- ============================================
-- 3. CLIENTES (2 clientes de ejemplo)
-- ============================================
INSERT INTO "Cliente" (id, nombre, email, telefono, direccion, "createdAt", "updatedAt")
VALUES 
  ('cli-001', 'Juan Pérez', 'juan.perez@email.com', '+598 99 123 456', 'Av. 18 de Julio 1234, Montevideo', NOW(), NOW()),
  ('cli-002', 'María González', 'maria.gonzalez@email.com', '+598 98 234 567', 'Rambla República Argentina 567, Montevideo', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  telefono = EXCLUDED.telefono,
  direccion = EXCLUDED.direccion,
  "updatedAt" = NOW();

-- ============================================
-- VERIFICACIÓN
-- ============================================
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
