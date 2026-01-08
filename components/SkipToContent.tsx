'use client';

import { useEffect } from 'react';
import styles from './SkipToContent.module.css';

export default function SkipToContent() {
  useEffect(() => {
    // Asegurar que el elemento main tenga id
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main-content';
    }
  }, []);

  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      main.removeAttribute('tabindex');
    }
  };

  return (
    <a
      href="#main-content"
      className={styles.skipLink}
      onClick={handleSkip}
    >
      Saltar al contenido principal
    </a>
  );
}
