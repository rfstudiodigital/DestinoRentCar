# Variables de Entorno para Vercel

## Variables Requeridas

### `DATABASE_URL`

- **Descripción**: URL de conexión a la base de datos Neon (PostgreSQL)
- **Formato**: `postgresql://user:password@host:5432/database?sslmode=require`
- **Ejemplo**: `postgresql://usuario:password123@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
- **Requerida**: ✅ SÍ (obligatoria)
- **Dónde obtenerla**:
  1. Ve a tu proyecto en Neon (https://console.neon.tech)
  2. Ve a la sección "Connection Details" o "Connection String"
  3. Copia la cadena de conexión completa
  4. Debe incluir `?sslmode=require` al final

## Variables Opcionales (pero recomendadas)

### `NEXT_PUBLIC_APP_URL`

- **Descripción**: URL pública de tu aplicación desplegada en Vercel
- **Formato**: `https://tu-app.vercel.app`
- **Ejemplo**: `https://destino-rent-car.vercel.app`
- **Requerida**: ❌ NO (opcional)
- **Cuándo configurarla**:
  - Si usas funcionalidades que requieren la URL absoluta de la app
  - Si necesitas configurar CORS o redirecciones
  - Esta variable se puede obtener automáticamente de Vercel después del primer despliegue

## Variables Automáticas (no necesitas configurarlas)

Vercel configura automáticamente estas variables:

- `NODE_ENV` = `production` (en producción)
- `VERCEL` = `1`
- `VERCEL_ENV` = `production` | `preview` | `development`

## Cómo configurar en Vercel

1. **Ir a la configuración del proyecto**

   - Ve a tu proyecto en Vercel Dashboard
   - Click en "Settings" → "Environment Variables"

2. **Agregar `DATABASE_URL`**

   - Name: `DATABASE_URL`
   - Value: Tu URL completa de Neon (con `?sslmode=require`)
   - Environment: Marca todas (Production, Preview, Development)

3. **Agregar `NEXT_PUBLIC_APP_URL` (opcional)**

   - Name: `NEXT_PUBLIC_APP_URL`
   - Value: `https://tu-dominio.vercel.app` (lo puedes actualizar después del primer deploy)
   - Environment: Marca todas

4. **Guardar y redeployar**
   - Guarda los cambios
   - Ve a "Deployments" y haz click en "Redeploy" en el último deployment

## Ejemplo de configuración completa

```
DATABASE_URL=postgresql://usuario:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_APP_URL=https://destino-rent-car.vercel.app
```

## Verificación

Después de configurar las variables y desplegar, verifica que todo funcione:

1. **Health Check**: Visita `/api/health` en tu app desplegada

   - Debería mostrar: `{"status":"ok","database":"connected"}`

2. **Logs en Vercel**:
   - Ve a "Deployments" → Click en el deployment → "Logs"
   - Verifica que no haya errores de conexión a la base de datos

## Notas Importantes

⚠️ **Seguridad**:

- NUNCA subas el archivo `.env.local` al repositorio
- Las variables de entorno en Vercel están encriptadas y seguras

⚠️ **Base de datos**:

- Después de configurar `DATABASE_URL`, necesitas ejecutar las migraciones:
  ```bash
  npx prisma migrate deploy
  ```
  O puedes agregarlo al build command en `package.json`:
  ```json
  "build": "prisma generate && prisma migrate deploy && next build"
  ```
