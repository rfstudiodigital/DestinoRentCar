# Guía de Solución de Problemas - Base de Datos

## Problema: No se cargan datos de la base de datos

### Diagnóstico Rápido

1. **Verificar endpoint de salud:**
   ```
   https://tu-app.vercel.app/api/health
   ```
   
   Debe retornar:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "data": {
       "vehiculos": X,
       "clientes": Y,
       "rentas": Z
     }
   }
   ```

2. **Verificar en la consola del navegador:**
   - Abre las DevTools (F12)
   - Ve a la pestaña "Console"
   - Busca mensajes con 📡, ✅, o ❌
   - Los logs te dirán exactamente qué está pasando

3. **Verificar logs en Vercel:**
   - Ve a tu proyecto en Vercel
   - Deployments > Último deployment > "Functions" o "Logs"
   - Busca mensajes de error relacionados con Prisma o la base de datos

### Problemas Comunes

#### 1. DATABASE_URL con formato incorrecto

**Síntoma:** Error de conexión o "Base de datos no configurada"

**Solución para Neon:**
El DATABASE_URL de Neon debe incluir `?sslmode=require` o usar connection pooling:

```
postgresql://user:password@host.neon.tech/dbname?sslmode=require&pgbouncer=true&connect_timeout=15
```

**Verificar en Vercel:**
1. Ve a Settings > Environment Variables
2. Verifica que `DATABASE_URL` esté configurada
3. Asegúrate de que no tenga espacios extra
4. Verifica que use `?sslmode=require` para Neon

#### 2. Connection Pooling en Serverless

**Problema:** Vercel usa funciones serverless que requieren connection pooling.

**Solución:** Para Neon, usa la URL con `pgbouncer=true`:

```
postgresql://user:password@ep-xxx-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

O configura Prisma con connection pooling:

En `DATABASE_URL`, agrega:
```
?connection_limit=1&pool_timeout=20
```

#### 3. Timeout en Queries

**Síntoma:** Las queries se cuelgan o timeout

**Solución:** Agrega timeout a Prisma Client:

```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connect_timeout=10',
    },
  },
});
```

#### 4. Schema no sincronizado

**Síntoma:** Error "Table does not exist" o campos faltantes

**Solución:**
1. Ejecuta localmente: `npx prisma db push`
2. O crea una migración: `npx prisma migrate dev --name init`
3. En producción, aplica migraciones: `npx prisma migrate deploy`

### Scripts de Diagnóstico

#### Verificar estado de la base de datos:
```bash
npm run db:check
```

Este script te mostrará:
- Si DATABASE_URL está configurada
- Estado de conexión
- Cantidad de registros en cada tabla

#### Crear datos de ejemplo:
```bash
npm run db:seed
```

Este script creará:
- 5 vehículos de ejemplo
- 2 clientes de ejemplo
- 1 renta de ejemplo

### Verificación Manual

1. **Probar conexión directamente:**
   ```bash
   npx prisma studio
   ```
   
   Esto abre Prisma Studio en `http://localhost:5555` y te permite ver todos los datos directamente.

2. **Verificar con query directa:**
   ```bash
   npx prisma db execute --stdin
   ```
   
   Luego ejecuta:
   ```sql
   SELECT COUNT(*) FROM "Vehiculo";
   ```

### Logs a Revisar

En el navegador (F12 > Console):
- `📡 Respuesta API vehículos:` - Estado de la respuesta HTTP
- `✅ Vehículos recibidos:` - Cantidad de vehículos
- `❌ Error cargando vehículos:` - Si hay un error

En Vercel (Logs del servidor):
- `🔍 Buscando vehículos con filtro:` - Qué filtro se está usando
- `✅ Vehículos encontrados:` - Cantidad encontrada en la BD
- `❌ Error obteniendo vehículos:` - Si hay error en el servidor

### Próximos Pasos si el Problema Persiste

1. **Revisar formato de DATABASE_URL:**
   - Debe empezar con `postgresql://`
   - No debe tener espacios
   - Debe incluir `?sslmode=require` para Neon

2. **Verificar que Neon esté activo:**
   - Ve al dashboard de Neon
   - Verifica que el proyecto esté activo
   - Verifica que no haya límites de conexión alcanzados

3. **Probar con Prisma Studio localmente:**
   - Configura DATABASE_URL localmente
   - Ejecuta `npx prisma studio`
   - Si funciona localmente pero no en Vercel, es un problema de configuración de conexión

4. **Contactar soporte:**
   Si nada funciona, incluye:
   - Logs de Vercel
   - Logs de la consola del navegador
   - Estado del endpoint `/api/health`
   - Formato de DATABASE_URL (sin contraseña)