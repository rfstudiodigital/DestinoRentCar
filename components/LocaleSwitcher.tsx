'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './LocaleSwitcher.module.css';

const locales = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

// Simple translation function
const translations: Record<string, Record<string, string>> = {
  es: {
    'nav.vehicles': 'Vehículos',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',
    'nav.profile': 'Mi Perfil',
    'nav.admin': 'Admin',
    'nav.hello': 'Hola,',
    'home.title': 'Tu viaje perfecto comienza aquí',
    'home.subtitle': 'Descubre la libertad de viajar con nuestra flota de vehículos premium. Reserva en minutos, disfruta por días.',
    'home.explore': 'Explorar Vehículos',
    'home.register': 'Crear Cuenta',
    'features.title': '¿Por qué elegir Destino Rent Car?',
    'features.quick': 'Reserva Rápida',
    'features.quickDesc': 'Proceso simple y rápido. Reserva tu vehículo en minutos desde cualquier dispositivo.',
    'features.premium': 'Flota Premium',
    'features.premiumDesc': 'Vehículos modernos, mantenidos y listos para tu aventura. Calidad garantizada.',
    'features.support': 'Atención 24/7',
    'features.supportDesc': 'Soporte disponible cuando lo necesites. Estamos aquí para ayudarte en cada paso.',
    'features.prices': 'Precios Transparentes',
    'features.pricesDesc': 'Sin sorpresas. Precios claros y competitivos sin costos ocultos.',
    'stats.vehicles': 'Vehículos Disponibles',
    'stats.clients': 'Clientes Satisfechos',
    'stats.satisfaction': 'Satisfacción',
    'stats.support': 'Soporte',
    'cta.title': '¿Listo para tu próxima aventura?',
    'cta.text': 'Explora nuestra flota y encuentra el vehículo perfecto para tu viaje.',
    'cta.button': 'Ver Vehículos Disponibles',
  },
  en: {
    'nav.vehicles': 'Vehicles',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.profile': 'My Profile',
    'nav.admin': 'Admin',
    'nav.hello': 'Hello,',
    'home.title': 'Your perfect journey starts here',
    'home.subtitle': 'Discover the freedom to travel with our premium vehicle fleet. Book in minutes, enjoy for days.',
    'home.explore': 'Explore Vehicles',
    'home.register': 'Create Account',
    'features.title': 'Why choose Destino Rent Car?',
    'features.quick': 'Quick Booking',
    'features.quickDesc': 'Simple and fast process. Book your vehicle in minutes from any device.',
    'features.premium': 'Premium Fleet',
    'features.premiumDesc': 'Modern, well-maintained vehicles ready for your adventure. Guaranteed quality.',
    'features.support': '24/7 Support',
    'features.supportDesc': 'Support available when you need it. We are here to help you every step of the way.',
    'features.prices': 'Transparent Prices',
    'features.pricesDesc': 'No surprises. Clear and competitive prices with no hidden costs.',
    'stats.vehicles': 'Available Vehicles',
    'stats.clients': 'Satisfied Clients',
    'stats.satisfaction': 'Satisfaction',
    'stats.support': 'Support',
    'cta.title': 'Ready for your next adventure?',
    'cta.text': 'Explore our fleet and find the perfect vehicle for your trip.',
    'cta.button': 'View Available Vehicles',
  }
};

export function useTranslation() {
  const [locale, setLocale] = useState('es');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'es';
    setLocale(savedLocale);
  }, []);

  const t = (key: string): string => {
    return translations[locale]?.[key] || translations['es'][key] || key;
  };

  return { t, locale, setLocale };
}

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem('locale') || 'es';
    setCurrentLocale(savedLocale);
  }, []);

  const changeLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    
    setCurrentLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Trigger a custom event to update translations
    window.dispatchEvent(new CustomEvent('localechange', { detail: newLocale }));
    
    // Small delay before reload to ensure localStorage is saved
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (!mounted) {
    return (
      <div className={styles.switcher}>
        <div className={styles.button} style={{ opacity: 0.5 }}>
          <span className={styles.flag}>🌐</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.switcher}>
      {locales.map((locale) => (
        <button
          key={locale.code}
          onClick={() => changeLocale(locale.code)}
          className={`${styles.button} ${currentLocale === locale.code ? styles.active : ''}`}
          title={locale.name}
          aria-label={`Switch to ${locale.name}`}
        >
          <span className={styles.flag}>{locale.flag}</span>
          <span className={styles.code}>{locale.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
