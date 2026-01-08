import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import { ToastProvider } from '@/components/ToastProvider';
import InstallPWA from '@/components/InstallPWA';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Destino Rent Car - Sistema de Renta de Autos',
  description: 'Sistema web de renta de autos con tecnología PWA',
  manifest: '/manifest.json',
  themeColor: '#1E3A8A',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <Header />
          {children}
          <InstallPWA />
        </ToastProvider>
      </body>
    </html>
  );
}

