'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import VehiculoCard from '@/components/VehiculoCard';
import SearchFilters from '@/components/SearchFilters';
import styles from './page.module.css';

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
  tipoVehiculo?: string;
  transmision?: string;
  pasajeros?: number;
}

export default function VehiculosPage() {
  const [todosVehiculos, setTodosVehiculos] = useState<Vehiculo[]>([]);
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehiculos = async () => {
    try {
      const res = await fetch('/api/vehiculos', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({
          error: 'Error desconocido',
          message: 'No se pudo parsear la respuesta del servidor'
        }));
        
        const errorMessage = errorData.message || errorData.error || 'Error al cargar vehículos';
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Error en API vehículos:', {
            status: res.status,
            message: errorMessage,
            details: errorData
          });
        }
        
        return;
      }

      const data = await res.json();
      
      if (!Array.isArray(data)) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error: Se esperaba un array pero se recibió', typeof data);
        }
        return;
      }

      setTodosVehiculos(data);
      setVehiculosFiltrados(data.filter((v: Vehiculo) => v.disponible));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error cargando vehículos:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const handleFilterChange = (filters: any) => {
    let filtrados = [...todosVehiculos];

    // Filtrar por búsqueda
    if (filters.busqueda) {
      const busqueda = filters.busqueda.toLowerCase();
      filtrados = filtrados.filter(v => 
        v.marca.toLowerCase().includes(busqueda) ||
        v.modelo.toLowerCase().includes(busqueda)
      );
    }

    // Filtrar por disponibilidad
    if (filters.soloDisponibles) {
      filtrados = filtrados.filter(v => v.disponible);
    }

    // Filtrar por tipo
    if (filters.tipo && filters.tipo.length > 0) {
      filtrados = filtrados.filter(v => 
        v.tipoVehiculo && filters.tipo.includes(v.tipoVehiculo)
      );
    }

    // Filtrar por transmisión
    if (filters.transmision && filters.transmision.length > 0) {
      filtrados = filtrados.filter(v => 
        v.transmision && filters.transmision.includes(v.transmision)
      );
    }

    // Filtrar por pasajeros
    if (filters.pasajeros) {
      filtrados = filtrados.filter(v => 
        v.pasajeros && v.pasajeros >= filters.pasajeros
      );
    }

    // Filtrar por precio
    if (filters.precioMin || filters.precioMax) {
      filtrados = filtrados.filter(v => {
        const precio = v.precioDiario;
        const cumpleMin = !filters.precioMin || precio >= filters.precioMin;
        const cumpleMax = !filters.precioMax || precio <= filters.precioMax;
        return cumpleMin && cumpleMax;
      });
    }

    // Filtrar por año
    if (filters.anoMin || filters.anoMax) {
      filtrados = filtrados.filter(v => {
        const anio = v.anio;
        const cumpleMin = !filters.anoMin || anio >= filters.anoMin;
        const cumpleMax = !filters.anoMax || anio <= filters.anoMax;
        return cumpleMin && cumpleMax;
      });
    }

    // Ordenar
    if (filters.ordenar) {
      filtrados.sort((a, b) => {
        switch (filters.ordenar) {
          case 'precio_asc':
            return a.precioDiario - b.precioDiario;
          case 'precio_desc':
            return b.precioDiario - a.precioDiario;
          case 'ano_desc':
            return b.anio - a.anio;
          case 'ano_asc':
            return a.anio - b.anio;
          default:
            return 0;
        }
      });
    }

    setVehiculosFiltrados(filtrados);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Vehículos Disponibles
          </h1>
          <p className={styles.subtitle}>
            Encuentra el vehículo perfecto para tu próximo viaje
          </p>
        </div>

        <SearchFilters onFilterChange={handleFilterChange} />

        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Cargando vehículos...</p>
          </div>
        ) : vehiculosFiltrados.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17H15M12 12V12.01M12 3C7.58172 3 4 6.58172 4 11C4 14.5265 6.17157 17.5 9.2 19.2C9.5 19.4 9.5 19.8 9.5 20.2V21H14.5V20.2C14.5 19.8 14.5 19.4 14.8 19.2C17.8284 17.5 20 14.5265 20 11C20 6.58172 16.4183 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>No se encontraron vehículos</h3>
            <p>No hay vehículos que coincidan con los filtros seleccionados.</p>
          </div>
        ) : (
          <>
            <div className={styles.resultsCount}>
              {vehiculosFiltrados.length} vehículo{vehiculosFiltrados.length !== 1 ? 's' : ''} encontrado{vehiculosFiltrados.length !== 1 ? 's' : ''}
            </div>
            <div className={styles.grid}>
              {vehiculosFiltrados.map((vehiculo) => (
                <VehiculoCard key={vehiculo.id} vehiculo={vehiculo} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
