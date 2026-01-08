import Link from 'next/link';
import styles from '../page.module.css';

export default function ClientesPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Clientes</h1>
        <p className={styles.description}>
          Gestiona la información de tus clientes
        </p>
        <Link href="/" className={styles.card}>
          ← Volver al inicio
        </Link>
        {/* Aquí irá la lista de clientes */}
      </div>
    </main>
  );
}

