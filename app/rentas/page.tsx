'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import { useTranslation } from '@/components/LocaleSwitcher';
import styles from './rentas.module.css';

interface Renta {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  precioTotal: number;
  estado: string;
  observaciones?: string | null;
  cliente: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
  };
  vehiculo: {
    id: string;
    marca: string;
    modelo: string;
    anio: number;
    placa: string;
  };
}

function RentasContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [rentas, setRentas] = useState<Renta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('todas');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchRentas = async () => {
    try {
      const url = filter !== 'todas' 
        ? `/api/rentas?estado=${filter}`
        : '/api/rentas';
      const res = await fetch(url, {
        headers: {
          'x-admin-auth': 'true',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setRentas(data);
      } else if (res.status === 403) {
        window.location.href = '/';
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error cargando rentas:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentas();
    
    if (searchParams.get('success') === 'true') {
      showToast('¡Renta creada exitosamente!', 'success');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchParams]);

  const handleCambiarEstado = async (id: string, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/rentas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (res.ok) {
        await fetchRentas();
        showToast('Renta actualizada exitosamente', 'success');
      } else {
        const error = await res.json();
        showToast(error.error || 'Error al actualizar renta', 'error');
      }
    } catch (error) {
      showToast('Error al actualizar renta', 'error');
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(precio);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return '#10b981';
      case 'completada':
        return '#3b82f6';
      case 'cancelada':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <>
      <div className={`${styles.header} ${mounted ? styles.headerAnimated : ''}`}>
        <h1 className={styles.title}>{t('rentals.title')}</h1>
        <div className={styles.actions}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filter}
          >
            <option value="todas">{t('common.all')}</option>
            <option value="activa">{t('rentals.active')}</option>
            <option value="completada">{t('rentals.completed')}</option>
            <option value="cancelada">{t('rentals.cancelled')}</option>
          </select>
          <Link href="/admin" className={styles.link}>
            {t('nav.admin')}
          </Link>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>{t('rentals.loading')}</p>
        </div>
      ) : rentas.length === 0 ? (
        <div className={`${styles.empty} ${mounted ? styles.emptyAnimated : ''}`}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17H15M12 12V12.01M12 3C7.58172 3 4 6.58172 4 11C4 14.5265 6.17157 17.5 9.2 19.2C9.5 19.4 9.5 19.8 9.5 20.2V21H14.5V20.2C14.5 19.8 14.5 19.4 14.8 19.2C17.8284 17.5 20 14.5265 20 11C20 6.58172 16.4183 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>{t('rentals.empty')}</p>
          <Link href="/vehiculos" className={styles.button}>
            {t('cta.button')}
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {rentas.map((renta, index) => (
            <div 
              key={renta.id} 
              className={`${styles.card} ${mounted ? styles.cardAnimated : ''}`}
              style={mounted ? { animationDelay: `${index * 0.1}s` } : {}}
            >
              <div className={styles.cardHeader}>
                <h3>
                  {renta.vehiculo.marca} {renta.vehiculo.modelo} {renta.vehiculo.anio}
                </h3>
                <span
                  className={styles.badge}
                  style={{ backgroundColor: getEstadoColor(renta.estado) }}
                >
                  {t(`rentals.${renta.estado}`).toUpperCase()}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <strong>{t('rentals.client')}:</strong>
                  <span>{renta.cliente.nombre}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>{t('register.email')}:</strong>
                  <span>{renta.cliente.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>{t('register.phone')}:</strong>
                  <span>{renta.cliente.telefono}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>{t('vehicleDetail.plates')}:</strong>
                  <span>{renta.vehiculo.placa}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>{t('rentals.startDate')}:</strong>
                  <span>{formatearFecha(renta.fechaInicio)}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>{t('rentals.endDate')}:</strong>
                  <span>{formatearFecha(renta.fechaFin)}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>{t('rentals.total')}:</strong>
                  <span className={styles.price}>{formatearPrecio(renta.precioTotal)}</span>
                </div>
                {renta.observaciones && (
                  <div className={styles.observaciones}>
                    <strong>{t('rentals.observations')}:</strong>
                    <p>{renta.observaciones}</p>
                  </div>
                )}
              </div>

              {renta.estado === 'activa' && (
                <div className={styles.cardActions}>
                  <button
                    onClick={() => handleCambiarEstado(renta.id, 'completada')}
                    className={styles.completeButton}
                  >
                    {t('rentals.markCompleted')}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(t('rentals.confirmCancel'))) {
                        handleCambiarEstado(renta.id, 'cancelada');
                      }
                    }}
                    className={styles.cancelButton}
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function RentasPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
      if (!isAdmin) {
        router.push('/');
      } else {
        setCheckingAuth(false);
      }
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>{t('common.loading')}</div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Suspense fallback={<div className={styles.loading}>{t('common.loading')}</div>}>
          <RentasContent />
        </Suspense>
      </div>
    </main>
  );
}
