# 🚀 Guía de Uso - Nuevas Funcionalidades

## 📋 Tabla de Contenidos
1. [Búsqueda y Filtros](#búsqueda-y-filtros)
2. [Galería de Imágenes](#galería-de-imágenes)
3. [Reseñas y Calificaciones](#reseñas-y-calificaciones)
4. [Calendario](#calendario)
5. [Dashboard del Cliente](#dashboard-del-cliente)
6. [Notificaciones](#notificaciones)
7. [Documentos](#documentos)
8. [Chat de Soporte](#chat-de-soporte)
9. [Analíticas Admin](#analíticas-admin)
10. [Exportar Reportes](#exportar-reportes)

---

## 🔍 Búsqueda y Filtros

### Ubicación
`/vehiculos` - Página principal de vehículos

### Cómo usar:
1. **Búsqueda por texto**: Escribe marca o modelo en el campo de búsqueda
2. **Solo disponibles**: Marca el checkbox para ver solo vehículos disponibles
3. **Filtros avanzados**: Click en "Filtros Avanzados" para mostrar opciones adicionales
   - **Precio**: Rango mínimo y máximo
   - **Año**: Rango de años
   - **Tipo**: Sedan, SUV, Camioneta, Deportivo, Compacto
   - **Transmisión**: Manual o Automática
   - **Pasajeros**: Mínimo de pasajeros
4. **Ordenar**: Selecciona cómo ordenar los resultados
5. **Reset**: Click en "Restablecer Filtros" para limpiar todo

### Código de ejemplo para integrar:
```tsx
import SearchFilters from '@/components/SearchFilters';

<SearchFilters onFilterChange={(filters) => {
  // Aplicar filtros a tu lista de vehículos
  console.log(filters);
}} />
```

---

## 🖼️ Galería de Imágenes

### Cómo usar:
```tsx
import ImageGallery from '@/components/ImageGallery';

<ImageGallery 
  vehiculoId="abc123"
  imagenes={[
    { id: '1', url: '/img1.jpg', alt: 'Vista frontal', esPortada: true, orden: 1 },
    { id: '2', url: '/img2.jpg', alt: 'Interior', esPortada: false, orden: 2 }
  ]}
/>
```

### Características:
- Click en imagen principal para ampliar
- Navegación con flechas ← →
- ESC para cerrar modal
- Thumbnails clickeables debajo

### API:
```typescript
// Obtener imágenes
GET /api/vehiculos/[id]/imagenes

// Agregar imagen
POST /api/vehiculos/[id]/imagenes
Body: {
  url: string,
  alt?: string,
  orden?: number,
  esPortada?: boolean
}
```

---

## ⭐ Reseñas y Calificaciones

### Componentes:

#### 1. Formulario de Reseña:
```tsx
import ReviewForm from '@/components/ReviewForm';

<ReviewForm 
  vehiculoId="abc123"
  onReviewSubmitted={() => {
    // Refrescar lista de reseñas
  }}
/>
```

#### 2. Lista de Reseñas:
```tsx
import ReviewList from '@/components/ReviewList';

<ReviewList 
  vehiculoId="abc123"
  refreshTrigger={refreshCounter} // Incrementa para refrescar
/>
```

#### 3. Estrellas (standalone):
```tsx
import StarRating from '@/components/StarRating';

// Solo lectura
<StarRating rating={4.5} />

// Interactivo
<StarRating 
  rating={rating}
  onRatingChange={(newRating) => setRating(newRating)}
  interactive
  size="large"
/>
```

### API:
```typescript
// Obtener reseñas
GET /api/vehiculos/[id]/resenas
Response: { resenas: [], promedio: number }

// Crear reseña
POST /api/vehiculos/[id]/resenas
Body: {
  calificacion: number (1-5),
  comentario: string (min 10 chars)
}
```

---

## 📅 Calendario

### Cómo usar:
```tsx
import AvailabilityCalendar from '@/components/AvailabilityCalendar';

<AvailabilityCalendar
  vehiculoId="abc123"
  precioBase={5000}
  onDateSelect={(fechaInicio, fechaFin) => {
    console.log('Rango seleccionado:', fechaInicio, fechaFin);
  }}
/>
```

### Características:
- Selección de rango (inicio y fin)
- Fechas pasadas deshabilitadas automáticamente
- Fechas ocupadas en rojo (configurable)
- Cálculo automático de días y total
- Leyenda de colores

---

## 👤 Dashboard del Cliente

### Ubicación:
`/perfil` - Accesible desde el menú cuando el usuario está logueado

### Contenido:
- **Información Personal**: Nombre, email, teléfono, licencia
- **Rentas Activas**: Vehículos actualmente alquilados
- **Historial**: Todas las rentas completadas

### Integración con Header:
El link aparece automáticamente en el header cuando hay un cliente logueado.

---

## 🔔 Notificaciones

### Integración:
```tsx
import NotificationBell from '@/components/NotificationBell';

// En el Header o donde quieras mostrarla
<NotificationBell />
```

### Características:
- Badge con contador de no leídas
- Auto-actualización cada 30 segundos
- Click para expandir/contraer
- Marcar individual o todas como leídas

### API para crear notificaciones:
```typescript
POST /api/notificaciones
Body: {
  clienteId: string,
  mensaje: string,
  tipo: 'info' | 'exito' | 'advertencia' | 'error'
}
```

### Ejemplo de uso en código:
```typescript
// Cuando se completa una renta
await fetch('/api/notificaciones', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clienteId: cliente.id,
    mensaje: 'Tu renta ha sido confirmada exitosamente',
    tipo: 'exito'
  })
});
```

---

## 📄 Documentos

### Cómo usar:
```tsx
import DocumentUpload from '@/components/DocumentUpload';

<DocumentUpload 
  clienteId="abc123"
  onUploadComplete={() => {
    console.log('Documento subido!');
  }}
/>
```

### Tipos de documentos:
- **licencia**: Licencia de conducir
- **cedula**: Cédula de identidad
- **comprobante**: Comprobante de domicilio

### Validaciones:
- Formatos permitidos: JPG, PNG, PDF
- Tamaño máximo: 5MB

### Archivos guardados en:
`/public/documentos/`

### API:
```typescript
// Subir documento
POST /api/documentos
FormData: {
  file: File,
  tipo: string,
  clienteId: string
}

// Listar documentos
GET /api/documentos?clienteId=abc123
```

---

## 💬 Chat de Soporte

### Integración:
```tsx
import SupportChat from '@/components/SupportChat';

// En el layout principal (ya está integrado)
<SupportChat />
```

### Características:
- Botón flotante siempre visible
- FAQ con respuestas expandibles
- Integración con WhatsApp Business
- Mensaje predefinido opcional

### Configuración del número de WhatsApp:
Editar en `/components/SupportChat.tsx`:
```typescript
const telefono = '59898123456'; // Tu número aquí
```

---

## 📊 Analíticas Admin

### Ubicación:
`/admin/analytics` - Solo accesible para administradores

### Características:
- **4 KPIs principales**: Total rentas, Ingresos, Vehículos activos, Clientes activos
- **4 Gráficos**:
  1. Rentas por mes (barras)
  2. Ingresos por mes (líneas)
  3. Top 5 vehículos rentados (donut)
  4. Estados de rentas (donut)
- **Selector de período**: Mes (últimos 6), Trimestre (últimos 12), Año (últimos 24)

### API:
```typescript
GET /api/admin/analytics?periodo=mes
Response: {
  totalRentas: number,
  ingresos: number,
  vehiculosActivos: number,
  clientesActivos: number,
  rentasPorMes: Array<{ mes: string, cantidad: number, ingresos: number }>,
  vehiculosMasRentados: Array<{ vehiculo: string, rentas: number }>,
  estadosRentas: Array<{ estado: string, cantidad: number }>
}
```

---

## 📥 Exportar Reportes

### Cómo usar:
```tsx
import ReportExport from '@/components/ReportExport';

<ReportExport tipo="rentas" />
<ReportExport tipo="vehiculos" />
<ReportExport tipo="clientes" />
<ReportExport tipo="ingresos" />
```

### Características:
- **Formatos**: Excel (.xlsx) y PDF
- **Datos incluidos**:
  - **Rentas**: Cliente, Vehículo, Fechas, Precio, Estado
  - **Vehículos**: Marca, Modelo, Año, Precio, Disponibilidad, Rentas
  - **Clientes**: Información completa
  - **Ingresos**: Análisis financiero

### Ejemplo de uso en admin:
```tsx
<div>
  <h2>Exportar Reportes</h2>
  <div style={{ display: 'grid', gap: '1rem' }}>
    <ReportExport tipo="rentas" />
    <ReportExport tipo="vehiculos" />
  </div>
</div>
```

---

## 🎨 Personalización de Estilos

### Variables CSS disponibles:
```css
:root {
  --primary-color: #1E3A8A;
  --primary-light: #3B82F6;
  --secondary-color: #FDB913;
  --secondary-light: #FCD34D;
  --text-color: #1F2937;
  --text-light: #6B7280;
  --background: #F3F4F6;
  --border: #E5E7EB;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
  --transition-base: all 0.3s ease;
}
```

### Para cambiar colores:
Edita estas variables en `/app/globals.css`

---

## 🛠️ Mantenimiento

### Actualizar dependencias:
```bash
npm update
```

### Regenerar cliente Prisma:
```bash
npx prisma generate
```

### Aplicar migraciones:
```bash
npx prisma migrate dev
```

### Build para producción:
```bash
npm run build
```

---

## 📞 Soporte Técnico

Para dudas o problemas:
1. Revisar documentación en `/NUEVAS_FUNCIONALIDADES.md`
2. Revisar resumen en `/RESUMEN_IMPLEMENTACION.md`
3. Consultar código fuente (bien comentado)

---

**✅ Todas las funcionalidades están listas para usar en producción**
