# Script de Seed (Población de Base de Datos)

Este script permite poblar la base de datos con datos ficticios de vehículos y clientes.

## Requisitos

- Base de datos configurada (`DATABASE_URL` en `.env.local`)
- Prisma Client generado (`npm run db:generate`)

## Ejecutar el script

```bash
npm run db:seed
```

O directamente con tsx:

```bash
npx tsx scripts/seed.ts
```

## Datos que se crearán

### Vehículos (12 vehículos)
- Varias marcas y modelos populares en Uruguay
- Precios en pesos uruguayos
- Imágenes de Unsplash
- Descripciones detalladas

### Clientes (8 clientes)
- Nombres y datos ficticios
- Teléfonos uruguayos (+598)
- Direcciones en Montevideo
- Emails únicos

## Nota

El script usa `upsert`, por lo que:
- Si un vehículo con la misma placa ya existe, se actualizará
- Si un cliente con el mismo email ya existe, se actualizará
- Si no existen, se crearán nuevos registros

Para limpiar datos existentes antes del seed, descomenta las líneas de `deleteMany()` en el script.
