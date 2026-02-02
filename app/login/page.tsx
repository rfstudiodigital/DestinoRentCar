'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import { useTranslation } from '@/components/LocaleSwitcher';
import styles from './login.module.css';

function ClienteLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Obtener la URL de redirección si existe
  const redirectTo = searchParams.get('redirect') || '/vehiculos';
  const emailParam = searchParams.get('email') || '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const res = await fetch('/api/auth/cliente/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Guardar sesión en localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('clienteId', data.cliente.id);
          localStorage.setItem('clienteNombre', data.cliente.nombre);
          localStorage.setItem('clienteEmail', data.cliente.email);
          localStorage.setItem('clienteTelefono', data.cliente.telefono);
          if (data.cliente.direccion) {
            localStorage.setItem('clienteDireccion', data.cliente.direccion);
          }
        }
        showToast('¡Bienvenido de vuelta!', 'success');
        router.push(redirectTo);
      } else {
        throw new Error(data.error || 'Email no encontrado');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      showToast(err.message || 'Error al iniciar sesión', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={`${styles.loginBox} ${mounted ? styles.animated : ''}`}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className={styles.title}>{t('login.title')}</h1>
            <p className={styles.subtitle}>{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.field}>
              <label htmlFor="email">{t('login.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder={t('login.emailPlaceholder')}
                autoComplete="email"
                defaultValue={emailParam}
                className={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? t('login.loading') : t('login.button')}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              {t('login.noAccount')}{' '}
              <Link href="/registro" className={styles.link}>
                {t('login.register')}
              </Link>
            </p>
            <Link href="/" className={styles.backLink}>
              {t('login.back')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ClienteLoginPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loginBox}>
            <div className={styles.loading}>{t('common.loading')}</div>
          </div>
        </div>
      </main>
    }>
      <ClienteLoginForm />
    </Suspense>
  );
}
