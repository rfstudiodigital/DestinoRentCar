# Instrucciones para poblar la base de datos en Neon Console

## Opción 1: Script Simple (RECOMENDADO)

Usa el archivo **`scripts/seed-simple.sql`** - Este es el más fácil de usar.

### Pasos:

1. **Abre Neon Console:**
   - Ve a tu proyecto en Neon (https://console.neon.tech)
   - Haz clic en tu base de datos
   - Abre el **SQL Editor**

2. **Copia y pega el contenido:**
   - Abre el archivo `scripts/seed-simple.sql` en tu editor
   - Copia TODO el contenido del archivo
   - Pégalo en el SQL Editor de Neon

3. **Ejecuta el script:**
   - Haz clic en **Run** o presiona `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
   - El script insertará:
     - ✅ 12 vehículos ficticios con imágenes
     - ✅ 8 clientes ficticios uruguayos

4. **Verifica los datos:**
   - Ejecuta: `SELECT COUNT(*) FROM "Vehiculo";` (debería mostrar 12)
   - Ejecuta: `SELECT COUNT(*) FROM "Cliente";` (debería mostrar 8)

---

## Opción 2: Script con UUIDs

Si prefieres usar IDs generados automáticamente, usa **`scripts/seed.sql`**.

**Nota:** Este script usa `gen_random_uuid()` que está disponible en PostgreSQL por defecto.

---

## Características del script:

✅ **INSERT con ON CONFLICT:** Si ya existen vehículos con las mismas placas o clientes con los mismos emails, se actualizarán en lugar de crear duplicados

✅ **Datos realistas:** 
- Vehículos con marcas y modelos populares en Uruguay
- Precios en pesos uruguayos
- Imágenes de Unsplash
- Teléfonos en formato uruguayo (+598)

✅ **Fechas automáticas:** Usa `NOW()` para createdAt y updatedAt

---

## Datos que se insertarán:

### Vehículos (12):
- Toyota Corolla 2023 - $2,500/día
- Chevrolet Onix 2024 - $2,200/día
- Volkswagen Gol 2023 - $2,100/día
- Ford Ranger 2024 - $4,500/día
- Fiat Cronos 2023 - $2,300/día
- Renault Duster 2024 - $3,800/día
- Peugeot 208 2023 - $2,400/día
- Nissan Frontier 2024 - $4,200/día
- Suzuki Vitara 2023 - $3,200/día
- Hyundai HB20 2024 - $2,250/día
- Chevrolet Cruze 2023 - $2,800/día
- Volkswagen Amarok 2024 - $4,800/día

### Clientes (8):
- Juan Pérez - juan.perez@email.com
- María González - maria.gonzalez@email.com
- Carlos Rodríguez - carlos.rodriguez@email.com
- Ana Martínez - ana.martinez@email.com
- Luis Fernández - luis.fernandez@email.com
- Laura Silva - laura.silva@email.com
- Pedro López - pedro.lopez@email.com
- Carmen Díaz - carmen.diaz@email.com

---

## Troubleshooting:

**Error: "relation does not exist"**
- Asegúrate de haber ejecutado las migraciones de Prisma primero
- Ejecuta: `npx prisma migrate dev` o `npx prisma db push`

**Error: "duplicate key value"**
- Esto es normal si ya existen los datos
- El script usa `ON CONFLICT` para actualizar en lugar de fallar

**Las imágenes no se muestran:**
- Verifica que `next.config.js` tenga configurado el dominio de Unsplash
- Asegúrate de que la URL de la imagen sea correcta
