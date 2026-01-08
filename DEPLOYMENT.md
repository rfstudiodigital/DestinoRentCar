# Guía de Despliegue - Destino Rent Car

## Configuración de Neon Database

1. **Crear una cuenta en Neon**
   - Ve a https://neon.tech y crea una cuenta
   - Crea un nuevo proyecto

2. **Obtener la URL de conexión**
   - En el dashboard de Neon, copia la URL de conexión
   - Formato: `postgresql://user:password@host/database?sslmode=require`

3. **Configurar variable de entorno**
   - En desarrollo: crea un archivo `.env.local` con:
     ```
     DATABASE_URL="tu_url_de_neon_aqui"
     ```
   - En Vercel: agrega `DATABASE_URL` como variable de entorno en la configuración del proyecto

## Configuración de Vercel

1. **Instalar Vercel CLI (opcional)**
   ```bash
   npm i -g vercel
   ```

2. **Conectar repositorio**
   - Ve a https://vercel.com
   - Importa tu repositorio de GitHub/GitLab
   - Vercel detectará automáticamente Next.js

3. **Configurar variables de entorno**
   - En la configuración del proyecto en Vercel
   - Agrega `DATABASE_URL` con tu URL de Neon

4. **Configurar build command**
   - El build se ejecuta automáticamente con `npm run build`
   - Esto generará Prisma Client y construirá Next.js

## Migración de Base de Datos

Después de configurar la URL de la base de datos:

```bash
# Generar Prisma Client
npm run db:generate

# Ejecutar migraciones (desarrollo)
npm run db:migrate

# O sincronizar el esquema (sin migraciones)
npm run db:push
```

Para producción, ejecuta las migraciones después del primer despliegue o usa `prisma migrate deploy` en el build de Vercel.

## Verificación

1. **Verificar conexión**
   - Despliega la aplicación
   - Visita `/api/health` para verificar la conexión a la base de datos

2. **Prisma Studio (opcional)**
   ```bash
   npm run db:studio
   ```
   - Abre http://localhost:5555 para gestionar la base de datos visualmente

## Notas Importantes

- La PWA solo funciona en producción o con HTTPS
- Asegúrate de que las variables de entorno estén configuradas correctamente
- El service worker se genera automáticamente con `next-pwa`

