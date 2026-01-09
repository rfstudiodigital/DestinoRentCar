'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import styles from './registro.module.css';

export default function RegistroPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        // Guardar ID del cliente en localStorage para futuras reservas
        if (typeof window !== 'undefined') {
          localStorage.setItem('clienteId', cliente.id);
          localStorage.setItem('clienteNombre', cliente.nombre);
        }
        router.push('/vehiculos');
      } else {
        const errorData = await res.json();
        if (res.status === 400 && errorData.error?.includes('Ya existe')) {
          showToast('Ya tienes una cuenta con este email. Redirigiendo al login...', 'info');
          // Redirigir al login con el email prellenado
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
        <div className={styles.header}>
          <h1 className={styles.title}>Registro de Cliente</h1>
          <Link href="/" className={styles.backLink}>
            ← Volver al inicio
          </Link>
        </div>

        <div className={styles.formContainer}>
          <p className={styles.description}>
            Regístrate para poder hacer reservas de vehículos online
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.field}>
              <label htmlFor="nombre">Nombre Completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                placeholder="Juan Pérez"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="telefono">Teléfono *</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                required
                placeholder="+598 99 123 456"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Calle y número"
              />
            </div>

            <div className={styles.actions}>
              <Link href="/vehiculos" className={styles.cancelButton}>
                Cancelar
              </Link>
              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </div>
          </form>

          <div className={styles.login}>
            <p>
              ¿Ya tienes cuenta?{' '}
              <Link href="/vehiculos" className={styles.loginLink}>
                Ver vehículos disponibles
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
