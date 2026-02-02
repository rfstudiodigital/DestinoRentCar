'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/components/LocaleSwitcher';
import styles from './perfil.module.css';

interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  licencia?: string | null;
}

interface Renta {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  precioTotal: number;
  estado: string;
  vehiculo: {
    marca: string;
    modelo: string;
    anio: number;
  };
}

export default function PerfilPage() {
  const { t } = useTranslation();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [rentasActivas, setRentasActivas] = useState<Renta[]>([]);
  const [historial, setHistorial] = useState<Renta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchClienteData();
  }, []);

  const fetchClienteData = async () => {
    try {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const clienteId = localStorage.getItem('clienteId');
      
      if (!clienteId) {
        setIsLoading(false);
        return;
      }

      const clienteResponse = await fetch(`/api/clientes/${clienteId}`);
      
      if (!clienteResponse.ok) {
        const errorData = await clienteResponse.json().catch(() => ({ error: 'Error desconocido' }));
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Error cargando cliente:', errorData);
        }
        
        if ((clienteResponse.status === 404 || clienteResponse.status === 500) && typeof window !== 'undefined') {
          localStorage.removeItem('clienteId');
          localStorage.removeItem('clienteNombre');
          localStorage.removeItem('clienteEmail');
          localStorage.removeItem('clienteTelefono');
          localStorage.removeItem('clienteDireccion');
        }
        setIsLoading(false);
        return;
      }

      const clienteData = await clienteResponse.json();
      
      setCliente({
        id: clienteData.id,
        nombre: clienteData.nombre,
        email: clienteData.email,
        telefono: clienteData.telefono,
        licencia: clienteData.licencia || null,
      });

      if (clienteData.rentas && Array.isArray(clienteData.rentas)) {
        const activas = clienteData.rentas.filter((r: any) => 
          r.estado === 'activa' || r.estado === 'pendiente'
        );
        const completadas = clienteData.rentas.filter((r: any) => 
          r.estado === 'completada'
        );
        
        setRentasActivas(activas.map((r: any) => ({
          id: r.id,
          fechaInicio: r.fechaInicio,
          fechaFin: r.fechaFin,
          precioTotal: r.precioTotal,
          estado: r.estado,
          vehiculo: {
            marca: r.vehiculo?.marca || '',
            modelo: r.vehiculo?.modelo || '',
            anio: r.vehiculo?.anio || 0,
          },
        })));
        
        setHistorial(completadas.map((r: any) => ({
          id: r.id,
          fechaInicio: r.fechaInicio,
          fechaFin: r.fechaFin,
          precioTotal: r.precioTotal,
          estado: r.estado,
          vehiculo: {
            marca: r.vehiculo?.marca || '',
            modelo: r.vehiculo?.modelo || '',
            anio: r.vehiculo?.anio || 0,
          },
        })));
      } else {
        setRentasActivas([]);
        setHistorial([]);
      }
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching cliente data:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{t('profile.loading')}</p>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className={styles.error}>
        <h2>{t('profile.error')}</h2>
        <Link href="/login" className={styles.loginLink}>
          {t('profile.login')}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={`${styles.pageTitle} ${mounted ? styles.titleAnimated : ''}`}>
        {t('profile.title')}
      </h1>

      {/* Información Personal */}
      <div className={`${styles.card} ${mounted ? styles.cardAnimated : ''}`}>
        <h2 className={styles.cardTitle}>{t('profile.personalInfo')}</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{t('profile.fullName')}</span>
            <span className={styles.infoValue}>{cliente.nombre}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{t('profile.email')}</span>
            <span className={styles.infoValue}>{cliente.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{t('profile.phone')}</span>
            <span className={styles.infoValue}>{cliente.telefono}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{t('profile.license')}</span>
            <span className={styles.infoValue}>{cliente.licencia || t('profile.licenseNotRegistered')}</span>
          </div>
        </div>
      </div>

      {/* Rentas Activas */}
      <div className={`${styles.card} ${mounted ? styles.cardAnimated : ''}`} style={{ animationDelay: '0.1s' }}>
        <h2 className={styles.cardTitle}>{t('profile.activeRentals')}</h2>
        {rentasActivas.length === 0 ? (
          <div className={styles.empty}>
            <p>{t('profile.noActiveRentals')}</p>
            <Link href="/vehiculos" className={styles.browseButton}>
              {t('profile.explore')}
            </Link>
          </div>
        ) : (
          <div className={styles.rentasList}>
            {rentasActivas.map((renta, index) => (
              <div 
                key={renta.id} 
                className={`${styles.rentaCard} ${styles.active}`}
                style={mounted ? { animationDelay: `${index * 0.1}s` } : {}}
              >
                <div className={styles.rentaHeader}>
                  <h3>{renta.vehiculo.marca} {renta.vehiculo.modelo} {renta.vehiculo.anio}</h3>
                  <span className={`${styles.badge} ${styles[renta.estado]}`}>
                    {t(`rentals.${renta.estado}`)}
                  </span>
                </div>
                <div className={styles.rentaDetails}>
                  <div className={styles.detailRow}>
                    <span>{t('rentals.startDate')}:</span>
                    <strong>{new Date(renta.fechaInicio).toLocaleDateString('es-ES')}</strong>
                  </div>
                  <div className={styles.detailRow}>
                    <span>{t('rentals.endDate')}:</span>
                    <strong>{new Date(renta.fechaFin).toLocaleDateString('es-ES')}</strong>
                  </div>
                  <div className={styles.detailRow}>
                    <span>{t('rentals.total')}:</span>
                    <strong className={styles.price}>${renta.precioTotal.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial */}
      <div className={`${styles.card} ${mounted ? styles.cardAnimated : ''}`} style={{ animationDelay: '0.2s' }}>
        <h2 className={styles.cardTitle}>{t('profile.history')}</h2>
        {historial.length === 0 ? (
          <div className={styles.empty}>
            <p>{t('profile.noHistory')}</p>
          </div>
        ) : (
          <div className={styles.rentasList}>
            {historial.map((renta, index) => (
              <div 
                key={renta.id} 
                className={styles.rentaCard}
                style={mounted ? { animationDelay: `${index * 0.1}s` } : {}}
              >
                <div className={styles.rentaHeader}>
                  <h3>{renta.vehiculo.marca} {renta.vehiculo.modelo} {renta.vehiculo.anio}</h3>
                  <span className={`${styles.badge} ${styles.completada}`}>
                    {t('rentals.completed')}
                  </span>
                </div>
                <div className={styles.rentaDetails}>
                  <div className={styles.detailRow}>
                    <span>{t('rentals.startDate')} - {t('rentals.endDate')}:</span>
                    <strong>
                      {new Date(renta.fechaInicio).toLocaleDateString('es-ES')} - {new Date(renta.fechaFin).toLocaleDateString('es-ES')}
                    </strong>
                  </div>
                  <div className={styles.detailRow}>
                    <span>{t('rentals.total')}:</span>
                    <strong className={styles.price}>${renta.precioTotal.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
