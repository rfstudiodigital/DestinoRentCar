'use client';

import { useEffect, useState } from 'react';
import styles from './NotificationBell.module.css';

interface Notificacion {
  id: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  createdAt: string;
}

export default function NotificationBell() {
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
      const response = await fetch('/api/notificaciones');
      if (response.ok) {
        const data = await response.json();
        setNotificaciones(data);
        setNoLeidas(data.filter((n: Notificacion) => !n.leida).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const marcarComoLeida = async (id: string) => {
    try {
      await fetch(`/api/notificaciones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leida: true }),
      });
      
      setNotificaciones(prev => 
        prev.map(n => n.id === id ? { ...n, leida: true } : n)
      );
      setNoLeidas(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      await fetch('/api/notificaciones/marcar-todas', {
        method: 'POST',
      });
      
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
      setNoLeidas(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
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
                  onClick={() => !notif.leida && marcarComoLeida(notif.id)}
                >
                  <div className={styles.notifContent}>
                    <span className={`${styles.tipo} ${styles[notif.tipo]}`}>
                      {notif.tipo === 'info' && 'ℹ️'}
                      {notif.tipo === 'exito' && '✅'}
                      {notif.tipo === 'advertencia' && '⚠️'}
                      {notif.tipo === 'error' && '❌'}
                    </span>
                    <p className={styles.mensaje}>{notif.mensaje}</p>
                  </div>
                  <span className={styles.fecha}>
                    {new Date(notif.createdAt).toLocaleDateString('es-ES')}
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
