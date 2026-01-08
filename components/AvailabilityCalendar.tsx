'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './AvailabilityCalendar.module.css';

interface AvailabilityCalendarProps {
  vehiculoId: string;
  onDateSelect: (fechaInicio: Date, fechaFin: Date) => void;
  precioBase: number;
}

export default function AvailabilityCalendar({
  vehiculoId,
  onDateSelect,
  precioBase,
}: AvailabilityCalendarProps) {
  const [fechaRango, setFechaRango] = useState<[Date, Date] | null>(null);
  const [rentasExistentes, setRentasExistentes] = useState<any[]>([]);

  useEffect(() => {
    // Cargar rentas existentes para este vehículo
    const fetchRentas = async () => {
      try {
        const response = await fetch(`/api/rentas?vehiculoId=${vehiculoId}&estado=activa`);
        if (response.ok) {
          const data = await response.json();
          setRentasExistentes(data || []);
        }
      } catch (error) {
        console.error('Error cargando rentas:', error);
      }
    };

    if (vehiculoId) {
      fetchRentas();
    }
  }, [vehiculoId]);

  const handleDateChange = (value: any) => {
    if (Array.isArray(value) && value.length === 2) {
      const [inicio, fin] = value;
      setFechaRango([inicio, fin]);
      onDateSelect(inicio, fin);
    }
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    // Deshabilitar fechas pasadas
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return true;
    }

    // Deshabilitar fechas con rentas existentes
    return rentasExistentes.some((renta) => {
      const inicio = new Date(renta.fechaInicio);
      const fin = new Date(renta.fechaFin);
      return date >= inicio && date <= fin;
    });
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const esOcupada = rentasExistentes.some((renta) => {
      const inicio = new Date(renta.fechaInicio);
      const fin = new Date(renta.fechaFin);
      return date >= inicio && date <= fin;
    });

    if (esOcupada) return styles.occupiedDate;
    return '';
  };

  const calcularTotal = () => {
    if (!fechaRango) return 0;
    const [inicio, fin] = fechaRango;
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    return dias * precioBase;
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Selecciona las Fechas</h3>
      
      <div className={styles.calendarWrapper}>
        <Calendar
          onChange={handleDateChange}
          value={fechaRango}
          selectRange={true}
          minDate={new Date()}
          tileDisabled={tileDisabled}
          tileClassName={tileClassName}
          className={styles.calendar}
        />
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#10B981' }}></span>
          <span>Disponible</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#EF4444' }}></span>
          <span>Ocupado</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#3B82F6' }}></span>
          <span>Seleccionado</span>
        </div>
      </div>

      {fechaRango && (
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Fecha Inicio:</span>
            <strong>{fechaRango[0].toLocaleDateString('es-ES')}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Fecha Fin:</span>
            <strong>{fechaRango[1].toLocaleDateString('es-ES')}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Días:</span>
            <strong>
              {Math.ceil((fechaRango[1].getTime() - fechaRango[0].getTime()) / (1000 * 60 * 60 * 24))}
            </strong>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total:</span>
            <strong>${calcularTotal().toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
