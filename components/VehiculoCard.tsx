'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './VehiculoCard.module.css';

interface VehiculoCardProps {
  vehiculo: {
    id: string;
    marca: string;
    modelo: string;
    anio: number;
    color: string;
    precioDiario: number;
    disponible: boolean;
    imagen?: string | null;
    descripcion?: string | null;
  };
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function VehiculoCard({ 
  vehiculo, 
  showActions = false,
  onEdit,
  onDelete 
}: VehiculoCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {vehiculo.imagen ? (
          <Image
            src={vehiculo.imagen}
            alt={`${vehiculo.marca} ${vehiculo.modelo}`}
            fill
            className={styles.image}
            objectFit="cover"
          />
        ) : (
          <div className={styles.placeholderImage}>
            <span>🚗</span>
          </div>
        )}
        {!vehiculo.disponible && (
          <div className={styles.badge}>No Disponible</div>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>
          {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
        </h3>
        <p className={styles.color}>Color: {vehiculo.color}</p>
        <p className={styles.price}>
          ${vehiculo.precioDiario.toFixed(2)} / día
        </p>
        {vehiculo.descripcion && (
          <p className={styles.description}>{vehiculo.descripcion}</p>
        )}
        
        {showActions && (
          <div className={styles.actions}>
            {onEdit && (
              <button
                onClick={() => onEdit(vehiculo.id)}
                className={styles.editButton}
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(vehiculo.id)}
                className={styles.deleteButton}
              >
                Eliminar
              </button>
            )}
          </div>
        )}
        
        {!showActions && vehiculo.disponible && (
          <Link href={`/alquilar/${vehiculo.id}`} className={styles.rentButton}>
            Alquilar Ahora
          </Link>
        )}
      </div>
    </div>
  );
}

