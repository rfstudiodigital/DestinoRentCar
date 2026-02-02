'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [rentasActivas, setRentasActivas] = useState<Renta[]>([]);
  const [historial, setHistorial] = useState<Renta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClienteData();
  }, []);

  const fetchClienteData = async () => {
    try {
      // Obtener ID del cliente autenticado del localStorage (solo en cliente)
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const clienteId = localStorage.getItem('clienteId');
      
      if (!clienteId) {
        setIsLoading(false);
        return;
      }

      // Obtener datos del cliente autenticado (incluye sus rentas)
      const clienteResponse = await fetch(`/api/clientes/${clienteId}`);
      
      if (!clienteResponse.ok) {
        const errorData = await clienteResponse.json().catch(() => ({ error: 'Error desconocido' }));
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Error cargando cliente:', errorData);
        }
        
        // Si el cliente no existe o hay error, limpiar localStorage (solo en cliente)
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
      
      // Establecer datos del cliente
      setCliente({
        id: clienteData.id,
        nombre: clienteData.nombre,
        email: clienteData.email,
        telefono: clienteData.telefono,
        licencia: clienteData.licencia || null,
      });

      // Procesar rentas incluidas en la respuesta
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
            <span className={styles.infoValue}>{cliente.nombre}</span>
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
