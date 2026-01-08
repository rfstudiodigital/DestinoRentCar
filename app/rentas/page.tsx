import Link from 'next/link';
import styles from '../page.module.css';

export default function RentasPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Rentas</h1>
        <p className={styles.description}>
          Administra todas las rentas del sistema
        </p>
        <Link href="/" className={styles.card}>
          ← Volver al inicio
        </Link>
        {/* Aquí irá la lista de rentas */}
      </div>
    </main>
  );
}

