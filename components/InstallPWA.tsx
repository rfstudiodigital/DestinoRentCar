'use client';

import { useState, useEffect } from 'react';
import { useToast } from './ToastProvider';
import styles from './InstallPWA.module.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const { showToast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Detectar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar si se instaló
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
      showToast('¡Aplicación instalada exitosamente!', 'success');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [showToast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      // Mostrar el prompt de instalación
      await deferredPrompt.prompt();
      
      // Esperar a que el usuario responda
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        showToast('Instalando aplicación...', 'info');
      } else {
        showToast('Instalación cancelada', 'info');
      }
      
      // Limpiar el prompt
      setDeferredPrompt(null);
      setShowInstallButton(false);
    } catch (error) {
      console.error('Error al instalar:', error);
      showToast('Error al instalar la aplicación', 'error');
    }
  };

  // No mostrar si ya está instalada
  if (isInstalled || !showInstallButton) {
    return null;
  }

  return (
    <div className={styles.installBanner}>
      <div className={styles.installContent}>
        <div className={styles.installIcon}>📱</div>
        <div className={styles.installText}>
          <strong>Instala Destino Rent Car</strong>
          <span>Accede rápidamente desde tu dispositivo</span>
        </div>
        <button onClick={handleInstallClick} className={styles.installButton}>
          Instalar
        </button>
        <button 
          onClick={() => setShowInstallButton(false)} 
          className={styles.closeButton}
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
}
