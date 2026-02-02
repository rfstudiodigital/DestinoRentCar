'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import { useTranslation } from '@/components/LocaleSwitcher';
import styles from './registro.module.css';

export default function RegistroPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get('nombre') as string;
    const email = formData.get('email') as string;
    const telefono = formData.get('telefono') as string;
    const direccion = formData.get('direccion') as string;

    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono, direccion }),
      });

      if (res.ok) {
        const cliente = await res.json();
        showToast('¡Registro exitoso! Ya puedes hacer reservas', 'success');
        if (typeof window !== 'undefined') {
          localStorage.setItem('clienteId', cliente.id);
          localStorage.setItem('clienteNombre', cliente.nombre);
        }
        router.push('/vehiculos');
      } else {
        const errorData = await res.json();
        if (res.status === 400 && errorData.error?.includes('Ya existe')) {
          showToast('Ya tienes una cuenta con este email. Redirigiendo al login...', 'info');
          router.push(`/login?email=${encodeURIComponent(email)}`);
          return;
        }
        throw new Error(errorData.error || 'Error al registrar cliente');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el registro');
      showToast(err.message || 'Error al procesar el registro', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={`${styles.header} ${mounted ? styles.headerAnimated : ''}`}>
          <h1 className={styles.title}>{t('register.title')}</h1>
          <Link href="/" className={styles.backLink}>
            {t('register.back')}
          </Link>
        </div>

        <div className={`${styles.formContainer} ${mounted ? styles.formAnimated : ''}`}>
          <div className={styles.iconWrapper}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className={styles.description}>
            {t('register.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.field}>
              <label htmlFor="nombre">{t('register.name')} *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                placeholder={t('register.namePlaceholder')}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">{t('register.email')} *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder={t('register.emailPlaceholder')}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="telefono">{t('register.phone')} *</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                required
                placeholder={t('register.phonePlaceholder')}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="direccion">{t('register.address')}</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder={t('register.addressPlaceholder')}
                className={styles.input}
              />
            </div>

            <div className={styles.actions}>
              <Link href="/vehiculos" className={styles.cancelButton}>
                {t('register.cancel')}
              </Link>
              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? t('register.loading') : t('register.button')}
              </button>
            </div>
          </form>

          <div className={styles.login}>
            <p>
              {t('register.hasAccount')}{' '}
              <Link href="/vehiculos" className={styles.loginLink}>
                {t('register.viewVehicles')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
