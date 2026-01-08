'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import VehiculoCard from '@/components/VehiculoCard';
import VehiculoForm from '@/components/VehiculoForm';
import styles from './admin.module.css';

interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  color: string;
  precioDiario: number;
  disponible: boolean;
  imagen?: string | null;
  descripcion?: string | null;
}

export default function AdminPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const fetchVehiculos = async () => {
    try {
      const res = await fetch('/api/vehiculos');
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

  const handleCreate = async (data: any) => {
    const res = await fetch('/api/vehiculos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      await fetchVehiculos();
      setShowForm(false);
    } else {
      const error = await res.json();
      throw new Error(error.error || 'Error al crear vehículo');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingVehiculo) return;

    const res = await fetch(`/api/vehiculos/${editingVehiculo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      await fetchVehiculos();
      setEditingVehiculo(null);
      setShowForm(false);
    } else {
      const error = await res.json();
      throw new Error(error.error || 'Error al actualizar vehículo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;

    const res = await fetch(`/api/vehiculos/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      await fetchVehiculos();
    } else {
      const error = await res.json();
      alert(error.error || 'Error al eliminar vehículo');
    }
  };

  const handleEdit = (id: string) => {
    const vehiculo = vehiculos.find(v => v.id === id);
    if (vehiculo) {
      setEditingVehiculo(vehiculo);
      setShowForm(true);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVehiculo(null);
  };

  if (showForm) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              {editingVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}
            </h1>
            <button onClick={handleCancel} className={styles.backButton}>
              ← Volver
            </button>
          </div>
          <VehiculoForm
            vehiculo={editingVehiculo || undefined}
            onSubmit={editingVehiculo ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Panel de Administración</h1>
          <div className={styles.actions}>
            <Link href="/" className={styles.link}>
              Ver como Cliente
            </Link>
            <button onClick={() => setShowForm(true)} className={styles.addButton}>
              + Agregar Vehículo
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Cargando vehículos...</div>
        ) : vehiculos.length === 0 ? (
          <div className={styles.empty}>
            <p>No hay vehículos registrados</p>
            <button onClick={() => setShowForm(true)} className={styles.addButton}>
              Agregar Primer Vehículo
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {vehiculos.map((vehiculo) => (
              <VehiculoCard
                key={vehiculo.id}
                vehiculo={vehiculo}
                showActions
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

