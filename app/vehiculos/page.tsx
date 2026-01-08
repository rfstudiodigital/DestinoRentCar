'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import VehiculoCard from '@/components/VehiculoCard';
import styles from '../page.module.css';

interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  precioDiario: number;
  disponible: boolean;
  imagen?: string | null;
  descripcion?: string | null;
}

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [soloDisponibles, setSoloDisponibles] = useState(true);

  useEffect(() => {
    fetchVehiculos();
  }, [soloDisponibles]);

  const fetchVehiculos = async () => {
    try {
      const url = soloDisponibles 
        ? '/api/vehiculos?disponible=true'
        : '/api/vehiculos';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVehiculos(data);
      }
    } catch (error) {
      console.error('Error cargando vehículos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 className={styles.title}>Vehículos Disponibles</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={soloDisponibles}
                onChange={(e) => setSoloDisponibles(e.target.checked)}
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
              <span>Solo disponibles</span>
            </label>
            <Link href="/admin" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
              Panel Admin
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px' }}>
            Cargando vehículos...
          </div>
        ) : vehiculos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px' }}>
            <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '1.5rem' }}>
              No hay vehículos disponibles en este momento
            </p>
            <Link href="/" className={styles.card}>
              ← Volver al inicio
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {vehiculos.map((vehiculo) => (
              <VehiculoCard key={vehiculo.id} vehiculo={vehiculo} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
