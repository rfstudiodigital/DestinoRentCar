import Link from 'next/link';
import styles from '../page.module.css';

export default function NuevaRentaPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Nueva Renta</h1>
        <p className={styles.description}>
          Registra una nueva renta de vehículo
        </p>
        <Link href="/" className={styles.card}>
          ← Volver al inicio
        </Link>
        {/* Aquí irá el formulario de nueva renta */}
      </div>
    </main>
  );
}

