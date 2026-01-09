-- ============================================
-- SCRIPT PARA EXPORTAR TODOS LOS DATOS EN UN SOLO PASO
-- Destino Rent Car - Sistema de Renta de Autos
-- ============================================
-- Ejecuta este script completo en Neon Console SQL Editor
-- Copia TODOS los resultados y pégalos en BASE_DATOS_COMPLETA.sql
-- ============================================

-- ============================================
-- EXPORTAR TODOS LOS DATOS COMO INSERT STATEMENTS
-- ============================================

-- 1. EXPORTAR ADMIN
SELECT 
    'INSERT INTO "Admin" (id, email, password, nombre, "createdAt", "updatedAt") VALUES (' ||
    '''' || id || ''', ' ||
    '''' || email || ''', ' ||
    '''' || password || ''', ' ||
    COALESCE('''' || nombre || '''', 'NULL') || ', ' ||
    '''' || "createdAt" || ''', ' ||
    '''' || "updatedAt" || ''');' AS insert_statement
FROM "Admin"
UNION ALL

-- 2. EXPORTAR CLIENTES
SELECT 
    'INSERT INTO "Cliente" (id, nombre, email, telefono, direccion, "createdAt", "updatedAt") VALUES (' ||
    '''' || id || ''', ' ||
    '''' || REPLACE(nombre, '''', '''''') || ''', ' ||
    '''' || email || ''', ' ||
    '''' || telefono || ''', ' ||
    COALESCE('''' || REPLACE(direccion, '''', '''''') || '''', 'NULL') || ', ' ||
    '''' || "createdAt" || ''', ' ||
    '''' || "updatedAt" || ''');' AS insert_statement
FROM "Cliente"
UNION ALL

-- 3. EXPORTAR VEHÍCULOS
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
FROM "Vehiculo"
UNION ALL

-- 4. EXPORTAR RENTAS
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
FROM "Renta"
UNION ALL

-- 5. EXPORTAR NOTIFICACIONES
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
FROM "Notificacion"
UNION ALL

-- 6. EXPORTAR DOCUMENTOS
SELECT 
    'INSERT INTO "Documento" (id, "clienteId", tipo, nombre, url, verificado, "createdAt") VALUES (' ||
    '''' || id || ''', ' ||
    '''' || "clienteId" || ''', ' ||
    '''' || tipo || ''', ' ||
    '''' || REPLACE(nombre, '''', '''''') || ''', ' ||
    '''' || url || ''', ' ||
    verificado || ', ' ||
    '''' || "createdAt" || ''');' AS insert_statement
FROM "Documento"
ORDER BY insert_statement;

-- ============================================
-- INSTRUCCIONES:
-- ============================================
-- 1. Ejecuta este script completo en Neon Console SQL Editor
-- 2. Copia TODOS los resultados (todos los INSERT statements)
-- 3. Abre el archivo BASE_DATOS_COMPLETA.sql
-- 4. Ve a la sección "PASO 4: INSERTAR DATOS"
-- 5. Pega todos los INSERT statements ahí (reemplaza los ejemplos comentados)
-- 6. Guarda el archivo BASE_DATOS_COMPLETA.sql
-- 7. Ahora tienes un backup completo de tu base de datos
-- ============================================
