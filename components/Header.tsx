'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/ToastProvider';
import InstallPWAButton from '@/components/InstallPWAButton';
import NotificationBell from '@/components/NotificationBell';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const [clienteLogueado, setClienteLogueado] = useState<{ nombre: string; email: string } | null>(null);

  useEffect(() => {
    // Verificar si hay sesión de cliente
    const clienteId = localStorage.getItem('clienteId');
    const clienteNombre = localStorage.getItem('clienteNombre');
    const clienteEmail = localStorage.getItem('clienteEmail');
    
    if (clienteId && clienteNombre && clienteEmail) {
      setClienteLogueado({ nombre: clienteNombre, email: clienteEmail });
    } else {
      setClienteLogueado(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('clienteId');
    localStorage.removeItem('clienteNombre');
    localStorage.removeItem('clienteEmail');
    localStorage.removeItem('clienteTelefono');
    localStorage.removeItem('clienteDireccion');
    setClienteLogueado(null);
    showToast('Sesión cerrada', 'info');
    if (pathname?.startsWith('/alquilar') || pathname?.startsWith('/rentas')) {
      router.push('/vehiculos');
    }
  };

  const getRedirectUrl = () => {
    if (pathname?.startsWith('/alquilar')) {
      return `/login?redirect=${encodeURIComponent(pathname)}`;
    }
    return '/login';
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink}>
        <div className={styles.logoWrapper}>
          <Image
            src="/logo.svg.jpeg"
            alt="Destino Rent Car"
            width={200}
            height={80}
            priority
            className={styles.logoImage}
          />
        </div>
      </Link>
      <nav className={styles.nav}>
        <Link href="/vehiculos" className={styles.navLink}>
          Vehículos
        </Link>
        {clienteLogueado ? (
          <>
            <Link href="/perfil" className={styles.navLink}>
              Mi Perfil
            </Link>
            <NotificationBell />
            <span className={styles.userInfo}>
              Hola, {clienteLogueado.nombre}
            </span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link href={getRedirectUrl()} className={styles.loginLink}>
            Iniciar Sesión
          </Link>
        )}
        <InstallPWAButton />
        <Link href="/admin/login" className={styles.adminLink}>
          Admin
        </Link>
      </nav>
    </header>
  );
}

