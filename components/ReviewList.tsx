'use client';

import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import styles from './ReviewList.module.css';

interface Review {
  id: string;
  calificacion: number;
  comentario: string;
  createdAt: string;
  cliente: {
    nombre: string;
    email: string;
  };
}

interface ReviewListProps {
  vehiculoId: string;
  refreshTrigger?: number;
}

export default function ReviewList({ vehiculoId, refreshTrigger = 0 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promedio, setPromedio] = useState(0);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiculoId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/vehiculos/${vehiculoId}/resenas`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.resenas);
        setPromedio(data.promedio);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Cargando reseñas...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Reseñas</h3>
        {reviews.length > 0 && (
          <div className={styles.summary}>
            <StarRating rating={promedio} size="large" />
            <span className={styles.averageText}>
              {promedio.toFixed(1)} de 5 ({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className={styles.empty}>
          <p>Aún no hay reseñas para este vehículo.</p>
          <p className={styles.emptySubtext}>¡Sé el primero en dejar tu opinión!</p>
        </div>
      ) : (
        <div className={styles.reviewList}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.review}>
              <div className={styles.reviewHeader}>
                <div className={styles.authorInfo}>
                  <div className={styles.avatar}>
                    {review.cliente.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={styles.authorName}>
                      {review.cliente.nombre}
                    </div>
                    <div className={styles.date}>
                      {new Date(review.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <StarRating rating={review.calificacion} />
              </div>
              <p className={styles.comment}>{review.comentario}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
