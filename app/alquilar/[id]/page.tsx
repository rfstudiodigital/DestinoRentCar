'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
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
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [precioTotal, setPrecioTotal] = useState<number>(0);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [clienteRegistrado, setClienteRegistrado] = useState<{ id: string; nombre: string } | null>(null);

  const fetchVehiculo = async (id: string) => {
    try {
      const res = await fetch(`/api/vehiculos/${id}`);
      if (res.ok) {
        const data = await res.json();
        setVehiculo(data);
      } else {
        setError('Vehículo no encontrado');
        showToast('Vehículo no encontrado', 'error');
        router.push('/vehiculos');
      }
    } catch (error) {
      setError('Error al cargar vehículo');
      showToast('Error al cargar vehículo', 'error');
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
      showToast('Debes iniciar sesión para rentar', 'error');
      router.push(`/login?redirect=/alquilar/${params.id}`);
      return;
    }

    if (!fechaInicio || !fechaFin) {
      showToast('Selecciona las fechas de renta', 'error');
      return;
    }

    // Validar que la fecha de inicio sea anterior a la de fin
    if (fechaFin <= fechaInicio) {
      showToast('La fecha de fin debe ser posterior a la fecha de inicio', 'error');
      return;
    }

    // Validar que la fecha de inicio no sea en el pasado
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    if (inicio < ahora) {
      showToast('La fecha de inicio no puede ser en el pasado', 'error');
      return;
    }

    // Validar que la renta sea de al menos 1 día
    const dias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    if (dias < 1) {
      showToast('La renta debe ser de al menos 1 día', 'error');
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

      showToast('¡Reserva enviada exitosamente! El administrador revisará tu solicitud y te notificará.', 'success');
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
          <div className={styles.loading}>Cargando...</div>
        </div>
      </main>
    );
  }

  if (!vehiculo || error) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error || 'Vehículo no encontrado'}</p>
            <Link href="/vehiculos" className={styles.button}>
              Volver a Vehículos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/vehiculos" className={styles.backButton}>
          ← Volver a Vehículos
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
        <div className={styles.header}>
          <h1 className={styles.title}>{vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})</h1>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{formatearPrecioSimple(vehiculo.precioDiario)}</span>
              <span className={styles.statLabel}>por día</span>
            </div>
            {vehiculo.calificacionPromedio && vehiculo.calificacionPromedio > 0 && (
              <div className={styles.stat}>
                <span className={styles.statValue}>⭐ {vehiculo.calificacionPromedio.toFixed(1)}</span>
                <span className={styles.statLabel}>{vehiculo.vecesRentado || 0} rentas</span>
              </div>
            )}
            <div className={styles.stat}>
              <span className={`${styles.badge} ${vehiculo.disponible ? styles.badgeSuccess : styles.badgeDanger}`}>
                {vehiculo.disponible ? '✓ Disponible' : '✗ No disponible'}
              </span>
            </div>
          </div>
        </div>

        {/* Grid de Información */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3>📋 Especificaciones</h3>
            <ul className={styles.infoList}>
              <li><strong>Tipo:</strong> {vehiculo.tipoVehiculo || 'No especificado'}</li>
              <li><strong>Transmisión:</strong> {vehiculo.transmision || 'No especificada'}</li>
              <li><strong>Combustible:</strong> {vehiculo.combustible || 'No especificado'}</li>
              <li><strong>Motor:</strong> {vehiculo.motor || 'No especificado'}</li>
              <li><strong>Color:</strong> {vehiculo.color}</li>
              <li><strong>Placas:</strong> {vehiculo.placas}</li>
            </ul>
          </div>

          <div className={styles.infoCard}>
            <h3>👥 Capacidad</h3>
            <ul className={styles.infoList}>
              <li><strong>Pasajeros:</strong> {vehiculo.pasajeros || 'No especificado'}</li>
              <li><strong>Puertas:</strong> {vehiculo.puertas || 'No especificado'}</li>
            </ul>
          </div>

          <div className={styles.infoCard}>
            <h3>🔧 Características</h3>
            <ul className={styles.featuresList}>
              {vehiculo.aireAcondicionado && <li>❄️ Aire acondicionado</li>}
              {vehiculo.gps && <li>🗺️ GPS</li>}
              {vehiculo.bluetooth && <li>📱 Bluetooth</li>}
              {vehiculo.camaraReversa && <li>📹 Cámara de reversa</li>}
              {vehiculo.sensoresEstacionamiento && <li>🔔 Sensores de estacionamiento</li>}
              {vehiculo.caracteristicas && vehiculo.caracteristicas.length > 0 && 
                vehiculo.caracteristicas.split(',').map((feat, idx) => (
                  <li key={idx}>✓ {feat.trim()}</li>
                ))
              }
            </ul>
          </div>

          {vehiculo.descripcion && (
            <div className={`${styles.infoCard} ${styles.fullWidth}`}>
              <h3>📝 Descripción</h3>
              <p>{vehiculo.descripcion}</p>
            </div>
          )}
        </div>

        {/* Calendario de Disponibilidad */}
        <div className={styles.calendarSection}>
          <h2>📅 Selecciona las Fechas</h2>
          {clienteRegistrado ? (
            <AvailabilityCalendar
              vehiculoId={vehiculo.id}
              onDateSelect={handleDateSelect}
              precioBase={vehiculo.precioDiario}
            />
          ) : (
            <div className={styles.loginPrompt}>
              <p>
                <strong>Inicia sesión</strong> para ver el calendario de disponibilidad y hacer tu reserva.
              </p>
              <Link href={`/login?redirect=/alquilar/${params.id}`} className={styles.loginButton}>
                Iniciar Sesión
              </Link>
              <p className={styles.registerPrompt}>
                ¿No tienes cuenta?{' '}
                <Link href="/registro" className={styles.registerLink}>
                  Regístrate aquí
                </Link>
              </p>
            </div>
          )}

          {/* Resumen de Precio */}
          {clienteRegistrado && fechaInicio && fechaFin && precioTotal > 0 && (
            <div className={styles.resumenPrecio}>
              <h3>💰 Resumen del Alquiler</h3>
              <div className={styles.resumenLine}>
                <span>Fechas:</span>
                <strong>
                  {fechaInicio.toLocaleDateString('es-ES')} - {fechaFin.toLocaleDateString('es-ES')}
                </strong>
              </div>
              <div className={styles.resumenLine}>
                <span>Días:</span>
                <strong>
                  {Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24))} día(s)
                </strong>
              </div>
              <div className={styles.resumenLine}>
                <span>Precio por día:</span>
                <strong>{formatearPrecioSimple(vehiculo.precioDiario)}</strong>
              </div>
              <div className={styles.resumenTotal}>
                <span>Total a pagar:</span>
                <strong>{formatearPrecioSimple(precioTotal)}</strong>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || !vehiculo.disponible}
                className={styles.reserveButton}
              >
                {submitting ? 'Procesando...' : '🚗 Reservar Ahora'}
              </button>
            </div>
          )}
        </div>

        {/* Sección de Reseñas */}
        <div className={styles.reviewsSection}>
          <h2>⭐ Reseñas</h2>
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

