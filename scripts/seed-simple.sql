-- Script SQL SIMPLIFICADO para poblar la base de datos en Neon Console
-- Este script NO requiere gen_random_uuid(), usa IDs simples
-- Ejecuta estos comandos en el SQL Editor de Neon

-- ============================================
-- VEHÍCULOS FICTICIOS (12 vehículos)
-- ============================================

INSERT INTO "Vehiculo" (id, marca, modelo, "año", placa, color, "precioDiario", disponible, imagen, descripcion, "createdAt", "updatedAt")
VALUES 
  ('veh-001-toyota-corolla-2023', 'Toyota', 'Corolla', 2023, 'SAB-1234', 'Blanco', 2500.00, true, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', 'Sedán confiable y económico, perfecto para la ciudad y viajes largos. Incluye aire acondicionado, dirección asistida y sistema multimedia.', NOW(), NOW()),
  ('veh-002-chevrolet-onix-2024', 'Chevrolet', 'Onix', 2024, 'SAB-5678', 'Gris', 2200.00, true, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop', 'Hatchback compacto ideal para movilidad urbana. Excelente consumo de combustible y gran espacio interior.', NOW(), NOW()),
  ('veh-003-volkswagen-gol-2023', 'Volkswagen', 'Gol', 2023, 'SAB-9012', 'Rojo', 2100.00, true, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Auto económico y robusto. Ideal para uso diario con bajo mantenimiento y alto rendimiento.', NOW(), NOW()),
  ('veh-004-ford-ranger-2024', 'Ford', 'Ranger', 2024, 'SAB-3456', 'Negro', 4500.00, true, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Pick-up 4x4 potente y versátil. Perfecta para trabajo, campo y aventura. Incluye doble cabina y caja trasera amplia.', NOW(), NOW()),
  ('veh-005-fiat-cronos-2023', 'Fiat', 'Cronos', 2023, 'SAB-7890', 'Azul', 2300.00, true, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', 'Sedán espacioso y cómodo. Tecnología moderna y seguridad avanzada. Ideal para familias.', NOW(), NOW()),
  ('veh-006-renault-duster-2024', 'Renault', 'Duster', 2024, 'SAB-2468', 'Blanco', 3800.00, true, 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop', 'SUV compacto con excelente altura libre. Perfecto para caminos de tierra y ciudad. Amplio espacio interior.', NOW(), NOW()),
  ('veh-007-peugeot-208-2023', 'Peugeot', '208', 2023, 'SAB-1357', 'Amarillo', 2400.00, true, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop', 'Hatchback deportivo y elegante. Diseño francés con tecnología avanzada y excelente manejo.', NOW(), NOW()),
  ('veh-008-nissan-frontier-2024', 'Nissan', 'Frontier', 2024, 'SAB-9876', 'Gris', 4200.00, true, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Pick-up robusta y confiable. Motor potente y gran capacidad de carga. Ideal para trabajo pesado.', NOW(), NOW()),
  ('veh-009-suzuki-vitara-2023', 'Suzuki', 'Vitara', 2023, 'SAB-5432', 'Rojo', 3200.00, true, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop', 'SUV compacto ágil y eficiente. Tracción delantera y 4x4 disponible. Perfecto para la ciudad y campo.', NOW(), NOW()),
  ('veh-010-hyundai-hb20-2024', 'Hyundai', 'HB20', 2024, 'SAB-1111', 'Negro', 2250.00, true, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', 'Hatchback moderno y bien equipado. Garantía extendida y excelente relación precio-calidad.', NOW(), NOW()),
  ('veh-011-chevrolet-cruze-2023', 'Chevrolet', 'Cruze', 2023, 'SAB-2222', 'Azul', 2800.00, true, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop', 'Sedán premium con excelente equipamiento. Motor turbo y transmisión automática. Máxima comodidad.', NOW(), NOW()),
  ('veh-012-volkswagen-amarok-2024', 'Volkswagen', 'Amarok', 2024, 'SAB-3333', 'Blanco', 4800.00, true, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'Pick-up premium alemana. Doble cabina con lujos. Motor diesel potente. Ideal para trabajo y ocio.', NOW(), NOW())
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
-- CLIENTES FICTICIOS (8 clientes)
-- ============================================

INSERT INTO "Cliente" (id, nombre, email, telefono, direccion, "createdAt", "updatedAt")
VALUES 
  ('cli-001-juan-perez', 'Juan Pérez', 'juan.perez@email.com', '+598 99 123 456', 'Av. 18 de Julio 1234, Montevideo', NOW(), NOW()),
  ('cli-002-maria-gonzalez', 'María González', 'maria.gonzalez@email.com', '+598 98 234 567', 'Rambla República Argentina 567, Montevideo', NOW(), NOW()),
  ('cli-003-carlos-rodriguez', 'Carlos Rodríguez', 'carlos.rodriguez@email.com', '+598 97 345 678', 'Bulevar Artigas 890, Montevideo', NOW(), NOW()),
  ('cli-004-ana-martinez', 'Ana Martínez', 'ana.martinez@email.com', '+598 96 456 789', 'Calle Ejido 2345, Montevideo', NOW(), NOW()),
  ('cli-005-luis-fernandez', 'Luis Fernández', 'luis.fernandez@email.com', '+598 95 567 890', 'Av. Agraciada 678, Montevideo', NOW(), NOW()),
  ('cli-006-laura-silva', 'Laura Silva', 'laura.silva@email.com', '+598 94 678 901', 'Calle Colonia 123, Montevideo', NOW(), NOW()),
  ('cli-007-pedro-lopez', 'Pedro López', 'pedro.lopez@email.com', '+598 93 789 012', 'Av. Rivera 3456, Montevideo', NOW(), NOW()),
  ('cli-008-carmen-diaz', 'Carmen Díaz', 'carmen.diaz@email.com', '+598 92 890 123', 'Bulevar España 789, Montevideo', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  telefono = EXCLUDED.telefono,
  direccion = EXCLUDED.direccion,
  "updatedAt" = NOW();

-- ============================================
-- VERIFICACIÓN (opcional - ejecuta después)
-- ============================================

-- SELECT COUNT(*) as total_vehiculos FROM "Vehiculo";
-- SELECT COUNT(*) as total_clientes FROM "Cliente";
-- SELECT marca, modelo, "año", placa, "precioDiario" FROM "Vehiculo" ORDER BY marca;
-- SELECT nombre, email, telefono FROM "Cliente" ORDER BY nombre;
