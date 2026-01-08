'use client';

import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import styles from './analytics.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface Analytics {
  totalRentas: number;
  ingresos: number;
  vehiculosActivos: number;
  clientesActivos: number;
  rentasPorMes: { mes: string; cantidad: number; ingresos: number }[];
  vehiculosMasRentados: { vehiculo: string; rentas: number }[];
  estadosRentas: { estado: string; cantidad: number }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes'); // mes, trimestre, año

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?periodo=${periodo}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Cargando analíticas...</div>;
  }

  if (!analytics) {
    return <div className={styles.error}>Error al cargar analíticas</div>;
  }

  const rentasPorMesData = {
    labels: analytics.rentasPorMes.map(r => r.mes),
    datasets: [
      {
        label: 'Cantidad de Rentas',
        data: analytics.rentasPorMes.map(r => r.cantidad),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const ingresosPorMesData = {
    labels: analytics.rentasPorMes.map(r => r.mes),
    datasets: [
      {
        label: 'Ingresos ($)',
        data: analytics.rentasPorMes.map(r => r.ingresos),
        borderColor: 'rgba(253, 185, 19, 1)',
        backgroundColor: 'rgba(253, 185, 19, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const vehiculosMasRentadosData = {
    labels: analytics.vehiculosMasRentados.map(v => v.vehiculo),
    datasets: [
      {
        data: analytics.vehiculosMasRentados.map(v => v.rentas),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(253, 185, 19, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(168, 85, 247, 0.7)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const estadosRentasData = {
    labels: analytics.estadosRentas.map(e => e.estado),
    datasets: [
      {
        data: analytics.estadosRentas.map(e => e.cantidad),
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(251, 191, 36, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(107, 114, 128, 0.7)',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Analíticas y Reportes</h1>
        
        <div className={styles.periodSelector}>
          <button 
            className={`${styles.periodButton} ${periodo === 'mes' ? styles.active : ''}`}
            onClick={() => setPeriodo('mes')}
          >
            Mes
          </button>
          <button 
            className={`${styles.periodButton} ${periodo === 'trimestre' ? styles.active : ''}`}
            onClick={() => setPeriodo('trimestre')}
          >
            Trimestre
          </button>
          <button 
            className={`${styles.periodButton} ${periodo === 'año' ? styles.active : ''}`}
            onClick={() => setPeriodo('año')}
          >
            Año
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.blue}`}>
          <div className={styles.kpiIcon}>📊</div>
          <div className={styles.kpiContent}>
            <h3>{analytics.totalRentas}</h3>
            <p>Total Rentas</p>
          </div>
        </div>
        
        <div className={`${styles.kpiCard} ${styles.yellow}`}>
          <div className={styles.kpiIcon}>💰</div>
          <div className={styles.kpiContent}>
            <h3>${analytics.ingresos.toLocaleString()}</h3>
            <p>Ingresos Totales</p>
          </div>
        </div>
        
        <div className={`${styles.kpiCard} ${styles.green}`}>
          <div className={styles.kpiIcon}>🚗</div>
          <div className={styles.kpiContent}>
            <h3>{analytics.vehiculosActivos}</h3>
            <p>Vehículos Activos</p>
          </div>
        </div>
        
        <div className={`${styles.kpiCard} ${styles.purple}`}>
          <div className={styles.kpiIcon}>👥</div>
          <div className={styles.kpiContent}>
            <h3>{analytics.clientesActivos}</h3>
            <p>Clientes Activos</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Rentas por Mes</h3>
          <div className={styles.chartWrapper}>
            <Bar data={rentasPorMesData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Ingresos por Mes</h3>
          <div className={styles.chartWrapper}>
            <Line data={ingresosPorMesData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Vehículos Más Rentados</h3>
          <div className={styles.chartWrapper}>
            <Doughnut data={vehiculosMasRentadosData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Estados de Rentas</h3>
          <div className={styles.chartWrapper}>
            <Doughnut data={estadosRentasData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>
      </div>
    </div>
  );
}
