'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import VehiculoCard from '@/components/VehiculoCard';
import SearchFilters from '@/components/SearchFilters';
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
      console.log('📡 Iniciando fetch a /api/vehiculos');
      const res = await fetch('/api/vehiculos', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Respuesta API vehículos:', res.status, res.statusText, res.ok);
      
      if (!res.ok) {
        const errorData = await res.json().catch((parseError) => {
          console.error('❌ Error parseando respuesta de error:', parseError);
          return { error: 'Error desconocido', message: 'No se pudo parsear la respuesta del servidor' };
        });
        console.error('❌ Error en API vehículos:', errorData);
        
        // Mostrar detalles completos del error
        const errorMessage = errorData.message || errorData.error || 'Error desconocido';
        const errorCode = errorData.code || '';
        const errorName = errorData.name || '';
        
        console.error('Error completo:', {
          status: res.status,
          message: errorMessage,
          code: errorCode,
          name: errorName,
          fullError: errorData,
        });
        
        // Si es error 500, sugerir revisar /api/debug
        if (res.status === 500) {
          alert(`Error del servidor (500): ${errorMessage}${errorCode ? `\nCódigo: ${errorCode}` : ''}\n\nVisita /api/debug para más detalles`);
        } else {
          alert(`Error cargando vehículos (${res.status}): ${errorMessage}`);
        }
        return;
      }

      const data = await res.json();
      console.log('✅ Datos recibidos:', data);
      console.log('✅ Tipo de dato:', Array.isArray(data) ? 'array' : typeof data);
      console.log('✅ Longitud:', Array.isArray(data) ? data.length : 'N/A');
      
      if (!Array.isArray(data)) {
        console.error('❌ Los datos no son un array:', data);
        console.error('❌ Tipo recibido:', typeof data);
        alert(`Error: Se esperaba un array pero se recibió ${typeof data}`);
        return;
      }

      console.log('✅ Vehículos recibidos:', data.length, 'vehículos');
      setTodosVehiculos(data);
      setVehiculosFiltrados(data.filter((v: Vehiculo) => v.disponible));
      
      if (data.length === 0) {
        console.log('⚠️  Array vacío - no hay vehículos en la base de datos');
        console.log('💡 Ejecuta: npm run db:seed para crear datos de ejemplo');
      }
    } catch (error) {
      console.error('❌ Error cargando vehículos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error tipo:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('Error completo:', error);
      alert(`Error de conexión: ${errorMessage}\n\nVisita /api/test-db para diagnosticar el problema`);
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '2rem' }}>
          Vehículos Disponibles
        </h1>

        <SearchFilters onFilterChange={handleFilterChange} />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', fontSize: '1.25rem', color: '#6B7280' }}>
            Cargando vehículos...
          </div>
        ) : vehiculosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', fontSize: '1.25rem', color: '#6B7280' }}>
            No hay vehículos que coincidan con los filtros seleccionados.
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '600', color: 'var(--text-light)' }}>
              {vehiculosFiltrados.length} vehículo{vehiculosFiltrados.length !== 1 ? 's' : ''} encontrado{vehiculosFiltrados.length !== 1 ? 's' : ''}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
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
