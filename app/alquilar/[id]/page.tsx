'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './alquilar.module.css';

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

export default function AlquilarPage() {
  const params = useParams();
  const router = useRouter();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchVehiculo(params.id as string);
    }
  }, [params.id]);

  const fetchVehiculo = async (id: string) => {
    try {
      const res = await fetch(`/api/vehiculos/${id}`);
      if (res.ok) {
        const data = await res.json();
        setVehiculo(data);
      } else {
        setError('Vehículo no encontrado');
      }
    } catch (error) {
      setError('Error al cargar vehículo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get('nombre') as string;
    const email = formData.get('email') as string;
    const telefono = formData.get('telefono') as string;
    const direccion = formData.get('direccion') as string;
    const fechaInicio = formData.get('fechaInicio') as string;
    const fechaFin = formData.get('fechaFin') as string;
    const observaciones = formData.get('observaciones') as string;

    try {
      // Primero crear o buscar cliente
      let clienteRes = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono, direccion }),
      });

      let cliente;
      if (clienteRes.status === 201) {
        cliente = await clienteRes.json();
      } else if (clienteRes.status === 400) {
        // Cliente ya existe, buscarlo
        const clientesRes = await fetch('/api/clientes');
        const clientes = await clientesRes.json();
        cliente = clientes.find((c: any) => c.email === email);
        if (!cliente) {
          throw new Error('Error al obtener información del cliente');
        }
      } else {
        throw new Error('Error al crear cliente');
      }

      // Crear renta
      const rentaRes = await fetch('/api/rentas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: cliente.id,
          vehiculoId: vehiculo!.id,
          fechaInicio,
          fechaFin,
          observaciones,
        }),
      });

      if (rentaRes.ok) {
        router.push('/rentas?success=true');
      } else {
        const errorData = await rentaRes.json();
        throw new Error(errorData.error || 'Error al crear renta');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el alquiler');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>Cargando...</div>
        </div>
      </main>
    );
  }

  if (!vehiculo || error) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error || 'Vehículo no encontrado'}</p>
            <Link href="/vehiculos" className={styles.button}>
              Volver a Vehículos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const fechaMinima = new Date().toISOString().split('T')[0];
  const fechaMaxima = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Alquilar Vehículo</h1>
          <Link href="/vehiculos" className={styles.backLink}>
            ← Volver
          </Link>
        </div>

        <div className={styles.content}>
          <div className={styles.vehiculoInfo}>
            <h2>{vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}</h2>
            <p><strong>Color:</strong> {vehiculo.color}</p>
            <p><strong>Precio por día:</strong> ${vehiculo.precioDiario.toFixed(2)}</p>
            {vehiculo.descripcion && (
              <p><strong>Descripción:</strong> {vehiculo.descripcion}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <h3>Información del Cliente</h3>
            
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="nombre">Nombre Completo *</label>
                <input type="text" id="nombre" name="nombre" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" name="email" required />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="telefono">Teléfono *</label>
                <input type="tel" id="telefono" name="telefono" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="direccion">Dirección</label>
                <input type="text" id="direccion" name="direccion" />
              </div>
            </div>

            <h3>Detalles del Alquiler</h3>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="fechaInicio">Fecha de Inicio *</label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  required
                  min={fechaMinima}
                  max={fechaMaxima}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="fechaFin">Fecha de Fin *</label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  required
                  min={fechaMinima}
                  max={fechaMaxima}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                name="observaciones"
                rows={4}
                placeholder="Notas adicionales sobre el alquiler..."
              />
            </div>

            <div className={styles.actions}>
              <Link href="/vehiculos" className={styles.cancelButton}>
                Cancelar
              </Link>
              <button type="submit" disabled={submitting || !vehiculo.disponible} className={styles.submitButton}>
                {submitting ? 'Procesando...' : 'Confirmar Alquiler'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

