import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import { ToastProvider } from '@/components/ToastProvider';
import InstallPWA from '@/components/InstallPWA';
import SupportChat from '@/components/SupportChat';
import SkipToContent from '@/components/SkipToContent';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Destino Rent Car - Sistema de Renta de Autos',
  description: 'Sistema web profesional de renta de autos con tecnología PWA. Alquiler de vehículos fácil, rápido y seguro.',
  manifest: '/manifest.json',
  themeColor: '#1E3A8A',
  keywords: ['renta de autos', 'alquiler de vehículos', 'car rental', 'Uruguay', 'Destino Rent Car'],
  authors: [{ name: 'Destino Rent Car' }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Destino Rent Car',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    title: 'Destino Rent Car - Alquiler de Vehículos',
    description: 'Sistema web profesional de renta de autos. Encuentra el vehículo perfecto para ti.',
    type: 'website',
    locale: 'es_UY',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logo.svg.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.svg.jpeg" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://destinorentcar.com" />
      </head>
      <body className={inter.className}>
        <SkipToContent />
        <ToastProvider>
          <Header />
          <main id="main-content">
            {children}
          </main>
          <InstallPWA />
          <SupportChat />
        </ToastProvider>
      </body>
    </html>
  );
}

