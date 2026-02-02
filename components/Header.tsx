'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/ToastProvider';
import InstallPWAButton from '@/components/InstallPWAButton';
import NotificationBell from '@/components/NotificationBell';
import LocaleSwitcher, { useTranslation } from '@/components/LocaleSwitcher';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [clienteLogueado, setClienteLogueado] = useState<{ nombre: string; email: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    showToast(t('nav.logout'), 'info');
    setIsMobileMenuOpen(false);
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
      <Link href="/" className={styles.logoLink} onClick={() => setIsMobileMenuOpen(false)}>
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
      
      {/* Mobile Menu Button */}
      <button 
        className={styles.mobileMenuButton}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={isMobileMenuOpen ? styles.closeIcon : styles.menuIcon}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </span>
      </button>

      <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
        <Link href="/vehiculos" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
          {t('nav.vehicles')}
        </Link>
        {clienteLogueado ? (
          <>
            <Link href="/perfil" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
              {t('nav.profile')}
            </Link>
            <NotificationBell />
            <span className={styles.userInfo}>
              {t('nav.hello')} {clienteLogueado.nombre}
            </span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              {t('nav.logout')}
            </button>
          </>
        ) : (
          <Link href={getRedirectUrl()} className={styles.loginLink} onClick={() => setIsMobileMenuOpen(false)}>
            {t('nav.login')}
          </Link>
        )}
        <LocaleSwitcher />
        <InstallPWAButton />
        <Link href="/admin/login" className={styles.adminLink} onClick={() => setIsMobileMenuOpen(false)}>
          {t('nav.admin')}
        </Link>
      </nav>
    </header>
  );
}
