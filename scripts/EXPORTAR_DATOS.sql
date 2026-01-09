-- ============================================
-- SCRIPT PARA EXPORTAR TODOS LOS DATOS EXISTENTES
-- Destino Rent Car - Sistema de Renta de Autos
-- ============================================
-- Este script genera INSERT statements con todos tus datos actuales
-- Ejecuta cada sección y copia los resultados
-- ============================================

-- ============================================
-- 1. EXPORTAR DATOS DE ADMIN
-- ============================================
-- Ejecuta esto y copia los resultados:
SELECT 
    'INSERT INTO "Admin" (id, email, password, nombre, "createdAt", "updatedAt") VALUES (' ||
    '''' || id || ''', ' ||
    '''' || email || ''', ' ||
    '''' || password || ''', ' ||
    COALESCE('''' || nombre || '''', 'NULL') || ', ' ||
    '''' || "createdAt" || ''', ' ||
    '''' || "updatedAt" || ''');' AS insert_statement
FROM "Admin";

-- ============================================
-- 2. EXPORTAR DATOS DE CLIENTES
-- ============================================
-- Ejecuta esto y copia los resultados:
SELECT 
    'INSERT INTO "Cliente" (id, nombre, email, telefono, direccion, "createdAt", "updatedAt") VALUES (' ||
    '''' || id || ''', ' ||
    '''' || REPLACE(nombre, '''', '''''') || ''', ' ||
    '''' || email || ''', ' ||
    '''' || telefono || ''', ' ||
    COALESCE('''' || REPLACE(direccion, '''', '''''') || '''', 'NULL') || ', ' ||
    '''' || "createdAt" || ''', ' ||
    '''' || "updatedAt" || ''');' AS insert_statement
FROM "Cliente";

-- ============================================
-- 3. EXPORTAR DATOS DE VEHÍCULOS
-- ============================================
-- Ejecuta esto y copia los resultados:
SELECT 
    'INSERT INTO "Vehiculo" (id, marca, modelo, "año", placa, color, "precioDiario", disponible, imagen, descripcion, "createdAt", "updatedAt") VALUES (' ||
    '''' || id || ''', ' ||
    '''' || marca || ''', ' ||
    '''' || modelo || ''', ' ||
    "año" || ', ' ||
    '''' || placa || ''', ' ||
    '''' || color || ''', ' ||
    "precioDiario" || ', ' ||
    disponible || ', ' ||
    COALESCE('''' || imagen || '''', 'NULL') || ', ' ||
    COALESCE('''' || REPLACE(descripcion, '''', '''''') || '''', 'NULL') || ', ' ||
    '''' || "createdAt" || ''', ' ||
    '''' || "updatedAt" || ''');' AS insert_statement
FROM "Vehiculo";

-- ============================================
-- 4. EXPORTAR DATOS DE RENTAS
-- ============================================
-- Ejecuta esto y copia los resultados:
SELECT 
    'INSERT INTO "Renta" (id, "clienteId", "vehiculoId", "fechaInicio", "fechaFin", "precioTotal", estado, observaciones, "createdAt", "updatedAt") VALUES (' ||
    '''' || id || ''', ' ||
    '''' || "clienteId" || ''', ' ||
    '''' || "vehiculoId" || ''', ' ||
    '''' || "fechaInicio" || ''', ' ||
    '''' || "fechaFin" || ''', ' ||
    "precioTotal" || ', ' ||
    '''' || estado || ''', ' ||
    COALESCE('''' || REPLACE(observaciones, '''', '''''') || '''', 'NULL') || ', ' ||
    '''' || "createdAt" || ''', ' ||
    '''' || "updatedAt" || ''');' AS insert_statement
FROM "Renta";

-- ============================================
-- 5. EXPORTAR DATOS DE NOTIFICACIONES
-- ============================================
-- Ejecuta esto y copia los resultados:
SELECT 
    'INSERT INTO "Notificacion" (id, "clienteId", "adminId", tipo, titulo, mensaje, leida, url, "rentaId", "createdAt") VALUES (' ||
    '''' || id || ''', ' ||
    COALESCE('''' || "clienteId" || '''', 'NULL') || ', ' ||
    COALESCE('''' || "adminId" || '''', 'NULL') || ', ' ||
    '''' || tipo || ''', ' ||
    '''' || REPLACE(titulo, '''', '''''') || ''', ' ||
    '''' || REPLACE(mensaje, '''', '''''') || ''', ' ||
    leida || ', ' ||
    COALESCE('''' || url || '''', 'NULL') || ', ' ||
    COALESCE('''' || "rentaId" || '''', 'NULL') || ', ' ||
    '''' || "createdAt" || ''');' AS insert_statement
FROM "Notificacion";

-- ============================================
-- 6. EXPORTAR DATOS DE DOCUMENTOS
-- ============================================
-- Ejecuta esto y copia los resultados:
SELECT 
    'INSERT INTO "Documento" (id, "clienteId", tipo, nombre, url, verificado, "createdAt") VALUES (' ||
    '''' || id || ''', ' ||
    '''' || "clienteId" || ''', ' ||
    '''' || tipo || ''', ' ||
    '''' || REPLACE(nombre, '''', '''''') || ''', ' ||
    '''' || url || ''', ' ||
    verificado || ', ' ||
    '''' || "createdAt" || ''');' AS insert_statement
FROM "Documento";

-- ============================================
-- ALTERNATIVA: EXPORTAR TODO EN UN SOLO QUERY
-- ============================================
-- Si prefieres, puedes ejecutar esto para ver todos los datos en formato legible:

-- Ver todos los Admins
SELECT * FROM "Admin";

-- Ver todos los Clientes
SELECT * FROM "Cliente";

-- Ver todos los Vehículos
SELECT * FROM "Vehiculo";

-- Ver todas las Rentas
SELECT * FROM "Renta";

-- Ver todas las Notificaciones
SELECT * FROM "Notificacion";

-- Ver todos los Documentos
SELECT * FROM "Documento";

-- ============================================
-- INSTRUCCIONES:
-- ============================================
-- 1. Ejecuta cada sección (1-6) en Neon Console SQL Editor
-- 2. Copia todos los resultados de INSERT statements
-- 3. Pega esos INSERT statements al final del script BACKUP_COMPLETO_BASE_DATOS.sql
-- 4. Guarda el archivo completo como respaldo
-- 5. Cuando quieras restaurar, ejecuta primero BACKUP_COMPLETO_BASE_DATOS.sql
--    (descomentando las líneas DROP TABLE si quieres empezar desde cero)
-- ============================================
