'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import VehiculoCard from '@/components/VehiculoCard';
import VehiculoForm from '@/components/VehiculoForm';
import { useToast } from '@/components/ToastProvider';
import AdminNotificationBell from '@/components/AdminNotificationBell';
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

interface Renta {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  precioTotal: number;
  estado: string;
  observaciones?: string | null;
  cliente: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
  };
  vehiculo: {
    id: string;
    marca: string;
    modelo: string;
    anio: number;
    placa: string;
  };
}

interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion?: string | null;
  createdAt: string;
  rentas?: Renta[];
}

interface Estadisticas {
  totalVehiculos: number;
  vehiculosDisponibles: number;
  totalRentas: number;
  rentasActivas: number;
  rentasCompletadas: number;
  ingresosTotales: number;
  totalClientes: number;
}

type TabType = 'dashboard' | 'vehiculos' | 'rentas' | 'clientes';

export default function AdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [rentas, setRentas] = useState<Renta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [rentaFilter, setRentaFilter] = useState<string>('todas');

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
      if (!isAuthenticated) {
        router.push('/admin/login');
      } else {
        setAuthenticated(true);
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!authenticated) return;
    
    const loadData = async () => {
      await fetchVehiculos();
      if (activeTab === 'dashboard' || activeTab === 'rentas') {
        await fetchRentas();
      }
      if (activeTab === 'dashboard' || activeTab === 'clientes') {
        await fetchClientes();
      }
      if (activeTab === 'dashboard') {
        await calcularEstadisticas();
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, rentaFilter, authenticated]);

  const fetchRentas = async () => {
    try {
      const url = rentaFilter !== 'todas' 
        ? `/api/rentas?estado=${rentaFilter}`
        : '/api/rentas';
      const res = await fetch(url, {
        headers: {
          'x-admin-auth': 'true',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setRentas(data);
      }
    } catch (error) {
      console.error('Error cargando rentas:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await fetch('/api/clientes', {
        headers: {
          'x-admin-auth': 'true',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setClientes(data);
      }
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };

  const calcularEstadisticas = async () => {
    try {
      // Cargar todos los datos necesarios para las estadísticas
      const [vehiculosRes, rentasRes, clientesRes] = await Promise.all([
        fetch('/api/vehiculos'),
        fetch('/api/rentas', {
          headers: {
            'x-admin-auth': 'true',
          },
        }),
        fetch('/api/clientes', {
          headers: {
            'x-admin-auth': 'true',
          },
        }),
      ]);

      const vehiculosData = vehiculosRes.ok ? await vehiculosRes.json() : [];
      const rentasData = rentasRes.ok ? await rentasRes.json() : [];
      const clientesData = clientesRes.ok ? await clientesRes.json() : [];

      const stats: Estadisticas = {
        totalVehiculos: vehiculosData.length,
        vehiculosDisponibles: vehiculosData.filter((v: Vehiculo) => v.disponible).length,
        totalRentas: rentasData.length,
        rentasActivas: rentasData.filter((r: Renta) => r.estado === 'activa').length,
        rentasCompletadas: rentasData.filter((r: Renta) => r.estado === 'completada').length,
        ingresosTotales: rentasData
          .filter((r: Renta) => r.estado === 'completada')
          .reduce((sum: number, r: Renta) => sum + r.precioTotal, 0),
        totalClientes: clientesData.length,
      };

      setEstadisticas(stats);
    } catch (error) {
      console.error('Error calculando estadísticas:', error);
    }
  };

  const fetchVehiculos = async () => {
    try {
      const res = await fetch('/api/vehiculos');
      console.log('📡 Admin - Respuesta API vehículos:', res.status, res.statusText);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
        console.error('❌ Admin - Error en API vehículos:', errorData);
        return;
      }

      const data = await res.json();
      console.log('✅ Admin - Vehículos recibidos:', data.length, 'vehículos');
      
      if (!Array.isArray(data)) {
        console.error('❌ Admin - Los datos no son un array:', data);
        return;
      }

      setVehiculos(data);
    } catch (error) {
      console.error('❌ Admin - Error cargando vehículos:', error);
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
      showToast('Vehículo creado exitosamente', 'success');
      await fetchVehiculos();
      if (activeTab === 'dashboard') {
        await calcularEstadisticas();
      }
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
      showToast('Vehículo actualizado exitosamente', 'success');
      await fetchVehiculos();
      if (activeTab === 'dashboard') {
        await calcularEstadisticas();
      }
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
      if (activeTab === 'dashboard') {
        await calcularEstadisticas();
      }
    } else {
      const error = await res.json();
      showToast(error.error || 'Error al eliminar vehículo', 'error');
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

  const handleCambiarEstadoRenta = async (id: string, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/rentas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

    if (res.ok) {
      await fetchRentas();
      await fetchVehiculos();
      await calcularEstadisticas();
      showToast('Renta actualizada exitosamente', 'success');
    } else {
      const error = await res.json();
      showToast(error.error || 'Error al actualizar renta', 'error');
    }
  } catch (error) {
    showToast('Error al actualizar renta', 'error');
  }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(precio);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return '#10b981';
      case 'completada':
        return '#3b82f6';
      case 'cancelada':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (checkingAuth) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>Verificando acceso...</div>
        </div>
      </main>
    );
  }

  // Si no está autenticado, no mostrar nada (ya redirigió)
  if (!authenticated) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminNombre');
    router.push('/admin/login');
    showToast('Sesión cerrada', 'info');
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
            <AdminNotificationBell />
            <Link href="/" className={styles.link}>
              Ver como Cliente
            </Link>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'dashboard' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'vehiculos' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('vehiculos')}
          >
            🚗 Vehículos
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'rentas' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('rentas')}
          >
            📋 Rentas
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'clientes' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('clientes')}
          >
            👥 Clientes
          </button>
        </div>

        {/* Contenido de las tabs */}
        {activeTab === 'dashboard' && estadisticas && (
          <div className={styles.dashboard}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Vehículos Totales</h3>
                <p className={styles.statValue}>{estadisticas.totalVehiculos}</p>
                <span className={styles.statSubtext}>
                  {estadisticas.vehiculosDisponibles} disponibles
                </span>
              </div>
              <div className={styles.statCard}>
                <h3>Rentas Activas</h3>
                <p className={styles.statValue}>{estadisticas.rentasActivas}</p>
                <span className={styles.statSubtext}>
                  {estadisticas.totalRentas} totales
                </span>
              </div>
              <div className={styles.statCard}>
                <h3>Ingresos Totales</h3>
                <p className={styles.statValue}>{formatearPrecio(estadisticas.ingresosTotales)}</p>
                <span className={styles.statSubtext}>
                  {estadisticas.rentasCompletadas} rentas completadas
                </span>
              </div>
              <div className={styles.statCard}>
                <h3>Total Clientes</h3>
                <p className={styles.statValue}>{estadisticas.totalClientes}</p>
                <span className={styles.statSubtext}>Registrados</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vehiculos' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2>Gestión de Vehículos</h2>
              <button onClick={() => setShowForm(true)} className={styles.addButton}>
                + Agregar Vehículo
              </button>
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
        )}

        {activeTab === 'rentas' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2>Gestión de Rentas</h2>
              <select
                value={rentaFilter}
                onChange={(e) => setRentaFilter(e.target.value)}
                className={styles.filter}
              >
                <option value="todas">Todas las rentas</option>
                <option value="pendiente">Pendientes</option>
                <option value="activa">Activas</option>
                <option value="completada">Completadas</option>
                <option value="cancelada">Canceladas</option>
                <option value="rechazada">Rechazadas</option>
              </select>
            </div>
            {rentas.length === 0 ? (
              <div className={styles.empty}>
                <p>No hay rentas registradas</p>
              </div>
            ) : (
              <div className={styles.rentasGrid}>
                {rentas.map((renta) => (
                  <div key={renta.id} className={styles.rentaCard}>
                    <div className={styles.rentaHeader}>
                      <h3>
                        {renta.vehiculo.marca} {renta.vehiculo.modelo} {renta.vehiculo.anio}
                      </h3>
                      <span
                        className={styles.badge}
                        style={{ backgroundColor: getEstadoColor(renta.estado) }}
                      >
                        {renta.estado.toUpperCase()}
                      </span>
                    </div>
                    <div className={styles.rentaBody}>
                      <div className={styles.rentaInfo}>
                        <strong>Cliente:</strong> {renta.cliente.nombre}
                      </div>
                      <div className={styles.rentaInfo}>
                        <strong>Email:</strong> {renta.cliente.email}
                      </div>
                      <div className={styles.rentaInfo}>
                        <strong>Teléfono:</strong> {renta.cliente.telefono}
                      </div>
                      <div className={styles.rentaInfo}>
                        <strong>Placa:</strong> {renta.vehiculo.placa}
                      </div>
                      <div className={styles.rentaInfo}>
                        <strong>Inicio:</strong> {formatearFecha(renta.fechaInicio)}
                      </div>
                      <div className={styles.rentaInfo}>
                        <strong>Fin:</strong> {formatearFecha(renta.fechaFin)}
                      </div>
                      <div className={styles.rentaInfo}>
                        <strong>Total:</strong> <span className={styles.price}>{formatearPrecio(renta.precioTotal)}</span>
                      </div>
                      {renta.observaciones && (
                        <div className={styles.observaciones}>
                          <strong>Observaciones:</strong>
                          <p>{renta.observaciones}</p>
                        </div>
                      )}
                    </div>
                    {renta.estado === 'pendiente' && (
                      <div className={styles.rentaActions}>
                        <button
                          onClick={() => {
                            if (confirm('¿Confirmar esta reserva? El vehículo quedará no disponible durante el período de alquiler.')) {
                              handleCambiarEstadoRenta(renta.id, 'activa');
                            }
                          }}
                          className={styles.confirmButton}
                          style={{ backgroundColor: '#10b981', color: 'white' }}
                        >
                          ✓ Aprobar Reserva
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('¿Estás seguro de rechazar esta reserva?')) {
                              handleCambiarEstadoRenta(renta.id, 'rechazada');
                            }
                          }}
                          className={styles.cancelButton}
                        >
                          ✗ Rechazar
                        </button>
                      </div>
                    )}
                    {renta.estado === 'activa' && (
                      <div className={styles.rentaActions}>
                        <button
                          onClick={() => handleCambiarEstadoRenta(renta.id, 'completada')}
                          className={styles.completeButton}
                        >
                          Completar
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('¿Estás seguro de cancelar esta renta?')) {
                              handleCambiarEstadoRenta(renta.id, 'cancelada');
                            }
                          }}
                          className={styles.cancelButton}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'clientes' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2>Gestión de Clientes</h2>
            </div>
            {clientes.length === 0 ? (
              <div className={styles.empty}>
                <p>No hay clientes registrados</p>
              </div>
            ) : (
              <div className={styles.clientesGrid}>
                {clientes.map((cliente) => (
                  <div key={cliente.id} className={styles.clienteCard}>
                    <h3>{cliente.nombre}</h3>
                    <div className={styles.clienteInfo}>
                      <p><strong>Email:</strong> {cliente.email}</p>
                      <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                      {cliente.direccion && (
                        <p><strong>Dirección:</strong> {cliente.direccion}</p>
                      )}
                      <p><strong>Total rentas:</strong> {cliente.rentas?.length || 0}</p>
                      <p className={styles.fechaRegistro}>
                        Registrado: {formatearFecha(cliente.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

