'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Guardar sesión en localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminAuthenticated', 'true');
          localStorage.setItem('adminEmail', data.admin.email);
          if (data.admin.nombre) {
            localStorage.setItem('adminNombre', data.admin.nombre);
          }
        }
        showToast('Login exitoso', 'success');
        router.push('/admin');
      } else {
        throw new Error(data.error || 'Credenciales inválidas');
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
        <div className={styles.loginBox}>
          <div className={styles.header}>
            <h1 className={styles.title}>Panel de Administración</h1>
            <p className={styles.subtitle}>Iniciar Sesión</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="admin@demo.com"
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className={styles.footer}>
            <Link href="/" className={styles.backLink}>
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
