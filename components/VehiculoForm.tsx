'use client';

import { useState, FormEvent } from 'react';
import styles from './VehiculoForm.module.css';

interface VehiculoFormProps {
  vehiculo?: {
    id: string;
    marca: string;
    modelo: string;
    anio: number;
    placa: string;
    color: string;
    precioDiario: number;
    imagen?: string | null;
    descripcion?: string | null;
    disponible: boolean;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function VehiculoForm({ vehiculo, onSubmit, onCancel }: VehiculoFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      marca: formData.get('marca') as string,
      modelo: formData.get('modelo') as string,
      anio: formData.get('anio') as string,
      placa: formData.get('placa') as string,
      color: formData.get('color') as string,
      precioDiario: formData.get('precioDiario') as string,
      imagen: formData.get('imagen') as string,
      descripcion: formData.get('descripcion') as string,
      disponible: formData.get('disponible') === 'on',
    };

    try {
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Error al guardar vehículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="marca">Marca *</label>
          <input
            type="text"
            id="marca"
            name="marca"
            required
            defaultValue={vehiculo?.marca}
            placeholder="Ej: Toyota"
          />
        </div>
        
        <div className={styles.field}>
          <label htmlFor="modelo">Modelo *</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            required
            defaultValue={vehiculo?.modelo}
            placeholder="Ej: Corolla"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="anio">Año *</label>
          <input
            type="number"
            id="anio"
            name="anio"
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            defaultValue={vehiculo?.anio}
            placeholder="2024"
          />
        </div>
        
        <div className={styles.field}>
          <label htmlFor="placa">Placa *</label>
          <input
            type="text"
            id="placa"
            name="placa"
            required
            defaultValue={vehiculo?.placa}
            placeholder="ABC-123"
            style={{ textTransform: 'uppercase' }}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="color">Color *</label>
          <input
            type="text"
            id="color"
            name="color"
            required
            defaultValue={vehiculo?.color}
            placeholder="Ej: Blanco"
          />
        </div>
        
        <div className={styles.field}>
          <label htmlFor="precioDiario">Precio Diario (USD) *</label>
          <input
            type="number"
            id="precioDiario"
            name="precioDiario"
            required
            min="0"
            step="0.01"
            defaultValue={vehiculo?.precioDiario}
            placeholder="50.00"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="imagen">URL de Imagen</label>
        <input
          type="url"
          id="imagen"
          name="imagen"
          defaultValue={vehiculo?.imagen || ''}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          defaultValue={vehiculo?.descripcion || ''}
          placeholder="Descripción del vehículo..."
        />
      </div>

      {vehiculo && (
        <div className={styles.field}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="disponible"
              defaultChecked={vehiculo.disponible}
            />
            <span>Disponible para alquiler</span>
          </label>
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancelar
        </button>
        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Guardando...' : vehiculo ? 'Actualizar' : 'Crear Vehículo'}
        </button>
      </div>
    </form>
  );
}

