import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo.svg"
            alt="Destino Rent Car Logo"
            width={300}
            height={150}
            priority
          />
        </div>
        
        <h1 className={styles.title}>Bienvenido a Destino Rent Car</h1>
        
        <p className={styles.description}>
          Tu solución completa para la renta de vehículos
        </p>

        <div className={styles.grid}>
          <Link href="/vehiculos" className={styles.card}>
            <h2>Vehículos &rarr;</h2>
            <p>Explora nuestra flota de vehículos disponibles</p>
          </Link>

          <Link href="/rentas" className={styles.card}>
            <h2>Rentas &rarr;</h2>
            <p>Gestiona tus rentas activas y pasadas</p>
          </Link>

          <Link href="/clientes" className={styles.card}>
            <h2>Clientes &rarr;</h2>
            <p>Administra la información de clientes</p>
          </Link>

          <Link href="/nueva-renta" className={styles.card}>
            <h2>Nueva Renta &rarr;</h2>
            <p>Registra una nueva renta de vehículo</p>
          </Link>
        </div>
      </div>
    </main>
  );
}

