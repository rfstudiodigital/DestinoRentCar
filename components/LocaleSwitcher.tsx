'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './LocaleSwitcher.module.css';

const locales = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState('es');

  const changeLocale = (newLocale: string) => {
    setCurrentLocale(newLocale);
    // Store in localStorage
    localStorage.setItem('locale', newLocale);
    
    // Optionally reload to apply changes
    // For full implementation, you would update the URL and use next-intl's navigation
    window.location.reload();
  };

  return (
    <div className={styles.switcher}>
      {locales.map((locale) => (
        <button
          key={locale.code}
          onClick={() => changeLocale(locale.code)}
          className={`${styles.button} ${currentLocale === locale.code ? styles.active : ''}`}
          title={locale.name}
        >
          <span className={styles.flag}>{locale.flag}</span>
          <span className={styles.code}>{locale.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
