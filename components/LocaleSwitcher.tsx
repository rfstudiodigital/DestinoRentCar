'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './LocaleSwitcher.module.css';

const locales = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

// Complete translation system
const translations: Record<string, Record<string, string>> = {
  es: {
    // Navigation
    'nav.vehicles': 'Vehículos',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',
    'nav.profile': 'Mi Perfil',
    'nav.admin': 'Admin',
    'nav.hello': 'Hola,',
    
    // Home
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
    
    // Vehicles
    'vehicles.title': 'Vehículos Disponibles',
    'vehicles.subtitle': 'Encuentra el vehículo perfecto para tu próximo viaje',
    'vehicles.loading': 'Cargando vehículos...',
    'vehicles.empty': 'No se encontraron vehículos',
    'vehicles.emptyDesc': 'No hay vehículos que coincidan con los filtros seleccionados.',
    'vehicles.found': 'vehículo encontrado',
    'vehicles.foundPlural': 'vehículos encontrados',
    
    // Login
    'login.title': 'Iniciar Sesión',
    'login.subtitle': 'Ingresa con tu email para continuar',
    'login.email': 'Email',
    'login.emailPlaceholder': 'tu@email.com',
    'login.button': 'Iniciar Sesión',
    'login.loading': 'Iniciando sesión...',
    'login.noAccount': '¿No tienes cuenta?',
    'login.register': 'Regístrate aquí',
    'login.back': '← Volver al inicio',
    
    // Register
    'register.title': 'Registro de Cliente',
    'register.subtitle': 'Regístrate para poder hacer reservas de vehículos online',
    'register.name': 'Nombre Completo',
    'register.namePlaceholder': 'Juan Pérez',
    'register.email': 'Email',
    'register.emailPlaceholder': 'juan@ejemplo.com',
    'register.phone': 'Teléfono',
    'register.phonePlaceholder': '+598 99 123 456',
    'register.address': 'Dirección',
    'register.addressPlaceholder': 'Calle y número',
    'register.cancel': 'Cancelar',
    'register.button': 'Registrarse',
    'register.loading': 'Registrando...',
    'register.hasAccount': '¿Ya tienes cuenta?',
    'register.viewVehicles': 'Ver vehículos disponibles',
    'register.back': '← Volver al inicio',
    
    // Profile
    'profile.title': 'Mi Perfil',
    'profile.personalInfo': 'Información Personal',
    'profile.fullName': 'Nombre Completo',
    'profile.email': 'Email',
    'profile.phone': 'Teléfono',
    'profile.license': 'Licencia',
    'profile.licenseNotRegistered': 'No registrada',
    'profile.activeRentals': 'Rentas Activas',
    'profile.noActiveRentals': 'No tienes rentas activas',
    'profile.explore': 'Explorar Vehículos',
    'profile.history': 'Historial de Rentas',
    'profile.noHistory': 'No tienes rentas completadas',
    'profile.loading': 'Cargando perfil...',
    'profile.error': 'No se pudo cargar el perfil',
    'profile.login': 'Iniciar Sesión',
    
    // Rentals
    'rentals.title': 'Mis Rentas',
    'rentals.loading': 'Cargando...',
    'rentals.empty': 'No tienes rentas registradas',
    'rentals.vehicle': 'Vehículo',
    'rentals.startDate': 'Fecha Inicio',
    'rentals.endDate': 'Fecha Fin',
    'rentals.total': 'Total',
    'rentals.status': 'Estado',
    'rentals.pending': 'Pendiente',
    'rentals.active': 'Activa',
    'rentals.completed': 'Completada',
    'rentals.cancelled': 'Cancelada',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.close': 'Cerrar',
    'common.back': 'Volver',
    'common.all': 'Todas',
    'rentals.client': 'Cliente',
    'rentals.observations': 'Observaciones',
    'rentals.markCompleted': 'Marcar como Completada',
    'rentals.confirmCancel': '¿Estás seguro de cancelar esta renta?',
    'vehicleDetail.plates': 'Placas',
    'vehicleDetail.back': 'Volver a Vehículos',
    'vehicleDetail.specifications': 'Especificaciones',
    'vehicleDetail.capacity': 'Capacidad',
    'vehicleDetail.features': 'Características',
    'vehicleDetail.description': 'Descripción',
    'vehicleDetail.selectDates': 'Selecciona las Fechas',
    'vehicleDetail.loginRequired': 'Inicia sesión para ver el calendario de disponibilidad y hacer tu reserva',
    'vehicleDetail.loginButton': 'Iniciar Sesión',
    'vehicleDetail.noAccount': '¿No tienes cuenta?',
    'vehicleDetail.register': 'Regístrate aquí',
    'vehicleDetail.rentalSummary': 'Resumen del Alquiler',
    'vehicleDetail.dates': 'Fechas',
    'vehicleDetail.days': 'Días',
    'vehicleDetail.pricePerDay': 'Precio por día',
    'vehicleDetail.totalPrice': 'Total a pagar',
    'vehicleDetail.reserveNow': 'Reservar Ahora',
    'vehicleDetail.reviews': 'Reseñas',
    'vehicleDetail.type': 'Tipo',
    'vehicleDetail.transmission': 'Transmisión',
    'vehicleDetail.fuel': 'Combustible',
    'vehicleDetail.motor': 'Motor',
    'vehicleDetail.color': 'Color',
    'vehicleDetail.passengers': 'Pasajeros',
    'vehicleDetail.doors': 'Puertas',
    'vehicleDetail.airConditioning': 'Aire acondicionado',
    'vehicleDetail.gps': 'GPS',
    'vehicleDetail.bluetooth': 'Bluetooth',
    'vehicleDetail.reverseCamera': 'Cámara de reversa',
    'vehicleDetail.parkingSensors': 'Sensores de estacionamiento',
    'vehicleDetail.notSpecified': 'No especificado',
    'vehicleDetail.loading': 'Cargando...',
    'vehicleDetail.error': 'Vehículo no encontrado',
    'vehicleDetail.invalidDates': 'La fecha de fin debe ser posterior a la fecha de inicio',
    'vehicleDetail.pastDate': 'La fecha de inicio no puede ser en el pasado',
    'vehicleDetail.minDays': 'La renta debe ser de al menos 1 día',
    'vehicleDetail.reservationSent': '¡Reserva enviada exitosamente! El administrador revisará tu solicitud y te notificará.',
    'vehicles.perDay': 'por día',
    'vehicles.available': 'Disponible',
    'vehicles.notAvailable': 'No disponible',
  },
  en: {
    // Navigation
    'nav.vehicles': 'Vehicles',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.profile': 'My Profile',
    'nav.admin': 'Admin',
    'nav.hello': 'Hello,',
    
    // Home
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
    
    // Vehicles
    'vehicles.title': 'Available Vehicles',
    'vehicles.subtitle': 'Find the perfect vehicle for your next trip',
    'vehicles.loading': 'Loading vehicles...',
    'vehicles.empty': 'No vehicles found',
    'vehicles.emptyDesc': 'No vehicles match the selected filters.',
    'vehicles.found': 'vehicle found',
    'vehicles.foundPlural': 'vehicles found',
    
    // Login
    'login.title': 'Login',
    'login.subtitle': 'Enter your email to continue',
    'login.email': 'Email',
    'login.emailPlaceholder': 'your@email.com',
    'login.button': 'Login',
    'login.loading': 'Logging in...',
    'login.noAccount': "Don't have an account?",
    'login.register': 'Register here',
    'login.back': '← Back to home',
    
    // Register
    'register.title': 'Client Registration',
    'register.subtitle': 'Register to make vehicle reservations online',
    'register.name': 'Full Name',
    'register.namePlaceholder': 'John Doe',
    'register.email': 'Email',
    'register.emailPlaceholder': 'john@example.com',
    'register.phone': 'Phone',
    'register.phonePlaceholder': '+1 555 123 4567',
    'register.address': 'Address',
    'register.addressPlaceholder': 'Street and number',
    'register.cancel': 'Cancel',
    'register.button': 'Register',
    'register.loading': 'Registering...',
    'register.hasAccount': 'Already have an account?',
    'register.viewVehicles': 'View available vehicles',
    'register.back': '← Back to home',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.fullName': 'Full Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.license': 'License',
    'profile.licenseNotRegistered': 'Not registered',
    'profile.activeRentals': 'Active Rentals',
    'profile.noActiveRentals': 'You have no active rentals',
    'profile.explore': 'Explore Vehicles',
    'profile.history': 'Rental History',
    'profile.noHistory': 'You have no completed rentals',
    'profile.loading': 'Loading profile...',
    'profile.error': 'Could not load profile',
    'profile.login': 'Login',
    
    // Rentals
    'rentals.title': 'My Rentals',
    'rentals.loading': 'Loading...',
    'rentals.empty': 'You have no registered rentals',
    'rentals.vehicle': 'Vehicle',
    'rentals.startDate': 'Start Date',
    'rentals.endDate': 'End Date',
    'rentals.total': 'Total',
    'rentals.status': 'Status',
    'rentals.pending': 'Pending',
    'rentals.active': 'Active',
    'rentals.completed': 'Completed',
    'rentals.cancelled': 'Cancelled',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.all': 'All',
    'rentals.client': 'Client',
    'rentals.observations': 'Observations',
    'rentals.markCompleted': 'Mark as Completed',
    'rentals.confirmCancel': 'Are you sure you want to cancel this rental?',
    'vehicleDetail.plates': 'License Plates',
    'vehicleDetail.back': 'Back to Vehicles',
    'vehicleDetail.specifications': 'Specifications',
    'vehicleDetail.capacity': 'Capacity',
    'vehicleDetail.features': 'Features',
    'vehicleDetail.description': 'Description',
    'vehicleDetail.selectDates': 'Select Dates',
    'vehicleDetail.loginRequired': 'Log in to view availability calendar and make your reservation',
    'vehicleDetail.loginButton': 'Log In',
    'vehicleDetail.noAccount': "Don't have an account?",
    'vehicleDetail.register': 'Register here',
    'vehicleDetail.rentalSummary': 'Rental Summary',
    'vehicleDetail.dates': 'Dates',
    'vehicleDetail.days': 'Days',
    'vehicleDetail.pricePerDay': 'Price per day',
    'vehicleDetail.totalPrice': 'Total to pay',
    'vehicleDetail.reserveNow': 'Reserve Now',
    'vehicleDetail.reviews': 'Reviews',
    'vehicleDetail.type': 'Type',
    'vehicleDetail.transmission': 'Transmission',
    'vehicleDetail.fuel': 'Fuel',
    'vehicleDetail.motor': 'Engine',
    'vehicleDetail.color': 'Color',
    'vehicleDetail.passengers': 'Passengers',
    'vehicleDetail.doors': 'Doors',
    'vehicleDetail.airConditioning': 'Air conditioning',
    'vehicleDetail.gps': 'GPS',
    'vehicleDetail.bluetooth': 'Bluetooth',
    'vehicleDetail.reverseCamera': 'Reverse camera',
    'vehicleDetail.parkingSensors': 'Parking sensors',
    'vehicleDetail.notSpecified': 'Not specified',
    'vehicleDetail.loading': 'Loading...',
    'vehicleDetail.error': 'Vehicle not found',
    'vehicleDetail.invalidDates': 'End date must be after start date',
    'vehicleDetail.pastDate': 'Start date cannot be in the past',
    'vehicleDetail.minDays': 'Rental must be at least 1 day',
    'vehicleDetail.reservationSent': 'Reservation sent successfully! The administrator will review your request and notify you.',
    'vehicles.perDay': 'per day',
    'vehicles.available': 'Available',
    'vehicles.notAvailable': 'Not available',
  }
};

export function useTranslation() {
  const [locale, setLocale] = useState('es');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'es';
    setLocale(savedLocale);
    
    // Listen for locale changes
    const handleLocaleChange = () => {
      const newLocale = localStorage.getItem('locale') || 'es';
      setLocale(newLocale);
    };
    
    window.addEventListener('localechange', handleLocaleChange);
    return () => window.removeEventListener('localechange', handleLocaleChange);
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
