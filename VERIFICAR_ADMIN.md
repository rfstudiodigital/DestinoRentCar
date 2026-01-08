# Verificación de Tabla Admin en Neon

## Problema: "Error al procesar el login"

Si estás viendo este error, probablemente la tabla `Admin` no existe en tu base de datos Neon.

## Solución: Ejecutar SQL en Neon Console

1. **Ve a Neon Console**: https://console.neon.tech
2. **Abre tu base de datos** → **SQL Editor**
3. **Ejecuta este código**:

```sql
-- Verificar si la tabla Admin existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'Admin'
);
```

Si devuelve `false` o no hay resultados, la tabla no existe. Ejecuta esto:

```sql
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

INSERT INTO "Admin" (id, email, password, nombre, "createdAt", "updatedAt")
VALUES 
  ('admin-001', 'admin@demo.com', 'Admin123', 'Administrador', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  nombre = EXCLUDED.nombre,
  "updatedAt" = NOW();

-- ============================================
-- VERIFICAR (opcional)
-- ============================================

SELECT id, email, nombre, "createdAt" FROM "Admin";
```

## Después de crear la tabla

1. Espera unos segundos para que la base de datos se actualice
2. Intenta hacer login nuevamente con:
   - **Email**: `admin@demo.com`
   - **Password**: `Admin123`

## Si sigue fallando

1. Verifica que la tabla se creó correctamente ejecutando:
   ```sql
   SELECT * FROM "Admin";
   ```
   Deberías ver una fila con el email `admin@demo.com`

2. Verifica que Prisma puede acceder a la tabla. Si estás en producción (Vercel), puede que necesites regenerar Prisma Client:
   ```bash
   npx prisma generate
   ```

3. Revisa los logs de la consola del navegador (F12) para ver el error específico
