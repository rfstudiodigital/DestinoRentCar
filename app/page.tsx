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
            <h2>Ver Vehículos &rarr;</h2>
            <p>Explora nuestra flota de vehículos disponibles para alquilar</p>
          </Link>

          <Link href="/rentas" className={styles.card}>
            <h2>Mis Rentas &rarr;</h2>
            <p>Gestiona tus rentas activas y pasadas</p>
          </Link>

          <Link href="/admin" className={styles.card}>
            <h2>Panel Admin &rarr;</h2>
            <p>Administra vehículos y gestiona el sistema</p>
          </Link>
        </div>
      </div>
    </main>
  );
}

