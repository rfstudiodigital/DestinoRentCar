'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  const [rentas, setRentas] = useState<Renta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('todas');

  const fetchRentas = async () => {
    try {
      const url = filter !== 'todas' 
        ? `/api/rentas?estado=${filter}`
        : '/api/rentas';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRentas(data);
      }
    } catch (error) {
      console.error('Error cargando rentas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentas();
    
    // Mostrar mensaje de éxito si viene de crear renta
    if (searchParams.get('success') === 'true') {
      alert('¡Renta creada exitosamente!');
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
      } else {
        const error = await res.json();
        alert(error.error || 'Error al actualizar renta');
      }
    } catch (error) {
      alert('Error al actualizar renta');
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
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
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
      <div className={styles.header}>
        <h1 className={styles.title}>Rentas</h1>
        <div className={styles.actions}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filter}
          >
            <option value="todas">Todas</option>
            <option value="activa">Activas</option>
            <option value="completada">Completadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
          <Link href="/vehiculos" className={styles.link}>
            Ver Vehículos
          </Link>
          <Link href="/admin" className={styles.link}>
            Panel Admin
          </Link>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Cargando rentas...</div>
      ) : rentas.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay rentas registradas</p>
          <Link href="/vehiculos" className={styles.button}>
            Ver Vehículos Disponibles
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {rentas.map((renta) => (
            <div key={renta.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>
                  {renta.vehiculo.marca} {renta.vehiculo.modelo} {renta.vehiculo.anio}
                </h3>
                <span
                  className={styles.badge}
                  style={{ backgroundColor: getEstadoColor(renta.estado) }}
                >
                  {renta.estado.toUpperCase()}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <strong>Cliente:</strong>
                  <span>{renta.cliente.nombre}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>Email:</strong>
                  <span>{renta.cliente.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>Teléfono:</strong>
                  <span>{renta.cliente.telefono}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>Placa:</strong>
                  <span>{renta.vehiculo.placa}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>Fecha Inicio:</strong>
                  <span>{formatearFecha(renta.fechaInicio)}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>Fecha Fin:</strong>
                  <span>{formatearFecha(renta.fechaFin)}</span>
                </div>
                <div className={styles.infoRow}>
                  <strong>Precio Total:</strong>
                  <span className={styles.price}>{formatearPrecio(renta.precioTotal)}</span>
                </div>
                {renta.observaciones && (
                  <div className={styles.observaciones}>
                    <strong>Observaciones:</strong>
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
                    Marcar como Completada
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('¿Estás seguro de cancelar esta renta?')) {
                        handleCambiarEstado(renta.id, 'cancelada');
                      }
                    }}
                    className={styles.cancelButton}
                  >
                    Cancelar
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
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Suspense fallback={<div className={styles.loading}>Cargando...</div>}>
          <RentasContent />
        </Suspense>
      </div>
    </main>
  );
}
