// Componente de Búsqueda y Filtros Avanzados
'use client';

import { useState, useEffect } from 'react';
import styles from './SearchFilters.module.css';

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  busqueda: string;
  precioMin: string;
  precioMax: string;
  anioMin: string;
  anioMax: string;
  tipoVehiculo: string;
  transmision: string;
  pasajeros: string;
  disponible: boolean;
  ordenPor: string;
}

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    busqueda: '',
    precioMin: '',
    precioMax: '',
    anioMin: '',
    anioMax: '',
    tipoVehiculo: '',
    transmision: '',
    pasajeros: '',
    disponible: true,
    ordenPor: 'reciente',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, onFilterChange]);

  const handleChange = (field: keyof FilterState, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({
      busqueda: '',
      precioMin: '',
      precioMax: '',
      anioMin: '',
      anioMax: '',
      tipoVehiculo: '',
      transmision: '',
      pasajeros: '',
      disponible: true,
      ordenPor: 'reciente',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainFilters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Buscar por marca, modelo..."
            value={filters.busqueda}
            onChange={(e) => handleChange('busqueda', e.target.value)}
            className={styles.searchInput}
            aria-label="Buscar vehículos"
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.quickFilters}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.disponible}
              onChange={(e) => handleChange('disponible', e.target.checked)}
            />
            <span>Solo disponibles</span>
          </label>

          <select
            value={filters.ordenPor}
            onChange={(e) => handleChange('ordenPor', e.target.value)}
            className={styles.select}
            aria-label="Ordenar por"
          >
            <option value="reciente">Más recientes</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="anio-desc">Año: más nuevo</option>
            <option value="anio-asc">Año: más antiguo</option>
            <option value="popular">Más populares</option>
          </select>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={styles.advancedButton}
            aria-label="Filtros avanzados"
            aria-expanded={showAdvanced}
          >
            {showAdvanced ? '▲ Ocultar filtros' : '▼ Más filtros'}
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className={styles.advancedFilters}>
          <div className={styles.filterGroup}>
            <label>Precio por día</label>
            <div className={styles.rangeInputs}>
              <input
                type="number"
                placeholder="Mínimo"
                value={filters.precioMin}
                onChange={(e) => handleChange('precioMin', e.target.value)}
                className={styles.input}
                min="0"
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Máximo"
                value={filters.precioMax}
                onChange={(e) => handleChange('precioMax', e.target.value)}
                className={styles.input}
                min="0"
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Año</label>
            <div className={styles.rangeInputs}>
              <input
                type="number"
                placeholder="Desde"
                value={filters.anioMin}
                onChange={(e) => handleChange('anioMin', e.target.value)}
                className={styles.input}
                min="1990"
                max={new Date().getFullYear()}
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Hasta"
                value={filters.anioMax}
                onChange={(e) => handleChange('anioMax', e.target.value)}
                className={styles.input}
                min="1990"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="tipoVehiculo">Tipo de vehículo</label>
            <select
              id="tipoVehiculo"
              value={filters.tipoVehiculo}
              onChange={(e) => handleChange('tipoVehiculo', e.target.value)}
              className={styles.select}
            >
              <option value="">Todos</option>
              <option value="Sedán">Sedán</option>
              <option value="SUV">SUV</option>
              <option value="Pickup">Pickup</option>
              <option value="Compacto">Compacto</option>
              <option value="Van">Van</option>
              <option value="Deportivo">Deportivo</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="transmision">Transmisión</label>
            <select
              id="transmision"
              value={filters.transmision}
              onChange={(e) => handleChange('transmision', e.target.value)}
              className={styles.select}
            >
              <option value="">Todas</option>
              <option value="Automática">Automática</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="pasajeros">Pasajeros</label>
            <select
              id="pasajeros"
              value={filters.pasajeros}
              onChange={(e) => handleChange('pasajeros', e.target.value)}
              className={styles.select}
            >
              <option value="">Cualquiera</option>
              <option value="2">2+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
              <option value="7">7+</option>
            </select>
          </div>

          <div className={styles.filterActions}>
            <button onClick={handleReset} className={styles.resetButton}>
              🔄 Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
