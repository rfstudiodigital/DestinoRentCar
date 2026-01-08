# Configuración de Base de Datos - Destino Rent Car

## ✅ Base de Datos Neon Configurada

Si ya configuraste `DATABASE_URL` en Vercel, ahora necesitas crear las tablas en la base de datos.

## Opción 1: Migraciones Automáticas (Recomendado para Producción)

Las migraciones se ejecutarán automáticamente durante el build en Vercel si:
- `DATABASE_URL` está configurada
- Estás en producción (`NODE_ENV=production`)

**Para activar esto, haz un redeploy en Vercel** después de configurar `DATABASE_URL`.

## Opción 2: Migraciones Manuales desde tu Máquina Local

1. **Configurar DATABASE_URL localmente**
   - Crea un archivo `.env.local` en la raíz del proyecto
   - Agrega tu URL de Neon (la misma que usaste en Vercel):
     ```
     DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
     ```

2. **Crear la migración inicial**
   ```bash
   npm run db:migrate
   ```
   - Esto creará una carpeta `prisma/migrations` con la migración inicial
   - Te pedirá un nombre para la migración (puedes usar: `init` o `initial_schema`)

3. **Subir los cambios al repositorio**
   ```bash
   git add prisma/migrations
   git commit -m "feat: agregar migración inicial de base de datos"
   git push origin main
   ```

4. **Desplegar en Vercel**
   - Las migraciones se aplicarán automáticamente en el siguiente deployment

## Opción 3: Sincronizar Schema Directamente (Desarrollo/Prueba)

Si prefieres sincronizar el schema sin crear migraciones formales:

```bash
# Asegúrate de tener DATABASE_URL en .env.local
npm run db:push
```

⚠️ **Nota**: `db:push` no crea migraciones, solo sincroniza el schema. Es útil para desarrollo, pero en producción usa `migrate deploy`.

## Verificar que Funciona

Después de crear las tablas, verifica que todo funcione:

1. **Health Check**
   - Visita `/api/health` en tu app desplegada
   - Debería mostrar: `{"status":"ok","database":"connected"}`

2. **Prisma Studio (Local)**
   ```bash
   npm run db:studio
   ```
   - Abre http://localhost:5555
   - Podrás ver y gestionar las tablas visualmente

## Estructura de Tablas Creadas

El esquema de Prisma creará las siguientes tablas:

- **Cliente**: Información de clientes (nombre, email, teléfono, dirección)
- **Vehiculo**: Flota de vehículos (marca, modelo, año, placa, precio, disponibilidad)
- **Renta**: Registros de rentas (cliente, vehículo, fechas, precio total, estado)

## Próximos Pasos

1. ✅ Base de datos Neon configurada
2. ✅ `DATABASE_URL` agregada en Vercel
3. ⏳ Crear migraciones y tablas (elige una opción de arriba)
4. ⏳ Verificar conexión con `/api/health`
5. ⏳ Comenzar a desarrollar las funcionalidades de la aplicación

## Comandos Útiles

```bash
# Generar Prisma Client
npm run db:generate

# Crear nueva migración (desarrollo)
npm run db:migrate

# Aplicar migraciones (producción)
npm run db:migrate:deploy

# Sincronizar schema sin migraciones
npm run db:push

# Abrir Prisma Studio
npm run db:studio
```

