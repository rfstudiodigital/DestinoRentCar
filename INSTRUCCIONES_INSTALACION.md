# 📋 Instrucciones de Instalación - Sistema de Notificaciones

## ⚠️ IMPORTANTE: Pasos Requeridos

Para que todas las nuevas funcionalidades funcionen correctamente, necesitas ejecutar estos pasos:

### Paso 1: Actualizar el Schema de Prisma

Abre el archivo `prisma/schema.prisma` y **agrega** el siguiente modelo al final del archivo (después del modelo Admin):

```prisma
model Cliente {
  id        String   @id @default(cuid())
  nombre    String
  email     String   @unique
  telefono  String
  direccion String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  rentas    Renta[]
  notificaciones Notificacion[]  // Agregar esta línea
}

model Renta {
  id              String   @id @default(cuid())
  clienteId       String
  vehiculoId      String
  fechaInicio     DateTime
  fechaFin        DateTime
  precioTotal     Float
  estado          String   @default("pendiente") // Cambiar de "activa" a "pendiente"
  observaciones   String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  cliente         Cliente  @relation(fields: [clienteId], references: [id], onDelete: Cascade)
  vehiculo        Vehiculo @relation(fields: [vehiculoId], references: [id], onDelete: Cascade)
  
  @@index([clienteId])
  @@index([vehiculoId])
  @@index([estado])  // Agregar este índice
  @@index([fechaInicio, fechaFin])
}

// Agregar todo este modelo al final del archivo:
model Notificacion {
  id        String   @id @default(cuid())
  clienteId String?  // null para notificaciones de admin
  adminId   String?  // null para notificaciones de cliente, o 'admin' para todas las notificaciones de admin
  tipo      String   // nueva_reserva, reserva_confirmada, reserva_cancelada, reserva_rechazada, recordatorio, etc.
  titulo    String
  mensaje   String
  leida     Boolean  @default(false)
  url       String?  // Link a la página relacionada (ej: /admin, /rentas)
  rentaId   String?  // ID de la renta relacionada
  createdAt DateTime @default(now())
  
  cliente   Cliente? @relation(fields: [clienteId], references: [id], onDelete: Cascade)
  
  @@index([clienteId])
  @@index([adminId])
  @@index([leida])
  @@index([tipo])
  @@index([createdAt])
  @@index([rentaId])
}
```

### Paso 2: Ejecutar el Script SQL en Neon Console

1. Abre tu base de datos en Neon Console
2. Ve a la pestaña "SQL Editor"
3. Copia y pega el contenido del archivo `scripts/add-notifications-system.sql`
4. Ejecuta el script

Este script creará:
- La tabla `Notificacion` con todos sus campos
- Los índices necesarios para optimizar las consultas
- Actualizará el estado por defecto de las rentas a "pendiente"

### Paso 3: Sincronizar Prisma con la Base de Datos

Después de ejecutar el SQL, sincroniza Prisma:

```bash
npx prisma db push
```

### Paso 4: Regenerar Prisma Client

```bash
npx prisma generate
```

### Paso 5: Reiniciar la Aplicación

Si estás ejecutando en desarrollo:

```bash
npm run dev
```

Si estás desplegando en Vercel, los cambios se aplicarán automáticamente en el próximo deploy.

## ✅ Verificación

Después de completar estos pasos:

1. **Crear una reserva como cliente**: Debe crear una notificación para el admin
2. **Ir al panel de admin**: Debe aparecer la campana de notificaciones con el contador
3. **Ver la reserva pendiente**: En la pestaña "Rentas" debe aparecer con estado "Pendiente"
4. **Aprobar la reserva**: Debe crear una notificación para el cliente y cambiar el estado a "Activa"

## 🐛 Si Algo No Funciona

### Error: "Notificacion model not found"
- Verifica que ejecutaste el script SQL
- Regenera Prisma Client: `npx prisma generate`
- Verifica que el schema.prisma tiene el modelo Notificacion

### Error: "Cannot update many records"
- Verifica que la tabla Notificacion existe en la base de datos
- Revisa los logs de la base de datos en Neon Console

### Las notificaciones no aparecen
- Abre las herramientas de desarrollador del navegador (F12)
- Revisa la pestaña "Network" para ver si hay errores en las llamadas a la API
- Verifica que los headers de autenticación están correctos

## 📞 Soporte

Si tienes problemas, revisa:
1. El archivo `MEJORAS_IMPLEMENTADAS.md` para ver qué se cambió
2. Los logs de la consola del navegador
3. Los logs de Vercel (si está desplegado)
