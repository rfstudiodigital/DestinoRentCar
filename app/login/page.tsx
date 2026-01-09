'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import styles from './login.module.css';

function ClienteLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <div className={styles.loginBox}>
          <div className={styles.header}>
            <h1 className={styles.title}>Iniciar Sesión</h1>
            <p className={styles.subtitle}>Ingresa con tu email para continuar</p>
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
                placeholder="tu@email.com"
                autoComplete="email"
                defaultValue={emailParam}
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className={styles.link}>
                Regístrate aquí
              </Link>
            </p>
            <Link href="/" className={styles.backLink}>
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ClienteLoginPage() {
  return (
    <Suspense fallback={
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loginBox}>
            <div className={styles.loading}>Cargando...</div>
          </div>
        </div>
      </main>
    }>
      <ClienteLoginForm />
    </Suspense>
  );
}
