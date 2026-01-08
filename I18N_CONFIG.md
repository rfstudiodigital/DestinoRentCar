# Configuración de Internacionalización (i18n)

## Descripción

El sistema incluye soporte completo para múltiples idiomas usando **next-intl**. Actualmente soporta:
- 🇪🇸 **Español (es)** - Idioma por defecto
- 🇺🇸 **English (en)** - Inglés

## Archivos Creados

### 1. Configuración
- `i18n.config.ts` - Configuración principal de i18n
- `messages/es.json` - Traducciones en español
- `messages/en.json` - Traducciones en inglés

### 2. Componentes
- `components/LocaleSwitcher.tsx` - Selector de idioma
- `components/LocaleSwitcher.module.css` - Estilos del selector

### 3. Integración
- El selector de idioma está integrado en el `Header.tsx`
- Aparece entre los botones de usuario/login y el botón PWA

## Uso del Selector de Idioma

El componente `LocaleSwitcher` muestra botones con banderas para cambiar entre idiomas:

```tsx
<LocaleSwitcher />
```

### Características
- **Almacenamiento Local**: La preferencia de idioma se guarda en `localStorage`
- **Indicador Visual**: El idioma activo se muestra con un estilo diferente
- **Banderas**: Cada idioma tiene su bandera (🇪🇸 🇺🇸)
- **Responsive**: En móviles solo muestra las banderas

## Estructura de Traducciones

Todas las traducciones están organizadas por secciones en JSON:

```json
{
  "nav": { ... },           // Navegación
  "home": { ... },          // Página principal
  "vehicles": { ... },      // Vehículos
  "vehicleDetail": { ... }, // Detalle de vehículo
  "rentals": { ... },       // Rentas
  "auth": { ... },          // Autenticación
  "admin": { ... },         // Admin
  "common": { ... }         // Común
}
```

## Cómo Usar las Traducciones en Componentes

Para usar las traducciones en tus componentes:

```typescript
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('vehicles');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

## Agregar Nuevas Traducciones

### 1. Editar los archivos JSON
Agrega las nuevas claves en ambos archivos:

**messages/es.json:**
```json
{
  "newSection": {
    "newKey": "Texto en español"
  }
}
```

**messages/en.json:**
```json
{
  "newSection": {
    "newKey": "Text in English"
  }
}
```

### 2. Usar en componentes
```typescript
const t = useTranslations('newSection');
<p>{t('newKey')}</p>
```

## Agregar Nuevos Idiomas

Para agregar un nuevo idioma (ej: Francés):

### 1. Crear archivo de traducciones
Crear `messages/fr.json` con todas las traducciones

### 2. Actualizar LocaleSwitcher
Editar `components/LocaleSwitcher.tsx`:

```typescript
const locales = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }  // Nuevo
];
```

## Estado Actual

### ✅ Implementado
- Configuración base de i18n
- Traducciones completas ES/EN
- Componente selector de idioma
- Integración en Header
- Almacenamiento de preferencia

### 🔄 Pendiente (Implementación Completa)
Para una implementación completa de next-intl, se requiere:

1. **Middleware de Next.js**: Crear `middleware.ts` para detección automática de idioma
2. **Rutas Localizadas**: Configurar rutas con prefijo `/es/` y `/en/`
3. **Provider Global**: Envolver la app en `NextIntlClientProvider`
4. **SSR**: Configurar server-side rendering con locale

### Implementación Básica vs Completa

**Actual (Básica):**
- Selector manual de idioma
- Preferencia en localStorage
- Requiere reload de página

**Completa (Recomendada):**
- URLs con locale: `/es/vehiculos`, `/en/vehicles`
- Detección automática del navegador
- Sin reloads, cambio instantáneo
- SEO optimizado por idioma

## Próximos Pasos

Para implementación completa:

1. Crear `middleware.ts` con detección de locale
2. Reestructurar app en `app/[locale]/...`
3. Agregar NextIntlClientProvider en layout raíz
4. Actualizar all Links para incluir locale
5. Configurar next.config.js para i18n

## Recursos

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n](https://nextjs.org/docs/advanced-features/i18n-routing)

## Notas

- El sistema actual es funcional pero básico
- Requiere reload de página para aplicar cambios
- Para producción, se recomienda implementación completa con middleware
- Todas las traducciones están centralizadas en los archivos JSON
