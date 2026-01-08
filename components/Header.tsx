'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink}>
        <Image
          src="/logo.svg"
          alt="Destino Rent Car"
          width={200}
          height={100}
          priority
        />
      </Link>
      <nav className={styles.nav}>
        <Link href="/vehiculos" className={styles.navLink}>
          Vehículos
        </Link>
        <Link href="/rentas" className={styles.navLink}>
          Rentas
        </Link>
        <Link href="/admin" className={styles.navLink}>
          Admin
        </Link>
      </nav>
    </header>
  );
}

