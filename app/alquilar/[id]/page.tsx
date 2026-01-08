'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import { formatearPrecioSimple } from '@/lib/formatters';
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
  placa?: string;
  descripcion?: string | null;
}

export default function AlquilarPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [precioTotal, setPrecioTotal] = useState<number>(0);
  const [dias, setDias] = useState<number>(0);
  const [clienteRegistrado, setClienteRegistrado] = useState<{ id: string; nombre: string } | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchVehiculo(params.id as string);
    }
    // Cargar datos del cliente registrado
    const clienteId = localStorage.getItem('clienteId');
    const clienteNombre = localStorage.getItem('clienteNombre');
    if (clienteId && clienteNombre) {
      setClienteRegistrado({ id: clienteId, nombre: clienteNombre });
    }
  }, [params.id]);

  const fetchClienteData = async (clienteId: string) => {
    try {
      const res = await fetch('/api/clientes');
      if (res.ok) {
        const clientes = await res.json();
        const cliente = clientes.find((c: any) => c.id === clienteId);
        return cliente;
      }
    } catch (error) {
      console.error('Error cargando datos del cliente:', error);
    }
    return null;
  };

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

  // Calcular precio cuando cambian las fechas
  useEffect(() => {
    if (vehiculo && fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      
      // Validar que fecha fin sea después de fecha inicio
      if (fin <= inicio) {
        setPrecioTotal(0);
        setDias(0);
        return;
      }
      
      const diasCalculados = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      const precioCalculado = diasCalculados * vehiculo.precioDiario;
      setDias(diasCalculados);
      setPrecioTotal(precioCalculado);
    } else {
      setPrecioTotal(0);
      setDias(0);
    }
  }, [fechaInicio, fechaFin, vehiculo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validar fechas
    if (!fechaInicio || !fechaFin) {
      setError('Por favor selecciona ambas fechas');
      setSubmitting(false);
      return;
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (fin <= inicio) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio');
      setSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const observaciones = (formData.get('observaciones') as string) || '';
    
    // Si el cliente está registrado, no necesitamos estos datos
    let nombre = '';
    let email = '';
    let telefono = '';
    let direccion = '';
    
    if (!clienteRegistrado) {
      nombre = formData.get('nombre') as string;
      email = formData.get('email') as string;
      telefono = formData.get('telefono') as string;
      direccion = (formData.get('direccion') as string) || '';
    }

    try {
      // Si hay un cliente registrado, obtener sus datos completos
      let cliente;
      if (clienteRegistrado) {
        const clienteData = await fetchClienteData(clienteRegistrado.id);
        if (!clienteData) {
          throw new Error('No se pudo obtener la información del cliente registrado');
        }
        cliente = clienteData;
      } else {
        // Primero crear o buscar cliente
        let clienteRes = await fetch('/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, email, telefono, direccion }),
        });

        if (clienteRes.status === 201) {
          cliente = await clienteRes.json();
          // Guardar en localStorage para futuras reservas
          localStorage.setItem('clienteId', cliente.id);
          localStorage.setItem('clienteNombre', cliente.nombre);
        } else if (clienteRes.status === 400) {
          // Cliente ya existe, buscarlo
          const clientesRes = await fetch('/api/clientes');
          const clientes = await clientesRes.json();
          cliente = clientes.find((c: any) => c.email === email);
          if (!cliente) {
            throw new Error('Error al obtener información del cliente');
          }
          // Guardar en localStorage
          localStorage.setItem('clienteId', cliente.id);
          localStorage.setItem('clienteNombre', cliente.nombre);
        } else {
          throw new Error('Error al crear cliente');
        }
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
        // Mostrar mensaje de éxito y redirigir
        showToast('¡Alquiler creado exitosamente!', 'success');
        router.push('/rentas');
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
            <p><strong>Precio por día:</strong> {formatearPrecioSimple(vehiculo.precioDiario)}</p>
            {vehiculo.descripcion && (
              <p><strong>Descripción:</strong> {vehiculo.descripcion}</p>
            )}
            
            {(dias > 0 && precioTotal > 0) && (
              <div className={styles.resumenPrecio}>
                <h3>Resumen del Alquiler</h3>
                <div className={styles.resumenLine}>
                  <span>Días:</span>
                  <strong>{dias} día{dias !== 1 ? 's' : ''}</strong>
                </div>
                <div className={styles.resumenLine}>
                  <span>Precio por día:</span>
                  <strong>{formatearPrecioSimple(vehiculo.precioDiario)}</strong>
                </div>
                <div className={styles.resumenTotal}>
                  <span>Total a pagar:</span>
                  <strong>{formatearPrecioSimple(precioTotal)}</strong>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            {clienteRegistrado ? (
              <div className={styles.clienteRegistrado}>
                <h3>Información del Cliente</h3>
                <p className={styles.clienteInfo}>
                  <strong>Cliente registrado:</strong> {clienteRegistrado.nombre}
                </p>
                <p className={styles.clienteNote}>
                  Usaremos tu información de registro para hacer la reserva.
                </p>
              </div>
            ) : (
              <>
                <h3>Información del Cliente</h3>
                <div className={styles.loginPrompt}>
                  <p className={styles.registerPrompt}>
                    ¿Ya tienes cuenta?{' '}
                    <Link href={`/login?redirect=${encodeURIComponent(`/alquilar/${params.id}`)}`} className={styles.loginLink}>
                      Inicia sesión aquí
                    </Link>
                    {' '}para agilizar tus reservas
                  </p>
                  <p className={styles.registerPrompt}>
                    ¿No tienes cuenta?{' '}
                    <Link href="/registro" className={styles.registerLink}>
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
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
              </>
            )}

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
                  value={fechaInicio}
                  onChange={(e) => {
                    setFechaInicio(e.target.value);
                    // Si fecha fin es anterior a nueva fecha inicio, limpiar fecha fin
                    if (fechaFin && new Date(e.target.value) >= new Date(fechaFin)) {
                      setFechaFin('');
                    }
                  }}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="fechaFin">Fecha de Fin *</label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  required
                  min={fechaInicio || fechaMinima}
                  max={fechaMaxima}
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
                {fechaFin && fechaInicio && new Date(fechaFin) <= new Date(fechaInicio) && (
                  <span className={styles.fieldError}>
                    La fecha de fin debe ser posterior a la fecha de inicio
                  </span>
                )}
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

