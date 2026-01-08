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
            width={400}
            height={200}
            priority
            style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
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

          <Link href="/registro" className={styles.card}>
            <h2>Registrarse &rarr;</h2>
            <p>Regístrate como cliente para hacer reservas online</p>
          </Link>

        </div>
      </div>
    </main>
  );
}

