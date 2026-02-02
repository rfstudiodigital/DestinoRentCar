'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import { useTranslation } from '@/components/LocaleSwitcher';
import ImageGallery from '@/components/ImageGallery';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import { formatearPrecioSimple } from '@/lib/formatters';
import styles from './alquilar.module.css';

interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  precioDiario: number;
  disponible: boolean;
  imagen?: string | null;
  imagenes?: Array<{ id: string; url: string; alt?: string }>;
  placa?: string;
  placas?: string;
  descripcion?: string | null;
  caracteristicas?: string;
  tipoVehiculo?: string;
  transmision?: string;
  combustible?: string;
  pasajeros?: number;
  puertas?: number;
  motor?: string;
  aireAcondicionado?: boolean;
  gps?: boolean;
  bluetooth?: boolean;
  camaraReversa?: boolean;
  sensoresEstacionamiento?: boolean;
  vecesRentado?: number;
  calificacionPromedio?: number;
}

export default function AlquilarPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [precioTotal, setPrecioTotal] = useState<number>(0);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [clienteRegistrado, setClienteRegistrado] = useState<{ id: string; nombre: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchVehiculo = async (id: string) => {
    try {
      const res = await fetch(`/api/vehiculos/${id}`);
      if (res.ok) {
        const data = await res.json();
        setVehiculo(data);
      } else {
        setError(t('vehicleDetail.error'));
        showToast(t('vehicleDetail.error'), 'error');
        router.push('/vehiculos');
      }
    } catch (error) {
      setError(t('vehicleDetail.error'));
      showToast(t('vehicleDetail.error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchVehiculo(params.id as string);
    }
    // Cargar datos del cliente registrado (solo en cliente)
    if (typeof window !== 'undefined') {
      try {
        const clienteId = localStorage.getItem('clienteId');
        const clienteNombre = localStorage.getItem('clienteNombre');
        if (clienteId && clienteNombre) {
          setClienteRegistrado({ id: clienteId, nombre: clienteNombre });
        }
      } catch (error) {
        console.error('Error leyendo localStorage:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleDateSelect = (inicio: Date, fin: Date) => {
    setFechaInicio(inicio);
    setFechaFin(fin);
    if (vehiculo) {
      const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      setPrecioTotal(dias * vehiculo.precioDiario);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteRegistrado) {
      showToast(t('vehicleDetail.loginRequired'), 'error');
      router.push(`/login?redirect=/alquilar/${params.id}`);
      return;
    }

    if (!fechaInicio || !fechaFin) {
      showToast(t('vehicleDetail.selectDates'), 'error');
      return;
    }

    if (fechaFin <= fechaInicio) {
      showToast(t('vehicleDetail.invalidDates'), 'error');
      return;
    }

    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    if (inicio < ahora) {
      showToast(t('vehicleDetail.pastDate'), 'error');
      return;
    }

    const dias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    if (dias < 1) {
      showToast(t('vehicleDetail.minDays'), 'error');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/rentas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehiculoId: vehiculo?.id,
          clienteId: clienteRegistrado.id,
          fechaInicio: fechaInicio.toISOString(),
          fechaFin: fechaFin.toISOString(),
          precioTotal,
          estado: 'pendiente',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear renta');
      }

      showToast(t('vehicleDetail.reservationSent'), 'success');
      router.push('/rentas');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al crear renta', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>{t('vehicleDetail.loading')}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!vehiculo || error) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error || t('vehicleDetail.error')}</p>
            <Link href="/vehiculos" className={styles.button}>
              {t('vehicleDetail.back')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/vehiculos" className={`${styles.backButton} ${mounted ? styles.backAnimated : ''}`}>
          ← {t('vehicleDetail.back')}
        </Link>

        {/* Galería de Imágenes */}
        {vehiculo.imagenes && vehiculo.imagenes.length > 0 ? (
          <ImageGallery 
            images={vehiculo.imagenes.map((img, index) => ({
              id: img.id,
              url: img.url,
              esPortada: index === 0
            }))} 
            alt={`${vehiculo.marca} ${vehiculo.modelo}`}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <div className={styles.imageWrapper}>
              <span>Sin imagen</span>
            </div>
          </div>
        )}

        {/* Información Principal */}
        <div className={`${styles.header} ${mounted ? styles.headerAnimated : ''}`}>
          <h1 className={styles.title}>{vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})</h1>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{formatearPrecioSimple(vehiculo.precioDiario)}</span>
              <span className={styles.statLabel}>{t('vehicles.perDay')}</span>
            </div>
            {vehiculo.calificacionPromedio && vehiculo.calificacionPromedio > 0 && (
              <div className={styles.stat}>
                <span className={styles.statValue}>⭐ {vehiculo.calificacionPromedio.toFixed(1)}</span>
                <span className={styles.statLabel}>{vehiculo.vecesRentado || 0} {t('rentals.title')}</span>
              </div>
            )}
            <div className={styles.stat}>
              <span className={`${styles.badge} ${vehiculo.disponible ? styles.badgeSuccess : styles.badgeDanger}`}>
                {vehiculo.disponible ? `✓ ${t('vehicles.available')}` : `✗ ${t('vehicles.notAvailable')}`}
              </span>
            </div>
          </div>
        </div>

        {/* Grid de Información */}
        <div className={`${styles.infoGrid} ${mounted ? styles.gridAnimated : ''}`}>
          <div className={`${styles.infoCard} ${mounted ? styles.cardAnimated : ''}`} style={mounted ? { animationDelay: '0.1s' } : {}}>
            <h3>📋 {t('vehicleDetail.specifications')}</h3>
            <ul className={styles.infoList}>
              <li><strong>{t('vehicleDetail.type')}:</strong> {vehiculo.tipoVehiculo || t('vehicleDetail.notSpecified')}</li>
              <li><strong>{t('vehicleDetail.transmission')}:</strong> {vehiculo.transmision || t('vehicleDetail.notSpecified')}</li>
              <li><strong>{t('vehicleDetail.fuel')}:</strong> {vehiculo.combustible || t('vehicleDetail.notSpecified')}</li>
              <li><strong>{t('vehicleDetail.motor')}:</strong> {vehiculo.motor || t('vehicleDetail.notSpecified')}</li>
              <li><strong>{t('vehicleDetail.color')}:</strong> {vehiculo.color}</li>
              <li><strong>{t('vehicleDetail.plates')}:</strong> {vehiculo.placas || t('vehicleDetail.notSpecified')}</li>
            </ul>
          </div>

          <div className={`${styles.infoCard} ${mounted ? styles.cardAnimated : ''}`} style={mounted ? { animationDelay: '0.2s' } : {}}>
            <h3>👥 {t('vehicleDetail.capacity')}</h3>
            <ul className={styles.infoList}>
              <li><strong>{t('vehicleDetail.passengers')}:</strong> {vehiculo.pasajeros || t('vehicleDetail.notSpecified')}</li>
              <li><strong>{t('vehicleDetail.doors')}:</strong> {vehiculo.puertas || t('vehicleDetail.notSpecified')}</li>
            </ul>
          </div>

          <div className={`${styles.infoCard} ${mounted ? styles.cardAnimated : ''}`} style={mounted ? { animationDelay: '0.3s' } : {}}>
            <h3>🔧 {t('vehicleDetail.features')}</h3>
            <ul className={styles.featuresList}>
              {vehiculo.aireAcondicionado && <li>❄️ {t('vehicleDetail.airConditioning')}</li>}
              {vehiculo.gps && <li>🗺️ {t('vehicleDetail.gps')}</li>}
              {vehiculo.bluetooth && <li>📱 {t('vehicleDetail.bluetooth')}</li>}
              {vehiculo.camaraReversa && <li>📹 {t('vehicleDetail.reverseCamera')}</li>}
              {vehiculo.sensoresEstacionamiento && <li>🔔 {t('vehicleDetail.parkingSensors')}</li>}
              {vehiculo.caracteristicas && vehiculo.caracteristicas.length > 0 && 
                vehiculo.caracteristicas.split(',').map((feat, idx) => (
                  <li key={idx}>✓ {feat.trim()}</li>
                ))
              }
            </ul>
          </div>

          {vehiculo.descripcion && (
            <div className={`${styles.infoCard} ${styles.fullWidth} ${mounted ? styles.cardAnimated : ''}`} style={mounted ? { animationDelay: '0.4s' } : {}}>
              <h3>📝 {t('vehicleDetail.description')}</h3>
              <p>{vehiculo.descripcion}</p>
            </div>
          )}
        </div>

        {/* Calendario de Disponibilidad */}
        <div className={`${styles.calendarSection} ${mounted ? styles.sectionAnimated : ''}`}>
          <h2>📅 {t('vehicleDetail.selectDates')}</h2>
          {clienteRegistrado ? (
            <AvailabilityCalendar
              vehiculoId={vehiculo.id}
              onDateSelect={handleDateSelect}
              precioBase={vehiculo.precioDiario}
            />
          ) : (
            <div className={styles.loginPrompt}>
              <p>
                <strong>{t('vehicleDetail.loginRequired')}</strong>
              </p>
              <Link href={`/login?redirect=/alquilar/${params.id}`} className={styles.loginButton}>
                {t('vehicleDetail.loginButton')}
              </Link>
              <p className={styles.registerPrompt}>
                {t('vehicleDetail.noAccount')}{' '}
                <Link href="/registro" className={styles.registerLink}>
                  {t('vehicleDetail.register')}
                </Link>
              </p>
            </div>
          )}

          {/* Resumen de Precio */}
          {clienteRegistrado && fechaInicio && fechaFin && precioTotal > 0 && (
            <div className={`${styles.resumenPrecio} ${mounted ? styles.resumenAnimated : ''}`}>
              <h3>💰 {t('vehicleDetail.rentalSummary')}</h3>
              <div className={styles.resumenLine}>
                <span>{t('vehicleDetail.dates')}:</span>
                <strong>
                  {fechaInicio.toLocaleDateString('es-ES')} - {fechaFin.toLocaleDateString('es-ES')}
                </strong>
              </div>
              <div className={styles.resumenLine}>
                <span>{t('vehicleDetail.days')}:</span>
                <strong>
                  {Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24))} {t('vehicleDetail.days').toLowerCase()}
                </strong>
              </div>
              <div className={styles.resumenLine}>
                <span>{t('vehicleDetail.pricePerDay')}:</span>
                <strong>{formatearPrecioSimple(vehiculo.precioDiario)}</strong>
              </div>
              <div className={styles.resumenTotal}>
                <span>{t('vehicleDetail.totalPrice')}:</span>
                <strong>{formatearPrecioSimple(precioTotal)}</strong>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || !vehiculo.disponible}
                className={styles.reserveButton}
              >
                {submitting ? t('common.loading') : `🚗 ${t('vehicleDetail.reserveNow')}`}
              </button>
            </div>
          )}
        </div>

        {/* Sección de Reseñas */}
        <div className={`${styles.reviewsSection} ${mounted ? styles.sectionAnimated : ''}`}>
          <h2>⭐ {t('vehicleDetail.reviews')}</h2>
          <ReviewList vehiculoId={vehiculo.id} key={reviewRefresh} />
          {clienteRegistrado && (
            <ReviewForm
              vehiculoId={vehiculo.id}
              onReviewSubmitted={() => setReviewRefresh(prev => prev + 1)}
            />
          )}
        </div>
      </div>
    </main>
  );
}

