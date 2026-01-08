'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './perfil.module.css';

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  licencia: string;
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
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [rentasActivas, setRentasActivas] = useState<Renta[]>([]);
  const [historial, setHistorial] = useState<Renta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClienteData();
  }, []);

  const fetchClienteData = async () => {
    try {
      // TODO: Obtener ID del cliente autenticado
      const clienteResponse = await fetch('/api/clientes');
      if (clienteResponse.ok) {
        const clientes = await clienteResponse.json();
        if (clientes.length > 0) {
          setCliente(clientes[0]);
          
          // Obtener rentas del cliente
          const rentasResponse = await fetch('/api/rentas');
          if (rentasResponse.ok) {
            const todasRentas = await rentasResponse.json();
            const misRentas = todasRentas.filter((r: any) => r.clienteId === clientes[0].id);
            
            const activas = misRentas.filter((r: Renta) => r.estado === 'activa' || r.estado === 'pendiente');
            const completadas = misRentas.filter((r: Renta) => r.estado === 'completada');
            
            setRentasActivas(activas);
            setHistorial(completadas);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching cliente data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Cargando perfil...</div>;
  }

  if (!cliente) {
    return (
      <div className={styles.error}>
        <h2>No se pudo cargar el perfil</h2>
        <Link href="/login" className={styles.loginLink}>
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Mi Perfil</h1>

      {/* Información Personal */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Información Personal</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Nombre Completo</span>
            <span className={styles.infoValue}>{cliente.nombre} {cliente.apellido}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{cliente.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Teléfono</span>
            <span className={styles.infoValue}>{cliente.telefono}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Licencia</span>
            <span className={styles.infoValue}>{cliente.licencia || 'No registrada'}</span>
          </div>
        </div>
      </div>

      {/* Rentas Activas */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Rentas Activas</h2>
        {rentasActivas.length === 0 ? (
          <div className={styles.empty}>
            <p>No tienes rentas activas</p>
            <Link href="/vehiculos" className={styles.browseButton}>
              Explorar Vehículos
            </Link>
          </div>
        ) : (
          <div className={styles.rentasList}>
            {rentasActivas.map((renta) => (
              <div key={renta.id} className={`${styles.rentaCard} ${styles.active}`}>
                <div className={styles.rentaHeader}>
                  <h3>{renta.vehiculo.marca} {renta.vehiculo.modelo} {renta.vehiculo.anio}</h3>
                  <span className={`${styles.badge} ${styles[renta.estado]}`}>
                    {renta.estado.toUpperCase()}
                  </span>
                </div>
                <div className={styles.rentaDetails}>
                  <div className={styles.detailRow}>
                    <span>Inicio:</span>
                    <strong>{new Date(renta.fechaInicio).toLocaleDateString('es-ES')}</strong>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Fin:</span>
                    <strong>{new Date(renta.fechaFin).toLocaleDateString('es-ES')}</strong>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Total:</span>
                    <strong className={styles.price}>${renta.precioTotal.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Historial de Rentas</h2>
        {historial.length === 0 ? (
          <div className={styles.empty}>
            <p>No tienes rentas completadas</p>
          </div>
        ) : (
          <div className={styles.rentasList}>
            {historial.map((renta) => (
              <div key={renta.id} className={styles.rentaCard}>
                <div className={styles.rentaHeader}>
                  <h3>{renta.vehiculo.marca} {renta.vehiculo.modelo} {renta.vehiculo.anio}</h3>
                  <span className={`${styles.badge} ${styles.completada}`}>
                    COMPLETADA
                  </span>
                </div>
                <div className={styles.rentaDetails}>
                  <div className={styles.detailRow}>
                    <span>Período:</span>
                    <strong>
                      {new Date(renta.fechaInicio).toLocaleDateString('es-ES')} - {new Date(renta.fechaFin).toLocaleDateString('es-ES')}
                    </strong>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Total:</span>
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
