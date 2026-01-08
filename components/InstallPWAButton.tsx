'use client';

import { useState, useEffect } from 'react';
import { useToast } from './ToastProvider';
import styles from './InstallPWAButton.module.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWAButton() {
  const { showToast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);
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
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar si se instaló
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowButton(false);
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
      }
      
      // Limpiar el prompt
      setDeferredPrompt(null);
      setShowButton(false);
    } catch (error) {
      console.error('Error al instalar:', error);
      showToast('Error al instalar la aplicación', 'error');
    }
  };

  // No mostrar si ya está instalada o no está disponible
  if (isInstalled || !showButton) {
    return null;
  }

  return (
    <button onClick={handleInstallClick} className={styles.installButton} title="Instalar aplicación">
      <span className={styles.installIcon}>⬇️</span>
      <span className={styles.installText}>Instalar</span>
    </button>
  );
}
