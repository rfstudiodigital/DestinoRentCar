-- Script SQL para poblar la base de datos en Neon Console
-- Ejecuta estos comandos en el SQL Editor de Neon

-- ============================================
-- VEHÍCULOS FICTICIOS
-- ============================================

-- Nota: Los IDs se generan automáticamente. Si necesitas IDs específicos, usa la función gen_random_uuid()::text o deja que Prisma los genere

INSERT INTO "Vehiculo" (id, marca, modelo, "año", placa, color, "precioDiario", disponible, imagen, descripcion, "createdAt", "updatedAt")
VALUES 
  (
    gen_random_uuid()::text,
    'Toyota',
    'Corolla',
    2023,
    'SAB-1234',
    'Blanco',
    2500.00,
    true,
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
    'Sedán confiable y económico, perfecto para la ciudad y viajes largos. Incluye aire acondicionado, dirección asistida y sistema multimedia.',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Chevrolet',
    'Onix',
    2024,
    'SAB-5678',
    'Gris',
    2200.00,
    true,
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    'Hatchback compacto ideal para movilidad urbana. Excelente consumo de combustible y gran espacio interior.',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Volkswagen',
    'Gol',
    2023,
    'SAB-9012',
    'Rojo',
    2100.00,
    true,
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    'Auto económico y robusto. Ideal para uso diario con bajo mantenimiento y alto rendimiento.',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Ford',
    'Ranger',
    2024,
    'SAB-3456',
    'Negro',
    4500.00,
    true,
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    'Pick-up 4x4 potente y versátil. Perfecta para trabajo, campo y aventura. Incluye doble cabina y caja trasera amplia.',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Fiat',
    'Cronos',
    2023,
    'SAB-7890',
    'Azul',
    2300.00,
    true,
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    'Sedán espacioso y cómodo. Tecnología moderna y seguridad avanzada. Ideal para familias.',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Renault',
    'Duster',
    2024,
    'SAB-2468',
    'Blanco',
    3800.00,
    true,
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
    'SUV compacto con excelente altura libre. Perfecto para caminos de tierra y ciudad. Amplio espacio interior.',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Peugeot',
    '208',
    2023,
    'SAB-1357',
    'Amarillo',
    2400.00,
    true,
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop',
    'Hatchback deportivo y elegante. Diseño francés con tecnología avanzada y excelente manejo.',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Nissan',
    'Frontier',
    2024,
    'SAB-9876',
    'Gris',
    4200.00,
    true,
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    'Pick-up robusta y confiable. Motor potente y gran capacidad de carga. Ideal para trabajo pesado.',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Suzuki',
    'Vitara',
    2023,
    'SAB-5432',
    'Rojo',
    3200.00,
    true,
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop',
    'SUV compacto ágil y eficiente. Tracción delantera y 4x4 disponible. Perfecto para la ciudad y campo.',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Hyundai',
    'HB20',
    2024,
    'SAB-1111',
    'Negro',
    2250.00,
    true,
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    'Hatchback moderno y bien equipado. Garantía extendida y excelente relación precio-calidad.',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Chevrolet',
    'Cruze',
    2023,
    'SAB-2222',
    'Azul',
    2800.00,
    true,
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop',
    'Sedán premium con excelente equipamiento. Motor turbo y transmisión automática. Máxima comodidad.',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Volkswagen',
    'Amarok',
    2024,
    'SAB-3333',
    'Blanco',
    4800.00,
    true,
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    'Pick-up premium alemana. Doble cabina con lujos. Motor diesel potente. Ideal para trabajo y ocio.',
    NOW(),
    NOW()
  )
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
-- CLIENTES FICTICIOS
-- ============================================

INSERT INTO "Cliente" (id, nombre, email, telefono, direccion, "createdAt", "updatedAt")
VALUES 
  (
    gen_random_uuid()::text,
    'Juan Pérez',
    'juan.perez@email.com',
    '+598 99 123 456',
    'Av. 18 de Julio 1234, Montevideo',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'María González',
    'maria.gonzalez@email.com',
    '+598 98 234 567',
    'Rambla República Argentina 567, Montevideo',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Carlos Rodríguez',
    'carlos.rodriguez@email.com',
    '+598 97 345 678',
    'Bulevar Artigas 890, Montevideo',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Ana Martínez',
    'ana.martinez@email.com',
    '+598 96 456 789',
    'Calle Ejido 2345, Montevideo',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Luis Fernández',
    'luis.fernandez@email.com',
    '+598 95 567 890',
    'Av. Agraciada 678, Montevideo',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Laura Silva',
    'laura.silva@email.com',
    '+598 94 678 901',
    'Calle Colonia 123, Montevideo',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Pedro López',
    'pedro.lopez@email.com',
    '+598 93 789 012',
    'Av. Rivera 3456, Montevideo',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Carmen Díaz',
    'carmen.diaz@email.com',
    '+598 92 890 123',
    'Bulevar España 789, Montevideo',
    NOW(),
    NOW()
  )
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  telefono = EXCLUDED.telefono,
  direccion = EXCLUDED.direccion,
  "updatedAt" = NOW();

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Para verificar que los datos se insertaron correctamente, ejecuta:
-- SELECT COUNT(*) FROM "Vehiculo";
-- SELECT COUNT(*) FROM "Cliente";
-- SELECT * FROM "Vehiculo" ORDER BY marca;
-- SELECT * FROM "Cliente" ORDER BY nombre;
