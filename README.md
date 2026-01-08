# Destino Rent Car

Sistema web de renta de autos con tecnología PWA, optimizado para Vercel y utilizando Neon como base de datos.

## Características

- 🚗 Sistema de renta de autos
- 📱 Progressive Web App (PWA)
- ⚡ Optimizado para Vercel
- 🗄️ Base de datos Neon (PostgreSQL)
- 🎨 Diseño moderno y responsivo

## Tecnologías

- Next.js 14
- React 18
- TypeScript
- Prisma ORM
- Neon Database (PostgreSQL)
- PWA

## Configuración

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
DATABASE_URL="tu_url_de_neon_database"
NEXT_PUBLIC_APP_URL="https://tu-app.vercel.app"
```

### Instalación

```bash
npm install
```

### Base de Datos

1. Configura tu base de datos en Neon
2. Copia la URL de conexión a `.env.local`
3. Ejecuta las migraciones:

```bash
npx prisma migrate dev
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Despliegue en Vercel

1. Conecta tu repositorio con Vercel
2. Agrega la variable de entorno `DATABASE_URL` en la configuración de Vercel
3. Vercel desplegará automáticamente la aplicación

## Estructura del Proyecto

```
├── app/                # App Router de Next.js
├── components/         # Componentes React
├── lib/               # Utilidades y configuración
├── prisma/            # Esquema de Prisma
├── public/            # Archivos estáticos
└── styles/            # Estilos globales
```

