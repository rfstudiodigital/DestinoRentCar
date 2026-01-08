import Link from 'next/link';
import styles from '../page.module.css';

export default function VehiculosPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Vehículos</h1>
        <p className={styles.description}>
          Gestiona la flota de vehículos disponibles
        </p>
        <Link href="/" className={styles.card}>
          ← Volver al inicio
        </Link>
        {/* Aquí irá la lista de vehículos */}
      </div>
    </main>
  );
}

