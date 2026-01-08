# Guía de Diagnóstico - Problemas con Base de Datos

## Pasos para Diagnosticar el Problema

### 1. Verificar Endpoint de Debug
Visita en tu navegador:
```
https://tu-app.vercel.app/api/debug
```

Este endpoint te mostrará:
- Si DATABASE_URL está configurada
- Si Prisma Client está disponible
- Si las tablas existen
- Conteo de registros
- Errores específicos con sugerencias

### 2. Verificar Endpoint de Health
Visita:
```
https://tu-app.vercel.app/api/health
```

Esto te mostrará:
- Estado de conexión
- Conteo de datos

### 3. Verificar Logs en Vercel

1. Ve a tu proyecto en Vercel
2. Deployments > Último deployment
3. Abre "Functions" o "Logs"
4. Busca mensajes con:
   - `❌` - Errores
   - `✅` - Operaciones exitosas
   - `⚠️` - Advertencias

### 4. Verificar en la Consola del Navegador

1. Abre tu aplicación en el navegador
2. Presiona F12 (DevTools)
3. Ve a la pestaña "Console"
4. Busca mensajes:
   - `📡 Respuesta API vehículos:` - Estado HTTP
   - `✅ Vehículos recibidos:` - Datos recibidos
   - `❌ Error en API vehículos:` - Si hay error

### 5. Verificar Variables de Entorno en Vercel

1. Ve a Settings > Environment Variables
2. Verifica que `DATABASE_URL` esté configurada
3. Para Neon, debe tener este formato:
   ```
   postgresql://user:password@ep-xxx-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### 6. Verificar que las Tablas Existan

Si el error es "table does not exist" (P2021):

1. Localmente, ejecuta:
   ```bash
   npx prisma db push
   ```

2. O crea una migración:
   ```bash
   npx prisma migrate dev --name init
   ```

3. En producción, aplica migraciones:
   ```bash
   npx prisma migrate deploy
   ```

### 7. Problemas Comunes y Soluciones

#### Error: "PrismaClient is undefined"
**Solución:**
- Verifica que `prisma generate` se ejecute en el build
- Revisa el script `prebuild` en `package.json`

#### Error: "Connection timeout"
**Solución:**
- Verifica que Neon esté activo
- Usa la URL con pooler: `ep-xxx-pooler.neon.tech`
- Agrega `?connect_timeout=15` a DATABASE_URL

#### Error: "SSL connection required"
**Solución:**
- Agrega `?sslmode=require` a tu DATABASE_URL
- Formato: `postgresql://user:pass@host/db?sslmode=require`

#### Error: "Table does not exist" (P2021)
**Solución:**
- Ejecuta `npx prisma db push` localmente
- O crea migraciones con `npx prisma migrate dev`

#### Error 500 sin mensaje claro
**Solución:**
- Revisa los logs en Vercel
- Visita `/api/debug` para diagnóstico detallado
- Verifica que Prisma Client se haya generado en el build

### 8. Verificar Build Logs

En Vercel, revisa los logs del build para ver si:
- `prisma generate` se ejecutó correctamente
- Hay errores de TypeScript
- Prisma Client se generó sin errores

### 9. Test Local

Para probar localmente:

1. Configura `.env.local` con tu DATABASE_URL
2. Ejecuta:
   ```bash
   npm run db:generate
   npm run dev
   ```
3. Visita `http://localhost:3000/api/vehiculos`
4. Verifica si funciona localmente

Si funciona localmente pero no en Vercel:
- Problema de configuración de entorno
- Problema con connection pooling
- Problema con SSL/TLS

### 10. Contactar Soporte

Si nada funciona, proporciona:
- Resultado de `/api/debug`
- Logs de Vercel (últimas 100 líneas)
- Formato de DATABASE_URL (sin contraseña)
- Mensaje de error exacto de la consola del navegador
