'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './NotificationBell.module.css';

interface Notificacion {
  id: string;
  mensaje: string;
  tipo: string;
  titulo: string;
  leida: boolean;
  url?: string | null;
  rentaId?: string | null;
  createdAt: string;
  cliente?: {
    id: string;
    nombre: string;
    email: string;
  } | null;
}

export default function AdminNotificationBell() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [mostrar, setMostrar] = useState(false);
  const [noLeidas, setNoLeidas] = useState(0);

  useEffect(() => {
    fetchNotificaciones();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchNotificaciones, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotificaciones = async () => {
    try {
      const response = await fetch('/api/admin/notificaciones', {
        headers: {
          'x-admin-auth': 'true',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotificaciones(data);
        setNoLeidas(data.filter((n: Notificacion) => !n.leida).length);
      }
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
    }
  };

  const marcarComoLeida = async (id: string) => {
    try {
      await fetch(`/api/notificaciones/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-auth': 'true',
        },
        body: JSON.stringify({ leida: true }),
      });
      
      setNotificaciones(prev => 
        prev.map(n => n.id === id ? { ...n, leida: true } : n)
      );
      setNoLeidas(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      await fetch('/api/notificaciones/marcar-todas', {
        method: 'POST',
        headers: {
          'x-admin-auth': 'true',
        },
      });
      
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
      setNoLeidas(0);
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  const handleNotificacionClick = (notif: Notificacion) => {
    if (!notif.leida) {
      marcarComoLeida(notif.id);
    }
    if (notif.url) {
      router.push(notif.url);
      setMostrar(false);
    }
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.bellButton}
        onClick={() => setMostrar(!mostrar)}
      >
        🔔
        {noLeidas > 0 && (
          <span className={styles.badge}>{noLeidas}</span>
        )}
      </button>

      {mostrar && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3>Notificaciones</h3>
            {noLeidas > 0 && (
              <button 
                className={styles.markAllButton}
                onClick={marcarTodasComoLeidas}
              >
                Marcar todas
              </button>
            )}
          </div>

          <div className={styles.list}>
            {notificaciones.length === 0 ? (
              <div className={styles.empty}>
                No hay notificaciones
              </div>
            ) : (
              notificaciones.map((notif) => (
                <div 
                  key={notif.id}
                  className={`${styles.notifItem} ${!notif.leida ? styles.unread : ''}`}
                  onClick={() => handleNotificacionClick(notif)}
                  style={{ cursor: notif.url ? 'pointer' : 'default' }}
                >
                  <div className={styles.notifContent}>
                    <span className={`${styles.tipo} ${styles[notif.tipo] || styles.info}`}>
                      {notif.tipo === 'nueva_reserva' && '🆕'}
                      {notif.tipo === 'reserva_confirmada' && '✅'}
                      {notif.tipo === 'reserva_cancelada' && '❌'}
                      {notif.tipo === 'reserva_rechazada' && '⚠️'}
                      {!['nueva_reserva', 'reserva_confirmada', 'reserva_cancelada', 'reserva_rechazada'].includes(notif.tipo) && 'ℹ️'}
                    </span>
                    <div>
                      <strong className={styles.titulo}>{notif.titulo}</strong>
                      <p className={styles.mensaje}>{notif.mensaje}</p>
                    </div>
                  </div>
                  <span className={styles.fecha}>
                    {new Date(notif.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
